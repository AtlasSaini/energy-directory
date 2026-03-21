import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-server'

interface RFQPayload {
  vendorIds: string[]
  buyerName: string
  buyerCompany?: string
  buyerEmail: string
  buyerPhone?: string
  serviceDescription: string
  province?: string
  timeline?: string
  message?: string
}

// Monthly inquiry limits by tier
const INQUIRY_LIMITS: Record<string, number> = {
  free: 5,
  basic: 10,
  featured: Infinity,
  premium: Infinity,
}

export async function POST(req: NextRequest) {
  try {
    const body: RFQPayload = await req.json()

    const {
      vendorIds,
      buyerName,
      buyerCompany,
      buyerEmail,
      buyerPhone,
      serviceDescription,
      province,
      timeline,
      message,
    } = body

    // Validate required fields
    if (!vendorIds || !Array.isArray(vendorIds) || vendorIds.length === 0) {
      return NextResponse.json({ error: 'At least one vendor must be selected' }, { status: 400 })
    }
    if (!buyerName || !buyerName.trim()) {
      return NextResponse.json({ error: 'Your name is required' }, { status: 400 })
    }
    if (!buyerEmail || !buyerEmail.trim()) {
      return NextResponse.json({ error: 'Your email is required' }, { status: 400 })
    }
    if (!serviceDescription || !serviceDescription.trim()) {
      return NextResponse.json({ error: 'Service description is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(buyerEmail.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const authClient = await createClient()
    const { data: { user } } = await authClient.auth.getUser()

    // Anonymous users must sign up to send inquiries
    if (!user) {
      return NextResponse.json(
        { error: 'Please create a free account to send inquiries.', code: 'auth_required' },
        { status: 401 }
      )
    }

    // Get the buyer's vendor profile to check their tier
    const { data: buyerVendor } = await supabase
      .from('vendors')
      .select('tier, subscription_status')
      .eq('user_id', user.id)
      .single()

    const tier = buyerVendor?.tier ?? 'free'
    const limit = INQUIRY_LIMITS[tier] ?? 5

    if (limit !== Infinity) {
      // Count inquiries sent this month
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count } = await supabase
        .from('rfq_requests')
        .select('id', { count: 'exact', head: true })
        .eq('buyer_email', buyerEmail.trim().toLowerCase())
        .gte('created_at', startOfMonth.toISOString())

      const used = count ?? 0

      if (used >= limit) {
        const tierLabel = tier === 'free' ? 'Free' : tier.charAt(0).toUpperCase() + tier.slice(1)
        const upgradeMsg = tier === 'free' || tier === 'basic'
          ? ' Upgrade to send more.'
          : ''
        return NextResponse.json(
          {
            error: `You've reached your ${tierLabel} plan limit of ${limit} inquiries this month.${upgradeMsg}`,
            code: 'limit_reached',
            limit,
            used,
            tier,
          },
          { status: 429 }
        )
      }
    }

    // Limit to 10 vendors per submission
    const limitedVendorIds = vendorIds.slice(0, 10)

    // Insert one RFQ row per vendor
    const rows = limitedVendorIds.map((vendorId) => ({
      vendor_id: vendorId,
      buyer_name: buyerName.trim(),
      buyer_company: buyerCompany?.trim() || null,
      buyer_email: buyerEmail.trim().toLowerCase(),
      buyer_phone: buyerPhone?.trim() || null,
      service_description: serviceDescription.trim(),
      province: province || null,
      timeline: timeline || null,
      message: message?.trim() || null,
      status: 'new',
    }))

    const { error } = await supabase.from('rfq_requests').insert(rows)

    if (error) {
      console.error('RFQ insert error:', error)
      return NextResponse.json({ error: 'Failed to submit request. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: rows.length })
  } catch (err) {
    console.error('RFQ route error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
