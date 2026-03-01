'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, User, Phone, Bot } from 'lucide-react'

export interface AdminConfigItem {
  id: string
  userEmail: string
  service_id: string
  created_at: string
  tokenPreview: string
  phone: string
}

export default function AdminActivateClient({ configs }: { configs: AdminConfigItem[] }) {
  const [activating, setActivating] = useState<string | null>(null)
  const [activated, setActivated] = useState<Set<string>>(new Set())

  const handleActivate = async (configId: string) => {
    setActivating(configId)
    try {
      const res = await fetch('/api/admin/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configId }),
      })
      if (res.ok) {
        setActivated((prev) => new Set([...prev, configId]))
      } else {
        const { error } = await res.json()
        alert('Hata: ' + error)
      }
    } catch {
      alert('Bağlantı hatası.')
    } finally {
      setActivating(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-yellow-400" />
        <h2 className="font-semibold text-lg">
          Bekleyen Aktivasyonlar
          {configs.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
              {configs.length}
            </span>
          )}
        </h2>
      </div>

      {configs.length === 0 && (
        <div className="glass-card p-10 text-center text-muted">
          <CheckCircle2 className="w-10 h-10 text-green-400/40 mx-auto mb-3" />
          <p>Bekleyen aktivasyon yok.</p>
        </div>
      )}

      {configs.map((cfg) => {
        const isActivated = activated.has(cfg.id)
        return (
          <div
            key={cfg.id}
            className={`glass-card p-6 transition-all ${
              isActivated ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted flex-shrink-0" />
                  <span className="font-medium truncate">{cfg.userEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{cfg.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Bot className="w-3.5 h-3.5 flex-shrink-0" />
                  <code className="text-xs bg-card px-2 py-0.5 rounded text-primary">
                    {cfg.tokenPreview}
                  </code>
                </div>
                <div className="text-xs text-muted/60">
                  {new Date(cfg.created_at).toLocaleString('tr-TR')}
                </div>
              </div>

              <div className="flex-shrink-0">
                {isActivated ? (
                  <div className="flex items-center gap-1.5 text-green-400 text-sm whitespace-nowrap">
                    <CheckCircle2 className="w-4 h-4" />
                    Aktifleştirildi
                  </div>
                ) : (
                  <Button
                    onClick={() => handleActivate(cfg.id)}
                    disabled={activating === cfg.id}
                    size="sm"
                  >
                    {activating === cfg.id ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                        İşleniyor...
                      </span>
                    ) : (
                      'Aktifleştir'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
