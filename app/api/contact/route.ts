import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(10),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = contactSchema.parse(body)

    const supabase = await createClient()

    const { error } = await supabase.from('contact_messages').insert({
      name: data.name,
      email: data.email,
      subject: data.subject ?? null,
      message: data.message,
    })

    if (error) {
      console.error('Contact message error:', error)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact route error:', error)
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
