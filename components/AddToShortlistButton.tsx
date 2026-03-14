'use client'

import { useShortlist, ShortlistVendor } from './ShortlistProvider'

interface AddToShortlistButtonProps {
  vendor: ShortlistVendor
  className?: string
}

export default function AddToShortlistButton({ vendor, className = '' }: AddToShortlistButtonProps) {
  const { isInShortlist, addToShortlist, removeFromShortlist, shortlist } = useShortlist()
  const inList = isInShortlist(vendor.id)
  const isFull = shortlist.length >= 10 && !inList

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (inList) {
      removeFromShortlist(vendor.id)
    } else if (!isFull) {
      addToShortlist(vendor)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isFull}
      title={isFull ? 'Shortlist is full (max 10 vendors)' : inList ? 'Remove from shortlist' : 'Add to shortlist'}
      className={`
        inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all
        ${inList
          ? 'bg-green-50 border-green-200 text-green-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
          : isFull
          ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-white border-gray-200 text-gray-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700'
        }
        ${className}
      `}
    >
      {inList ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Shortlisted
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {isFull ? 'List Full' : '+ Shortlist'}
        </>
      )}
    </button>
  )
}
