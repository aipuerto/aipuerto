import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { notifyAdmin } from '@/lib/whatsapp'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, message } = await req.json()
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Mesaj boş olamaz' }, { status: 400 })
    }

    const adminMsg =
      `DESTEK TALEBİ\n` +
      `-----------------------------\n` +
      `Email: ${user.email}\n` +
      `Konu: ${subject?.trim() || 'Belirtilmedi'}\n` +
      `Mesaj: ${message.trim()}\n` +
      `-----------------------------\n` +
      `Tarih: ${new Date().toLocaleString('tr-TR')}`

    await notifyAdmin(adminMsg)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Support error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
