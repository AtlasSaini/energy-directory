import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase'
import type { Vendor } from '@/types/database'
import Stripe from 'stripe'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

          // Auto-send Stripe invoice for month 1 (Stripe handles renewals automatically)
          try {
            const subscription2 = await stripe.subscriptions.retrieve(session.subscription as string, {
              expand: ['latest_invoice'],
            })
            const latestInvoice = subscription2.latest_invoice as Stripe.Invoice | null
            if (latestInvoice?.id && latestInvoice.status === 'paid') {
              await stripe.invoices.sendInvoice(latestInvoice.id)
            }
          } catch (invoiceErr) {
            console.error('Failed to send Stripe invoice:', invoiceErr)
          }

          // Send confirmation email via Resend
          const customerEmail = session.customer_details?.email as string | undefined
          const customerName = (session.customer_details?.name as string | undefined) || 'there'
          const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1)
          const tierPrices: Record<string, string> = {
            basic: '$19/month',
            featured: '$49/month',
            premium: '$99/month',
          }
          const priceLabel = tierPrices[tier] || ''
          const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`

          if (customerEmail) {
            await resend.emails.send({
              from: 'Energy Directory <support@energydirectory.ca>',
              to: customerEmail,
              subject: `Your ${tierLabel} listing is now live — Energy Directory`,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
                  <div style="background: #0f172a; padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Energy Directory</h1>
                    <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">Canada's Energy Sector Vendor Directory</p>
                  </div>
                  <div style="background: #ffffff; padding: 40px 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
                    <h2 style="margin: 0 0 16px; font-size: 20px;">You're live, ${customerName}! 🎉</h2>
                    <p style="color: #475569; line-height: 1.6; margin: 0 0 24px;">
                      Your <strong>${tierLabel} listing</strong> on Energy Directory is now active. You're now visible to thousands of buyers and procurement teams across Canada's energy sector.
                    </p>
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin: 0 0 28px;">
                      <p style="margin: 0 0 8px; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Your plan</p>
                      <p style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a;">${tierLabel} — ${priceLabel}</p>
                    </div>
                    <a href="${dashboardUrl}" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 15px; margin: 0 0 28px;">
                      View Your Dashboard →
                    </a>
                    <p style="color: #94a3b8; font-size: 13px; margin: 24px 0 0; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                      Questions? Reply to this email or visit <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #0f172a;">energydirectory.ca</a>
                    </p>
                  </div>
                </div>
              `,
            }).catch((err: Error) => console.error('Resend email error:', err))
          }
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
