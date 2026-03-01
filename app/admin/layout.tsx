import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/tr/giris')
  }

  return (
    <div className="mesh-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold">Admin Panel</h1>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
          <Link href="/tr" className="text-sm text-muted hover:text-foreground transition-colors">
            ← Siteye Dön
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
