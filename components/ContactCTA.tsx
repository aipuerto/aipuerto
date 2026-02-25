'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MessageCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactCTA() {
  const t = useTranslations('contact_cta')
  const locale = useLocale()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905000000000'
  const message = encodeURIComponent(
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
      'Merhaba, aipuerto.com hakkında bilgi almak istiyorum.'
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <section className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="container-width relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted max-w-xl mx-auto mb-10">{t('subtitle')}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="xl" className="bg-[#25D366] hover:bg-[#20b858] text-white group">
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {t('whatsapp')}
              </Button>
            </a>
            <Link href={`/${locale}/iletisim`}>
              <Button size="xl" variant="outline">
                <Mail className="w-5 h-5" />
                {t('contact_form')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
