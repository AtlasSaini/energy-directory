import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

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

    // Limit to 10 vendors
    const limitedVendorIds = vendorIds.slice(0, 10)

    const supabase = createAdminClient()

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
