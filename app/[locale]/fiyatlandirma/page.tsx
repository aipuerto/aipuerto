'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Check, MessageSquare, FolderSearch, BarChart3, Users, TrendingUp,
  ArrowRight, MessageCircle, Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Footer from '@/components/Footer'

const WHATSAPP_URL = `https://wa.me/905318358331?text=${encodeURIComponent('Merhaba, kurumsal çözümler hakkında teklif almak istiyorum.')}`

const automationServices = [
  {
    slug: 'kartvizit',
    serviceSlug: 'kartvizit-ajan',
    icon: MessageSquare,
    priceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_KARTVIZIT',
    color: 'primary',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    slug: 'belge_takip',
    serviceSlug: 'drive-ocr',
    icon: FolderSearch,
    priceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_DRIVE_OCR',
    color: 'secondary',
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
  },
]

const enterpriseServices = [
  {
    slug: 'erp',
    serviceSlug: 'erp',
    icon: BarChart3,
    priceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_ERP',
    color: 'accent',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
  },
  {
    slug: 'crm',
    serviceSlug: 'crm',
    icon: Users,
    priceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_CRM',
    color: 'primary',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    slug: 'pazarlama',
    serviceSlug: 'sosyal-medya',
    icon: TrendingUp,
    priceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_PAZARLAMA',
    color: 'secondary',
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
  },
]

export default function PricingPage() {
  const t = useTranslations('pricing')
  const ts = useTranslations('services')
  const locale = useLocale()
  const router = useRouter()

  const handleBuy = async (serviceSlug: string) => {
    // Kartvizit için kurulum sihirbazına yönlendir
    if (serviceSlug === 'kartvizit-ajan') {
      router.push(`/${locale}/kartvizit-kurulum`)
      return
    }

    const priceIdMap: Record<string, string | undefined> = {
      'drive-ocr': process.env.NEXT_PUBLIC_STRIPE_PRICE_DRIVE_OCR,
      'erp': process.env.NEXT_PUBLIC_STRIPE_PRICE_ERP,
      'crm': process.env.NEXT_PUBLIC_STRIPE_PRICE_CRM,
      'sosyal-medya': process.env.NEXT_PUBLIC_STRIPE_PRICE_PAZARLAMA,
    }
    const priceId = priceIdMap[serviceSlug]
    if (!priceId || priceId === 'price_placeholder') {
      alert('Satın alma yakında aktif olacak. WhatsApp üzerinden iletişime geçin.')
      return
    }
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, serviceSlug, locale }),
    })
    const { url, error } = await res.json()
    if (error) { alert(error); return }
    if (url) window.location.href = url
  }

  return (
    <>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">
              <Zap className="w-3.5 h-3.5 mr-1" />
              {t('one_time')}
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">{t('title')}</h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">{t('subtitle')}</p>
          </motion.div>

          {/* ── Otomasyon Araçları ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">{t('automation_section')}</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="text-center text-muted text-sm mb-8">{t('automation_desc')}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {automationServices.map((svc, i) => {
              const features = ts.raw(`${svc.slug}.features`) as string[]
              return (
                <motion.div
                  key={svc.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="glass-card p-8 relative group hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-5">
                      <Badge variant={svc.color === 'primary' ? 'default' : 'secondary'}>
                        {ts(`${svc.slug}.badge`)}
                      </Badge>
                      <div className={`w-11 h-11 ${svc.iconBg} rounded-xl flex items-center justify-center`}>
                        <svc.icon className={`w-5 h-5 ${svc.iconColor}`} />
                      </div>
                    </div>

                    <h3 className="text-xl font-display font-bold mb-1">{ts(`${svc.slug}.title`)}</h3>
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="text-3xl font-display font-bold text-primary">{ts(`${svc.slug}.price`)}</span>
                      <span className="text-xs text-muted">{ts(`${svc.slug}.currency`)} · {t('one_time')}</span>
                    </div>

                    <p className="text-muted text-sm leading-relaxed mb-5">{ts(`${svc.slug}.description`)}</p>

                    <ul className="space-y-1.5 mb-7">
                      {features.map((feat, fi) => (
                        <li key={fi} className="flex items-center gap-2 text-sm">
                          <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="text-foreground/80">{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full group/btn"
                      size="lg"
                      onClick={() => handleBuy(svc.serviceSlug)}
                    >
                      {t('buy_now')}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* ── Kurumsal Çözümler ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-semibold text-accent uppercase tracking-widest">{t('enterprise_section')}</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="text-center text-muted text-sm mb-8">{t('enterprise_desc')}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {enterpriseServices.map((svc, i) => {
              const features = ts.raw(`${svc.slug}.features`) as string[]
              return (
                <motion.div
                  key={svc.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.1 }}
                  className="glass-card p-7 relative group hover:border-accent/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-5">
                      <Badge variant="accent">{ts(`${svc.slug}.badge`)}</Badge>
                      <div className={`w-11 h-11 ${svc.iconBg} rounded-xl flex items-center justify-center`}>
                        <svc.icon className={`w-5 h-5 ${svc.iconColor}`} />
                      </div>
                    </div>

                    <h3 className="text-xl font-display font-bold mb-1">{ts(`${svc.slug}.title`)}</h3>
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="text-2xl font-display font-bold text-accent">{ts(`${svc.slug}.price`)}</span>
                      <span className="text-xs text-muted">{ts(`${svc.slug}.currency`)}</span>
                    </div>

                    <p className="text-muted text-sm leading-relaxed mb-5">{ts(`${svc.slug}.description`)}</p>

                    <ul className="space-y-1.5 mb-6">
                      {features.map((feat, fi) => (
                        <li key={fi} className="flex items-center gap-2 text-sm">
                          <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                          <span className="text-foreground/80">{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full group/btn"
                      size="lg"
                      onClick={() => handleBuy(svc.serviceSlug)}
                    >
                      {t('buy_now')}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="glass-card p-8 text-center"
          >
            <h3 className="text-xl font-display font-bold mb-2">{t('cta_title')}</h3>
            <p className="text-muted mb-6">{t('cta_subtitle')}</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/10">
                <MessageCircle className="w-4 h-4" />
                {t('get_quote')}
              </Button>
            </a>
          </motion.div>

        </div>
      </div>
      <Footer />
    </>
  )
}
