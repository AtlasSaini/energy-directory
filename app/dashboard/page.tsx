'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-browser'
import LogoUpload from '@/components/LogoUpload'

const PROVINCES = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
]

type Category = {
  id: string
  name: string
  slug: string
  sector?: string
}

type Vendor = {
  id: string
  company_name: string
  slug: string
  description: string | null
  website: string | null
  phone: string | null
  email: string | null
  city: string | null
  province: string | null
  tier: 'free' | 'featured' | 'premium'
  verified: boolean
  subscription_status: string | null
  subscription_expires_at: string | null
  stripe_customer_id: string | null
  views: number
}

const TIER_STYLES: Record<string, string> = {
  premium: 'bg-purple-100 text-purple-700 border-purple-200',
  featured: 'bg-amber-100 text-amber-700 border-amber-200',
  free: 'bg-gray-100 text-gray-600 border-gray-200',
}

const TIER_LABELS: Record<string, string> = {
  premium: '⭐ Premium',
  featured: '🔥 Featured',
  free: 'Free',
}

export default function DashboardPage() {
  const router = useRouter()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Category picker state
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [savingCategories, setSavingCategories] = useState(false)
  const [categorySaveSuccess, setCategorySaveSuccess] = useState(false)
  const [categorySaveError, setCategorySaveError] = useState('')

  const [form, setForm] = useState({
    description: '',
    website: '',
    phone: '',
    city: '',
    province: '',
  })

  const loadDashboard = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    setUserEmail(user.email ?? '')

    // Admin users go straight to /admin — they don't have vendor listings
    const adminCheck = await fetch('/api/auth/is-admin')
    if (adminCheck.ok) {
      const { isAdmin } = await adminCheck.json()
      if (isAdmin) { router.push('/admin'); return }
    }

    const { data: vendorData } = await supabase
      .from('vendors')
      .select('id, company_name, slug, description, website, phone, email, logo_url, city, province, tier, verified, subscription_status, subscription_expires_at, stripe_customer_id, views')
      .eq('user_id', user.id)
      .single()

    if (!vendorData) {
      // No claimed listing — send to claim page
      router.push('/auth/claim')
      return
    }

    setVendor(vendorData as Vendor)
    setForm({
      description: vendorData.description ?? '',
      website: vendorData.website ?? '',
      phone: vendorData.phone ?? '',
      city: vendorData.city ?? '',
      province: vendorData.province ?? '',
      logo_url: vendorData.logo_url ?? '',
    })

    // Load categories
    const { data: cats } = await supabase.from('categories').select('id, name, slug, sector').order('name')
    setAllCategories((cats as Category[]) || [])

    // Load current category selections
    const catRes = await fetch('/api/vendor/categories')
    if (catRes.ok) {
      const { categoryIds } = await catRes.json()
      setSelectedCategoryIds(categoryIds || [])
    }

    setLoading(false)
  }, [router])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    setSaveError('')

    const res = await fetch('/api/vendor/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setSaveError(data.error ?? 'Failed to save changes')
      return
    }

    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)

    // Update local state
    setVendor((v) => v ? { ...v, ...form } : v)
  }

  async function handleSaveCategories() {
    if (selectedCategoryIds.length === 0) {
      setCategorySaveError('Please select at least 1 category.')
      return
    }
    setSavingCategories(true)
    setCategorySaveSuccess(false)
    setCategorySaveError('')

    const res = await fetch('/api/vendor/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryIds: selectedCategoryIds }),
    })

    const data = await res.json()
    setSavingCategories(false)

    if (!res.ok) {
      setCategorySaveError(data.error ?? 'Failed to save categories')
      return
    }

    setCategorySaveSuccess(true)
    setTimeout(() => setCategorySaveSuccess(false), 3000)
  }

  function toggleCategory(id: string) {
    setSelectedCategoryIds(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id)
      if (prev.length >= 2) return prev // max 2
      return [...prev, id]
    })
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading your dashboard…</div>
      </div>
    )
  }

  if (!vendor) return null

  const isSubscribed = vendor.subscription_status === 'active'
  const expiresDate = vendor.subscription_expires_at
    ? new Date(vendor.subscription_expires_at).toLocaleDateString('en-CA', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-[#0a1628] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/logo-medium-dark.svg"
              alt="Energy Directory"
              width={160}
              height={43}
            />
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

        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{vendor.company_name}</h1>
                <span className={`text-sm px-3 py-1 rounded-full font-medium border ${TIER_STYLES[vendor.tier] ?? TIER_STYLES.free}`}>
                  {TIER_LABELS[vendor.tier] ?? vendor.tier}
                </span>
                {vendor.verified && (
                  <span className="text-sm px-3 py-1 rounded-full font-medium bg-green-100 text-green-700 border border-green-200">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1">
                {vendor.views.toLocaleString()} total views
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/dashboard/leads"
                className="inline-flex items-center gap-1.5 text-sm bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                📋 View Inquiries
              </Link>
              <Link
                href={`/vendors/${vendor.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-500 font-medium border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
              >
                View live listing
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Edit form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Your Listing</h2>

            {saveError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                ✓ Changes saved successfully
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <LogoUpload
                currentUrl={form.logo_url || undefined}
                onUpload={(url) => setForm({ ...form, logo_url: url })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  placeholder="Tell potential clients what your company does…"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="https://yourcompany.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone number (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Calgary"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                  <select
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm bg-white"
                  >
                    <option value="">Select province</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-[#0a1628] font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Category picker */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Your Categories</h2>
            <p className="text-sm text-gray-500 mb-4">Select up to 2 categories that best describe your business. <span className="font-medium text-amber-600">{selectedCategoryIds.length}/2 selected</span></p>

            {categorySaveError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{categorySaveError}</div>
            )}
            {categorySaveSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">✓ Categories saved</div>
            )}

            {/* Energy categories */}
            {allCategories.filter(c => c.sector !== 'mining').length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">⚡ Energy</p>
                <div className="flex flex-wrap gap-2">
                  {allCategories.filter(c => c.sector !== 'mining').map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        selectedCategoryIds.includes(cat.id)
                          ? 'bg-amber-500 border-amber-500 text-[#0a1628] font-semibold'
                          : selectedCategoryIds.length >= 2
                          ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mining categories */}
            {allCategories.filter(c => c.sector === 'mining').length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">⛏️ Mining</p>
                <div className="flex flex-wrap gap-2">
                  {allCategories.filter(c => c.sector === 'mining').map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        selectedCategoryIds.includes(cat.id)
                          ? 'bg-amber-500 border-amber-500 text-[#0a1628] font-semibold'
                          : selectedCategoryIds.length >= 2
                          ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleSaveCategories}
              disabled={savingCategories || selectedCategoryIds.length === 0}
              className="mt-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-[#0a1628] font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              {savingCategories ? 'Saving…' : 'Save Categories'}
            </button>
          </div>

          {/* Subscription panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current plan</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${TIER_STYLES[vendor.tier] ?? TIER_STYLES.free}`}>
                    {TIER_LABELS[vendor.tier] ?? vendor.tier}
                  </span>
                </div>

                {isSubscribed && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="text-sm text-green-600 font-medium">Active</span>
                  </div>
                )}

                {expiresDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {isSubscribed ? 'Renews' : 'Expired'}
                    </span>
                    <span className="text-sm text-gray-900">{expiresDate}</span>
                  </div>
                )}
              </div>

              {isSubscribed && vendor.stripe_customer_id && (
                <a
                  href={`/api/checkout?action=portal&customerId=${vendor.stripe_customer_id}`}
                  className="mt-4 block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg text-sm transition-colors"
                >
                  Manage Billing →
                </a>
              )}

              {vendor.tier === 'free' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-3">
                    Upgrade to get featured placement, priority search ranking, and lead generation.
                  </p>
                  <Link
                    href="/list-your-business"
                    className="block w-full text-center bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold py-2.5 rounded-lg text-sm transition-colors"
                  >
                    Upgrade Listing ↑
                  </Link>
                </div>
              )}

              {/* Premium upsell hidden until traffic justifies it */}
            </div>

            {/* Analytics card */}
            {(vendor.tier === 'featured' || vendor.tier === 'premium') ? (
              <div className="bg-gradient-to-br from-[#0a1628] to-[#1a3a6b] text-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📊</span>
                  <h2 className="text-base font-semibold">Analytics</h2>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  See how many people are finding and viewing your listing.
                </p>
                <Link
                  href="/dashboard/analytics"
                  className="block w-full text-center bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  View Analytics →
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📊</span>
                  <h2 className="text-base font-semibold text-gray-900">Analytics</h2>
                </div>
                <p className="text-gray-500 text-sm mb-4">
                  Analytics are available on Featured and above — see views, search appearances, and category ranking.
                </p>
                <Link
                  href="/list-your-business"
                  className="block w-full text-center bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  Upgrade to Featured →
                </Link>
              </div>
            )}

            {/* Quick links */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Links</h2>
              <div className="space-y-2">
                <Link
                  href={`/vendors/${vendor.slug}`}
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  <span>🔗</span> View public listing
                </Link>
                <Link
                  href="/dashboard/leads"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  <span>📋</span> Inquiries
                </Link>
                {(vendor.tier === 'featured' || vendor.tier === 'premium') && (
                  <Link
                    href="/dashboard/analytics"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    <span>📊</span> Analytics
                  </Link>
                )}
                <Link
                  href="/auth/claim"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  <span>📋</span> Claim another listing
                </Link>
                <Link
                  href="/list-your-business"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  <span>📈</span> Upgrade plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
