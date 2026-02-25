import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
  pathnames: {
    '/': '/',
    '/hizmetler': {
      tr: '/hizmetler',
      en: '/services',
    },
    '/hizmetler/kartvizit': {
      tr: '/hizmetler/kartvizit',
      en: '/services/business-card',
    },
    '/hizmetler/drive-ocr': {
      tr: '/hizmetler/drive-ocr',
      en: '/services/drive-ocr',
    },
    '/fiyatlandirma': {
      tr: '/fiyatlandirma',
      en: '/pricing',
    },
    '/iletisim': {
      tr: '/iletisim',
      en: '/contact',
    },
    '/giris': {
      tr: '/giris',
      en: '/login',
    },
    '/kayit': {
      tr: '/kayit',
      en: '/register',
    },
  },
})
