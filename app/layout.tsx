import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'aipuerto.com — Yapay Zeka & Otomasyon Hizmetleri',
    template: '%s | aipuerto.com',
  },
  description:
    'Yapay zeka destekli otomasyon çözümleri. Telegram kartvizit ajanı, Google Drive OCR ve daha fazlası.',
  keywords: ['yapay zeka', 'otomasyon', 'n8n', 'workflow', 'telegram', 'google drive', 'OCR'],
  authors: [{ name: 'aipuerto.com' }],
  openGraph: {
    title: 'aipuerto.com — Yapay Zeka & Otomasyon',
    description: 'İşinizi yapay zeka ile otomatize edin.',
    url: 'https://aipuerto.com',
    siteName: 'aipuerto.com',
    locale: 'tr_TR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
