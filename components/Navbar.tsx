'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Menu, X, Zap, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/hizmetler`, label: t('services') },
    { href: `/${locale}/fiyatlandirma`, label: t('pricing') },
    { href: `/${locale}/iletisim`, label: t('contact') },
  ]

  const otherLocale = locale === 'tr' ? 'en' : 'tr'
  const localeLabel = locale === 'tr' ? 'EN' : 'TR'

  const switchLocalePath = () => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    return `/${otherLocale}${pathWithoutLocale}`
  }

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl">
              ai<span className="text-primary">puerto</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted hover:text-foreground hover:bg-card'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={switchLocalePath()}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-card"
            >
              <Globe className="w-4 h-4" />
              <span>{localeLabel}</span>
            </Link>
            <Link href={`/${locale}/giris`}>
              <Button variant="ghost" size="sm">
                {t('login')}
              </Button>
            </Link>
            <Link href={`/${locale}/kayit`}>
              <Button size="sm" className="glow-primary">
                {t('register')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-muted hover:text-foreground hover:bg-card transition-all"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  pathname === link.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted hover:text-foreground hover:bg-card'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 space-y-2 border-t border-border">
              <Link href={`/${locale}/giris`} onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  {t('login')}
                </Button>
              </Link>
              <Link href={`/${locale}/kayit`} onClick={() => setIsOpen(false)}>
                <Button size="sm" className="w-full">
                  {t('register')}
                </Button>
              </Link>
              <Link
                href={switchLocalePath()}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-muted hover:text-foreground"
              >
                <Globe className="w-4 h-4" />
                <span>{locale === 'tr' ? 'Switch to English' : "Türkçe'ye Geç"}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
