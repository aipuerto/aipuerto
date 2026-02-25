'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const locale = useLocale()

  const links = [
    { href: `/${locale}`, label: nav('home') },
    { href: `/${locale}/hizmetler`, label: nav('services') },
    { href: `/${locale}/fiyatlandirma`, label: nav('pricing') },
    { href: `/${locale}/iletisim`, label: nav('contact') },
  ]

  const legal = [
    { href: `/${locale}/gizlilik`, label: t('privacy') },
    { href: `/${locale}/kosullar`, label: t('terms') },
  ]

  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl">
                ai<span className="text-primary">puerto</span>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs">{t('description')}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">{t('links')}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">{t('legal')}</h4>
            <ul className="space-y-2">
              {legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">{t('copyright')}</p>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>Powered by</span>
            <span className="text-primary font-medium">n8n</span>
            <span>•</span>
            <span className="text-secondary font-medium">Supabase</span>
            <span>•</span>
            <span className="text-accent font-medium">Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
