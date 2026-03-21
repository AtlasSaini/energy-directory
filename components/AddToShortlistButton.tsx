'use client'

import Link from 'next/link'
import { useShortlist, ShortlistVendor } from './ShortlistProvider'

interface AddToShortlistButtonProps {
  vendor: ShortlistVendor
  className?: string
}

export default function AddToShortlistButton({ vendor, className = '' }: AddToShortlistButtonProps) {
  const { isInShortlist, addToShortlist, removeFromShortlist, isAtAnonLimit } = useShortlist()
  const inList = isInShortlist(vendor.id)
  const anonLimitHit = isAtAnonLimit() && !inList

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (inList) {
      removeFromShortlist(vendor.id)
    } else if (!anonLimitHit) {
      addToShortlist(vendor)
    }
  }

  // Anon limit hit — nudge to sign up
  if (anonLimitHit) {
    return (
      <Link
        href="/auth/signup"
        onClick={(e) => e.stopPropagation()}
        title="Sign up free to add more vendors"
        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100 ${className}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Sign up to add more
      </Link>
    )
  }

  return (
    <button
      onClick={handleClick}
      title={inList ? 'Remove from shortlist' : '+ Shortlist'}
      className={`
        inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all
        ${inList
          ? 'bg-green-50 border-green-200 text-green-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
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
          + Shortlist
        </>
      )}
    </button>
  )
}
