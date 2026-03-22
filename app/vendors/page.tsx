import { createAdminClient } from '@/lib/supabase'
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

function buildQueryString(params: Record<string, string | undefined>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    search.set(key, value)
  }
  return search.toString()
}

const PAGE_SIZE = 48

async function getVendors(params: SearchParams): Promise<{ vendors: Vendor[]; total: number }> {
  const supabase = createAdminClient()
  const qualityCurated = params.quality === 'full'
  const page = Math.max(1, parseInt(params.page || '1', 10))
  const offset = (page - 1) * PAGE_SIZE

  if (params.category) {
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.category)
      .single()

    if (!catData) return { vendors: [], total: 0 }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from('vendors')
      .select('*, vendor_categories!inner(category_id)', { count: 'exact' })
      .eq('vendor_categories.category_id', catData.id)
      .eq('active', true)
      .order('tier', { ascending: false })
      .order('company_name')

    if (params.province) query = query.eq('province', params.province)
    if (params.tier && ['featured', 'premium'].includes(params.tier)) query = query.eq('tier', params.tier)
    if (params.q) query = query.or(`company_name.ilike.%${params.q}%,description.ilike.%${params.q}%`)
    if (qualityCurated) query = query.or('website.not.is.null,description.not.is.null')

    const { data, count } = await query.range(offset, offset + PAGE_SIZE - 1)
    if (!data) return { vendors: [], total: 0 }
    const tierRank: Record<string, number> = { premium: 0, featured: 1, basic: 2, free: 3 }
    const vendors = data
      .map(({ vendor_categories: _vc, ...vendor }: { vendor_categories: unknown } & Vendor) => vendor)
      .sort((a: Vendor, b: Vendor) => (tierRank[a.tier] ?? 4) - (tierRank[b.tier] ?? 4) || a.company_name.localeCompare(b.company_name)) as Vendor[]
    return { vendors, total: count ?? 0 }
  }

  // When a search query is present, also look up vendors in categories matching that query
  // e.g. searching "Carbon & ESG Services" should return vendors in that category
  let categoryVendorIds: string[] = []
  if (params.q) {
    const { data: matchingCats } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', `%${params.q}%`)

    if (matchingCats && matchingCats.length > 0) {
      const catIds = matchingCats.map((c: { id: string }) => c.id)
      const { data: links } = await supabase
        .from('vendor_categories')
        .select('vendor_id')
        .in('category_id', catIds)
      categoryVendorIds = (links || []).map((l: { vendor_id: string }) => l.vendor_id)
    }
  }

  let query = supabase
    .from('vendors')
    .select('*', { count: 'exact' })
    .eq('active', true)
    .order('tier', { ascending: false })
    .order('company_name')

  if (params.province) query = query.eq('province', params.province)
  if (params.tier && ['featured', 'premium'].includes(params.tier)) query = query.eq('tier', params.tier)

  if (params.q) {
    const textFilter = `company_name.ilike.%${params.q}%,description.ilike.%${params.q}%`
    if (categoryVendorIds.length > 0) {
      // Include vendors matching the text OR vendors in matching categories
      query = query.or(`${textFilter},id.in.(${categoryVendorIds.join(',')})`)
    } else {
      query = query.or(textFilter)
    }
  }

  if (qualityCurated) query = query.or('website.not.is.null,description.not.is.null')

  const { data, count } = await query.range(offset, offset + PAGE_SIZE - 1)
  const tierRank: Record<string, number> = { premium: 0, featured: 1, basic: 2, free: 3 }
  const sorted = (data || []).sort((a: Vendor, b: Vendor) =>
    (tierRank[a.tier] ?? 4) - (tierRank[b.tier] ?? 4) || a.company_name.localeCompare(b.company_name)
  )
  return { vendors: sorted as Vendor[], total: count ?? 0 }
}

async function getCategories() {
  const supabase = createAdminClient()
  const { data } = await supabase.from('categories').select('*').order('name')
  return (data || []) as Category[]
}

export const revalidate = 30
export const dynamic = 'force-dynamic'

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const [{ vendors, total }, categories] = await Promise.all([
    getVendors(params),
    getCategories(),
  ])

  const page = Math.max(1, parseInt(params.page || '1', 10))
  const totalPages = Math.ceil(total / PAGE_SIZE)
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
          {total > 0 ? `${total} vendor${total !== 1 ? 's' : ''} found${totalPages > 1 ? ` — page ${page} of ${totalPages}` : ''}` : 'Browse Canadian energy vendors'}
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
                    href={`/vendors?${buildQueryString({ ...params, tier: value, province: params.province || '' })}`}
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
                  href={`/vendors?${buildQueryString({ ...params, province: '' })}`}
                  className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${!params.province ? 'bg-[#0a1628] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  All Provinces
                </Link>
                {PROVINCES.map(({ code, name }) => (
                  <Link
                    key={code}
                    href={`/vendors?${buildQueryString({ ...params, province: code })}`}
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
                    href={`/vendors?${buildQueryString({ ...params, category: '' })}`}
                    className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${!params.category ? 'bg-[#0a1628] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    All Categories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/vendors?${buildQueryString({ ...params, category: cat.slug })}`}
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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {vendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`/vendors?${buildQueryString({ ...params, page: String(page - 1) })}`}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      ← Previous
                    </Link>
                  )}
                  <span className="px-4 py-2 text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={`/vendors?${buildQueryString({ ...params, page: String(page + 1) })}`}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-[#0a1628] text-white hover:bg-[#0d1f3c] transition-colors"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
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
