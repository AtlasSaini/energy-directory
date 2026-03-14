import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-[#0a1628] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-[#0a1628] font-bold text-sm">⚡</span>
            </div>
            <span className="font-bold text-lg tracking-tight">
              Energy<span className="text-amber-400">Directory</span>.ca
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/vendors" className="hover:text-amber-400 transition-colors">
              Browse Vendors
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/list-your-business" className="bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors">
              List Business
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
