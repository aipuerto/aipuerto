/**
 * Supabase Migration Runner
 * Kullanım: node supabase/run-migration.mjs
 *
 * Supabase Management API ile SQL migration çalıştırır.
 * Bunun için sb_secret_... key'i yeterli değil;
 * Supabase Dashboard'dan Personal Access Token (PAT) gerekir.
 *
 * PAT için: https://supabase.com/dashboard/account/tokens
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// .env.local'dan değerleri oku
const envContent = readFileSync(join(__dirname, '../.env.local'), 'utf8')
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()]
    })
)

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
const PROJECT_REF = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')

// Management API için PAT (ortam değişkeninden veya komut satırı argümanından)
const PAT = process.env.SUPABASE_PAT || process.argv[2]

const SQL = readFileSync(join(__dirname, 'migrations/001_initial_schema.sql'), 'utf8')

async function runMigration() {
  console.log(`\n📦 Proje: ${PROJECT_REF}`)
  console.log(`📄 Migration: 001_initial_schema.sql\n`)

  if (!PAT) {
    console.log('⚠️  Supabase Personal Access Token bulunamadı.')
    console.log('   SQL\'i manuel çalıştırmak için:')
    console.log(`   1. https://supabase.com/dashboard/project/${PROJECT_REF}/editor adresine gidin`)
    console.log('   2. supabase/migrations/001_initial_schema.sql içeriğini kopyalayın')
    console.log('   3. SQL Editor\'e yapıştırın ve "Run" butonuna tıklayın\n')
    process.exit(1)
  }

  try {
    const res = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PAT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: SQL }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      console.error('❌ Migration başarısız:', JSON.stringify(data, null, 2))
      process.exit(1)
    }

    console.log('✅ Migration başarıyla çalıştırıldı!')
    console.log('   Oluşturulan tablolar: profiles, services, packages, purchases, service_configs, references, testimonials, contact_messages')
  } catch (err) {
    console.error('❌ Hata:', err.message)
    process.exit(1)
  }
}

runMigration()
