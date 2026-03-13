import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
})

export const STRIPE_PRICES = {
  featured: {
    monthly: process.env.STRIPE_PRICE_FEATURED_MONTHLY!,
    annual: process.env.STRIPE_PRICE_FEATURED_ANNUAL!,
  },
  premium: {
    monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY!,
    annual: process.env.STRIPE_PRICE_PREMIUM_ANNUAL!,
  },
}

export const PLANS = {
  free: {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    features: [
      'Basic directory listing',
      'Company name & description',
      'Province & category tags',
      'Contact form leads',
    ],
    cta: 'List for Free',
    highlighted: false,
  },
  featured: {
    name: 'Featured',
    price: { monthly: 29, annual: 290 },
    features: [
      'Everything in Free',
      'Featured placement in search',
      'Logo & banner image',
      'Up to 5 photos',
      'Website & social links',
      'Priority in category listings',
    ],
    cta: 'Get Featured',
    highlighted: true,
    priceId: STRIPE_PRICES.featured,
  },
  premium: {
    name: 'Premium',
    price: { monthly: 79, annual: 790 },
    features: [
      'Everything in Featured',
      'Top of all search results',
      'Verified badge',
      'Unlimited photos',
      'Video embed',
      'Analytics dashboard',
      'Dedicated account manager',
    ],
    cta: 'Go Premium',
    highlighted: false,
    priceId: STRIPE_PRICES.premium,
  },
}
