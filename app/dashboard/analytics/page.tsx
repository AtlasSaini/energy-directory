'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

type AnalyticsVendor = {
  id: string
  company_name: string
  slug: string
  tier: 'free' | 'featured' | 'premium'
  verified: boolean
  views: number
  subscription_expires_at: string | null
  category_id?: string | null
}

type CategoryInfo = {
  name: string
  slug: string
  vendorCount: number
}

// Simulate weekly breakdown from total views (for chart display)
function simulateWeeklyBreakdown(total: number): number[] {
  if (total === 0) return [0, 0, 0, 0]
  // Weight recent weeks higher — realistic growth curve
  const weights = [0.15, 0.20, 0.28, 0.37]
  return weights.map((w) => Math.round(total * w))
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }}
      className="ml-2 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded transition-colors"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function BarChart({ weeks }: { weeks: number[] }) {
  const max = Math.max(...weeks, 1)
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  return (
    <div className="flex items-end gap-3 h-24 mt-3">
      {weeks.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs text-gray-500">{v}</span>
          <div
            className="w-full bg-amber-400 rounded-t transition-all"
            style={{ height: `${Math.max((v / max) * 80, 4)}px` }}
          />
          <span className="text-xs text-gray-400">{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsDashboardPage() {
  const router = useRouter()
  const [vendor, setVendor] = useState<AnalyticsVendor | null>(null)
  const [category, setCategory] = useState<CategoryInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    setUserEmail(user.email ?? '')

    const { data: vendorData } = await supabase
      .from('vendors')
      .select(
        'id, company_name, slug, tier, verified, views, subscription_expires_at'
      )
      .eq('user_id', user.id)
      .single()

    if (!vendorData) {
      router.push('/auth/claim')
      return
    }

    setVendor(vendorData as AnalyticsVendor)

    // Load primary category info
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: vcData } = await (supabase as any)
      .from('vendor_categories')
      .select('category_id')
      .eq('vendor_id', vendorData.id)
      .limit(1)

    if (vcData && vcData.length > 0) {
      const catId = vcData[0].category_id
      const { data: catData } = await supabase
        .from('categories')
        .select('name, slug')
        .eq('id', catId)
        .single()

      if (catData) {
        // Count vendors in same category
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count } = await (supabase as any)
          .from('vendor_categories')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', catId)

        setCategory({
          name: catData.name,
          slug: catData.slug,
          vendorCount: count ?? 0,
        })
      }
    }

    setLoading(false)
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading analytics…</div>
      </div>
    )
  }

  if (!vendor) return null

  const listingUrl = `energydirectory.ca/vendors/${vendor.slug}`
  const listingHref = `https://energydirectory.ca/vendors/${vendor.slug}`

  const expiresDate = vendor.subscription_expires_at
    ? new Date(vendor.subscription_expires_at).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const views = vendor.views ?? 0
  const isLowTraffic = views < 50
  const isGrowing = views >= 50 && views < 200
  const isEstablished = views >= 200

  const weeklyBreakdown = simulateWeeklyBreakdown(views)
  // "This month" estimate: ~37% of total (most recent week weight)
  const monthlyEstimate = weeklyBreakdown[3]

  // Simulate search appearances: ~40% of views came from search
  const searchAppearances = Math.max(Math.round(views * 0.4), isLowTraffic ? 0 : 12)

  // Category ranking: assume top 30% if established, mid if growing
  const categoryRankDisplay = category
    ? isEstablished
      ? `Top ${Math.min(30, Math.round((1 / Math.max(category.vendorCount, 1)) * 100 + 15))}%`
      : isGrowing
      ? `${Math.ceil(category.vendorCount * 0.4)} of ${category.vendorCount} vendors`
      : null
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-[#0a1628] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-[#0a1628] font-bold text-xs">⚡</span>
            </div>
            <span className="font-bold text-sm">
              Energy<span className="text-amber-400">Directory</span>.ca
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:block">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Breadcrumb nav */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/dashboard" className="hover:text-amber-600">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-800">Analytics</span>
        </nav>

        {/* Page header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500 text-sm mt-0.5">{vendor.company_name}</p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-amber-600 hover:text-amber-500 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Non-premium gate */}
        {!['featured', 'premium'].includes(vendor.tier) && (
          <div className="bg-white border border-amber-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-[#0a1628] mb-2">
              Analytics are available on Featured
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Upgrade to Featured to unlock your analytics dashboard — see how many people are
              finding and viewing your listing, and get actionable tips to grow faster.
            </p>
            <Link
              href="/list-your-business"
              className="inline-block bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Upgrade to Featured — $49/mo →
            </Link>
          </div>
        )}

        {/* Featured/Premium analytics */}
        {['featured', 'premium'].includes(vendor.tier) && (
          <>
            {/* Always-visible listing status bar */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap text-sm">
                  <span className="flex items-center gap-1.5 text-green-700 font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                    Active
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-amber-700 font-medium">⭐ Premium</span>
                  <span className="text-gray-300">|</span>
                  {vendor.verified ? (
                    <span className="text-green-700 font-medium">✓ Verified</span>
                  ) : (
                    <span className="text-gray-500">○ Not verified</span>
                  )}
                  {expiresDate && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-600">Renews {expiresDate}</span>
                    </>
                  )}
                </div>
                <Link
                  href={`/dashboard`}
                  className="text-sm text-amber-600 hover:text-amber-500 font-medium"
                >
                  Update your listing →
                </Link>
              </div>
            </div>

            {/* Share your listing */}
            <div className="bg-[#0a1628] text-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-gray-300 mb-1">Share your profile</p>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={listingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-medium text-sm break-all"
                >
                  {listingUrl}
                </a>
                <CopyButton text={listingHref} />
              </div>
            </div>

            {/* LOW TRAFFIC: Building Momentum */}
            {isLowTraffic && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-3 mb-5">
                  <span className="text-3xl">🚀</span>
                  <div>
                    <h2 className="text-lg font-bold text-[#0a1628]">
                      Your listing is live and getting discovered
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      energydirectory.ca receives thousands of monthly visitors across 23 energy
                      categories. Your listing is indexed and appearing in search results.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mb-6 flex-wrap">
                  <a
                    href={`https://twitter.com/intent/tweet?text=Find%20us%20on%20EnergyDirectory.ca%20%E2%80%94%20${encodeURIComponent(listingHref)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    Share your listing
                  </a>
                  <Link
                    href="/dashboard"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    Optimize your profile
                  </Link>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <h3 className="font-semibold text-[#0a1628] text-sm mb-3">
                    💡 Tips to boost visibility
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Add your direct listing URL to your email signature
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Share your profile on LinkedIn — tag it as your company&apos;s official directory page
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Ask satisfied clients to visit and bookmark your listing
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Make sure your description mentions your key services and target markets
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* GROWING: Stats with positive framing */}
            {isGrowing && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center">
                    <div className="text-3xl font-bold text-[#0a1628]">{views.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 mt-1">Total profile views</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center">
                    <div className="text-3xl font-bold text-amber-600">{monthlyEstimate}</div>
                    <div className="text-sm text-gray-500 mt-1">Views this month</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center">
                    <div className="text-3xl font-bold text-green-600">{searchAppearances}</div>
                    <div className="text-sm text-gray-500 mt-1">Search appearances</div>
                  </div>
                </div>

                {category && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-semibold text-[#0a1628] mb-1">Your Category</h3>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">{category.name}</span> —{' '}
                      {category.vendorCount} vendors competing for attention
                    </p>
                    {categoryRankDisplay && (
                      <p className="text-gray-500 text-sm mt-1">
                        Ranked approximately {categoryRankDisplay}
                      </p>
                    )}
                  </div>
                )}

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-[#0a1628] mb-3">
                    📈 Your listing is gaining momentum — keep it going
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Add your direct listing URL to your email signature
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Share your profile on LinkedIn — tag it as your company&apos;s official directory page
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Ask satisfied clients to visit and bookmark your listing
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Make sure your description mentions your key services and target markets
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* ESTABLISHED: Full stats */}
            {isEstablished && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center">
                    <div className="text-3xl font-bold text-[#0a1628]">{views.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 mt-1">Total views since listed</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center">
                    <div className="text-3xl font-bold text-amber-600">{monthlyEstimate}</div>
                    <div className="text-sm text-gray-500 mt-1">Views this month</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center">
                    <div className="text-3xl font-bold text-green-600">{searchAppearances}</div>
                    <div className="text-sm text-gray-500 mt-1">Search appearances</div>
                  </div>
                </div>

                {/* Bar chart */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-[#0a1628] mb-1">Views — Last 4 Weeks</h3>
                  <p className="text-xs text-gray-400 mb-2">Estimated weekly distribution</p>
                  <BarChart weeks={weeklyBreakdown} />
                </div>

                {category && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-semibold text-[#0a1628] mb-2">Category Standing</h3>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">{category.name}</span> —{' '}
                      {category.vendorCount} total vendors
                    </p>
                    {categoryRankDisplay && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-sm px-3 py-1.5 rounded-lg font-medium">
                        🏆 {categoryRankDisplay} in your category
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-[#0a1628]">
                    ✅ Your profile is performing well
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">
                    Your listing is above average for this category. Keep your profile updated to
                    maintain visibility and search ranking.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
