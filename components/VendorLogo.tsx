'use client'

import { useState } from 'react'

interface VendorLogoProps {
  logoUrl: string | null
  companyName: string
}

export default function VendorLogo({ logoUrl, companyName }: VendorLogoProps) {
  const [failed, setFailed] = useState(false)
  const initial = companyName.charAt(0).toUpperCase()

  if (!logoUrl || failed) {
    return (
      <span className="text-xl font-bold text-[#0a1628]">{initial}</span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt={companyName}
      className="w-full h-full object-contain p-1"
      onError={() => setFailed(true)}
    />
  )
}
