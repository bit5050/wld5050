import type { Metadata } from 'next'
import HowItWorksContent from '@/components/sections/HowItWorksContent'

export const metadata: Metadata = {
  title: 'How It Works WLD5050 | World Chain WLD Raffle Platform',
  description: 'How It Works WLD5050 , World Chain WLD Raffle Platform',
  openGraph: {
    title: 'How It Works WLD5050 | World Chain WLD Raffle Platform',
    description: 'How It Works WLD5050 , World Chain WLD Raffle Platform',
  },
  twitter: {
    title: 'How It Works WLD5050 | World Chain WLD Raffle Platform',
    description: 'How It Works WLD5050 , World Chain WLD Raffle Platform',
  },
}

export default function HowItWorksPage() {
  return <HowItWorksContent />
}
