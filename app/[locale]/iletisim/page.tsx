'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { MessageCircle, Mail, Send, Loader2, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Footer from '@/components/Footer'

const contactSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta girin'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalı'),
})

type ContactForm = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905000000000'
  const message = encodeURIComponent(
    'Merhaba, aipuerto.com hakkında bilgi almak istiyorum.'
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactForm) => {
    setError(null)
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      setError('Mesaj gönderilemedi. Lütfen tekrar deneyin.')
      return
    }

    setSent(true)
  }

  return (
    <>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">İletişim</h1>
            <p className="text-lg text-muted">Sorularınız için bize ulaşın</p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 space-y-6"
            >
              <div className="glass-card p-6">
                <h3 className="font-display font-bold mb-4">Hızlı Ulaşım</h3>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all group"
                >
                  <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">WhatsApp</div>
                    <div className="text-muted text-xs">Hızlı yanıt garantisi</div>
                  </div>
                </a>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-display font-bold mb-4">E-posta</h3>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                  <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">info@aipuerto.com</div>
                    <div className="text-muted text-xs">1-2 gün içinde yanıt</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-3"
            >
              {sent ? (
                <div className="glass-card p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-display font-bold mb-2">Mesajınız İletildi!</h3>
                  <p className="text-muted">En kısa sürede size dönüş yapacağız.</p>
                </div>
              ) : (
                <div className="glass-card p-8">
                  <h3 className="font-display font-bold text-xl mb-6">Mesaj Gönderin</h3>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Ad Soyad</Label>
                        <Input id="name" placeholder="Ahmet Yıldız" {...register('name')} />
                        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input id="email" type="email" placeholder="ornek@mail.com" {...register('email')} />
                        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Konu (opsiyonel)</Label>
                      <Input id="subject" placeholder="Mesajınızın konusu" {...register('subject')} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mesaj</Label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Mesajınızı buraya yazın..."
                        {...register('message')}
                        className="flex w-full rounded-xl border border-border bg-card/50 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      />
                      {errors.message && <p className="text-xs text-red-400">{errors.message.message}</p>}
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
                        {error}
                      </div>
                    )}

                    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Gönderiliyor...</>
                      ) : (
                        <><Send className="w-4 h-4" /> Gönder</>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
