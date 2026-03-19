import Link from 'next/link'
import type { Category } from '@/types/database'

const CATEGORY_ICONS: Record<string, string> = {
  'drilling-completions': '🛢️',
  'engineering-consulting': '⚙️',
  'equipment-rentals': '🏗️',
  'environmental-services': '🌿',
  'field-services': '🔧',
  'health-safety': '🦺',
  'it-software': '💻',
  'land-legal': '📋',
  'logistics-transportation': '🚛',
  'manufacturing-fabrication': '🏭',
  'pipeline-services': '🔩',
  'production-services': '⛽',
  'staffing-recruitment': '👷',
  'surveying-mapping': '🗺️',
  'water-waste': '💧',
  'solar-wind': '☀️',
  'battery-storage': '🔋',
  'carbon-esg': '🌱',
  'power-generation': '⚡',
  'lng-gas-processing': '🔥',
  'oilsands': '🏔️',
  'geothermal': '🌋',
  'energy-trading-finance': '📈',
  // Mining
  'gold-mining': '🥇',
  'copper-base-metals': '🔶',
  'coal-mining': '⚫',
  'uranium-nuclear-fuels': '☢️',
  'potash-fertilizer': '🌱',
  'iron-ore-steel': '🏗️',
  'lithium-battery-metals': '🔋',
  'diamonds-precious-stones': '💎',
  'mining-services-equipment': '⛏️',
  'mineral-exploration': '🔍',
  'mine-engineering-consulting': '📐',
  'mine-safety-environment': '🦺',
}

const MINING_SLUGS = new Set([
  'gold-mining', 'copper-base-metals', 'coal-mining', 'uranium-nuclear-fuels',
  'potash-fertilizer', 'iron-ore-steel', 'lithium-battery-metals',
  'diamonds-precious-stones', 'mining-services-equipment',
  'mineral-exploration', 'mine-engineering-consulting', 'mine-safety-environment'
])

function CategoryTile({ cat }: { cat: Category }) {
  const icon = CATEGORY_ICONS[cat.slug] || (cat as any).icon || '⚡'
  return (
    <Link href={`/categories/${cat.slug}`}>
      <div className="group bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-amber-400 hover:shadow-md transition-all cursor-pointer h-full flex flex-col items-center justify-center gap-2 min-h-[100px]">
        <span className="text-3xl">{icon}</span>
        <span className="text-sm font-medium text-gray-700 group-hover:text-[#0a1628] leading-tight">
          {cat.name}
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

  // Split into energy and mining using sector field or slug fallback
  const energy = categories.filter(c => (c as any).sector === 'energy' || (!((c as any).sector) && !MINING_SLUGS.has(c.slug)))
  const mining = categories.filter(c => (c as any).sector === 'mining' || (!((c as any).sector) && MINING_SLUGS.has(c.slug)))

  return (
    <div className="space-y-10">
      {/* Energy Section */}
      {energy.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">⚡</span>
            <h3 className="text-xl font-bold text-[#0a1628]">Energy</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{energy.length} categories</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {energy.map((cat) => <CategoryTile key={cat.id} cat={cat} />)}
          </div>
        </div>
      )}

      {/* Divider */}
      {energy.length > 0 && mining.length > 0 && (
        <hr className="border-gray-200" />
      )}

      {/* Mining Section */}
      {mining.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">⛏️</span>
            <h3 className="text-xl font-bold text-[#0a1628]">Mining</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{mining.length} categories</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mining.map((cat) => <CategoryTile key={cat.id} cat={cat} />)}
          </div>
        </div>
      )}
    </div>
  )
}
