import Link from 'next/link'
import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'For Buyers — Find Energy Vendors Fast | EnergyDirectory.ca',
  description: 'Browse Canada\'s largest energy vendor directory. Shortlist the best fits. Send one inquiry to multiple vendors at once — free, no account required.',
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
  { name: 'Drilling & Completions', slug: 'drilling-completions', icon: '🛢️' },
  { name: 'Engineering & Consulting', slug: 'engineering-consulting', icon: '⚙️' },
  { name: 'Environmental Services', slug: 'environmental-services', icon: '🌿' },
  { name: 'Equipment & Rentals', slug: 'equipment-rentals', icon: '🏗️' },
  { name: 'Pipeline Services', slug: 'pipeline-services', icon: '🔧' },
  { name: 'Field Services', slug: 'field-services', icon: '🦺' },
  { name: 'Logistics & Transportation', slug: 'logistics-transportation', icon: '🚛' },
  { name: 'Health & Safety', slug: 'health-safety', icon: '🔒' },
]

export default async function ForBuyersPage() {
  const categoryCount = await getCategoryCount()
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#0a1628] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span>🇨🇦</span>
            Canadian Energy Procurement Made Simple
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Find the Right Energy Vendor —{' '}
            <span className="text-amber-400">Fast</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
            Browse Canada&apos;s largest energy vendor directory. Shortlist the best fits.
            Send one inquiry to multiple vendors at once.
          </p>
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-bold text-lg px-8 py-4 rounded-xl transition-colors"
          >
            Start Browsing Vendors →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#0a1628] mb-3">How It Works</h2>
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
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-amber-200 to-transparent -z-0 last:hidden" />

                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 relative z-10 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0a1628] mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why buyers use us */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0a1628] mb-4">
                Why buyers use EnergyDirectory.ca
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We built the procurement tool that energy buyers actually need — fast, frictionless, and free.
              </p>
              <ul className="space-y-4">
                {[
                  'Free to use — no account required',
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
              <div className="bg-[#0a1628] rounded-xl p-4 mb-4 text-white">
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
                    <span className="text-xs text-gray-400">Describe the service or project…</span>
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
                <div className="h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <span className="text-[#0a1628] text-xs font-bold">Send Request to 3 Vendors</span>
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
            <h2 className="text-3xl font-bold text-[#0a1628] mb-3">Browse by Category</h2>
            <p className="text-gray-600">Find vendors across all energy sectors</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-xl p-5 text-center transition-all"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-amber-800 leading-tight">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/vendors"
              className="text-amber-600 hover:text-amber-500 font-medium text-sm"
            >
              View all {categoryCount} categories →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#0a1628] text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your next vendor?</h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Join hundreds of Canadian energy buyers who use EnergyDirectory.ca to source vendors faster.
          </p>
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-bold text-lg px-8 py-4 rounded-xl transition-colors"
          >
            Browse Vendors →
          </Link>
          <p className="text-gray-500 text-sm mt-4">Free to use · No account required</p>
        </div>
      </section>
    </div>
  )
}
