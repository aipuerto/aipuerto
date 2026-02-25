'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false)

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905000000000'
  const message = encodeURIComponent(
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
      'Merhaba, aipuerto.com hakkında bilgi almak istiyorum.'
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      {showTooltip && (
        <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-xl max-w-[200px] text-sm text-right animate-fade-in">
          <p className="text-foreground font-medium">Yardıma ihtiyacınız mı var?</p>
          <p className="text-muted text-xs mt-1">Hemen yazın, yanıt verelim!</p>
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-muted hover:text-foreground"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-green-500/30 hover:scale-110 transition-all duration-300 group"
        aria-label="WhatsApp ile iletişime geç"
      >
        <MessageCircle className="w-7 h-7 text-white fill-white group-hover:scale-110 transition-transform" />
      </a>
    </div>
  )
}
