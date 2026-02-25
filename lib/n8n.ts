const N8N_BASE_URL = process.env.N8N_BASE_URL!
const N8N_API_KEY = process.env.N8N_API_KEY!

// n8n'deki template workflow ID'leri
const TEMPLATE_WORKFLOW_IDS: Record<string, string> = {
  'kartvizit-ajan': 'rWpV18lQ408971Ao',
  'drive-ocr': 'cM3GvElTCKnn9IZS',
}

function n8nHeaders() {
  return {
    'X-N8N-API-KEY': N8N_API_KEY,
    'Content-Type': 'application/json',
  }
}

async function n8nFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${N8N_BASE_URL}/api/v1${path}`, {
    ...options,
    headers: { ...n8nHeaders(), ...(options?.headers ?? {}) },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`n8n API hatası [${res.status}] ${path}: ${body}`)
  }
  return res.json()
}

/**
 * n8n'de credential objesi oluşturur ve ID'sini döndürür.
 * type: n8n credential type adı (ör: 'telegramApi', 'googleDriveOAuth2Api')
 * data: credential alanları
 * name: credential adı (kullanıcıya özel, benzersiz olmalı)
 */
async function createCredential(
  name: string,
  type: string,
  data: Record<string, string>
): Promise<string> {
  const cred = await n8nFetch('/credentials', {
    method: 'POST',
    body: JSON.stringify({ name, type, data }),
  })
  return cred.id
}

/**
 * Template workflow'u JSON olarak getirir
 */
async function getTemplateWorkflow(templateId: string) {
  return n8nFetch(`/workflows/${templateId}`)
}

/**
 * Workflow JSON içindeki credential referanslarını
 * yeni oluşturulan credential ID'leriyle değiştirir.
 */
function injectCredentials(
  workflow: Record<string, unknown>,
  credMap: Record<string, { id: string; name: string }>
): Record<string, unknown> {
  const nodes = (workflow.nodes as Array<Record<string, unknown>>).map((node) => {
    const creds = node.credentials as Record<string, { id: string; name: string }> | undefined
    if (!creds) return node

    const newCreds: Record<string, { id: string; name: string }> = {}
    for (const [credType, _credVal] of Object.entries(creds)) {
      if (credMap[credType]) {
        newCreds[credType] = credMap[credType]
      } else {
        newCreds[credType] = _credVal
      }
    }
    return { ...node, credentials: newCreds }
  })

  return { ...workflow, nodes }
}

/**
 * Kartvizit Ajanı için gerekli credential'ları n8n'de oluşturur.
 * Döndürdüğü Map: credentialType → {id, name}
 */
async function createKartvizitCredentials(
  userId: string,
  cfg: Record<string, string>
): Promise<Record<string, { id: string; name: string }>> {
  const prefix = `user_${userId.substring(0, 8)}`
  const credMap: Record<string, { id: string; name: string }> = {}

  // Telegram
  if (cfg.telegram_bot_token) {
    const name = `${prefix}_telegram`
    const id = await createCredential(name, 'telegramApi', {
      accessToken: cfg.telegram_bot_token,
    })
    credMap['telegramApi'] = { id, name }
  }

  // Google OAuth (Drive, Contacts, Gmail ortak OAuth credentials)
  if (cfg.google_client_id && cfg.google_client_secret && cfg.google_refresh_token) {
    const googleOAuthData = {
      clientId: cfg.google_client_id,
      clientSecret: cfg.google_client_secret,
      oauthTokenData: JSON.stringify({
        refresh_token: cfg.google_refresh_token,
        token_type: 'Bearer',
      }),
    }

    const driveName = `${prefix}_google_drive`
    const driveId = await createCredential(driveName, 'googleDriveOAuth2Api', googleOAuthData)
    credMap['googleDriveOAuth2Api'] = { id: driveId, name: driveName }

    const contactsName = `${prefix}_google_contacts`
    const contactsId = await createCredential(contactsName, 'googleContactsOAuth2Api', googleOAuthData)
    credMap['googleContactsOAuth2Api'] = { id: contactsId, name: contactsName }

    const gmailName = `${prefix}_gmail`
    const gmailId = await createCredential(gmailName, 'gmailOAuth2', googleOAuthData)
    credMap['gmailOAuth2'] = { id: gmailId, name: gmailName }
  }

  // Airtable
  if (cfg.airtable_token) {
    const name = `${prefix}_airtable`
    const id = await createCredential(name, 'airtableTokenApi', {
      apiKey: cfg.airtable_token,
    })
    credMap['airtableTokenApi'] = { id, name }
  }

  return credMap
}

/**
 * Drive OCR için gerekli credential'ları oluşturur.
 */
async function createDriveOcrCredentials(
  userId: string,
  cfg: Record<string, string>
): Promise<Record<string, { id: string; name: string }>> {
  const prefix = `user_${userId.substring(0, 8)}`
  const credMap: Record<string, { id: string; name: string }> = {}

  if (cfg.google_client_id && cfg.google_client_secret && cfg.google_refresh_token) {
    const googleOAuthData = {
      clientId: cfg.google_client_id,
      clientSecret: cfg.google_client_secret,
      oauthTokenData: JSON.stringify({
        refresh_token: cfg.google_refresh_token,
        token_type: 'Bearer',
      }),
    }

    const driveName = `${prefix}_google_drive`
    const driveId = await createCredential(driveName, 'googleDriveOAuth2Api', googleOAuthData)
    credMap['googleDriveOAuth2Api'] = { id: driveId, name: driveName }

    const sheetsName = `${prefix}_google_sheets`
    const sheetsId = await createCredential(sheetsName, 'googleSheetsOAuth2Api', googleOAuthData)
    credMap['googleSheetsOAuth2Api'] = { id: sheetsId, name: sheetsName }
  }

  return credMap
}

/**
 * Ana aktivasyon fonksiyonu:
 * 1. Servise özel credential'ları n8n'de oluşturur
 * 2. Template workflow'u klonlar, credential'ları enjekte eder
 * 3. Workflow'u aktifleştirir
 * 4. Webhook URL'ini döndürür
 */
export async function activateUserWorkflow(
  serviceSlug: string,
  userId: string,
  userConfig: Record<string, string>
): Promise<{ workflowId: string; webhookUrl: string }> {
  const templateId = TEMPLATE_WORKFLOW_IDS[serviceSlug]
  if (!templateId) throw new Error(`Bilinmeyen hizmet: ${serviceSlug}`)

  // 1. Credential'ları oluştur
  let credMap: Record<string, { id: string; name: string }> = {}
  if (serviceSlug === 'kartvizit-ajan') {
    credMap = await createKartvizitCredentials(userId, userConfig)
  } else if (serviceSlug === 'drive-ocr') {
    credMap = await createDriveOcrCredentials(userId, userConfig)
  }

  // 2. Template workflow'u getir
  const template = await getTemplateWorkflow(templateId)

  // 3. Credential referanslarını enjekte et
  const clonedWorkflow = injectCredentials(template, credMap)

  // 4. Yeni workflow oluştur (klonla)
  const userName = userId.substring(0, 8)
  const created = await n8nFetch('/workflows', {
    method: 'POST',
    body: JSON.stringify({
      ...clonedWorkflow,
      id: undefined, // Yeni ID üretilsin
      name: `[${userName}] ${serviceSlug}`,
      active: false,
    }),
  })

  // 5. Workflow'u aktifleştir
  await n8nFetch(`/workflows/${created.id}/activate`, { method: 'POST' })

  // 6. Webhook trigger node'unun URL'ini bul
  const webhookNode = (created.nodes as Array<Record<string, unknown>>).find(
    (n) =>
      n.type === 'n8n-nodes-base.webhook' ||
      n.type === 'n8n-nodes-base.telegramTrigger' ||
      n.type === 'n8n-nodes-base.googleDriveTrigger'
  )

  const webhookId = (webhookNode?.webhookId as string) ?? created.id
  const webhookUrl =
    serviceSlug === 'kartvizit-ajan'
      ? `${N8N_BASE_URL}/webhook/${webhookId}`
      : `${N8N_BASE_URL}/webhook/${webhookId}`

  return { workflowId: created.id as string, webhookUrl }
}

export async function deactivateWorkflow(workflowId: string): Promise<void> {
  await n8nFetch(`/workflows/${workflowId}/deactivate`, { method: 'POST' })
}

export async function deleteWorkflow(workflowId: string): Promise<void> {
  await n8nFetch(`/workflows/${workflowId}`, { method: 'DELETE' })
}
