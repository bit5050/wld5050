import type { Metadata } from 'next'
import '@/lib/fonts'
import 'lenis/dist/lenis.css'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CommandMenu from '@/components/layout/command-menu'
import AppProviders from '@/components/providers/app-providers'
import MotionProviders from '@/components/providers/motion-providers'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'WLD5050 — Human-verified 50/50 raffles on World Chain',
  description: 'Create or enter a fair 50/50 raffle. One ticket per verified human. Winners selected by Chainlink CRE, paid automatically.',
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
            <Toaster position="bottom-center" richColors closeButton />
          </MotionProviders>
        </AppProviders>
      </body>
    </html>
  )
}
