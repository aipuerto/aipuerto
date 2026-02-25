-- ================================================================
-- aipuerto.com — Veritabanı Şeması
-- Supabase Dashboard → SQL Editor'e yapıştırın ve çalıştırın
-- ================================================================

-- ── 1. PROFILES ─────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  full_name     text,
  company       text,
  phone         text,
  whatsapp      text,
  created_at    timestamptz default now()
);

-- Profile otomatik oluşturma trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, company)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── 2. SERVICES ─────────────────────────────────────────────────
create table if not exists public.services (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name            text not null,
  name_en         text,
  description     text,
  description_en  text,
  price           numeric(10,2) not null,
  stripe_price_id text,
  active          boolean default true,
  created_at      timestamptz default now()
);

-- Başlangıç hizmet kayıtları
insert into public.services (slug, name, name_en, description, description_en, price)
values
  (
    'kartvizit-ajan',
    'Kartvizit AI Ajanı',
    'Business Card AI Agent',
    'Telegram üzerinden kartvizit fotoğrafı gönderin. AI okusun, Google Contacts ve Airtable''a kaydetsin.',
    'Send a business card photo via Telegram. AI reads it and saves to Google Contacts and Airtable.',
    49.00
  ),
  (
    'drive-ocr',
    'Drive OCR Otomasyonu',
    'Drive OCR Automation',
    'Google Drive klasörünüze dosya atın. OCR ile okunur, Google Sheets''e kaydedilir.',
    'Drop files in your Google Drive folder. OCR reads them and saves to Google Sheets.',
    39.00
  )
on conflict (slug) do nothing;

-- ── 3. PACKAGES ─────────────────────────────────────────────────
create table if not exists public.packages (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name_tr         text not null,
  name_en         text not null,
  description_tr  text,
  description_en  text,
  price           numeric(10,2) not null,
  stripe_price_id text,
  is_popular      boolean default false,
  active          boolean default true,
  created_at      timestamptz default now()
);

insert into public.packages (slug, name_tr, name_en, description_tr, description_en, price, is_popular)
values
  ('starter', 'Starter', 'Starter', 'Tek bir otomasyon ile başlayın', 'Start with one automation', 39.00, false),
  ('pro',     'Pro',     'Pro',     'Tüm otomasyonlara erişin',       'Access all automations',   79.00, true),
  ('business','Business','Business','Tüm özellikler + öncelikli destek','All features + priority support', 129.00, false)
on conflict (slug) do nothing;

-- ── 4. PACKAGE_SERVICES ─────────────────────────────────────────
create table if not exists public.package_services (
  package_id  uuid references public.packages(id) on delete cascade,
  service_id  uuid references public.services(id) on delete cascade,
  primary key (package_id, service_id)
);

-- Paket → Hizmet ilişkileri (pro ve business tüm hizmetleri içerir)
insert into public.package_services (package_id, service_id)
select p.id, s.id
from public.packages p, public.services s
where p.slug in ('pro', 'business')
on conflict do nothing;

-- Starter sadece 1 hizmet (kartvizit)
insert into public.package_services (package_id, service_id)
select p.id, s.id
from public.packages p, public.services s
where p.slug = 'starter' and s.slug = 'kartvizit-ajan'
on conflict do nothing;

-- ── 5. PURCHASES ────────────────────────────────────────────────
create table if not exists public.purchases (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references public.profiles(id) on delete cascade,
  service_id        uuid references public.services(id),
  package_id        uuid references public.packages(id),
  stripe_session_id text unique,
  stripe_payment_id text,
  status            text default 'pending' check (status in ('pending','paid','refunded')),
  paid_at           timestamptz,
  created_at        timestamptz default now()
);

-- ── 6. SERVICE_CONFIGS ──────────────────────────────────────────
create table if not exists public.service_configs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.profiles(id) on delete cascade,
  purchase_id     uuid references public.purchases(id) on delete cascade,
  service_id      uuid references public.services(id),
  config_data     jsonb not null default '{}',
  n8n_workflow_id text,
  n8n_webhook_url text,
  is_active       boolean default false,
  setup_completed boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- updated_at otomatik güncelle
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_service_configs_updated_at on public.service_configs;
create trigger set_service_configs_updated_at
  before update on public.service_configs
  for each row execute function public.set_updated_at();

-- ── 7. REFERENCES ───────────────────────────────────────────────
create table if not exists public.references (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_url    text,
  website     text,
  sort_order  int default 0,
  active      boolean default true
);

-- ── 8. TESTIMONIALS ─────────────────────────────────────────────
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  user_name   text not null,
  company     text,
  content     text not null,
  content_en  text,
  rating      int check (rating between 1 and 5),
  avatar_url  text,
  approved    boolean default false,
  created_at  timestamptz default now()
);

-- ── 9. CONTACT_MESSAGES ─────────────────────────────────────────
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  replied     boolean default false,
  created_at  timestamptz default now()
);

-- ── 10. ROW LEVEL SECURITY ──────────────────────────────────────

-- profiles
alter table public.profiles enable row level security;
drop policy if exists "Kendi profili" on public.profiles;
create policy "Kendi profili" on public.profiles
  for all using (auth.uid() = id);

-- purchases
alter table public.purchases enable row level security;
drop policy if exists "Kendi satın alımları" on public.purchases;
create policy "Kendi satın alımları" on public.purchases
  for all using (auth.uid() = user_id);

-- service_configs
alter table public.service_configs enable row level security;
drop policy if exists "Kendi konfigürasyonu" on public.service_configs;
create policy "Kendi konfigürasyonu" on public.service_configs
  for all using (auth.uid() = user_id);

-- services (herkese okuma)
alter table public.services enable row level security;
drop policy if exists "Herkese okuma" on public.services;
create policy "Herkese okuma" on public.services
  for select using (active = true);

-- packages (herkese okuma)
alter table public.packages enable row level security;
drop policy if exists "Herkese okuma" on public.packages;
create policy "Herkese okuma" on public.packages
  for select using (active = true);

-- package_services (herkese okuma)
alter table public.package_services enable row level security;
drop policy if exists "Herkese okuma" on public.package_services;
create policy "Herkese okuma" on public.package_services
  for select using (true);

-- references (herkese okuma)
alter table public.references enable row level security;
drop policy if exists "Herkese okuma" on public.references;
create policy "Herkese okuma" on public.references
  for select using (active = true);

-- testimonials (sadece onaylananlar herkese)
alter table public.testimonials enable row level security;
drop policy if exists "Onaylı testimonials" on public.testimonials;
create policy "Onaylı testimonials" on public.testimonials
  for select using (approved = true);

-- contact_messages (insert herkese, okuma yok)
alter table public.contact_messages enable row level security;
drop policy if exists "Mesaj gönder" on public.contact_messages;
create policy "Mesaj gönder" on public.contact_messages
  for insert with check (true);

-- ── 11. SERVICE ROLE İÇİN BYPASS ───────────────────────────────
-- contact_messages'ı service role ile okuyabilmek için
drop policy if exists "Service role tam erişim" on public.contact_messages;
create policy "Service role tam erişim" on public.contact_messages
  for all using (auth.jwt()->>'role' = 'service_role');

-- ── TAMAMLANDI ──────────────────────────────────────────────────
-- Tabloları kontrol edin:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
