'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

interface RFQLead {
  id: string
  vendor_id: string
  buyer_name: string
  buyer_company: string | null
  buyer_email: string
  buyer_phone: string | null
  service_description: string
  province: string | null
  timeline: string | null
  message: string | null
  status: string
  created_at: string
}

interface Vendor {
  id: string
  company_name: string
  tier: string
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-amber-100 text-amber-700 border-amber-200',
  viewed: 'bg-blue-100 text-blue-700 border-blue-200',
  responded: 'bg-green-100 text-green-700 border-green-200',
}

const STATUS_LABELS: Record<string, string> = {
  new: '● New',
  viewed: '◎ Viewed',
  responded: '✓ Responded',
}

const PROVINCE_LABELS: Record<string, string> = {
  AB: 'Alberta', BC: 'British Columbia', SK: 'Saskatchewan', MB: 'Manitoba',
  ON: 'Ontario', QC: 'Quebec', NS: 'Nova Scotia', NB: 'New Brunswick',
  PE: 'PEI', NL: 'Newfoundland', YT: 'Yukon', NT: 'Northwest Territories', NU: 'Nunavut',
}

export default function LeadsPage() {
  const router = useRouter()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [leads, setLeads] = useState<RFQLead[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    // Get vendor
    const { data: vendorData } = await supabase
      .from('vendors')
      .select('id, company_name, tier')
      .eq('user_id', user.id)
      .single()

    if (!vendorData) {
      router.push('/auth/claim')
      return
    }

    setVendor(vendorData as Vendor)

    // Get RFQ leads for this vendor
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: leadsData } = await (supabase as any)
      .from('rfq_requests')
      .select('*')
      .eq('vendor_id', vendorData.id)
      .order('created_at', { ascending: false })

    setLeads((leadsData || []) as RFQLead[])
    setLoading(false)
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleLeadClick(lead: RFQLead) {
    const supabase = createClient()

    if (expandedId === lead.id) {
      setExpandedId(null)
      return
    }

    setExpandedId(lead.id)

    // Mark as viewed if new
    if (lead.status === 'new') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('rfq_requests')
        .update({ status: 'viewed' })
        .eq('id', lead.id)

      setLeads((prev) =>
        prev.map((l) => l.id === lead.id ? { ...l, status: 'viewed' } : l)
      )
    }
  }

  async function markResponded(leadId: string, e: React.MouseEvent) {
    e.stopPropagation()
    const supabase = createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('rfq_requests')
      .update({ status: 'responded' })
      .eq('id', leadId)

    setLeads((prev) =>
      prev.map((l) => l.id === leadId ? { ...l, status: 'responded' } : l)
    )
  }

  const isPremium = vendor?.tier === 'premium' || vendor?.tier === 'featured'
  const newCount = leads.filter((l) => l.status === 'new').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading leads…</div>
      </div>
    )
  }

  if (!vendor) return null

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
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/dashboard/leads" className="text-amber-400 font-medium">Leads</Link>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              RFQ Leads
              {newCount > 0 && (
                <span className="bg-amber-500 text-[#0a1628] text-xs font-bold px-2.5 py-1 rounded-full">
                  {newCount} new
                </span>
              )}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Buyers who submitted a Request for Quote to {vendor.company_name}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Premium upsell banner for non-premium */}
        {!isPremium && leads.length > 0 && (
          <div className="bg-gradient-to-r from-[#0a1628] to-[#1a3a6b] text-white rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-semibold text-sm">Upgrade to Featured for full lead details</p>
                <p className="text-gray-300 text-xs mt-0.5">See buyer email, phone, and full message. Respond directly.</p>
              </div>
            </div>
            <Link
              href="/list-your-business"
              className="flex-shrink-0 bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Upgrade →
            </Link>
          </div>
        )}

        {/* Leads list */}
        {leads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">No leads yet</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Your listing is live and getting discovered. When buyers send an RFQ, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className={`bg-white rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                  expandedId === lead.id ? 'border-amber-300 shadow-sm' : 'border-gray-200'
                }`}
                onClick={() => handleLeadClick(lead)}
              >
                {/* Lead card header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {lead.buyer_name}
                          {lead.buyer_company && (
                            <span className="text-gray-500 font-normal"> · {lead.buyer_company}</span>
                          )}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[lead.status] || STATUS_STYLES.new}`}>
                          {STATUS_LABELS[lead.status] || lead.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {lead.service_description.slice(0, 100)}{lead.service_description.length > 100 ? '…' : ''}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                        {lead.province && (
                          <span>{PROVINCE_LABELS[lead.province] || lead.province}</span>
                        )}
                        {lead.timeline && (
                          <span>Timeline: {lead.timeline}</span>
                        )}
                        <span>{new Date(lead.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${expandedId === lead.id ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded details */}
                {expandedId === lead.id && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50 rounded-b-xl">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Service Request</p>
                        <p className="text-gray-800 text-sm leading-relaxed">{lead.service_description}</p>
                      </div>

                      {lead.message && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Additional Message</p>
                          <p className="text-gray-800 text-sm leading-relaxed">{lead.message}</p>
                        </div>
                      )}

                      {/* Contact details — gated for non-premium */}
                      {isPremium ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</p>
                            <a
                              href={`mailto:${lead.buyer_email}?subject=Re: Your RFQ to ${vendor.company_name}`}
                              className="text-amber-600 hover:text-amber-500 text-sm font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {lead.buyer_email}
                            </a>
                          </div>
                          {lead.buyer_phone && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                              <a
                                href={`tel:${lead.buyer_phone}`}
                                className="text-gray-800 hover:text-gray-600 text-sm font-medium"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {lead.buyer_phone}
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-amber-800 text-sm font-medium mb-1">
                            🔒 Upgrade to Premium to see full contact details
                          </p>
                          <p className="text-amber-700 text-xs">
                            Email: {lead.buyer_email.replace(/(.{2}).*(@.*)/, '$1***$2')}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-1">
                        {isPremium && (
                          <a
                            href={`mailto:${lead.buyer_email}?subject=Re: Your RFQ to ${vendor.company_name}&body=Hi ${lead.buyer_name},%0A%0AThank you for your request. I'd be happy to discuss your needs further.%0A%0ABest regards,%0A${vendor.company_name}`}
                            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Reply via Email
                          </a>
                        )}
                        {lead.status !== 'responded' && (
                          <button
                            onClick={(e) => markResponded(lead.id, e)}
                            className="inline-flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
                          >
                            Mark as Responded
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
