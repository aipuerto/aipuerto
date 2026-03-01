import { createAdminClient } from '@/lib/supabase/admin'
import { decrypt } from '@/lib/crypto'
import AdminActivateClient, { type AdminConfigItem } from './AdminActivateClient'

type PendingConfig = {
  id: string
  user_id: string
  service_id: string
  config_data: unknown
  created_at: string
}

export default async function AdminPage() {
  const supabase = createAdminClient()

  // setup_completed=true, is_active=false olan bekleyenler
  const { data: raw } = await supabase
    .from('service_configs')
    .select('id, user_id, service_id, config_data, created_at')
    .eq('is_active', false)
    .eq('setup_completed', true)
    .order('created_at', { ascending: false })

  const pendingConfigs = (raw ?? []) as PendingConfig[]

  const configs: AdminConfigItem[] = await Promise.all(
    pendingConfigs.map(async (cfg) => {
      const { data: userData } = await supabase.auth.admin.getUserById(cfg.user_id)
      const userEmail = userData?.user?.email ?? cfg.user_id

      const configData = cfg.config_data as Record<string, string>

      let tokenPreview = 'N/A'
      let phone = 'N/A'

      try {
        if (configData?.telegram_bot_token) {
          const raw = decrypt(configData.telegram_bot_token)
          tokenPreview = raw.slice(0, 12) + '...' + raw.slice(-6)
        }
      } catch {
        tokenPreview = 'Çözülemedi'
      }

      try {
        if (configData?.phone) {
          phone = decrypt(configData.phone)
        }
      } catch {
        phone = 'Çözülemedi'
      }

      return {
        id: cfg.id,
        userEmail,
        service_id: cfg.service_id,
        created_at: cfg.created_at,
        tokenPreview,
        phone,
      }
    })
  )

  return <AdminActivateClient configs={configs} />
}
