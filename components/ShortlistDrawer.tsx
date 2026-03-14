'use client'

import { useState } from 'react'
import { useShortlist } from './ShortlistProvider'
import RFQModal from './RFQModal'

interface ShortlistDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShortlistDrawer({ isOpen, onClose }: ShortlistDrawerProps) {
  const { shortlist, removeFromShortlist, clearShortlist } = useShortlist()
  const [showRFQ, setShowRFQ] = useState(false)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="bg-[#0a1628] text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="font-semibold text-base">
              My Shortlist
              {shortlist.length > 0 && (
                <span className="ml-2 bg-amber-500 text-[#0a1628] text-xs font-bold px-2 py-0.5 rounded-full">
                  {shortlist.length}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close shortlist"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {shortlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">Your shortlist is empty</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Add vendors to your shortlist to send a group RFQ in one step.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {shortlist.map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0a1628] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {vendor.company_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{vendor.company_name}</p>
                    {vendor.category && (
                      <p className="text-xs text-gray-500 truncate">{vendor.category}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromShortlist(vendor.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label={`Remove ${vendor.company_name}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {shortlist.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex-shrink-0 space-y-3">
            <p className="text-xs text-gray-500 text-center">
              {shortlist.length < 10
                ? `${10 - shortlist.length} more vendor${10 - shortlist.length !== 1 ? 's' : ''} can be added`
                : 'Maximum 10 vendors reached'}
            </p>
            <button
              onClick={() => setShowRFQ(true)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-bold py-3 rounded-lg transition-colors text-sm"
            >
              Send RFQ to All ({shortlist.length}) →
            </button>
            <button
              onClick={clearShortlist}
              className="w-full text-sm text-gray-500 hover:text-red-600 transition-colors py-1"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* RFQ Modal */}
      {showRFQ && (
        <RFQModal
          vendors={shortlist}
          onClose={() => setShowRFQ(false)}
        />
      )}
    </>
  )
}
