'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Key, CheckCircle2, ArrowRight, ArrowLeft,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Footer from '@/components/Footer'

interface WizardState {
  telegramBotToken: string
  phone: string
}

const slideVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
}

export default function KartvizitKurulumPage() {
  const [step, setStep] = useState(1)
  const [state, setState] = useState<WizardState>({ telegramBotToken: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const locale = useLocale()

  const handleCheckout = async () => {
    if (!state.telegramBotToken.trim() || !state.phone.trim()) {
      setError('Lütfen tüm alanları doldurun.')
      return
    }
    if (!/^\d+:[A-Za-z0-9_-]{35,}$/.test(state.telegramBotToken.trim())) {
      setError('Geçersiz bot token formatı. BotFather\'dan aldığınız tokeni kontrol edin.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_KARTVIZIT
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          serviceSlug: 'kartvizit-ajan',
          locale,
          configData: {
            telegram_bot_token: state.telegramBotToken.trim(),
            phone: state.phone.trim(),
          },
        }),
      })
      const { url, error: apiError } = await res.json()
      if (apiError) { setError(apiError); return }
      if (url) window.location.href = url
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto">

          {/* Başlık */}
          <div className="text-center mb-10">
            <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-2">
              Kartvizit Okuyucu
            </p>
            <h1 className="text-3xl font-display font-bold">Kurulum Sihirbazı</h1>
            <p className="text-muted mt-2 text-sm">3 adımda botunuzu hazırlayın, sonra ödeme yapın.</p>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  s <= step ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <div className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted uppercase tracking-widest">Adım 1 / 3</div>
                      <h2 className="text-xl font-display font-bold">BotFather&apos;ı Bulun</h2>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-6">
                    <ShieldAlert className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-yellow-300 mb-1">Sahte Hesaplara Dikkat</p>
                      <p className="text-foreground/70">
                        Sadece <span className="font-mono font-bold text-white">@BotFather</span> adlı
                        mavi tik rozetli resmi hesabı kullanın. Başka hesaplar dolandırıcılık amaçlıdır.
                      </p>
                    </div>
                  </div>

                  <ol className="space-y-3 mb-8 text-sm text-foreground/80">
                    {[
                      'Telegram uygulamasını açın',
                      <>Arama çubuğuna <code className="bg-card px-1.5 py-0.5 rounded text-primary font-mono">@BotFather</code> yazın</>,
                      <>Mavi tik rozetli hesabı seçin ve <code className="bg-card px-1.5 py-0.5 rounded text-primary font-mono">/start</code> gönderin</>,
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>

                  <Button onClick={() => setStep(2)} className="w-full" size="lg">
                    Anladım, Devam Et <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <div className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Key className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted uppercase tracking-widest">Adım 2 / 3</div>
                      <h2 className="text-xl font-display font-bold">Botunuzu Oluşturun</h2>
                    </div>
                  </div>

                  <ol className="space-y-4 mb-6 text-sm text-foreground/80">
                    {[
                      <><code className="bg-card px-1.5 py-0.5 rounded text-secondary font-mono">/newbot</code> komutunu gönderin</>,
                      'Botunuz için bir isim girin (ör: "Kartvizit Asistanım")',
                      <><strong>Kullanıcı adı</strong> belirleyin — <code className="bg-card px-1.5 py-0.5 rounded text-secondary font-mono">_bot</code> ile bitmeli</>,
                      <>BotFather size <strong>HTTP API Token</strong> verecek — kopyalayın</>,
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="p-4 rounded-xl bg-card/50 border border-border mb-8">
                    <p className="text-xs text-muted mb-1">Token örneği:</p>
                    <p className="text-sm font-mono text-primary break-all">
                      1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ-abc_def
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => setStep(1)} size="lg" className="flex-1">
                      <ArrowLeft className="w-4 h-4" /> Geri
                    </Button>
                    <Button onClick={() => setStep(3)} size="lg" className="flex-1">
                      Token Hazır <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <div className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-muted uppercase tracking-widest">Adım 3 / 3</div>
                      <h2 className="text-xl font-display font-bold">Bilgilerinizi Girin</h2>
                    </div>
                  </div>

                  <div className="space-y-5 mb-5">
                    <div className="space-y-1.5">
                      <Label>Telegram Bot Token</Label>
                      <Input
                        type="password"
                        placeholder="1234567890:ABCdef..."
                        value={state.telegramBotToken}
                        onChange={(e) => setState((p) => ({ ...p, telegramBotToken: e.target.value }))}
                        className="font-mono text-sm"
                        autoComplete="off"
                      />
                      <p className="text-xs text-muted">BotFather&apos;dan aldığınız HTTP API token</p>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Telefon Numaranız</Label>
                      <Input
                        type="tel"
                        placeholder="+90 532 123 4567"
                        value={state.phone}
                        onChange={(e) => setState((p) => ({ ...p, phone: e.target.value }))}
                      />
                      <p className="text-xs text-muted">Kurulum tamamlandığında bilgilendirme için</p>
                    </div>
                  </div>

                  <div className="flex gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10 mb-5">
                    <ShieldAlert className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-foreground/60">
                      Token ve telefon numaranız AES-256 şifrelenerek saklanır. Üçüncü taraflarla paylaşılmaz.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(2)}
                      size="lg"
                      className="flex-1"
                      disabled={loading}
                    >
                      <ArrowLeft className="w-4 h-4" /> Geri
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      size="lg"
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Yönlendiriliyor...
                        </span>
                      ) : (
                        <>Ödemeye Geç <ArrowRight className="w-4 h-4" /></>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
      <Footer />
    </>
  )
}
