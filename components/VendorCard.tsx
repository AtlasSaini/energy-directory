import Link from 'next/link'
import type { Vendor } from '@/types/database'
import AddToShortlistButton from './AddToShortlistButton'

interface VendorCardProps {
  vendor: Vendor & { categories?: string[] }
}

const TIER_BADGES = {
  premium: { label: 'Premium', classes: 'bg-amber-100 text-amber-800 border border-amber-300' },
  featured: { label: 'Featured', classes: 'bg-blue-100 text-blue-800 border border-blue-200' },
  free: { label: null, classes: '' },
}

const PROVINCE_LABELS: Record<string, string> = {
  AB: 'Alberta', BC: 'British Columbia', SK: 'Saskatchewan', MB: 'Manitoba',
  ON: 'Ontario', QC: 'Quebec', NS: 'Nova Scotia', NB: 'New Brunswick',
  PE: 'PEI', NL: 'Newfoundland', YT: 'Yukon', NT: 'Northwest Territories', NU: 'Nunavut',
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const badge = TIER_BADGES[vendor.tier]
  const isPremium = vendor.tier === 'premium'
  const isFeatured = vendor.tier === 'featured' || isPremium

  return (
    <Link href={`/vendors/${vendor.slug}`}>
      <div className={`bg-white rounded-xl border transition-all hover:shadow-md h-full flex flex-col ${isPremium ? 'border-amber-300 shadow-amber-50 shadow-sm' : isFeatured ? 'border-blue-200' : 'border-gray-200'}`}>
        {/* Banner */}
        {vendor.banner_url ? (
          <div className="h-24 rounded-t-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={vendor.banner_url} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className={`h-16 rounded-t-xl ${isPremium ? 'bg-gradient-to-r from-[#0a1628] to-amber-900' : isFeatured ? 'bg-gradient-to-r from-[#0a1628] to-blue-900' : 'bg-gradient-to-r from-[#0a1628] to-slate-700'}`} />
        )}

        <div className="p-4 flex flex-col flex-1 -mt-4">
          {/* Logo + name row */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg border-2 border-white shadow-sm bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
              {vendor.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={vendor.logo_url} alt={vendor.company_name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-xl font-bold text-[#0a1628]">{vendor.company_name.charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0 flex-1 pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-[#0a1628] text-sm leading-tight truncate">{vendor.company_name}</h3>
                {vendor.verified && (
                  <span className="text-blue-500" title="Verified">✓</span>
                )}
              </div>
              {badge.label && (
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 ${badge.classes}`}>
                  {badge.label}
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          {(vendor.city || vendor.province) && (
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {[vendor.city, vendor.province ? PROVINCE_LABELS[vendor.province] || vendor.province : null].filter(Boolean).join(', ')}
            </p>
          )}

          {/* Description */}
          {vendor.description && (
            <p className="text-gray-600 text-sm line-clamp-2 flex-1 mb-3">{vendor.description}</p>
          )}

          {/* Categories */}
          {vendor.categories && vendor.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto mb-3">
              {vendor.categories.slice(0, 3).map((cat) => (
                <span key={cat} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {cat}
                </span>
              ))}
              {vendor.categories.length > 3 && (
                <span className="text-xs text-gray-400">+{vendor.categories.length - 3} more</span>
              )}
            </div>
          )}

          {/* Shortlist button */}
          <div className="mt-auto pt-1">
            <AddToShortlistButton
              vendor={{ id: vendor.id, company_name: vendor.company_name, slug: vendor.slug, category: vendor.categories?.[0] }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
