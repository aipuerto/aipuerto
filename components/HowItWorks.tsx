'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { UserPlus, CreditCard, Rocket } from 'lucide-react'

export default function HowItWorks() {
  const t = useTranslations('how_it_works')
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const icons = [UserPlus, CreditCard, Rocket]
  const colors = ['text-primary', 'text-secondary', 'text-accent']
  const bgColors = ['bg-primary/10', 'bg-secondary/10', 'bg-accent/10']
  const borderColors = ['border-primary/30', 'border-secondary/30', 'border-accent/30']

  const steps = (t.raw('steps') as Array<{ title: string; description: string }>)

  return (
    <section className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />

      <div className="container-width relative z-10">
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
          <p className="text-lg text-muted max-w-2xl mx-auto">{t('subtitle')}</p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-30" />

          {steps.map((step, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center"
              >
                {/* Step number indicator */}
                <div className="flex justify-center mb-6">
                  <div className={`relative w-16 h-16 ${bgColors[i]} rounded-2xl flex items-center justify-center border ${borderColors[i]} group hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${colors[i]}`} />
                    <div className="absolute -top-3 -right-3 w-7 h-7 bg-background border border-border rounded-full flex items-center justify-center text-xs font-bold font-mono text-foreground">
                      {i + 1}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold mb-3">{step.title}</h3>
                <p className="text-muted leading-relaxed">{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
