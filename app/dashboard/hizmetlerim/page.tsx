'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, Copy, Check, Settings, ExternalLink, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface ServiceConfig {
  id: string
  service_id: string
  n8n_webhook_url: string | null
  is_active: boolean
  setup_completed: boolean
  config_data: Record<string, string>
}

interface Purchase {
  id: string
  services: { name: string; slug: string; description: string }
  service_configs: ServiceConfig | null
}

const SERVICE_FIELDS: Record<string, { key: string; label: string; placeholder: string; sensitive?: boolean }[]> = {
  'kartvizit-ajan': [
    { key: 'telegram_bot_token', label: 'Telegram Bot Token', placeholder: '1234567890:ABCdef...', sensitive: true },
    { key: 'telegram_chat_id', label: 'Telegram Chat ID (botu ekleyip /start gonderin)', placeholder: '-100123456789' },
    { key: 'google_client_id', label: 'Google OAuth 2.0 Client ID', placeholder: 'xxx.apps.googleusercontent.com' },
    { key: 'google_client_secret', label: 'Google Client Secret', placeholder: 'GOCSPX-...', sensitive: true },
    { key: 'google_refresh_token', label: 'Google Refresh Token', placeholder: '1//...', sensitive: true },
    { key: 'airtable_token', label: 'Airtable API Token', placeholder: 'patXXXX...', sensitive: true },
  ],
  'drive-ocr': [
    { key: 'google_client_id', label: 'Google OAuth 2.0 Client ID', placeholder: 'xxx.apps.googleusercontent.com' },
    { key: 'google_client_secret', label: 'Google Client Secret', placeholder: 'GOCSPX-...', sensitive: true },
    { key: 'google_refresh_token', label: 'Google Refresh Token', placeholder: '1//...', sensitive: true },
    { key: 'source_folder_id', label: 'Kaynak Drive Klasör ID (takip edilecek)', placeholder: '1BxiMVs0YxABC...' },
    { key: 'processed_folder_id', label: 'İşlenmiş Klasör ID (tamamlanan)', placeholder: '1BxiMVs0YxDEF...' },
    { key: 'sheets_id', label: 'Google Sheets Spreadsheet ID', placeholder: '1BxiMVs0YxGHI...' },
    { key: 'sheet_name', label: 'Hedef Sheet (Sayfa) Adı', placeholder: 'Sayfa1' },
  ],
}

export default function HizmetlerimPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [configValues, setConfigValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchPurchases = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('purchases')
        .select('*, services(*), service_configs(*)')
        .eq('status', 'paid')
      setPurchases((data as Purchase[]) ?? [])
      setLoading(false)
    }
    fetchPurchases()
  }, [])

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const startEdit = (purchase: Purchase) => {
    setEditingId(purchase.id)
    setConfigValues((purchase.service_configs?.config_data as Record<string, string>) ?? {})
  }

  const saveConfig = async (purchase: Purchase) => {
    setSaving(true)
    const res = await fetch('/api/service-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        purchaseId: purchase.id,
        serviceId: purchase.services.slug,
        serviceSlug: purchase.services.slug,
        config: configValues,
      }),
    })

    if (res.ok) {
      setEditingId(null)
      window.location.reload()
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Hizmetlerim</h1>
        <p className="text-muted mt-1">Satın aldığınız otomasyonları yönetin</p>
      </div>

      {purchases.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
            <Zap className="w-8 h-8 text-muted" />
          </div>
          <h3 className="font-display font-bold mb-2">Henüz hizmet satın almadınız</h3>
          <p className="text-muted text-sm mb-6">Otomasyon çözümlerimizi keşfedin.</p>
          <Link href="/tr/fiyatlandirma">
            <Button>Hizmetlere Göz At</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {purchases.map((purchase) => {
            const config = purchase.service_configs
            const fields = SERVICE_FIELDS[purchase.services.slug] ?? []
            const isEditing = editingId === purchase.id

            return (
              <div key={purchase.id} className="glass-card p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold">{purchase.services.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {config?.is_active ? (
                          <span className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                            Aktif
                          </span>
                        ) : config?.setup_completed ? (
                          <span className="text-xs text-yellow-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Aktivasyon Bekleniyor
                          </span>
                        ) : (
                          <span className="text-xs text-orange-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Kurulum Gerekiyor
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => startEdit(purchase)}>
                    <Settings className="w-4 h-4 mr-1" />
                    Yapılandır
                  </Button>
                </div>

                {/* Webhook URL */}
                {config?.n8n_webhook_url && (
                  <div className="mb-4 p-4 bg-card/50 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-xs text-muted">Webhook URL</Label>
                      <button
                        onClick={() => copyToClipboard(config.n8n_webhook_url!, purchase.id)}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        {copiedId === purchase.id ? (
                          <><Check className="w-3 h-3" /> Kopyalandı!</>
                        ) : (
                          <><Copy className="w-3 h-3" /> Kopyala</>
                        )}
                      </button>
                    </div>
                    <code className="text-xs font-mono text-foreground/60 break-all">
                      {config.n8n_webhook_url}
                    </code>
                  </div>
                )}

                {/* Config Form */}
                {isEditing && (
                  <div className="mt-4 space-y-4 border-t border-border pt-4">
                    <p className="text-sm text-muted">API bilgilerinizi girin. Bilgiler şifreli olarak saklanır.</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {fields.map((field) => (
                        <div key={field.key} className="space-y-1.5">
                          <Label className="text-xs">{field.label}</Label>
                          <Input
                            type={field.sensitive ? 'password' : 'text'}
                            placeholder={field.placeholder}
                            value={configValues[field.key] ?? ''}
                            onChange={(e) =>
                              setConfigValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                            }
                            className="text-xs font-mono"
                            autoComplete="off"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button onClick={() => saveConfig(purchase)} disabled={saving}>
                        {saving ? 'Kaydediliyor...' : 'Kaydet & Aktifleştir'}
                      </Button>
                      <Button variant="ghost" onClick={() => setEditingId(null)}>
                        İptal
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
