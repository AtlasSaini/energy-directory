import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase'
import SearchBar from '@/components/SearchBar'
import CategoryGrid from '@/components/CategoryGrid'
import VendorCard from '@/components/VendorCard'
import type { Vendor, Category } from '@/types/database'

async function getHomeData() {
  const supabase = createAdminClient()
  const [categoriesRes, featuredVendorsRes, countRes, recentVendorsRes] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase
      .from('vendors')
      .select('*')
      .eq('active', true)
      .in('tier', ['featured', 'premium'])
      .limit(8),
    supabase
      .from('vendors')
      .select('id', { count: 'exact', head: true })
      .eq('active', true)
      .or('website.not.is.null,description.not.is.null'), // display-ready vendors only
    supabase
      .from('vendors')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const vendorCount = countRes.count || 365

  return {
    categories: (categoriesRes.data || []) as Category[],
    featuredVendors: (featuredVendorsRes.data || []) as Vendor[],
    recentVendors: (recentVendorsRes.data || []) as Vendor[],
    vendorCount,
  }
}

export const revalidate = 3600

export default async function HomePage() {
  const { categories, featuredVendors, recentVendors, vendorCount } = await getHomeData()

  const stats = [
    { label: 'Vendors Listed', value: `${vendorCount}` },
    { label: 'Categories', value: `${categories.length}` },
    { label: 'Provinces Covered', value: '13' },
    { label: 'Listed & Searchable', value: 'Free' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#0a1628] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            Canada&apos;s Largest Energy<br />
            <span className="text-amber-400">&amp; Mining Directory</span>
          </h1>
          <p className="text-base text-amber-300/80 font-medium mb-3 tracking-wide">
            Oil &amp; Gas · Renewables · Mining · Carbon &amp; ESG · Power Generation
          </p>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            The most comprehensive directory of Canadian energy and mining vendors. Verified suppliers across every sector — nationwide coverage.
          </p>
          <SearchBar
            placeholder="Search vendors, services, categories..."
            className="max-w-2xl mx-auto"
          />
          <p className="text-gray-400 text-sm mt-4">
            Try: &quot;Pipeline services Alberta&quot;, &quot;Solar installers BC&quot;, &quot;Oilfield equipment&quot;
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#0d1f3c] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-extrabold text-amber-400">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#0a1628]">Browse by Category</h2>
              <p className="text-gray-500 text-sm mt-1">Find vendors in your specific energy sector</p>
            </div>
          </div>
          {categories.length > 0 ? (
            <CategoryGrid categories={categories} grouped={true} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {['Oil & Gas', 'Renewables', 'Pipeline', 'Engineering', 'Solar', 'Wind Energy', 'Natural Gas', 'Electrical', 'Drilling', 'Environmental', 'Power Generation', 'Transmission', 'Oilfield Services', 'Geothermal', 'Energy Storage'].map((name) => (
                <div key={name} className="bg-white border border-gray-200 rounded-xl p-4 text-center h-[100px] flex flex-col items-center justify-center gap-2">
                  <span className="text-3xl">⚡</span>
                  <span className="text-sm font-medium text-gray-700">{name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Vendors or Recently Added */}
      {featuredVendors.length > 0 ? (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#0a1628]">Featured Vendors</h2>
                <p className="text-gray-500 text-sm mt-1">Verified, premium energy suppliers</p>
              </div>
              <Link href="/vendors?tier=featured" className="text-amber-600 hover:text-amber-500 font-medium text-sm">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </div>
        </section>
      ) : recentVendors.length > 0 ? (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#0a1628]">Recently Added Vendors</h2>
                <p className="text-gray-500 text-sm mt-1">Newly listed energy suppliers</p>
              </div>
              <Link href="/vendors" className="text-amber-600 hover:text-amber-500 font-medium text-sm">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#0a1628] to-[#1a3a6b]">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">
            Grow Your Energy Business
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join Canada&apos;s premier energy vendor directory. Get discovered by buyers, operators, and project managers across the country.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/list-your-business"
              className="bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              List Your Business — Free
            </Link>
            <Link
              href="/vendors"
              className="border border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Browse Directory
            </Link>
          </div>
          <p className="text-gray-400 text-sm mt-4">No credit card required for free listing</p>
        </div>
      </section>
    </div>
  )
}
