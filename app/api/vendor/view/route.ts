import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

// Simple in-memory rate limiter: IP+vendorId → last seen timestamp
const rateCache = new Map<string, number>()
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour per IP+vendor

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vendorId } = body as { vendorId?: string }

    if (!vendorId) {
      return NextResponse.json({ error: 'vendorId required' }, { status: 400 })
    }

    // Rate limit by IP + vendorId
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'
    const key = `${ip}:${vendorId}`
    const now = Date.now()
    const last = rateCache.get(key)
    if (last && now - last < RATE_WINDOW_MS) {
      // Already counted within the window — silently succeed
      return NextResponse.json({ success: true })
    }
    rateCache.set(key, now)

    // Prune old entries periodically (keep map from growing unbounded)
    if (rateCache.size > 10000) {
      for (const [k, ts] of rateCache) {
        if (now - ts > RATE_WINDOW_MS) rateCache.delete(k)
      }
    }

    // Increment views
    const admin = createAdminClient()
    const { error } = await admin.rpc('increment_vendor_views', {
      vendor_id_param: vendorId,
    })

    if (error) {
      // Fallback: manual increment if RPC doesn't exist
      const { data: current } = await admin
        .from('vendors')
        .select('views')
        .eq('id', vendorId)
        .single()

      await admin
        .from('vendors')
        .update({ views: ((current?.views ?? 0) + 1) })
        .eq('id', vendorId)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('View tracking error:', err)
    // Never fail loudly — this is a background tracking call
    return NextResponse.json({ success: true })
  }
}
