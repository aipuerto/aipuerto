import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Navbar from '@/components/Navbar'
import WhatsAppButton from '@/components/WhatsAppButton'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'tr' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="mesh-bg min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
