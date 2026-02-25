import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardSidebar from '@/components/DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/tr/giris')
  }

  return (
    <html lang="tr">
      <body className="mesh-bg min-h-screen">
        <div className="flex min-h-screen">
          <DashboardSidebar user={user} />
          <main className="flex-1 ml-0 md:ml-64 p-6 pt-20 md:pt-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
