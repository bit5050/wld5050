import type { Metadata } from 'next'
import AboutContent from '@/components/sections/AboutContent'

export const metadata: Metadata = {
  title: 'About WLD5050 | World Chain 50/50 Raffles',
  description:
    'About WLD5050 , World Chain 50/50 Raffles , World ID Raffle , World ID 50/50 Raffle Platform',
  openGraph: {
    title: 'About WLD5050 | World Chain 50/50 Raffles',
    description:
      'About WLD5050 , World Chain 50/50 Raffles , World ID Raffle , World ID 50/50 Raffle Platform',
  },
  twitter: {
    title: 'About WLD5050 | World Chain 50/50 Raffles',
    description:
      'About WLD5050 , World Chain 50/50 Raffles , World ID Raffle , World ID 50/50 Raffle Platform',
  },
}

export default function AboutPage() {
  return <AboutContent />
}
