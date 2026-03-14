-- energydirectory.ca — Database Schema
-- Saini Private Capital Ltd.
-- Created: 2026-03-12

-- ── Extensions ──
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for fast text search

-- ── Vendors ──
create table if not exists vendors (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),

  -- Company info
  company_name  text not null,
  slug          text unique not null, -- URL-friendly name
  description   text,
  website       text,
  email         text,
  phone         text,
  logo_url      text,

  -- Location
  province      text,           -- AB, BC, SK, MB, etc.
  city          text,
  address       text,

  -- Listing tier
  tier          text not null default 'free' check (tier in ('free', 'featured', 'premium')),
  verified      boolean default false,
  active        boolean default true,

  -- Stripe subscription
  stripe_customer_id      text,
  stripe_subscription_id  text,
  subscription_status     text default 'inactive',
  subscription_expires_at timestamptz,

  -- Auth
  user_id       uuid references auth.users(id) on delete set null,

  -- Meta
  views         integer default 0,
  featured_until timestamptz
);

-- ── Categories ──
create table if not exists categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  slug        text not null unique,
  description text,
  icon        text,
  sort_order  integer default 0
);

-- ── Vendor ↔ Categories (many-to-many) ──
create table if not exists vendor_categories (
  vendor_id   uuid references vendors(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (vendor_id, category_id)
);

-- ── Reviews ──
create table if not exists reviews (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz default now(),
  vendor_id   uuid references vendors(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete set null,
  rating      integer check (rating >= 1 and rating <= 5),
  comment     text,
  approved    boolean default false
);

-- ── Contact/Lead Submissions ──
create table if not exists leads (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz default now(),
  vendor_id   uuid references vendors(id) on delete cascade,
  name        text not null,
  email       text not null,
  company     text,
  message     text,
  notified    boolean default false
);

-- ── Stripe Webhook Events (audit log) ──
create table if not exists stripe_events (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz default now(),
  stripe_event_id   text unique,
  event_type  text,
  vendor_id   uuid references vendors(id) on delete set null,
  payload     jsonb,
  processed   boolean default false
);

-- ── Seed Categories (Canadian energy sector) ──
insert into categories (name, slug, description, sort_order) values
  ('Drilling & Completions',    'drilling-completions',    'Drilling contractors, completion services', 1),
  ('Engineering & Consulting',  'engineering-consulting',  'Engineering firms, consultants, technical services', 2),
  ('Equipment & Rentals',       'equipment-rentals',       'Equipment suppliers and rental companies', 3),
  ('Environmental Services',    'environmental-services',  'Environmental consulting, remediation, compliance', 4),
  ('Field Services',            'field-services',          'Oilfield services, maintenance, operations', 5),
  ('Health & Safety',           'health-safety',           'HSE consulting, training, compliance', 6),
  ('IT & Software',             'it-software',             'Energy software, data management, automation', 7),
  ('Land & Legal',              'land-legal',              'Land agents, legal services, regulatory', 8),
  ('Logistics & Transportation','logistics-transportation','Trucking, fluid hauling, camp logistics', 9),
  ('Manufacturing & Fabrication','manufacturing-fabrication','Steel fabrication, manufacturing, equipment builds', 10),
  ('Pipeline Services',         'pipeline-services',       'Pipeline construction, inspection, integrity', 11),
  ('Production Services',       'production-services',     'Production optimization, artificial lift, well services', 12),
  ('Staffing & Recruitment',    'staffing-recruitment',    'Energy sector staffing and recruitment', 13),
  ('Surveying & Mapping',       'surveying-mapping',       'Land surveying, geomatics, GIS', 14),
  ('Water & Waste Management',  'water-waste',             'Water sourcing, disposal, environmental waste', 15)
on conflict (slug) do nothing;

-- ── Indexes for performance ──
create index if not exists vendors_tier_idx       on vendors(tier);
create index if not exists vendors_province_idx   on vendors(province);
create index if not exists vendors_active_idx     on vendors(active);
create index if not exists vendors_search_idx     on vendors using gin(to_tsvector('english', coalesce(company_name,'') || ' ' || coalesce(description,'')));
create index if not exists vendor_categories_vid  on vendor_categories(vendor_id);
create index if not exists vendor_categories_cid  on vendor_categories(category_id);

-- ── RLS Policies ──

-- Vendors: anyone can read active listings
alter table vendors enable row level security;
create policy "Public can view active vendors"
  on vendors for select using (active = true);
create policy "Vendors can update own listing"
  on vendors for update using (auth.uid() = user_id);
create policy "Vendors can insert own listing"
  on vendors for insert with check (auth.uid() = user_id);

-- Categories: public read
alter table categories enable row level security;
create policy "Public can view categories"
  on categories for select using (true);

-- Reviews: approved reviews are public
alter table reviews enable row level security;
create policy "Public can view approved reviews"
  on reviews for select using (approved = true);
create policy "Users can submit reviews"
  on reviews for insert with check (auth.uid() = user_id);

-- Leads: vendors can see their own leads
alter table leads enable row level security;
create policy "Vendors can view own leads"
  on leads for select using (
    vendor_id in (select id from vendors where user_id = auth.uid())
  );
create policy "Anyone can submit leads"
  on leads for insert with check (true);

-- ── Updated_at trigger ──
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger vendors_updated_at
  before update on vendors
  for each row execute function update_updated_at();

-- ── RFQ Requests ──
-- MANUAL STEP: Run this in the Supabase Dashboard SQL Editor
CREATE TABLE IF NOT EXISTS rfq_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_company TEXT,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  service_description TEXT NOT NULL,
  province TEXT,
  timeline TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rfq_vendor_id ON rfq_requests(vendor_id);
CREATE INDEX IF NOT EXISTS idx_rfq_status ON rfq_requests(status);

-- RLS for rfq_requests
ALTER TABLE rfq_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit RFQs"
  ON rfq_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Vendors can view own RFQ leads"
  ON rfq_requests FOR SELECT USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
  );
CREATE POLICY "Service role can manage RFQs"
  ON rfq_requests FOR ALL USING (true);
