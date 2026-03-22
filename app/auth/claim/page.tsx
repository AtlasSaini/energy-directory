'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { extractDomain, isFreeEmailDomain } from '@/lib/free-email-domains'

type Vendor = {
  id: string
  company_name: string
  slug: string
  city: string | null
  province: string | null
  website: string | null
  tier: string
  user_id: string | null
}

export default function ClaimPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [autoMatches, setAutoMatches] = useState<Vendor[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Vendor[]>([])
  const [searching, setSearching] = useState(false)
  const [claiming, setClaiming] = useState<string | null>(null)
  const [claimError, setClaimError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const supabase = createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      router.push('/auth/login')
      return
    }
    setUser({ id: authUser.id, email: authUser.email ?? '' })

    // Auto-match by domain (skip free/personal email providers — they'd false-match vendor websites)
    const domain = extractDomain(authUser.email ?? '')
    if (domain && !isFreeEmailDomain(authUser.email ?? '')) {
      const { data: matches } = await supabase
        .from('vendors')
        .select('id, company_name, slug, city, province, website, tier, user_id')
        .is('user_id', null)
        .ilike('website', `%${domain}%`)
        .limit(5)

      if (matches && matches.length > 0) {
        setAutoMatches(matches as Vendor[])
      }
    }

    setLoading(false)
  }, [router])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    setSearchResults([])

    const supabase = createClient()
    const { data } = await supabase
      .from('vendors')
      .select('id, company_name, slug, city, province, website, tier, user_id')
      .ilike('company_name', `%${searchQuery.trim()}%`)
      .is('user_id', null)
      .limit(10)

    setSearchResults((data as Vendor[]) ?? [])
    setSearching(false)
  }

  async function handleClaim(vendorId: string, domainMatch: boolean) {
    setClaiming(vendorId)
    setClaimError('')

    const res = await fetch('/api/vendor/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorId, domainMatch }),
    })

    const data = await res.json()

    if (!res.ok) {
      setClaimError(data.error ?? 'Failed to claim listing')
      setClaiming(null)
      return
    }

    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading…</div>
      </div>
    )
  }

  const tierBadge = (tier: string) => {
    const map: Record<string, string> = {
      premium: 'bg-purple-100 text-purple-700',
      featured: 'bg-amber-100 text-amber-700',
      free: 'bg-gray-100 text-gray-600',
    }
    return map[tier] ?? map.free
  }

  const VendorRow = ({ vendor, isDomainMatch }: { vendor: Vendor; isDomainMatch: boolean }) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors">
      <div>
        <p className="font-semibold text-gray-900">{vendor.company_name}</p>
        <p className="text-sm text-gray-500">
          {[vendor.city, vendor.province].filter(Boolean).join(', ') || 'Location not set'}
          {vendor.website && (
            <span className="ml-2 text-xs text-gray-400">{vendor.website}</span>
          )}
        </p>
        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${tierBadge(vendor.tier)}`}>
          {vendor.tier}
        </span>
        {isDomainMatch && (
          <span className="inline-block mt-1 ml-2 text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">
            ✓ Domain match — will be verified
          </span>
        )}
      </div>
      <button
        onClick={() => handleClaim(vendor.id, isDomainMatch)}
        disabled={claiming === vendor.id}
        className="ml-4 shrink-0 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-[#0a1628] font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
      >
        {claiming === vendor.id ? 'Claiming…' : 'Claim It'}
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-[#0a1628] font-bold text-sm">⚡</span>
            </div>
            <span className="font-bold text-lg text-[#0a1628]">
              Energy<span className="text-amber-500">Directory</span>.ca
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Claim Your Listing</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Signed in as <span className="font-medium">{user?.email}</span>
          </p>
        </div>

        {claimError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {claimError}
          </div>
        )}

        {/* Auto-matches */}
        {autoMatches.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-semibold text-gray-900">
                We found {autoMatches.length === 1 ? 'a match' : 'matches'} for your domain
              </h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Is one of these your company? Click &quot;Claim It&quot; to take ownership of the listing.
            </p>
            <div className="space-y-3">
              {autoMatches.map((v) => (
                <VendorRow key={v.id} vendor={v} isDomainMatch={true} />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Not your company?</p>
            </div>
          </div>
        )}

        {/* Manual search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-1">
            {autoMatches.length > 0 ? 'Search for a different company' : 'Search for your company'}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Search by company name to find and claim your listing.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company name…"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
            />
            <button
              type="submit"
              disabled={searching}
              className="bg-[#0a1628] hover:bg-[#0d1f35] text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {searching ? 'Searching…' : 'Search'}
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="space-y-3">
              {searchResults.map((v) => (
                <VendorRow key={v.id} vendor={v} isDomainMatch={false} />
              ))}
            </div>
          )}

          {searchResults.length === 0 && searchQuery && !searching && (
            <p className="text-sm text-gray-500 text-center py-4">
              No unclaimed listings found for &quot;{searchQuery}&quot;.{' '}
              <Link href="/list-your-business" className="text-amber-600 hover:underline">
                Add your business
              </Link>{' '}
              instead.
            </p>
          )}
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already claimed?{' '}
          <Link href="/dashboard" className="text-amber-600 hover:underline">
            Go to dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}
