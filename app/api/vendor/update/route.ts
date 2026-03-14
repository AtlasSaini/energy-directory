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

    const body = await request.json()
    const { description, website, phone, city, province } = body

    // Ensure the vendor belongs to this user
    const admin = createAdminClient()
    const { data: vendor, error: fetchError } = await admin
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (fetchError || !vendor) {
      return NextResponse.json(
        { error: 'No claimed listing found for this account' },
        { status: 404 }
      )
    }

    const { error: updateError } = await admin
      .from('vendors')
      .update({
        description,
        website,
        phone,
        city,
        province,
        updated_at: new Date().toISOString(),
      })
      .eq('id', vendor.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Update error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
