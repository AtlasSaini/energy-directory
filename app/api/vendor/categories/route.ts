import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { categoryIds } = await request.json()

    if (!Array.isArray(categoryIds) || categoryIds.length === 0 || categoryIds.length > 2) {
      return NextResponse.json({ error: 'Select 1 or 2 categories' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Verify vendor belongs to this user
    const { data: vendor, error: fetchError } = await admin
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (fetchError || !vendor) {
      return NextResponse.json({ error: 'No claimed listing found' }, { status: 404 })
    }

    // Delete existing category links
    await admin.from('vendor_categories').delete().eq('vendor_id', vendor.id)

    // Insert new ones
    const inserts = categoryIds.map((cid: string) => ({
      vendor_id: vendor.id,
      category_id: cid,
    }))

    const { error: insertError } = await admin.from('vendor_categories').insert(inserts)

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Category update error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()

    const { data: vendor } = await admin
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!vendor) {
      return NextResponse.json({ categoryIds: [] })
    }

    const { data: links } = await admin
      .from('vendor_categories')
      .select('category_id')
      .eq('vendor_id', vendor.id)

    return NextResponse.json({ categoryIds: (links || []).map((l: any) => l.category_id) })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
