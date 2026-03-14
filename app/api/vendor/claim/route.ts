import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { vendorId } = await request.json()

    if (!vendorId) {
      return NextResponse.json({ error: 'Missing vendorId' }, { status: 400 })
    }

    // Verify vendor exists and is not already claimed
    const admin = createAdminClient()
    const { data: vendor, error: fetchError } = await admin
      .from('vendors')
      .select('id, user_id, company_name')
      .eq('id', vendorId)
      .single()

    if (fetchError || !vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    if (vendor.user_id && vendor.user_id !== user.id) {
      return NextResponse.json(
        { error: 'This listing has already been claimed' },
        { status: 409 }
      )
    }

    // Claim it
    const { error: updateError } = await admin
      .from('vendors')
      .update({ user_id: user.id, updated_at: new Date().toISOString() })
      .eq('id', vendorId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, companyName: vendor.company_name })
  } catch (err) {
    console.error('Claim error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
