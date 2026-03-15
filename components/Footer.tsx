import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-[#0a1628] font-bold text-xs">⚡</span>
              </div>
              <span className="font-bold text-white">
                Energy<span className="text-amber-400">Directory</span>.ca
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Canada&apos;s premier directory for energy sector vendors. Connecting buyers with trusted suppliers across the country.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Directory</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/vendors" className="hover:text-amber-400 transition-colors">All Vendors</Link></li>
              <li><Link href="/vendors?tier=featured" className="hover:text-amber-400 transition-colors">Featured Vendors</Link></li>
              <li><Link href="/vendors?tier=premium" className="hover:text-amber-400 transition-colors">Premium Vendors</Link></li>
            </ul>
          </div>

          {/* For Buyers */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">For Buyers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/for-buyers" className="hover:text-amber-400 transition-colors">How It Works</Link></li>
              <li><Link href="/for-buyers#rfq" className="hover:text-amber-400 transition-colors">Send an Inquiry</Link></li>
              <li><Link href="/vendors" className="hover:text-amber-400 transition-colors">Browse Vendors</Link></li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">For Business</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/list-your-business" className="hover:text-amber-400 transition-colors">List Your Business</Link></li>
              <li><Link href="/list-your-business#pricing" className="hover:text-amber-400 transition-colors">Pricing</Link></li>
              <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <p>&copy; {new Date().getFullYear()} EnergyDirectory.ca — GST# 738605831 RT0001</p>
          <p>Built for Canadian Energy 🇨🇦</p>
        </div>
      </div>
    </footer>
  )
}
