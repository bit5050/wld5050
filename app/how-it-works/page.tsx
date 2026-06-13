import type { Metadata } from 'next'
import HowItWorksContent from '@/components/sections/HowItWorksContent'

export const metadata: Metadata = {
  title: 'How It Works — WLD5050',
  description:
    'Verify with World ID, pay in USDC or WLD, and let Chainlink CRE settle 50/50 raffles automatically on World Chain.',
}

export default function HowItWorksPage() {
  return <HowItWorksContent />
}
