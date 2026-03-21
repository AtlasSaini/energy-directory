// Client-safe plan definitions — no Stripe SDK import
// Used by client components (list-your-business, pricing cards, etc.)

export const PLANS = {
  free: {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    features: [
      'Unclaimed listing visible in directory',
      'Company name & description',
      'Province & category tags',
    ],
    cta: 'Claim for Free',
    highlighted: false,
  },
  basic: {
    name: 'Basic',
    price: { monthly: 19, annual: 190 },
    features: [
      'Claim & manage your listing',
      'Verified badge',
      'Receive up to 10 inquiries/month',
      'Website & contact links',
      'Province & category tags',
    ],
    cta: 'Get Basic',
    highlighted: false,
  },
  featured: {
    name: 'Featured',
    price: { monthly: 49, annual: 490 },
    features: [
      'Everything in Basic',
      'Priority placement in search',
      'Unlimited inquiries',
      'Logo & banner image',
      'Analytics dashboard',
      'Featured in category listings',
    ],
    cta: 'Get Featured',
    highlighted: true,
  },
  premium: {
    name: 'Premium',
    price: { monthly: 99, annual: 990 },
    features: [
      'Everything in Featured',
      'Homepage featured placement',
      'Top of category results',
      'Leads export (CSV)',
      'Priority support',
    ],
    cta: 'Go Premium',
    highlighted: false,
  },
}

export type PlanKey = keyof typeof PLANS
