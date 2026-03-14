'use client'

import { useEffect } from 'react'

export default function ViewTracker({ vendorId }: { vendorId: string }) {
  useEffect(() => {
    // Fire-and-forget — never block rendering
    fetch('/api/vendor/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorId }),
    }).catch(() => {
      // Silently ignore errors
    })
  }, [vendorId])

  return null
}
