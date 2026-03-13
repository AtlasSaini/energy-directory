import { supabase } from '@/lib/supabase'
import VendorCard from '@/components/VendorCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Vendor, Category } from '@/types/database'

async function getCategoryData(slug: string) {
  const { data: categoryData } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  const category = categoryData as Category | null
  if (!category) return null

  // Get vendors in this category via join
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: vcRaw } = await (supabase as any)
    .from('vendor_categories')
    .select('vendor_id')
    .eq('category_id', category.id)

  const vcData = (vcRaw || []) as { vendor_id: string }[]
  let vendors: Vendor[] = []
  if (vcData.length > 0) {
    const vendorIds = vcData.map((vc) => vc.vendor_id)
    const { data } = await supabase
      .from('vendors')
      .select('*')
      .in('id', vendorIds)
      .eq('active', true)
      .order('tier', { ascending: false })
    vendors = (data || []) as Vendor[]
  }

  // Get all categories for sidebar
  const { data: allCategories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return {
    category,
    vendors,
    allCategories: (allCategories || []) as Category[],
  }
}

export const revalidate = 60

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getCategoryData(slug)

  if (!data) notFound()

  const { category, vendors, allCategories } = data

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <Link href="/vendors" className="hover:text-amber-600">Vendors</Link>
        <span>/</span>
        <span className="text-gray-800">{category.name}</span>
      </nav>

      {/* Hero */}
      <div className="bg-[#0a1628] text-white rounded-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-300 max-w-2xl">{category.description}</p>
        )}
        <p className="text-amber-400 mt-2 text-sm font-medium">
          {vendors.length} vendor{vendors.length !== 1 ? 's' : ''} in this category
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="font-semibold text-[#0a1628] text-sm mb-3">All Categories</h2>
            <div className="space-y-1">
              {allCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${cat.slug === slug ? 'bg-[#0a1628] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {vendors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-lg font-semibold text-[#0a1628] mb-2">No vendors yet</h3>
              <p className="text-gray-500 text-sm mb-4">
                Be the first to list in the {category.name} category.
              </p>
              <Link href="/list-your-business" className="bg-[#0a1628] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0d1f3c] transition-colors">
                List your business
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
