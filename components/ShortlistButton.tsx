'use client'

import { useState } from 'react'
import { useShortlist } from './ShortlistProvider'
import ShortlistDrawer from './ShortlistDrawer'

export default function ShortlistButton() {
  const { shortlist } = useShortlist()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const count = shortlist.length

  return (
    <>
      {/* Floating button — hidden on mobile when empty */}
      <button
        onClick={() => setDrawerOpen(true)}
        aria-label={`My Shortlist${count > 0 ? ` (${count})` : ''}`}
        className={`
          fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg font-semibold text-sm
          transition-all duration-200 hover:scale-105
          ${count > 0
            ? 'bg-amber-500 hover:bg-amber-400 text-[#0a1628]'
            : 'bg-slate-700 hover:bg-slate-600 text-white'
          }
          ${count === 0 ? 'hidden sm:flex' : 'flex'}
        `}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span className="hidden sm:inline">My Shortlist</span>
        {count > 0 && (
          <span className={`
            flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
            ${count > 0 ? 'bg-[#0a1628] text-amber-400' : 'bg-gray-600 text-white'}
          `}>
            {count}
          </span>
        )}
      </button>

      <ShortlistDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  )
}
