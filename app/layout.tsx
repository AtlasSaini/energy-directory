import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'
import { ShortlistProvider } from '@/components/ShortlistProvider'
import ShortlistButton from '@/components/ShortlistButton'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'EnergyDirectory.ca — Canada\'s Energy Vendor Directory',
  description: 'Find trusted Canadian energy sector vendors. Oil & gas, renewables, pipeline, engineering, and more. Browse verified suppliers across Canada.',
  keywords: 'energy vendors Canada, oil gas suppliers, renewable energy companies, Canadian energy directory',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  openGraph: {
    title: 'EnergyDirectory.ca — Canada\'s Energy Vendor Directory',
    description: 'Find trusted Canadian energy sector vendors.',
    url: 'https://energydirectory.ca',
    siteName: 'EnergyDirectory.ca',
    type: 'website',
    images: [{ url: '/logo/logo-primary-light.svg' }],
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
        <ShortlistProvider>
          <ConditionalLayout>
            <main className="flex-1">{children}</main>
          </ConditionalLayout>
          <ShortlistButton />
        </ShortlistProvider>
      </body>
    </html>
  )
}
