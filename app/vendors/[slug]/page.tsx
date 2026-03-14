import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Vendor, Category, Review } from '@/types/database'

interface VendorWithDetails extends Vendor {
  categories: Category[]
  reviews: Review[]
}

async function getVendor(slug: string): Promise<VendorWithDetails | null> {
  const { data: vendorData } = await supabase
    .from('vendors')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  const vendor = vendorData as Vendor | null
  if (!vendor) return null

  // Get categories
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: vcRaw } = await (supabase as any)
    .from('vendor_categories')
    .select('category_id')
    .eq('vendor_id', vendor.id)

  const vcData = (vcRaw || []) as { category_id: string }[]
  let categories: Category[] = []
  if (vcData.length > 0) {
    const catIds = vcData.map((vc) => vc.category_id)
    const { data: cats } = await supabase
      .from('categories')
      .select('*')
      .in('id', catIds)
    categories = (cats || []) as Category[]
  }

  // Get reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('vendor_id', vendor.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return {
    ...vendor,
    categories,
    reviews: (reviews || []) as Review[],
  }
}

const PROVINCE_LABELS: Record<string, string> = {
  AB: 'Alberta', BC: 'British Columbia', SK: 'Saskatchewan', MB: 'Manitoba',
  ON: 'Ontario', QC: 'Quebec', NS: 'Nova Scotia', NB: 'New Brunswick',
  PE: 'PEI', NL: 'Newfoundland', YT: 'Yukon', NT: 'Northwest Territories', NU: 'Nunavut',
}

export const revalidate = 60

export default async function VendorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const vendor = await getVendor(slug)

  if (!vendor) notFound()

  const avgRating = vendor.reviews.length > 0
    ? vendor.reviews.reduce((sum, r) => sum + r.rating, 0) / vendor.reviews.length
    : null

  const tierColor = vendor.tier === 'premium' ? 'text-amber-600 bg-amber-50 border-amber-200' : vendor.tier === 'featured' ? 'text-blue-600 bg-blue-50 border-blue-200' : ''

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <Link href="/vendors" className="hover:text-amber-600">Vendors</Link>
        <span>/</span>
        <span className="text-gray-800">{vendor.company_name}</span>
      </nav>

      {/* Banner */}
      <div className={`h-48 rounded-2xl overflow-hidden mb-6 ${vendor.banner_url ? '' : 'bg-gradient-to-r from-[#0a1628] to-[#1a3a6b]'}`}>
        {vendor.banner_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={vendor.banner_url} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 -mt-16 lg:-mt-0">
            <div className="flex items-start gap-4 -mt-10 lg:mt-0 mb-4 lg:mb-0">
              <div className="w-20 h-20 rounded-xl border-4 border-white shadow-md bg-white flex items-center justify-center overflow-hidden flex-shrink-0 lg:-mt-16">
                {vendor.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={vendor.logo_url} alt={vendor.company_name} className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-3xl font-bold text-[#0a1628]">{vendor.company_name.charAt(0)}</span>
                )}
              </div>
              <div className="pt-6 lg:pt-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-[#0a1628]">{vendor.company_name}</h1>
                  {vendor.verified && (
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-200 font-medium">
                      ✓ Verified
                    </span>
                  )}
                  {vendor.tier !== 'free' && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${tierColor}`}>
                      {vendor.tier}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  {(vendor.city || vendor.province) && (
                    <span className="flex items-center gap-1">
                      📍 {[vendor.city, vendor.province ? PROVINCE_LABELS[vendor.province] || vendor.province : null].filter(Boolean).join(', ')}
                    </span>
                  )}
                  {avgRating !== null && (
                    <span className="flex items-center gap-1">
                      ⭐ {avgRating.toFixed(1)} ({vendor.reviews.length} review{vendor.reviews.length !== 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          {vendor.description && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-[#0a1628] mb-3">About</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{vendor.description}</p>
            </div>
          )}

          {/* Categories */}
          {vendor.categories.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-[#0a1628] mb-3">Services & Categories</h2>
              <div className="flex flex-wrap gap-2">
                {vendor.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 text-sm px-3 py-1.5 rounded-full transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Photos */}
          {vendor.photos && vendor.photos.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-[#0a1628] mb-3">Photos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {vendor.photos.map((photo, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={photo} alt="" className="rounded-lg w-full h-32 object-cover" />
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {vendor.reviews.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="font-semibold text-[#0a1628] mb-4">
                Reviews ({vendor.reviews.length})
                {avgRating !== null && <span className="text-amber-500 ml-2">{'⭐'.repeat(Math.round(avgRating))}</span>}
              </h2>
              <div className="space-y-4">
                {vendor.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-[#0a1628] text-sm">{review.reviewer_name}</span>
                      <span className="text-amber-500 text-sm">{'⭐'.repeat(review.rating)}</span>
                    </div>
                    {review.comment && <p className="text-gray-600 text-sm">{review.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-72 flex-shrink-0 space-y-4">
          {/* Contact Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-[#0a1628] mb-4">Contact & Links</h3>
            <div className="space-y-3">
              {vendor.website && (
                <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-500 transition-colors">
                  <span>🌐</span>
                  <span className="truncate">{vendor.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
              {vendor.phone && (
                <a href={`tel:${vendor.phone}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#0a1628] transition-colors">
                  <span>📞</span>
                  <span>{vendor.phone}</span>
                </a>
              )}
              {vendor.email && (
                <a href={`mailto:${vendor.email}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#0a1628] transition-colors">
                  <span>✉️</span>
                  <span className="truncate">{vendor.email}</span>
                </a>
              )}
            </div>

            {vendor.website && (
              <a
                href={vendor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold text-sm px-4 py-2.5 rounded-lg text-center transition-colors"
              >
                Visit Website →
              </a>
            )}
          </div>

          {/* CTA */}
          <div className="bg-[#0a1628] text-white rounded-xl p-5">
            <h3 className="font-semibold mb-2">Are you this vendor?</h3>
            <p className="text-gray-300 text-sm mb-4">Claim your listing and upgrade to get more leads.</p>
            <Link
              href="/list-your-business"
              className="block w-full bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold text-sm px-4 py-2.5 rounded-lg text-center transition-colors"
            >
              Claim & Upgrade
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
