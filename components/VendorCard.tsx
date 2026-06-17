import Link from 'next/link'
import type { Vendor } from '@/types/database'
import VendorLogo from './VendorLogo'

interface VendorCardProps {
  vendor: Vendor & { categories?: string[] }
}

const TIER_BADGES = {
  premium: { label: 'Premium', classes: 'bg-[#E8590C]/10 text-[#E8590C] border border-[#E8590C]/30' },
  featured: { label: 'Featured', classes: 'bg-[#E8590C]/10 text-[#E8590C] border border-[#E8590C]/20' },
  free: { label: null, classes: '' },
}

const PROVINCE_LABELS: Record<string, string> = {
  AB: 'Alberta', BC: 'British Columbia', SK: 'Saskatchewan', MB: 'Manitoba',
  ON: 'Ontario', QC: 'Quebec', NS: 'Nova Scotia', NB: 'New Brunswick',
  PE: 'PEI', NL: 'Newfoundland', YT: 'Yukon', NT: 'Northwest Territories', NU: 'Nunavut',
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const isFeatured = vendor.tier === 'featured' || vendor.tier === 'premium'

  return (
    <Link href={`/vendors/${vendor.slug}`}>
      <div className={`
        group bg-white rounded-xl border transition-all duration-200 cursor-pointer
        flex items-center gap-4 p-4
        hover:-translate-y-0.5 hover:shadow-md
        ${isFeatured
          ? 'border-l-4 border-l-[#E8590C] border-[#E8590C]/25 shadow-sm'
          : 'border-[#E8E8ED] hover:border-[#D2D2D7]'
        }
      `}>
        {/* Logo — 44px rounded square */}
        <div className="w-11 h-11 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] flex items-center justify-center overflow-hidden flex-shrink-0">
          <VendorLogo logoUrl={vendor.logo_url} companyName={vendor.company_name} />
        </div>

        {/* Info — flex-1 */}
        <div className="flex-1 min-w-0">
          {/* Name + verified badge */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="text-sm font-semibold text-[#1D1D1F] leading-tight line-clamp-2">{vendor.company_name}</h3>

          </div>
          {/* Location */}
          <p className="text-xs text-[#6E6E73] truncate mb-1.5">
            {[vendor.city, vendor.province ? (PROVINCE_LABELS[vendor.province] || vendor.province) : null].filter(Boolean).join(', ') || 'Canada'}
          </p>
          {/* Description — featured/premium only */}
      {isFeatured && vendor.description && (
        <p className="text-[11px] text-[#6E6E73] line-clamp-3 mt-1 mb-0.5 leading-relaxed">{vendor.description}</p>
      )}
      {/* Category pills — max 2 */}
          {vendor.categories && vendor.categories.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {vendor.categories.slice(0, 2).map(cat => (
                <span key={cat} className="text-xs bg-[#F5F5F7] text-[#6E6E73] px-2 py-0.5 rounded-full whitespace-nowrap">{cat}</span>
              ))}
            </div>
          )}
        </div>

        {/* Right side — badge + cta */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {vendor.verified && (
            <span title="Verified Business">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="7.5" fill="#0066CC"/>
                <polyline points="4.5,7.5 6.5,9.5 10.5,5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </span>
          )}
          {isFeatured && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#E8590C] bg-[#E8590C]/10 px-2 py-0.5 rounded-full border border-[#E8590C]/20">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#E8590C"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>
              Featured
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}