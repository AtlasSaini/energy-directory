'use client'

import { useState } from 'react'
import PricingCard from '@/components/PricingCard'
import { PLANS } from '@/lib/plans'

const FAQS = [
  {
    q: 'How long does it take to get listed?',
    a: 'Your business is likely already in our directory. Search for it and claim your listing in minutes. Once claimed and verified, your listing goes live immediately.',
  },
  {
    q: 'Can I upgrade or downgrade later?',
    a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
  },
  {
    q: 'What categories can I list in?',
    a: 'We have 35 categories across energy and mining — including Oil & Gas, Renewables, Solar & Wind, Battery Storage, Carbon & ESG, Power Generation, LNG, Oilsands, Gold Mining, Copper & Base Metals, Uranium, Potash, Lithium & Battery Metals, Mining Services, and more.',
  },
  {
    q: 'Is there a contract?',
    a: 'No long-term contracts. Monthly plans are billed month-to-month. Annual plans save you ~17% vs monthly.',
  },
  {
    q: 'How do I receive inquiries?',
    a: 'Inquiries are sent directly to your email and stored in your vendor dashboard. Basic plans receive up to 10 inquiries/month. Featured plans receive unlimited inquiries.',
  },
  {
    q: 'What is the verified badge?',
    a: 'The verified badge confirms your company email domain matches your listed website. It builds buyer trust and is included with all paid plans.',
  },
]

export default function ListYourBusinessPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const plans = Object.values(PLANS)

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
            Get discovered by buyers, project managers, and operators across Canada&apos;s full energy sector — Oil &amp; Gas, Renewables, Carbon &amp; ESG, Power Generation, Oilsands, Geothermal, LNG, and more. Start free — upgrade when you&apos;re ready.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#0a1628] mb-4">Choose Your Plan</h2>

            {/* Billing toggle */}
            <div className="inline-flex items-center bg-gray-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-white text-[#0a1628] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('annual')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${billing === 'annual' ? 'bg-white text-[#0a1628] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Annual
                <span className="ml-1.5 bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full">Save 17%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch py-6">
            {plans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} billing={billing} />
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-6 font-medium">
            All prices in CAD. 5% GST will be added at checkout.
          </p>
          <p className="text-center text-gray-400 text-xs mt-1">
            GST# 738605831 RT0001
          </p>
          <p className="text-center text-gray-400 text-sm mt-4">
            Cancel anytime. Questions? Email{' '}
            <a href="mailto:support@energydirectory.ca" className="text-amber-600 hover:text-amber-500">
              support@energydirectory.ca
            </a>
          </p>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-12 px-4 bg-white border-y border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-2">ðŸ‡¨ðŸ‡¦</div>
              <h3 className="font-semibold text-[#0a1628] mb-1">Canada-Focused</h3>
              <p className="text-gray-500 text-sm">Built specifically for the Canadian energy market. All 13 provinces and territories.</p>
            </div>
            <div>
              <div className="text-3xl mb-2">âœ…</div>
              <h3 className="font-semibold text-[#0a1628] mb-1">Verified Listings</h3>
              <p className="text-gray-500 text-sm">Every listing is reviewed for accuracy. Buyers trust our directory.</p>
            </div>
            <div>
              <div className="text-3xl mb-2">ðŸ“ˆ</div>
              <h3 className="font-semibold text-[#0a1628] mb-1">Real Leads</h3>
              <p className="text-gray-500 text-sm">Connect with decision-makers actively seeking energy services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0a1628] text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                >
                  <span className="font-medium text-[#0a1628] text-sm">{faq.q}</span>
                  <span className="text-gray-400 flex-shrink-0">{openFaq === i ? 'âˆ’' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

