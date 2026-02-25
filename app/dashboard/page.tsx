import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Package, Settings, ArrowRight, Zap, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const { data: purchases } = await supabase
    .from('purchases')
    .select('*, services(*), service_configs(*)')
    .eq('user_id', user!.id)
    .eq('status', 'paid')

  const activePurchases = purchases?.filter((p) => p.status === 'paid') ?? []
  const setupComplete = activePurchases.filter((p) => p.service_configs?.setup_completed).length
  const setupPending = activePurchases.length - setupComplete

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">
          Merhaba, {profile?.full_name?.split(' ')[0] ?? 'Kullanıcı'} 👋
        </h1>
        <p className="text-muted mt-1">aipuerto.com panelinize hoş geldiniz</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-muted">Aktif Hizmet</span>
          </div>
          <div className="text-3xl font-display font-bold">{activePurchases.length}</div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-sm text-muted">Kurulum Tamam</span>
          </div>
          <div className="text-3xl font-display font-bold">{setupComplete}</div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-400" />
            </div>
            <span className="text-sm text-muted">Kurulum Bekliyor</span>
          </div>
          <div className="text-3xl font-display font-bold">{setupPending}</div>
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold">Son Hizmetlerim</h2>
          <Link href="/dashboard/hizmetlerim">
            <Button variant="ghost" size="sm">
              Tümünü Gör <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {activePurchases.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
              <Zap className="w-8 h-8 text-muted" />
            </div>
            <h3 className="font-display font-bold mb-2">Henüz hizmet satın almadınız</h3>
            <p className="text-muted text-sm mb-6">
              Yapay zeka otomasyonlarını keşfedin ve işinizi hızlandırın.
            </p>
            <Link href="/tr/fiyatlandirma">
              <Button>Hizmetleri İncele</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activePurchases.slice(0, 3).map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{purchase.services?.name}</div>
                    <div className="text-xs text-muted">
                      {purchase.service_configs?.setup_completed ? (
                        <span className="text-green-400">Aktif</span>
                      ) : (
                        <span className="text-yellow-400">Kurulum Gerekiyor</span>
                      )}
                    </div>
                  </div>
                </div>
                <Link href="/dashboard/hizmetlerim">
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
