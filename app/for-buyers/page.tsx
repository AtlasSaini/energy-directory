mport Link from 'next/link'
import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'For Buyers - Find Energy Vendors Fast | EnergyDirectory.ca',
  description: 'Browse Canada\'s largest energy vendor directory. Shortlist the best fits. Send one inquiry to multiple vendors at once - free, no account required.',
}

async function getCategoryCount(): Promise<number> {
  try {
    const supabase = createAdminClient()
    const { count } = await supabase.from('categories').select('*', { count: 'exact', head: true })
    return count ?? 35
  } catch {
    return 35
  }
}

const CATEGORIES = [
  { name: 'Drilling & Completions', slug: 'drilling-completions' },
  { name: 'Engineering & Consulting', slug: 'engineering-consulting' },
  { name: 'Environmental Services', slug: 'environmental-services' },
  { name: 'Equipment & Rentals', slug: 'equipment-rentals' },
  { name: 'Pipeline Services', slug: 'pipeline-services' },
  { name: 'Field Services', slug: 'field-services' },
  { name: 'Logistics & Transportation', slug: 'logistics-transportation' },
  { name: 'Health & Safety', slug: 'health-safety' },
]

function CategoryIcon({ slug }: { slug: string }) {
  const svgProps = {
    viewBox: '0 0 24 24',
    width: 28,
    height: 28,
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (slug) {
    case 'drilling-completions':
      return (
        <svg {...svgProps}>
          <polyline points="12,3 5,21 19,21 12,3"/>
          <line x1="8" y1="14" x2="16" y2="14"/>
          <line x1="11" y1="21" x2="11" y2="18"/>
          <line x1="13" y1="21" x2="13" y2="18"/>
        </svg>
      )
    case 'engineering-consulting':
      return (
        <svg {...svgProps}>
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="9" y1="3" x2="9" y2="21"/>
        </svg>
      )
    case 'environmental-services':
      return (
        <svg {...svgProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      )
    case 'equipment-rentals':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
        </svg>
      )
    case 'pipeline-services':
      return (
        <svg {...svgProps}>
          <path d="M3 12h18"/>
          <circle cx="7" cy="12" r="3"/>
          <circle cx="17" cy="12" r="3"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      )
    case 'field-services':
      return (
        <svg {...svgProps}>
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
        </svg>
      )
    case 'logistics-transportation':
      return (
        <svg {...svgProps}>
          <rect x="1" y="9" width="14" height="8" rx="1"/>
          <path d="M15 13h4l3 3v2h-7z"/>
          <circle cx="5" cy="18" r="1.5"/>
          <circle cx="18" cy="18" r="1.5"/>
        </svg>
      )
    case 'health-safety':
      return (
        <svg {...svgProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polyline points="9,12 11,14 15,10"/>
        </svg>
      )
    default:
      return null
  }
}

export default async function ForBuyersPage() {
  const categoryCount = await getCategoryCount()
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#1D1D1F] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#E8590C]/20 border border-[#E8590C]/30 text-[#E8590C] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span>🇨🇦</span>
            Canadian Energy Procurement Made Simple
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Find the Right Energy Vendor —{' '}
            <span className="text-[#E8590C]">Fast</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
            Browse Canada&apos;s largest energy vendor directory. Shortlist the best fits.
            Send one inquiry to multiple vendors at once.
          </p>
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 bg-[#E8590C] hover:bg-[#CC4A08] text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors"
          >
            Start Browsing Vendors →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#1D1D1F] mb-3">How It Works</h2>
            <p className="text-gray-600 text-lg">Three steps to your next energy vendor</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '🔍',
                title: 'Search & Filter',
                desc: 'Browse 300+ verified Canadian energy vendors by category, service type, and province. Use filters to narrow down exactly what you need.',
              },
              {
                step: '02',
                icon: '📋',
                title: 'Build Your Shortlist',
                desc: 'Add the best candidates to your shortlist with one click. Compare up to 10 vendors side by side. No account required.',
              },
              {
                step: '03',
                icon: '📨',
                title: 'Send One Inquiry to All',
                desc: 'Fill out one form. All shortlisted vendors receive it simultaneously. No phone tag, no email chains. Just results.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                {/* Step connector line (hidden on mobile) */}
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-[#E8590C]/20 to-transparent -z-0 last:hidden" />

                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 relative z-10 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-xs font-bold text-[#E8590C] bg-[#FFF5F0] border border-[#E8590C]/30 px-2 py-1 rounded-full">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why buyers use us */}
      <section className="py-20 px-4 bg-[#F5F5F7]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1D1D1F] mb-4">
                Why buyers use EnergyDirectory.ca
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We built the procurement tool that energy buyers actually need - fast, frictionless, and free.
              </p>
              <ul className="space-y-4">
                {[
                  'Free to use - no account required',
                  'Verified Canadian vendors only',
                  `${categoryCount} energy categories covered`,
                  'Oil & Gas, Renewables, Carbon & ESG, Power Generation',
                  'Send inquiries to multiple vendors in one step',
                  'Vendors respond directly to your email',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual mockup */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="bg-[#1D1D1F] rounded-xl p-4 mb-4 text-white">
                <div className="text-xs text-gray-400 mb-1">Sending to 3 vendors</div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {['Apex Drilling', 'ProPipe Inc.', 'EnviroTech AB'].map((v) => (
                    <span key={v} className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full border border-white/20">{v}</span>
                  ))}
                </div>
                <div className="text-sm font-semibold">Send an Inquiry</div>
              </div>
              <div className="space-y-2">
                {[{ label: 'Your Name', ph: 'Jane Smith' }, { label: 'Email Address', ph: 'jane@company.com' }].map(f => (
                  <div key={f.label}>
                    <div className="text-xs text-gray-500 mb-1 font-medium">{f.label}</div>
                    <div className="h-8 bg-gray-100 rounded-lg flex items-center px-3">
                      <span className="text-xs text-gray-400">{f.ph}</span>
                    </div>
                  </div>
                ))}
                <div>
                  <div className="text-xs text-gray-500 mb-1 font-medium">What do you need?</div>
                  <div className="h-16 bg-gray-100 rounded-lg flex items-start px-3 pt-2">
                    <span className="text-xs text-gray-400">Describe the service or project.</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[{ label: 'Province', ph: 'Alberta' }, { label: 'Timeline', ph: 'Q2 2026' }].map(f => (
                    <div key={f.label}>
                      <div className="text-xs text-gray-500 mb-1 font-medium">{f.label}</div>
                      <div className="h-8 bg-gray-100 rounded-lg flex items-center px-3">
                        <span className="text-xs text-gray-400">{f.ph}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-10 bg-[#E8590C] rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Send Request to 3 Vendors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1D1D1F] mb-3">Browse by Category</h2>
            <p className="text-gray-600">Find vendors across all energy sectors</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group bg-[#F5F5F7] hover:bg-[#FFF5F0] border border-gray-200 hover:border-[#E8590C]/30 rounded-xl p-5 text-center transition-all"
              >
                <div className="flex justify-center mb-2">
                  <span className="text-[#6E6E73]">
                    <CategoryIcon slug={cat.slug} />
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-[#E8590C] leading-tight">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/vendors"
              className="text-[#E8590C] hover:text-[#CC4A08] font-medium text-sm"
            >
              View all {categoryCount} categories →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#1D1D1F] text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your next vendor?</h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Join hundreds of Canadian energy buyers who use EnergyDirectory.ca to source vendors faster.
          </p>
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 bg-[#E8590C] hover:bg-[#CC4A08] text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors"
          >
            Browse Vendors →
          </Link>
          <p className="text-gray-500 text-sm mt-4">Free to use · No account required</p>
        </div>
      </section>
    </div>
  )
}
