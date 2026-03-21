import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

const PRICE_MAP: Record<string, { monthly: string; annual: string }> = {
  basic: {
    monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY || '',
    annual: process.env.STRIPE_PRICE_BASIC_ANNUAL || '',
  },
  featured: {
    monthly: process.env.STRIPE_PRICE_FEATURED_MONTHLY || '',
    annual: process.env.STRIPE_PRICE_FEATURED_ANNUAL || '',
  },
  premium: {
    monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || '',
    annual: process.env.STRIPE_PRICE_PREMIUM_ANNUAL || '',
  },
}

export async function POST(req: NextRequest) {
  try {
    const { priceId: rawPriceId, plan, billing, vendorId } = await req.json()

    // Support both legacy priceId and new plan+billing approach
    let priceId = rawPriceId
    if (!priceId && plan && billing) {
      priceId = PRICE_MAP[plan]?.[billing]
    }

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID required' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://energydirectory.ca'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/list-your-business?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/list-your-business?canceled=1`,
      metadata: {
        vendorId: vendorId || '',
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    const message = err instanceof Error ? err.message : 'Failed to create checkout session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
