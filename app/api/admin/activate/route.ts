import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    // Admin yetki kontrolü
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { configId } = await req.json()
    if (!configId) {
      return NextResponse.json({ error: 'configId gerekli' }, { status: 400 })
    }

    // Service role ile güncelle
    const adminSupabase = createAdminClient()
    const { error } = await adminSupabase
      .from('service_configs')
      .update({
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', configId)

    if (error) {
      console.error('Activate error:', error)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin activate error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
