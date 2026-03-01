import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { priceId, serviceSlug, locale = 'tr', configData } = await req.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const metadata: Record<string, string> = {
      userId: user.id,
      serviceId: serviceSlug ?? '',
    }

    if (configData?.telegram_bot_token) {
      metadata.telegram_bot_token = String(configData.telegram_bot_token).slice(0, 490)
    }
    if (configData?.phone) {
      metadata.phone = String(configData.phone).slice(0, 50)
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/${locale}/fiyatlandirma`,
      customer_email: user.email,
      metadata,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
