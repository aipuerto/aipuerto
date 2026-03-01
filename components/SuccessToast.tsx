'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, X } from 'lucide-react'

export default function SuccessToast({ show }: { show: boolean }) {
  const router = useRouter()
  const [visible, setVisible] = useState(show)

  useEffect(() => {
    if (!show) return
    // URL'den ?success=true parametresini temizle
    router.replace('/dashboard', { scroll: false })
    const timer = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [show, router])

  if (!visible) return null

  return (
    <div className="fixed top-6 right-6 z-50 flex items-start gap-3 glass-card border border-green-500/30 bg-green-500/10 p-4 rounded-xl shadow-xl max-w-sm animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="w-9 h-9 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
        <CheckCircle className="w-5 h-5 text-green-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-green-300">Ödeme Başarılı!</p>
        <p className="text-xs text-muted mt-0.5">
          Hizmetiniz aktive edildi. Kurulum için aşağıdaki adımları takip edin.
        </p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="text-muted hover:text-foreground transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
