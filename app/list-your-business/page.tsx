import { createAdminClient } from '@/lib/supabase'
import ListYourBusinessClient from '@/components/ListYourBusinessClient'

export const revalidate = 3600 // re-fetch category count at most once per hour

async function getCategoryCount() {
  const supabase = createAdminClient()
  const { count } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
  return count ?? 0
}

export default async function ListYourBusinessPage() {
  const categoryCount = await getCategoryCount()

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0a1628] text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold mb-4">
            List Your Business on<br />
            <span className="text-amber-400">EnergyDirectory.ca</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Get discovered by buyers, project managers, and operators across Canada&apos;s full energy sector - Oil &amp; Gas, Renewables, Carbon &amp; ESG, Power Generation, Oilsands, Geothermal, LNG, and more. Start free - upgrade when you&apos;re ready.
          </p>
        </div>
      </section>

      <ListYourBusinessClient categoryCount={categoryCount} />
    </div>
  )
}
