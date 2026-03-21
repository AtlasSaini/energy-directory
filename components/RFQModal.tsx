'use client'

import { useState, useEffect } from 'react'

interface Vendor {
  id: string
  company_name: string
  slug: string
}

interface RFQModalProps {
  vendors: Vendor[]
  onClose: () => void
}

const PROVINCES = [
  { value: '', label: 'All Provinces' },
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'ON', label: 'Ontario' },
  { value: 'QC', label: 'Quebec' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'PE', label: 'PEI' },
  { value: 'NL', label: 'Newfoundland' },
  { value: 'YT', label: 'Yukon' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
]

const TIMELINES = [
  { value: '', label: 'Select timeline' },
  { value: 'ASAP', label: 'ASAP' },
  { value: 'Within 1 month', label: 'Within 1 month' },
  { value: '1-3 months', label: '1–3 months' },
  { value: '3-6 months', label: '3–6 months' },
  { value: '6+ months', label: '6+ months' },
]

export default function RFQModal({ vendors, onClose }: RFQModalProps) {
  const [form, setForm] = useState({
    buyerName: '',
    buyerCompany: '',
    buyerEmail: '',
    buyerPhone: '',
    serviceDescription: '',
    province: '',
    timeline: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [authRequired, setAuthRequired] = useState(false)
  const [limitReached, setLimitReached] = useState<{limit: number; tier: string} | null>(null)

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Auto-close after success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/rfq/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorIds: vendors.map((v) => v.id),
          buyerName: form.buyerName,
          buyerCompany: form.buyerCompany || undefined,
          buyerEmail: form.buyerEmail,
          buyerPhone: form.buyerPhone || undefined,
          serviceDescription: form.serviceDescription,
          province: form.province || undefined,
          timeline: form.timeline || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.code === 'auth_required') {
          setAuthRequired(true)
          return
        }
        if (data.code === 'limit_reached') {
          setLimitReached({ limit: data.limit, tier: data.tier })
          return
        }
        setError(data.error || 'Failed to submit. Please try again.')
        return
      }

      setSuccess(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#0a1628] text-white px-6 py-5 rounded-t-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Send an Inquiry</h2>
              <p className="text-gray-300 text-sm mt-0.5">
                Sending to {vendors.length} vendor{vendors.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors mt-0.5 flex-shrink-0"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Vendor pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {vendors.map((v) => (
              <span
                key={v.id}
                className="bg-white/10 text-white text-xs px-2.5 py-1 rounded-full border border-white/20"
              >
                {v.company_name}
              </span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0a1628] mb-2">Request Sent!</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                ✓ Your request has been sent to{' '}
                <strong>{vendors.length} vendor{vendors.length !== 1 ? 's' : ''}</strong>.
                Expect to hear back within 1–2 business days.
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
              >
                Close
              </button>
            </div>
          ) : authRequired ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0a1628] mb-2">Create a Free Account</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                A free account is required to send inquiries. It takes less than a minute.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/auth/signup"
                  className="bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm text-center"
                >
                  Create Free Account
                </a>
                <a
                  href="/auth/login"
                  className="border border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition-colors text-sm text-center"
                >
                  Sign In
                </a>
              </div>
            </div>
          ) : limitReached ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0a1628] mb-2">Monthly Limit Reached</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                You've used all {limitReached.limit} inquiries on your {limitReached.tier} plan this month.
                {limitReached.tier !== 'featured' && limitReached.tier !== 'premium' && (
                  <> Upgrade to send more.</>
                )}
              </p>
              {limitReached.tier !== 'featured' && limitReached.tier !== 'premium' && (
                <a
                  href="/list-your-business"
                  className="bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm inline-block"
                >
                  View Plans
                </a>
              )}
              <button onClick={onClose} className="mt-3 block mx-auto text-sm text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.buyerName}
                    onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
                    placeholder="Jane Smith"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={form.buyerCompany}
                    onChange={(e) => setForm({ ...form, buyerCompany: e.target.value })}
                    placeholder="Acme Corp (optional)"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.buyerEmail}
                    onChange={(e) => setForm({ ...form, buyerEmail: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.buyerPhone}
                    onChange={(e) => setForm({ ...form, buyerPhone: e.target.value })}
                    placeholder="+1 (403) 555-0100"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What do you need? <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={form.serviceDescription}
                  onChange={(e) => setForm({ ...form, serviceDescription: e.target.value })}
                  rows={4}
                  placeholder="Describe the service or product you're looking for..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Where is the work needed? <span className="text-gray-400 font-normal">(Province)</span></label>
                  <select
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm bg-white"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                  <select
                    value={form.timeline}
                    onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm bg-white"
                  >
                    {TIMELINES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-[#0a1628] font-bold py-3 rounded-lg transition-colors text-sm mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending…
                  </span>
                ) : (
                  `Send Request to ${vendors.length} Vendor${vendors.length !== 1 ? 's' : ''}`
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Your contact info is shared only with the vendors you select. No spam.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
