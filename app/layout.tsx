import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'EnergyDirectory.ca — Canada\'s Energy Vendor Directory',
  description: 'Find trusted Canadian energy sector vendors. Oil & gas, renewables, pipeline, engineering, and more. Browse verified suppliers across Canada.',
  keywords: 'energy vendors Canada, oil gas suppliers, renewable energy companies, Canadian energy directory',
  openGraph: {
    title: 'EnergyDirectory.ca — Canada\'s Energy Vendor Directory',
    description: 'Find trusted Canadian energy sector vendors.',
    url: 'https://energydirectory.ca',
    siteName: 'EnergyDirectory.ca',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased bg-gray-50 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
