import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase'
import type { Vendor } from '@/types/database'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Log the event
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('stripe_events') as any).insert({
    stripe_event_id: event.id,
    type: event.type,
    data: event.data,
    processed: false,
  })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const vendorId = session.metadata?.vendorId

        if (vendorId && session.subscription && session.customer) {
          // Determine tier from subscription
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const priceId = subscription.items.data[0]?.price.id

          const BASIC_PRICES = [
            process.env.STRIPE_PRICE_BASIC_MONTHLY,
            process.env.STRIPE_PRICE_BASIC_ANNUAL,
          ]
          const FEATURED_PRICES = [
            process.env.STRIPE_PRICE_FEATURED_MONTHLY,
            process.env.STRIPE_PRICE_FEATURED_ANNUAL,
          ]
          const PREMIUM_PRICES = [
            process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
            process.env.STRIPE_PRICE_PREMIUM_ANNUAL,
          ]

          const tier: Vendor['tier'] = PREMIUM_PRICES.includes(priceId)
            ? 'premium'
            : FEATURED_PRICES.includes(priceId)
            ? 'featured'
            : BASIC_PRICES.includes(priceId)
            ? 'basic'
            : 'free'

          // Auto-assign logo from logo.dev if vendor has a website but no logo yet
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: vendorData } = await (supabase.from('vendors') as any)
            .select('website, logo_url')
            .eq('id', vendorId)
            .single()

          const autoLogo = (!vendorData?.logo_url && vendorData?.website)
            ? (() => {
                try {
                  const domain = new URL(vendorData.website).hostname.replace(/^www\./, '')
                  return `https://img.logo.dev/${domain}?token=pk_GP7ffDQOShW1EB-MVph0fw&size=128`
                } catch { return null }
              })()
            : null

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from('vendors') as any)
            .update({
              tier,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              ...(autoLogo ? { logo_url: autoLogo } : {}),
            })
            .eq('id', vendorId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const priceId = subscription.items.data[0]?.price.id

        const BASIC_PRICES = [
          process.env.STRIPE_PRICE_BASIC_MONTHLY,
          process.env.STRIPE_PRICE_BASIC_ANNUAL,
        ]
        const FEATURED_PRICES = [
          process.env.STRIPE_PRICE_FEATURED_MONTHLY,
          process.env.STRIPE_PRICE_FEATURED_ANNUAL,
        ]
        const PREMIUM_PRICES = [
          process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
          process.env.STRIPE_PRICE_PREMIUM_ANNUAL,
        ]

        const tier: Vendor['tier'] = PREMIUM_PRICES.includes(priceId)
          ? 'premium'
          : FEATURED_PRICES.includes(priceId)
          ? 'featured'
          : BASIC_PRICES.includes(priceId)
          ? 'basic'
          : 'free'

        const isActive = subscription.status === 'active'

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('vendors') as any)
          .update({ tier: isActive ? tier : 'free' })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('vendors') as any)
          .update({ tier: 'free', stripe_subscription_id: null })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = (invoice as Stripe.Invoice & { subscription?: string }).subscription
        if (subId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from('vendors') as any)
            .update({ tier: 'free' })
            .eq('stripe_subscription_id', subId)
        }
        break
      }
    }

    // Mark event as processed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('stripe_events') as any)
      .update({ processed: true })
      .eq('stripe_event_id', event.id)

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook processing error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
