'use client'
import Link from 'next/link'
import type { Category } from '@/types/database'

const MINING_SLUGS = new Set([
  'gold-mining', 'copper-base-metals', 'coal-mining', 'uranium-nuclear-fuels',
  'potash-fertilizer', 'iron-ore-steel', 'lithium-battery-metals',
  'diamonds-precious-stones', 'mining-services-equipment',
  'mineral-exploration', 'mine-engineering-consulting', 'mine-safety-environment'
])

function CategoryIcon({ slug }: { slug: string }) {
  const common = {
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    fill: "none",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "w-8 h-8",
  }

  switch (slug) {
    case 'drilling-completions':
      return <svg {...common}><polyline points="12,3 5,21 19,21 12,3"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="11" y1="21" x2="11" y2="18"/><line x1="13" y1="21" x2="13" y2="18"/></svg>
    case 'engineering-consulting':
      return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
    case 'equipment-rentals':
      return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
    case 'environmental-services':
      return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    case 'field-services':
      return <svg {...common}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
    case 'health-safety':
      return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9,12 11,14 15,10"/></svg>
    case 'it-software':
      return <svg {...common}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    case 'land-legal':
      return <svg {...common}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    case 'logistics-transportation':
      return <svg {...common}><rect x="1" y="9" width="14" height="8" rx="1"/><path d="M15 13h4l3 3v2h-7z"/><circle cx="5" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/></svg>
    case 'manufacturing-fabrication':
      return <svg {...common}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
    case 'pipeline-services':
      return <svg {...common}><path d="M3 12h18"/><circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    case 'production-services':
      return <svg {...common}><path d="M3 22v-8.5l5-3 4 2.5 4-2.5 5 3V22"/><path d="M12 11V2"/><path d="M9 5l3-3 3 3"/></svg>
    case 'staffing-recruitment':
      return <svg {...common}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
    case 'surveying-mapping':
      return <svg {...common}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
    case 'water-waste':
      return <svg {...common}><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
    case 'solar-wind':
      return <svg {...common}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
    case 'battery-storage':
      return <svg {...common}><rect x="2" y="7" width="16" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="7" y1="11" x2="7" y2="13"/><line x1="11" y1="11" x2="11" y2="13"/></svg>
    case 'carbon-esg':
      return <svg {...common}><path d="M2 22l10-10"/><path d="M16 8l-2 2"/><circle cx="18" cy="6" r="3"/><path d="M8 16l-5 5"/><circle cx="6" cy="18" r="2"/></svg>
    case 'power-generation':
      return <svg {...common}><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>
    case 'lng-gas-processing':
      return <svg {...common}><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z"/></svg>
    case 'oilsands':
      return <svg {...common}><path d="M3 20h18M5 20V8l7-5 7 5v12"/><rect x="9" y="14" width="6" height="6"/></svg>
    case 'geothermal':
      return <svg {...common}><path d="M12 22v-5"/><path d="M9 8c0-1.7.6-3.2 2-4.5 1.4 1.3 2 2.8 2 4.5a2 2 0 01-4 0z"/><path d="M5 20a7 7 0 0014 0"/></svg>
    case 'energy-trading-finance':
      return <svg {...common}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
    case 'gold-mining':
      return <svg {...common}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>
    case 'copper-base-metals':
      return <svg {...common}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
    case 'coal-mining':
      return <svg {...common}><rect x="2" y="4" width="20" height="5" rx="1"/><rect x="2" y="11" width="20" height="5" rx="1"/><rect x="2" y="18" width="20" height="3" rx="1"/></svg>
    case 'uranium-nuclear-fuels':
      return <svg {...common}><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>
    case 'potash-fertilizer':
      return <svg {...common}><path d="M12 2a9 9 0 019 9c0 5-4 9-9 11C7 20 3 16 3 11a9 9 0 019-9z"/><path d="M9 12l2 2 4-4"/></svg>
    case 'iron-ore-steel':
      return <svg {...common}><rect x="2" y="8" width="20" height="8" rx="2"/><path d="M6 8V6a2 2 0 012-2h8a2 2 0 012 2v2"/></svg>
    case 'lithium-battery-metals':
      return <svg {...common}><rect x="2" y="7" width="16" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="12" x2="14" y2="12"/></svg>
    case 'diamonds-precious-stones':
      return <svg {...common}><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20M6 3l4 6M18 3l-4 6"/></svg>
    case 'mining-services-equipment':
      return <svg {...common}><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
    case 'mineral-exploration':
      return <svg {...common}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    case 'mine-engineering-consulting':
      return <svg {...common}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    case 'mine-safety-environment':
      return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9,12 11,14 15,10"/></svg>
    default:
      return <svg {...common}><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>
  }
}

function CategoryTile({ cat }: { cat: Category }) {
  return (
    <Link href={`/categories/${cat.slug}`} className="group block">
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8ED] cursor-pointer flex flex-col gap-3 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:border-[#E8590C]/20">
        {/* Icon container */}
        <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] flex items-center justify-center transition-all duration-200 group-hover:border-[#E8590C]/35 group-hover:shadow-[0_6px_20px_rgba(232,89,12,0.15)]">
          <span className="text-[#6E6E73] group-hover:text-[#E8590C] transition-colors duration-200">
            <CategoryIcon slug={cat.slug} />
          </span>
        </div>
        {/* Label */}
        <div>
          <h3 className="text-sm font-semibold text-[#1D1D1F] leading-tight">{cat.name}</h3>
        </div>
        {/* CTA — fades in on hover */}
        <span className="text-xs font-semibold text-[#0066CC] opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200">
          Browse sector →
        </span>
      </div>
    </Link>
  )
}

interface CategoryGridProps {
  categories: Category[]
  grouped?: boolean
}

export default function CategoryGrid({ categories, grouped = false }: CategoryGridProps) {
  if (!grouped) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((cat) => <CategoryTile key={cat.id} cat={cat} />)}
      </div>
    )
  }

  const energy = categories.filter(c => (c as any).sector === 'energy' || (!((c as any).sector) && !MINING_SLUGS.has(c.slug)))
  const mining = categories.filter(c => (c as any).sector === 'mining' || (!((c as any).sector) && MINING_SLUGS.has(c.slug)))

  return (
    <div className="space-y-10">
      {/* Energy Section */}
      {energy.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="#E8590C" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>
            <h3 className="text-xl font-bold text-[#1D1D1F]">Energy</h3>
            <span className="text-sm text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded-full">{energy.length} categories</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {energy.map((cat) => <CategoryTile key={cat.id} cat={cat} />)}
          </div>
        </div>
      )}

      {/* Divider */}
      {energy.length > 0 && mining.length > 0 && (
        <hr className="border-[#E8E8ED]" />
      )}

      {/* Mining Section */}
      {mining.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="#E8590C" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
            <h3 className="text-xl font-bold text-[#1D1D1F]">Mining</h3>
            <span className="text-sm text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded-full">{mining.length} categories</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mining.map((cat) => <CategoryTile key={cat.id} cat={cat} />)}
          </div>
        </div>
      )}
    </div>
  )
}