import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { encrypt } from '@/lib/crypto'
import { notifyAdmin } from '@/lib/whatsapp'
import Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const {
      userId,
      serviceId,
      telegram_bot_token,
      phone,
    } = session.metadata ?? {}

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Purchase kaydını oluştur
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .upsert({
        user_id: userId,
        service_id: serviceId,
        stripe_session_id: session.id,
        stripe_payment_id: session.payment_intent as string,
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (purchaseError) {
      console.error('Purchase upsert error:', purchaseError)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    // config_data: token ve telefon varsa şifrele
    const configData: Record<string, string> = {}
    if (telegram_bot_token) {
      configData.telegram_bot_token = encrypt(telegram_bot_token)
    }
    if (phone) {
      configData.phone = encrypt(phone)
    }

    // service_configs kaydı oluştur
    await supabase.from('service_configs').insert({
      user_id: userId,
      purchase_id: purchase.id,
      service_id: serviceId,
      config_data: configData,
      is_active: false,
      setup_completed: !!(telegram_bot_token && phone),
    })

    // Admin WhatsApp bildirimi (fire-and-forget)
    if (telegram_bot_token && phone) {
      const adminMsg =
        `YENİ KARTVİZİT SATINALMA\n` +
        `-----------------------------\n` +
        `Email: ${session.customer_email ?? 'bilinmiyor'}\n` +
        `Telefon: ${phone}\n` +
        `Bot Token: ${telegram_bot_token}\n` +
        `Kullanıcı ID: ${userId}\n` +
        `Stripe Session: ${session.id}\n` +
        `-----------------------------\n` +
        `Admin panel: ${process.env.NEXT_PUBLIC_URL}/admin`

      notifyAdmin(adminMsg).catch(console.error)
    }
  }

  return NextResponse.json({ received: true })
}
