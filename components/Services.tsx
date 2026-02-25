'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  MessageSquare, FolderSearch, BarChart3, Users, TrendingUp,
  Check, ArrowRight, MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Services() {
  const t = useTranslations('services')
  const locale = useLocale()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const whatsappUrl = `https://wa.me/905318358331?text=${encodeURIComponent('Merhaba, kurumsal çözümler hakkında teklif almak istiyorum.')}`

  const automationServices = [
    {
      slug: 'kartvizit',
      icon: MessageSquare,
      badge: t('kartvizit.badge'),
      title: t('kartvizit.title'),
      description: t('kartvizit.description'),
      features: t.raw('kartvizit.features') as string[],
      price: t('kartvizit.price'),
      currency: t('kartvizit.currency'),
      color: 'primary',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      href: `/${locale}/kayit`,
      priceStripeKey: 'NEXT_PUBLIC_STRIPE_PRICE_KARTVIZIT',
    },
    {
      slug: 'belge-takip',
      icon: FolderSearch,
      badge: t('belge_takip.badge'),
      title: t('belge_takip.title'),
      description: t('belge_takip.description'),
      features: t.raw('belge_takip.features') as string[],
      price: t('belge_takip.price'),
      currency: t('belge_takip.currency'),
      color: 'secondary',
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
      href: `/${locale}/kayit`,
    },
  ]

  const enterpriseServices = [
    {
      slug: 'erp',
      icon: BarChart3,
      badge: t('erp.badge'),
      title: t('erp.title'),
      description: t('erp.description'),
      features: t.raw('erp.features') as string[],
      price: t('erp.price'),
      currency: t('erp.currency'),
      color: 'accent',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
    },
    {
      slug: 'crm',
      icon: Users,
      badge: t('crm.badge'),
      title: t('crm.title'),
      description: t('crm.description'),
      features: t.raw('crm.features') as string[],
      price: t('crm.price'),
      currency: t('crm.currency'),
      color: 'primary',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      slug: 'pazarlama',
      icon: TrendingUp,
      badge: t('pazarlama.badge'),
      title: t('pazarlama.title'),
      description: t('pazarlama.description'),
      features: t.raw('pazarlama.features') as string[],
      price: t('pazarlama.price'),
      currency: t('pazarlama.currency'),
      color: 'secondary',
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
  ]

  return (
    <section id="hizmetler" className="section-padding" ref={ref}>
      <div className="container-width">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4">{t('title')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">{t('title')}</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">{t('subtitle')}</p>
        </motion.div>

        {/* ── Otomasyon Araçları ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-4"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">{t('automation_title')}</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {automationServices.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="glass-card p-7 group hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <Badge variant={service.color === 'primary' ? 'default' : 'secondary'}>
                    {service.badge}
                  </Badge>
                  <div className={`w-11 h-11 ${service.iconBg} rounded-xl flex items-center justify-center`}>
                    <service.icon className={`w-5 h-5 ${service.iconColor}`} />
                  </div>
                </div>

                <div className="mb-1">
                  <h3 className="text-xl font-display font-bold">{service.title}</h3>
                  <div className="flex items-baseline gap-1.5 mt-2 mb-3">
                    <span className="text-2xl font-display font-bold text-primary">{service.price}</span>
                    <span className="text-xs text-muted">{service.currency} · tek seferlik</span>
                  </div>
                </div>

                <p className="text-muted text-sm leading-relaxed mb-5">{service.description}</p>

                <ul className="space-y-1.5 mb-6">
                  {service.features.map((feature, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={service.href}>
                  <Button className="w-full group/btn" size="lg">
                    {t('cta')}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Kurumsal Çözümler ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-4"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm font-semibold text-accent uppercase tracking-widest">{t('enterprise_title')}</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {enterpriseServices.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.1 }}
              className="glass-card p-7 group hover:border-accent/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <Badge variant="accent">{service.badge}</Badge>
                  <div className={`w-11 h-11 ${service.iconBg} rounded-xl flex items-center justify-center`}>
                    <service.icon className={`w-5 h-5 ${service.iconColor}`} />
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold mb-1">{service.title}</h3>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-2xl font-display font-bold text-accent">{service.price}</span>
                  <span className="text-xs text-muted">{service.currency}</span>
                </div>

                <p className="text-muted text-sm leading-relaxed mb-5">{service.description}</p>

                <ul className="space-y-1.5 mb-6">
                  {service.features.map((feature, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm">
                      <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-accent/30 hover:border-accent hover:bg-accent/10 hover:text-accent" size="lg">
                    <MessageCircle className="w-4 h-4" />
                    {t('cta_quote')}
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
