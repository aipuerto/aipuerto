import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { encrypt } from '@/lib/crypto'
import { activateUserWorkflow } from '@/lib/n8n'

export async function POST(req: NextRequest) {
  try {
    const { purchaseId, serviceId, serviceSlug, config } = await req.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Config değerlerini şifrele
    const encryptedConfig: Record<string, string> = {}
    for (const [key, value] of Object.entries(config as Record<string, string>)) {
      if (value) {
        encryptedConfig[key] = encrypt(value)
      }
    }

    let webhookUrl: string | null = null

    // n8n workflow aktifleştir
    try {
      const result = await activateUserWorkflow(serviceSlug, user.id, config as Record<string, string>)
      webhookUrl = result.webhookUrl
    } catch (n8nError) {
      console.error('n8n activation error:', n8nError)
      // n8n hatası kurulumu engellemez, webhook URL olmadan devam eder
    }

    // service_configs güncelle
    const { error } = await supabase
      .from('service_configs')
      .update({
        config_data: encryptedConfig,
        n8n_webhook_url: webhookUrl,
        setup_completed: true,
        is_active: !!webhookUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('purchase_id', purchaseId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Config update error:', error)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, webhookUrl })
  } catch (error) {
    console.error('Service config error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
