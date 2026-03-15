'use client'

import { useState } from 'react'
import RFQModal from '@/components/RFQModal'
import AddToShortlistButton from '@/components/AddToShortlistButton'

interface VendorActionsProps {
  vendor: {
    id: string
    company_name: string
    slug: string
  }
}

export default function VendorActions({ vendor }: VendorActionsProps) {
  const [showRFQ, setShowRFQ] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowRFQ(true)}
        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-bold px-5 py-2.5 rounded-lg transition-colors text-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Send an Inquiry
      </button>

      <AddToShortlistButton vendor={vendor} />

      {showRFQ && (
        <RFQModal
          vendors={[vendor]}
          onClose={() => setShowRFQ(false)}
        />
      )}
    </>
  )
}
