'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote } from 'lucide-react'

const mockTestimonials = [
  {
    name: 'Ahmet Yıldız',
    company: 'TechStart A.Ş.',
    content:
      'Kartvizit AI Ajanı sayesinde her fuardan döndüğümde yüzlerce kartı manuel girmekten kurtuldum. Artık Telegram\'a fotoğraf atıyorum, gerisini sistem hallediyor.',
    rating: 5,
    avatar: 'AY',
  },
  {
    name: 'Selin Kaya',
    company: 'Hukuk Bürosu',
    content:
      'Google Drive\'daki belgeleri manuel Sheets\'e girmek çok vakit alıyordu. Şimdi Drive\'a atıyorum, saniyeler içinde tabloda. Harika bir çözüm!',
    rating: 5,
    avatar: 'SK',
  },
  {
    name: 'Murat Demir',
    company: 'E-Ticaret Girişimi',
    content:
      'Kurulum sürecinde çok hızlı destek aldım. Dashboard\'da her şey net anlatılmış, webhook URL\'si bile hazır. Tavsiye ederim.',
    rating: 5,
    avatar: 'MD',
  },
]

export default function Testimonials() {
  const t = useTranslations('testimonials')
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="section-padding" ref={ref}>
      <div className="container-width">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted">{t('subtitle')}</p>
        </motion.div>

        {/* Testimonial Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {mockTestimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-primary/30 mb-4 group-hover:text-primary/60 transition-colors" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, si) => (
                  <Star key={si} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/80 leading-relaxed mb-6 text-sm">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-muted text-xs">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
