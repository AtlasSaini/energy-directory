import Link from 'next/link'
import type { Category } from '@/types/database'

const CATEGORY_ICONS: Record<string, string> = {
  'oil-gas': '🛢️',
  'renewables': '☀️',
  'solar': '🌞',
  'wind': '💨',
  'hydro': '💧',
  'geothermal': '🌋',
  'nuclear': '⚛️',
  'natural-gas': '🔥',
  'coal': '⚫',
  'petroleum': '⛽',
  'electrical': '⚡',
  'pipeline': '🔧',
  'drilling': '🏗️',
  'engineering': '⚙️',
  'environmental': '🌿',
  'oilfield-services': '🔩',
  'power-generation': '🏭',
  'transmission': '🔌',
  'storage': '🏪',
  'trading': '📈',
}

interface CategoryGridProps {
  categories: Category[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {categories.map((cat) => {
        const icon = CATEGORY_ICONS[cat.slug] || cat.icon || '⚡'
        return (
          <Link key={cat.id} href={`/categories/${cat.slug}`}>
            <div className="group bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-amber-400 hover:shadow-md transition-all cursor-pointer h-full flex flex-col items-center justify-center gap-2 min-h-[100px]">
              <span className="text-3xl">{icon}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#0a1628] leading-tight">
                {cat.name}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
