import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { company_name, website, description, province, city } = await req.json()

    if (!company_name?.trim()) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Check if user already has a listing
    const { data: existing } = await admin.from('vendors').select('id').eq('user_id', user.id).single()
    if (existing) return NextResponse.json({ error: 'You already have a listing' }, { status: 400 })

    // Generate unique slug
    let slug = slugify(company_name)
    const { data: slugCheck } = await admin.from('vendors').select('id').eq('slug', slug).single()
    if (slugCheck) slug = `${slug}-${Date.now()}`

    const { data: vendor, error } = await admin.from('vendors').insert({
      company_name: company_name.trim(),
      slug,
      website: website || null,
      description: description || null,
      province: province || null,
      city: city || null,
      email: user.email,
      user_id: user.id,
      tier: 'free',
      verified: false,
      active: true,
    }).select('id, slug').single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, vendor })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
