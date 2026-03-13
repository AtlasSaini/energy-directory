import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <div className="text-6xl mb-6">⚡</div>
      <h1 className="text-4xl font-extrabold text-[#0a1628] mb-4">404</h1>
      <p className="text-gray-500 text-lg mb-8">
        This page doesn&apos;t exist — but there&apos;s plenty more to explore.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/" className="bg-[#0a1628] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0d1f3c] transition-colors">
          Go Home
        </Link>
        <Link href="/vendors" className="border border-gray-200 text-[#0a1628] px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
          Browse Vendors
        </Link>
      </div>
    </div>
  )
}
