export async function sendWhatsApp(phone: string, message: string): Promise<void> {
  const apiKey = process.env.CALLMEBOT_API_KEY
  if (!apiKey || apiKey === 'placeholder') {
    console.warn('CallMeBot API key not configured — skipping WhatsApp notification')
    return
  }

  const encoded = encodeURIComponent(message)
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apiKey}`

  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`CallMeBot error [${res.status}]: ${body}`)
  }
}

export async function notifyAdmin(message: string): Promise<void> {
  const adminPhone = process.env.ADMIN_PHONE
  if (!adminPhone) {
    console.warn('ADMIN_PHONE not configured — skipping WhatsApp notification')
    return
  }
  return sendWhatsApp(adminPhone, message)
}
