'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Pages that have their own header/footer
const NO_GLOBAL_LAYOUT = ['/dashboard', '/auth/']

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideGlobal = NO_GLOBAL_LAYOUT.some(p => pathname.startsWith(p))

  if (hideGlobal) return <>{children}</>

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
