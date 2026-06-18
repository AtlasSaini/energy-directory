import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase'
import SearchBar from '@/components/SearchBar'
import CategoryGrid from '@/components/CategoryGrid'
import VendorLogo from '@/components/VendorLogo'
import type { Vendor, Category } from '@/types/database'

async function getHomeData() {
  const supabase = createAdminClient()
  const [categoriesRes, featuredVendorsRes, countRes] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase
      .from('vendors')
      .select('*')
      .eq('active', true)
      .in('tier', ['featured', 'premium'])
      .limit(12),
    supabase
      .from('vendors')
      .select('id', { count: 'exact', head: true })
      .eq('active', true)
      .or('website.not.is.null,description.not.is.null'),
  ])

  const vendorCount = countRes.count || 365

  return {
    categories: (categoriesRes.data || []) as Category[],
    featuredVendors: (featuredVendorsRes.data || []) as Vendor[],
    vendorCount,
  }
}

export const revalidate = 3600


export const metadata = {
  title: 'Canadian Energy Directory | Find Verified Energy & Mining Vendors',
  description: 'Canada\'s largest energy sector vendor directory. Find verified oil & gas, mining, pipeline, renewables, and engineering suppliers across Alberta, BC, Saskatchewan and beyond.',
  keywords: 'Canadian energy directory, energy directory Canada, oil gas vendors Canada, energy suppliers Alberta, mining vendors Canada, pipeline companies Canada, energy directory',
  openGraph: {
    title: 'Canadian Energy Directory | Find Verified Energy & Mining Vendors',
    description: 'Canada\'s largest energy sector vendor directory. Find verified oil & gas, mining, pipeline, renewables, and engineering suppliers.',
    url: 'https://energydirectory.ca',
    siteName: 'Canadian Energy Directory',
    images: [{ url: 'https://energydirectory.ca/og-image.png', width: 1200, height: 630, alt: 'Canadian Energy Directory' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canadian Energy Directory | Find Verified Energy & Mining Vendors',
    description: 'Canada\'s largest energy sector vendor directory.',
    images: ['https://energydirectory.ca/og-image.png'],
  },
  alternates: {
    canonical: 'https://energydirectory.ca',
  },
}
export default async function HomePage() {
  const { categories, featuredVendors, vendorCount } = await getHomeData()

  const stats = [
    { label: 'Vendors Listed', value: `${vendorCount.toLocaleString()}+` },
    { label: 'Categories', value: `${categories.length}` },
    { label: 'Provinces Covered', value: '13' },
    { label: 'Free to Search', value: '100%' },
  ]

  // Duplicate for seamless infinite scroll loop
  const scrollVendors = [...featuredVendors, ...featuredVendors]

  return (
    <>
      <style>{`
        @keyframes scrollVendors {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .vendor-scroll-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: scrollVendors 45s linear infinite;
        }
        .vendor-scroll-track:hover { animation-play-state: paused; }
        .vendor-scroll-wrap {
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
      `}</style>

      {/* ── Hero ── */}
      <section
        style={{ background: 'linear-gradient(180deg, #ffffff 0%, #F5F5F7 100%)' }}
        className="pt-24 pb-20 px-4 text-center"
      >
        <div className="max-w-4xl mx-auto">
          {/* Eyebrow */}
          <p className="text-xs font-semibold tracking-widest uppercase text-[#E8590C] mb-5 flex items-center justify-center gap-3">
            <span className="inline-block w-5 h-px bg-[#E8590C] opacity-40" />
            Canada&apos;s Premier Energy Platform
            <span className="inline-block w-5 h-px bg-[#E8590C] opacity-40" />
          </p>

          {/* Headline */}
          <h1
            style={{ letterSpacing: '-0.03em', lineHeight: '1.05' }}
            className="text-5xl sm:text-6xl lg:text-[68px] font-light text-[#1D1D1F] mb-5"
          >
            Canada&apos;s <strong className="font-extrabold">Largest</strong>
            <br />
            Energy &amp; Mining{' '}
            <em style={{ fontStyle: 'normal', color: '#E8590C', fontWeight: 800 }}>Directory.</em>
          </h1>

          {/* Sub */}
          <p className="text-lg font-light text-[#6E6E73] max-w-xl mx-auto mb-10 leading-relaxed">
            Find verified vendors, suppliers, and service providers across Canada&apos;s energy and mining sectors.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-4">
            <SearchBar placeholder="Search vendors, categories, or services…" />
          </div>

          {/* Meta */}
          <p className="text-sm font-light text-[#6E6E73]">
            <strong className="font-semibold text-[#1D1D1F]">{vendorCount.toLocaleString()}+</strong> verified vendors &nbsp;·&nbsp; Updated daily
          </p>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-[#1D1D1F] py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <span
                style={{ letterSpacing: '-0.02em' }}
                className="block text-4xl font-extrabold text-white mb-1"
              >
                {s.value}
              </span>
              <span className="text-xs font-light text-white/50 uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Scrolling Featured Vendor Strip ── */}
      {scrollVendors.length > 0 && (
        <section className="py-16 bg-[#F5F5F7]">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#E8590C] text-center mb-6">
            Featured Vendors
          </p>
          <div className="vendor-scroll-wrap">
            <div className="vendor-scroll-track">
              {scrollVendors.map((vendor, i) => (
                <Link key={`${vendor.id}-${i}`} href={`/vendors/${vendor.slug}`}>
                  <div className="bg-white rounded-2xl px-4 py-3.5 border border-[#D2D2D7] flex items-center gap-3 w-72 flex-shrink-0 hover:shadow-md transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] flex items-center justify-center overflow-hidden flex-shrink-0">
                      <VendorLogo logoUrl={vendor.logo_url} companyName={vendor.company_name} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#1D1D1F] truncate">{vendor.company_name}</p>
                      <p className="text-xs font-light text-[#6E6E73] truncate">
                        {[vendor.city, vendor.province].filter(Boolean).join(', ') || 'Canada'}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#0066CC] whitespace-nowrap flex-shrink-0">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Browse by Sector ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#E8590C] mb-2">Browse</p>
            <h2
              style={{ letterSpacing: '-0.02em' }}
              className="text-3xl font-bold text-[#1D1D1F] mb-2"
            >
              Find Your Sector
            </h2>
            <p className="text-base font-light text-[#6E6E73]">
              Explore vendors across every corner of Canada&apos;s energy and mining industry.
            </p>
          </div>
          <CategoryGrid categories={categories} grouped={true} />
          <div className="text-center mt-10">
            <Link href="/vendors" className="text-sm font-semibold text-[#0066CC] hover:underline">
              Browse all vendors →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature Callout — List Your Business ── */}
      <section className="bg-[#1D1D1F] py-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#E8590C] bg-[#E8590C]/10 px-3 py-1 rounded-full mb-4">
              For Vendors
            </span>
            <h2
              style={{ letterSpacing: '-0.02em', lineHeight: '1.15' }}
              className="text-3xl sm:text-4xl font-light text-white mb-4"
            >
              Get discovered by<br />
              <strong className="font-extrabold text-[#E8590C]">thousands of buyers.</strong>
            </h2>
            <p className="text-base font-light text-white/60 leading-relaxed mb-8">
              Energy operators, procurement teams, and project managers use EnergyDirectory.ca to find verified Canadian suppliers. List your business and start receiving inbound leads.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { n: '1', title: 'Create your listing', sub: 'Free basic listing — takes 2 minutes' },
                { n: '2', title: 'Get verified', sub: 'Build credibility with buyers' },
                { n: '3', title: 'Receive leads', sub: 'Buyers contact you directly' },
              ].map((step) => (
                <div key={step.n} className="flex items-start gap-4">
                  <div
                    style={{
                      background: 'rgba(232,89,12,0.20)',
                      border: '1px solid rgba(232,89,12,0.40)',
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-[#E8590C] flex-shrink-0 mt-0.5"
                  >
                    {step.n}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <p className="text-xs font-light text-white/50">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — vendor preview card */}
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
            className="rounded-2xl p-6 flex flex-col gap-3"
          >
            {featuredVendors.slice(0, 4).map((vendor) => (
              <div
                key={vendor.id}
                style={{ background: 'rgba(255,255,255,0.07)' }}
                className="rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-[#E8590C] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  ✓
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  <VendorLogo logoUrl={vendor.logo_url} companyName={vendor.company_name} />
                </div>
                <span className="text-sm font-medium text-white/90 flex-1 truncate">
                  {vendor.company_name}
                </span>
                <span className="text-xs text-white/40 capitalize">{vendor.tier}</span>
              </div>
            ))}
            <Link
              href="/list-your-business"
              className="mt-2 rounded-xl py-3 text-center text-sm font-bold text-white transition-colors block"
              style={{ background: '#E8590C' }}
            >
              List Your Business — Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Strip ── */}
      <section
        className="py-24 px-4 text-center"
        style={{
          background: '#1D1D1F',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <h2
          style={{ letterSpacing: '-0.02em' }}
          className="text-4xl sm:text-5xl font-light text-white mb-3"
        >
          Ready to{' '}
          <strong className="font-extrabold">find your vendor?</strong>
        </h2>
        <p className="text-lg font-light text-white/60 max-w-md mx-auto mb-10">
          Canada&apos;s most comprehensive energy and mining vendor database. Free to search.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/vendors"
            style={{ borderRadius: '980px' }}
            className="bg-white text-[#1D1D1F] font-bold text-sm px-8 py-3.5 hover:opacity-90 transition-opacity"
          >
            Browse Directory
          </Link>
          <Link
            href="/list-your-business"
            style={{ borderRadius: '980px', border: '1px solid rgba(255,255,255,0.22)' }}
            className="text-white/80 font-light text-sm px-8 py-3.5 hover:border-white/50 transition-colors"
          >
            List Your Business
          </Link>
        </div>
      </section>
    </>
  )
}
