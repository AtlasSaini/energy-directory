'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-[#0a1628] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/logo-medium-dark.svg"
              alt="Energy Directory"
              width={194}
              height={52}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/vendors" className="hover:text-amber-400 transition-colors">
              Browse Vendors
            </Link>
            <Link href="/for-buyers" className="hover:text-amber-400 transition-colors">
              For Buyers
            </Link>
            <Link href="/vendors?tier=featured" className="hover:text-amber-400 transition-colors">
              Featured
            </Link>
            <Link href="/auth/login" className="hover:text-amber-400 transition-colors">
              Sign In
            </Link>
            <Link href="/list-your-business" className="bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold px-4 py-2 rounded-lg transition-colors">
              List Your Business
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a1628]">
          <nav className="flex flex-col px-4 py-3 gap-1 text-sm font-medium">
            <Link
              href="/vendors"
              className="px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Browse Vendors
            </Link>
            <Link
              href="/for-buyers"
              className="px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              For Buyers
            </Link>
            <Link
              href="/vendors?tier=featured"
              className="px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Featured
            </Link>
            <Link
              href="/auth/login"
              className="px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/list-your-business"
              className="mt-1 bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold px-3 py-2.5 rounded-lg transition-colors text-center"
              onClick={() => setMobileOpen(false)}
            >
              List Your Business — Free
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
