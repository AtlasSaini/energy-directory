'use client'

import Link from 'next/link'
import Logo from './Logo'
import { useState } from 'react'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-[#D2D2D7] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo variant="dark" size="md" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/vendors" className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">
              Browse Vendors
            </Link>
            <Link href="/for-buyers" className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">
              For Buyers
            </Link>
            <Link href="/vendors?tier=featured" className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">
              Featured
            </Link>
            <Link href="/auth/login" className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">
              Sign In
            </Link>
            <Link href="/list-your-business" className="bg-[#1D1D1F] text-white font-semibold px-4 py-2 rounded-full hover:opacity-80 transition-opacity">
              List Your Business
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#F5F5F7] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5 text-[#1D1D1F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-[#1D1D1F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#D2D2D7] bg-white">
          <nav className="flex flex-col px-4 py-3 gap-1 text-sm font-medium">
            <Link
              href="/vendors"
              className="px-3 py-2.5 rounded-lg text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Browse Vendors
            </Link>
            <Link
              href="/for-buyers"
              className="px-3 py-2.5 rounded-lg text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              For Buyers
            </Link>
            <Link
              href="/vendors?tier=featured"
              className="px-3 py-2.5 rounded-lg text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Featured
            </Link>
            <Link
              href="/auth/login"
              className="px-3 py-2.5 rounded-lg text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/list-your-business"
              className="mt-1 bg-[#E8590C] hover:bg-[#CC4A08] text-white font-semibold px-3 py-2.5 rounded-lg transition-colors text-center"
              onClick={() => setMobileOpen(false)}
            >
              List Your Business - Free
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
