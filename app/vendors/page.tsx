import { supabase } from '@/lib/supabase'
import VendorCard from '@/components/VendorCard'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'
import type { Vendor, Category } from '@/types/database'

const PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'ON', name: 'Ontario' },
  { code: 'QC', name: 'Quebec' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland' },
  { code: 'PE', name: 'PEI' },
  { code: 'YT', name: 'Yukon' },
  { code: 'NT', name: 'NWT' },
  { code: 'NU', name: 'Nunavut' },
]

interface SearchParams {
  q?: string
  province?: string
  category?: string
  tier?: string
  page?: string
  quality?: string
}

async function getVendors(params: SearchParams) {
  // Quality filter: when ?quality=full, only show vendors with website OR description
  const qualityCurated = params.quality === 'full'

  // If filtering by category, use a proper join via vendor_categories
  if (params.category) {
    // Get category ID from slug
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.category)
      .single()

    if (!catData) return [] as Vendor[]

    // Use join query — avoids URL-length limits of .in() with many IDs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from('vendor_categories')
      .select('vendors!inner(*)')
      .eq('category_id', catData.id)
      .eq('vendors.active', true)
      .order('vendors.tier', { ascending: false })
      .order('vendors.company_name')

    if (params.province) {
      query = query.eq('vendors.province', params.province)
    }
    if (params.tier && ['featured', 'premium'].includes(params.tier)) {
      query = query.eq('vendors.tier', params.tier)
    }
    if (params.q) {
      query = query.or(`company_name.ilike.%${params.q}%,description.ilike.%${params.q}%`, { foreignTable: 'vendors' })
    }
    if (qualityCurated) {
      query = query.or('website.not.is.null,description.not.is.null', { foreignTable: 'vendors' })
    }

    const { data } = await query.limit(48)
    if (!data) return [] as Vendor[]
    return data.map((row: { vendors: Vendor }) => row.vendors).filter(Boolean) as Vendor[]
  }

  let query = supabase
    .from('vendors')
    .select('*')
    .eq('active', true)
    .order('tier', { ascending: false })
    .order('company_name')

  if (params.province) {
    query = query.eq('province', params.province)
  }
  if (params.tier && ['featured', 'premium'].includes(params.tier)) {
    query = query.eq('tier', params.tier)
  }
  if (params.q) {
    query = query.or(`company_name.ilike.%${params.q}%,description.ilike.%${params.q}%`)
  }
  if (qualityCurated) {
    query = query.or('website.not.is.null,description.not.is.null')
  }

  const { data } = await query.limit(48)
  return (data || []) as Vendor[]
}

async function getCategories() {
  const { data } = await supabase.from('categories').select('*').order('name')
  return (data || []) as Category[]
}

export const revalidate = 30

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const [vendors, categories] = await Promise.all([
    getVendors(params),
    getCategories(),
  ])

  const activeFilters = [params.province, params.category, params.tier, params.q].filter(Boolean).length
  const isCuratedView = params.quality === 'full'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Claim banner — shown on full unfiltered list to drive vendor registrations */}
      {!isCuratedView && !params.q && !params.province && !params.category && !params.tier && (
        <div className="mb-5 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-5 py-3">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Is your business listed here?</span>{' '}
            Claim your listing to add your website, description, and contact info — it&apos;s free.
          </p>
          <Link
            href="/auth/claim"
            className="ml-4 shrink-0 text-sm font-semibold text-amber-700 hover:text-amber-600 underline underline-offset-2"
          >
            Claim it →
          </Link>
        </div>
      )}

      {/* Curated view banner */}
      {isCuratedView && (
        <div className="mb-5 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-5 py-3">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Curated view</span> — showing vendors with at least a website or description.
          </p>
          <Link href="/vendors" className="ml-4 shrink-0 text-sm font-medium text-blue-600 hover:text-blue-500">
            Show all →
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0a1628] mb-1">Energy Vendor Directory</h1>
        <p className="text-gray-500 text-sm">
          {vendors.length > 0 ? `${vendors.length} vendor${vendors.length !== 1 ? 's' : ''} found` : 'Browse Canadian energy vendors'}
          {params.q && ` for "${params.q}"`}
          {params.province && ` in ${PROVINCES.find(p => p.code === params.province)?.name || params.province}`}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar defaultValue={params.q || ''} placeholder="Search vendors..." />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#0a1628] text-sm">Filters</h2>
              {activeFilters > 0 && (
                <Link href="/vendors" className="text-xs text-amber-600 hover:text-amber-500">
                  Clear all ({activeFilters})
                </Link>
              )}
            </div>

            {/* Tier filter */}
            <div className="mb-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Listing Type</h3>
              <div className="space-y-1.5">
                {[
                  { value: '', label: 'All Vendors' },
                  { value: 'premium', label: '⭐ Premium' },
                  { value: 'featured', label: '✨ Featured' },
                ].map(({ value, label }) => (
                  <Link
                    key={value}
                    href={`/vendors?${new URLSearchParams({ ...params, tier: value, province: params.province || '' }).toString()}`}
                    className={`block text-sm px-3 py-2 rounded-lg transition-colors ${
                      (params.tier || '') === value
                        ? 'bg-[#0a1628] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Province filter */}
            <div className="mb-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Province</h3>
              <div className="space-y-1">
                <Link
                  href={`/vendors?${new URLSearchParams({ ...params, province: '' }).toString()}`}
                  className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${!params.province ? 'bg-[#0a1628] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  All Provinces
                </Link>
                {PROVINCES.map(({ code, name }) => (
                  <Link
                    key={code}
                    href={`/vendors?${new URLSearchParams({ ...params, province: code }).toString()}`}
                    className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${params.province === code ? 'bg-[#0a1628] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Category filter */}
            {categories.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</h3>
                <div className="space-y-1">
                  <Link
                    href={`/vendors?${new URLSearchParams({ ...params, category: '' }).toString()}`}
                    className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${!params.category ? 'bg-[#0a1628] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    All Categories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/vendors?${new URLSearchParams({ ...params, category: cat.slug }).toString()}`}
                      className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${params.category === cat.slug ? 'bg-[#0a1628] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Vendor Grid */}
        <div className="flex-1 min-w-0">
          {vendors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-[#0a1628] mb-2">No vendors found</h3>
              <p className="text-gray-500 text-sm mb-4">
                {activeFilters > 0
                  ? 'Try adjusting your filters or search terms.'
                  : 'Be the first to list your business in this directory.'}
              </p>
              <div className="flex gap-3 justify-center">
                {activeFilters > 0 && (
                  <Link href="/vendors" className="text-sm text-amber-600 hover:text-amber-500 font-medium">
                    Clear filters
                  </Link>
                )}
                <Link href="/list-your-business" className="bg-[#0a1628] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0d1f3c] transition-colors">
                  List your business
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
