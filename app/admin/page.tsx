/**
 * /admin — Vendor Data Quality Dashboard
 *
 * ⚠️  INTERNAL TOOL — no auth protection yet.
 * TODO: Add authentication before making this route public or deploying to production.
 *       Recommended: protect via middleware.ts with a simple secret cookie or Supabase Auth check.
 */

import { createAdminClient } from '@/lib/supabase'
import BareVendorsTable from './BareVendorsTable'
import DataHealthSection from './DataHealthSection'
import type { Vendor } from '@/types/database'

// ─── Quality helpers ─────────────────────────────────────────────────────────

function calcScore(v: Vendor): number {
  let s = 0
  if (v.description && v.description.length > 20) s++
  if (v.website && v.website.trim() !== '')        s++
  if (v.city    && v.city.trim()    !== '')         s++
  if (v.phone   && v.phone.trim()   !== '')         s++
  if (v.province && v.province.trim() !== '')       s++
  return s
}

type QTier = 'Full' | 'Partial' | 'Bare'
function qualityTier(score: number): QTier {
  if (score >= 4) return 'Full'
  if (score >= 2) return 'Partial'
  return 'Bare'
}

interface TierCounts { Full: number; Partial: number; Bare: number }

function pct(num: number, total: number) {
  if (total === 0) return '0.0'
  return ((num / total) * 100).toFixed(1)
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchAllVendors(): Promise<Vendor[]> {
  const supabase = createAdminClient()
  const PAGE = 1000
  let offset = 0
  const all: Vendor[] = []

  while (true) {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .range(offset, offset + PAGE - 1)
      .order('id')

    if (error) throw new Error(`Vendor fetch failed: ${error.message}`)
    if (!data || data.length === 0) break

    all.push(...(data as Vendor[]))
    if (data.length < PAGE) break
    offset += PAGE
  }

  return all
}

async function fetchVendorCategoryMap(): Promise<Record<string, string[]>> {
  const supabase = createAdminClient()

  const [{ data: vcData }, { data: catData }] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('vendor_categories').select('vendor_id,category_id').limit(20000),
    supabase.from('categories').select('id,name'),
  ])

  const catById: Record<string, string> = {}
  ;(catData || []).forEach((c: { id: string; name: string }) => {
    catById[c.id] = c.name
  })

  const map: Record<string, string[]> = {}
  ;(vcData || []).forEach((vc: { vendor_id: string; category_id: string }) => {
    if (!map[vc.vendor_id]) map[vc.vendor_id] = []
    map[vc.vendor_id].push(catById[vc.category_id] || 'Unknown')
  })

  return map
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const revalidate = 60

export default async function AdminPage() {
  const [vendors, catMap] = await Promise.all([
    fetchAllVendors(),
    fetchVendorCategoryMap(),
  ])

  // Score every vendor
  const scored = vendors.map(v => ({
    ...v,
    score: calcScore(v),
    tier: qualityTier(calcScore(v)),
    cats: catMap[v.id] || ['Uncategorized'],
  }))

  // Summary totals
  const total   = scored.length
  const fullCnt = scored.filter(v => v.tier === 'Full').length
  const partCnt = scored.filter(v => v.tier === 'Partial').length
  const bareCnt = scored.filter(v => v.tier === 'Bare').length

  // Province breakdown
  const byProvince: Record<string, TierCounts> = {}
  scored.forEach(v => {
    const p = v.province || 'Unknown'
    if (!byProvince[p]) byProvince[p] = { Full: 0, Partial: 0, Bare: 0 }
    byProvince[p][v.tier]++
  })
  const provinceRows = Object.entries(byProvince)
    .sort((a, b) => (b[1].Full + b[1].Partial + b[1].Bare) - (a[1].Full + a[1].Partial + a[1].Bare))

  // Category breakdown
  const byCat: Record<string, TierCounts> = {}
  scored.forEach(v => {
    v.cats.forEach(cat => {
      if (!byCat[cat]) byCat[cat] = { Full: 0, Partial: 0, Bare: 0 }
      byCat[cat][v.tier]++
    })
  })
  const catRows = Object.entries(byCat).sort((a, b) => {
    const aT = a[1].Full + a[1].Partial + a[1].Bare
    const bT = b[1].Full + b[1].Partial + b[1].Bare
    const aP = aT ? (a[1].Full + a[1].Partial) / aT : 0
    const bP = bT ? (b[1].Full + b[1].Partial) / bT : 0
    return aP - bP
  })

  // Bare vendors for table
  const bareVendors = scored
    .filter(v => v.tier === 'Bare')
    .map(v => ({
      id: v.id,
      company_name: v.company_name,
      province: v.province,
      categories: v.cats,
      user_id: v.user_id,
      active: v.active,
    }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0a1628] text-white px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Vendor Data Quality Dashboard</h1>
          <p className="text-gray-400 text-xs mt-0.5">Internal tool · energydirectory.ca</p>
        </div>
        <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
          ⚠️ Needs auth before launch
        </span>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Vendors" value={total} color="blue" />
          <StatCard label="Full Listings" value={fullCnt} sub={`${pct(fullCnt, total)}%`} color="green" />
          <StatCard label="Partial Listings" value={partCnt} sub={`${pct(partCnt, total)}%`} color="amber" />
          <StatCard label="Bare Listings" value={bareCnt} sub={`${pct(bareCnt, total)}%`} color="red" />
        </div>

        {/* Province breakdown */}
        <Section title="Quality by Province">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="pb-2 pr-4">Province</th>
                  <th className="pb-2 pr-4 text-right">Full</th>
                  <th className="pb-2 pr-4 text-right">Partial</th>
                  <th className="pb-2 pr-4 text-right">Bare</th>
                  <th className="pb-2 pr-4 text-right">Total</th>
                  <th className="pb-2 text-right">% Complete</th>
                </tr>
              </thead>
              <tbody>
                {provinceRows.map(([prov, c]) => {
                  const t = c.Full + c.Partial + c.Bare
                  const p = pct(c.Full + c.Partial, t)
                  return (
                    <tr key={prov} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 pr-4 font-medium text-gray-800">{prov}</td>
                      <td className="py-2 pr-4 text-right text-green-700">{c.Full}</td>
                      <td className="py-2 pr-4 text-right text-amber-600">{c.Partial}</td>
                      <td className="py-2 pr-4 text-right text-red-600">{c.Bare}</td>
                      <td className="py-2 pr-4 text-right text-gray-700 font-medium">{t}</td>
                      <td className="py-2 text-right">
                        <PctBadge value={Number(p)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Category breakdown */}
        <Section title="Quality by Category (Weakest First)">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="pb-2 pr-4">Category</th>
                  <th className="pb-2 pr-4 text-right">Full</th>
                  <th className="pb-2 pr-4 text-right">Partial</th>
                  <th className="pb-2 pr-4 text-right">Bare</th>
                  <th className="pb-2 pr-4 text-right">Total</th>
                  <th className="pb-2 text-right">% Complete</th>
                </tr>
              </thead>
              <tbody>
                {catRows.map(([cat, c]) => {
                  const t = c.Full + c.Partial + c.Bare
                  const p = pct(c.Full + c.Partial, t)
                  return (
                    <tr key={cat} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 pr-4 font-medium text-gray-800">{cat}</td>
                      <td className="py-2 pr-4 text-right text-green-700">{c.Full}</td>
                      <td className="py-2 pr-4 text-right text-amber-600">{c.Partial}</td>
                      <td className="py-2 pr-4 text-right text-red-600">{c.Bare}</td>
                      <td className="py-2 pr-4 text-right text-gray-700 font-medium">{t}</td>
                      <td className="py-2 text-right">
                        <PctBadge value={Number(p)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Bare vendors table */}
        <Section title={`Bare Listings (${bareVendors.length})`}>
          <p className="text-sm text-gray-500 mb-4">
            These vendors have a name (and possibly a province) but no website, description, or contact info.
            They can be hidden from the public directory or manually promoted once enriched.
          </p>
          <BareVendorsTable vendors={bareVendors} />
        </Section>

        {/* Data Health section */}
        <DataHealthSection />

      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: number
  sub?: string
  color: 'blue' | 'green' | 'amber' | 'red'
}) {
  const colors = {
    blue:  'bg-blue-50  border-blue-200  text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    red:   'bg-red-50   border-red-200   text-red-700',
  }
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <div className="text-3xl font-extrabold">{value.toLocaleString()}</div>
      <div className="text-sm font-medium mt-1">{label}</div>
      {sub && <div className="text-xs mt-0.5 opacity-70">{sub} of total</div>}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-[#0a1628] mb-4">{title}</h2>
      {children}
    </div>
  )
}

function PctBadge({ value }: { value: number }) {
  const color =
    value >= 60 ? 'bg-green-100 text-green-700' :
    value >= 30 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
      {value.toFixed(1)}%
    </span>
  )
}
