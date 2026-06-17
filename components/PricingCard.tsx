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

    if (!user) {
      router.push(`/auth/signup?next=/list-your-business&plan=${plan.planKey}&billing=${billing}`)
      return
    }

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
        ? 'border-[#E8590C] bg-[#1D1D1F] text-white shadow-xl scale-105'
        : 'border-[#E8E8ED] bg-white text-[#1D1D1F] hover:border-[#E8590C]/40 hover:shadow-md'
    }`}>
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-[#E8590C] text-white font-bold text-xs px-4 py-1.5 rounded-full whitespace-nowrap">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-[#1D1D1F]'}`}>
          {plan.name}
        </h3>
        <div className="flex items-end gap-1">
          {price === 0 ? (
            <span className={`text-4xl font-extrabold ${plan.highlighted ? 'text-white' : 'text-[#1D1D1F]'}`}>
              Free
            </span>
          ) : (
            <>
              <span className={`text-4xl font-extrabold ${plan.highlighted ? 'text-[#E8590C]' : 'text-[#1D1D1F]'}`}>
                ${annualMonthly ?? price}
              </span>
              <span className={`text-sm mb-1.5 ${plan.highlighted ? 'text-[#6E6E73]' : 'text-[#6E6E73]'}`}>
                /mo{billing === 'annual' && <span className="ml-1 text-xs">(billed annually)</span>}
              </span>
            </>
          )}
        </div>
        {billing === 'annual' && price > 0 && (
          <p className={`text-sm mt-1 ${plan.highlighted ? 'text-[#E8590C]/80' : 'text-[#E8590C]'}`}>
            Save ${plan.price.monthly * 12 - price}/year
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-[#E8590C]' : 'text-[#E8590C]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className={plan.highlighted ? 'text-[#E8E8ED]' : 'text-[#6E6E73]'}>{feature}</span>
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
            ? 'bg-[#E8590C] hover:bg-[#CC4A08] text-white'
            : 'bg-[#1D1D1F] hover:bg-[#2a2a2f] text-white'
        }`}
      >
        {loading ? 'Loading...' : plan.cta}
      </button>
    </div>
  )
}