import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

/**
 * Extracts the registrable domain from a URL or plain domain string.
 * e.g. "https://www.acme-energy.com/about" → "acme-energy.com"
 */
function extractWebsiteDomain(raw: string): string {
  try {
    const withProto = raw.startsWith('http') ? raw : `https://${raw}`
    const hostname = new URL(withProto).hostname.toLowerCase()
    // Strip www. prefix
    return hostname.replace(/^www\./, '')
  } catch {
    return raw.toLowerCase().replace(/^www\./, '')
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { vendorId, domainMatch } = await request.json()

    if (!vendorId) {
      return NextResponse.json({ error: 'Missing vendorId' }, { status: 400 })
    }

    // Verify vendor exists and is not already claimed by someone else
    const admin = createAdminClient()
    const { data: vendor, error: fetchError } = await admin
      .from('vendors')
      .select('id, user_id, company_name, website')
      .eq('id', vendorId)
      .single()

    if (fetchError || !vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    if (vendor.user_id && vendor.user_id !== user.id) {
      return NextResponse.json(
        { error: 'This listing has already been claimed by another account' },
        { status: 409 }
      )
    }

    // ----------------------------------------------------------------
    // Determine whether this claim earns automatic verification.
    //
    // Requirements (ALL must be true):
    //   1. User's email is verified in Supabase Auth
    //   2. The claim was initiated via auto domain-match (domainMatch === true)
    //   3. Server-side re-validation: user's email domain matches vendor's website domain
    // ----------------------------------------------------------------
    let setVerified = false

    const emailVerified = !!(user.email_confirmed_at ?? user.confirmed_at)
    const userEmailDomain = user.email?.split('@')[1]?.toLowerCase() ?? ''
    const vendorWebsiteDomain = vendor.website
      ? extractWebsiteDomain(vendor.website)
      : ''

    if (
      domainMatch === true &&
      emailVerified &&
      userEmailDomain &&
      vendorWebsiteDomain &&
      vendorWebsiteDomain.endsWith(userEmailDomain)
    ) {
      setVerified = true
    }

    // Build the update payload
    const updatePayload: Record<string, unknown> = {
      user_id: user.id,
      updated_at: new Date().toISOString(),
    }

    if (setVerified) {
      updatePayload.verified = true
    }

    const { error: updateError } = await admin
      .from('vendors')
      .update(updatePayload)
      .eq('id', vendorId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      companyName: vendor.company_name,
      verified: setVerified,
    })
  } catch (err) {
    console.error('Claim error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
