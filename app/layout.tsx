import type { Metadata } from 'next'
import '@/lib/fonts'
import 'lenis/dist/lenis.css'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CommandMenu from '@/components/layout/command-menu'
import AppProviders from '@/components/providers/app-providers'
import MotionProviders from '@/components/providers/motion-providers'
import TermsAgreementModal from '@/components/legal/TermsAgreementModal'
import { Toaster } from '@/components/ui/sonner'
import { siteShareImage, SITE_SHARE_IMAGE_PATH } from '@/lib/seo/share-image'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.wld5050.com'),
  title: {
    default: 'WLD5050 | Human-Verified 50/50 Raffles On World Chain | World ID Raffle',
    template: '%s',
  },
  description:
    'WLD5050 , Human-Verified 50/50 Raffles On World Chain , World ID Raffle , World ID 50/50 Raffle Platform',
  openGraph: {
    type: 'website',
    siteName: 'WLD5050',
    title: 'WLD5050 | Human-Verified 50/50 Raffles On World Chain | World ID Raffle',
    description:
      'WLD5050 , Human-Verified 50/50 Raffles On World Chain , World ID Raffle , World ID 50/50 Raffle Platform',
    images: siteShareImage,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WLD5050 | Human-Verified 50/50 Raffles On World Chain | World ID Raffle',
    description:
      'WLD5050 , Human-Verified 50/50 Raffles On World Chain , World ID Raffle , World ID 50/50 Raffle Platform',
    images: [SITE_SHARE_IMAGE_PATH],
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/icon.png', sizes: '32x32', type: 'image/png' }],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    title: 'WLD5050',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-foreground font-body antialiased">
        <AppProviders>
          <MotionProviders>
            <Navbar />
            <main className="flex-1 max-w-[800px] w-full mx-auto">
              {children}
            </main>
            <Footer />
            <CommandMenu />
            <TermsAgreementModal />
            <Toaster position="bottom-center" richColors closeButton />
          </MotionProviders>
        </AppProviders>
      </body>
    </html>
  )
}
