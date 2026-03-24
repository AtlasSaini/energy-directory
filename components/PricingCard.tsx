'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

interface PricingPlan {
  name: string
  planKey?: string
  price: { monthly: number; annual: number }
  features: string[]
  cta: string
  highlighted: boolean
}

interface PricingCardProps {
  plan: PricingPlan
  billing: 'monthly' | 'annual'
}

export default function PricingCard({ plan, billing }: PricingCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const price = plan.price[billing]
  const annualMonthly = billing === 'annual' && price > 0 ? Math.round(price / 12) : null

  const handleClick = async () => {
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Free plan
    if (price === 0 || !plan.planKey) {
      if (user) {
        // Already logged in — go to claim or dashboard
        const { data: vendor } = await supabase
          .from('vendors')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()
        router.push(vendor ? '/dashboard' : '/auth/claim')
      } else {
        router.push('/auth/signup')
      }
      return
    }

    // Paid plan — already fetched user above

    if (!user) {
      // Redirect to signup with plan params so we can resume after auth
      router.push(`/auth/signup?next=/list-your-business&plan=${plan.planKey}&billing=${billing}`)
      return
    }

    // Get the user's vendor ID to pass to checkout
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)
      .single()

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.planKey, billing, vendorId: vendor?.id || '' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Connection error. Please try again.')
      console.error('Checkout error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`relative rounded-2xl border-2 p-8 flex flex-col h-full transition-all ${
      plan.highlighted
        ? 'border-amber-400 bg-[#0a1628] text-white shadow-xl scale-105'
        : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:shadow-md'
    }`}>
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-amber-500 text-[#0a1628] font-bold text-xs px-4 py-1.5 rounded-full whitespace-nowrap">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-[#0a1628]'}`}>
          {plan.name}
        </h3>
        <div className="flex items-end gap-1">
          {price === 0 ? (
            <span className={`text-4xl font-extrabold ${plan.highlighted ? 'text-white' : 'text-[#0a1628]'}`}>
              Free
            </span>
          ) : (
            <>
              <span className={`text-4xl font-extrabold ${plan.highlighted ? 'text-amber-400' : 'text-[#0a1628]'}`}>
                ${annualMonthly ?? price}
              </span>
              <span className={`text-sm mb-1.5 ${plan.highlighted ? 'text-gray-300' : 'text-gray-500'}`}>
                /mo{billing === 'annual' && <span className="ml-1 text-xs">(billed annually)</span>}
              </span>
            </>
          )}
        </div>
        {billing === 'annual' && price > 0 && (
          <p className={`text-sm mt-1 ${plan.highlighted ? 'text-amber-300' : 'text-green-600'}`}>
            Save ${plan.price.monthly * 12 - price}/year
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-amber-400' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className={plan.highlighted ? 'text-gray-200' : 'text-gray-600'}>{feature}</span>
          </li>
        ))}
      </ul>

      {error && (
        <p className={`text-xs mb-3 text-center ${plan.highlighted ? 'text-red-300' : 'text-red-500'}`}>
          {error}
        </p>
      )}

      <button
        onClick={handleClick}
        disabled={loading}
        className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 ${
          plan.highlighted
            ? 'bg-amber-500 hover:bg-amber-400 text-[#0a1628]'
            : 'bg-[#0a1628] hover:bg-[#0d1f3c] text-white'
        }`}
      >
        {loading ? 'Loading...' : plan.cta}
      </button>
    </div>
  )
}
