import type { Metadata } from 'next'
import HowItWorksContent from '@/components/sections/HowItWorksContent'

export const metadata: Metadata = {
  title: 'How It Works — WLD5050',
  description:
    'Verify with World ID, pay in USDC or WLD, let Chainlink CRE settle on World Chain, and claim optional winner ENS badges on Ethereum.',
}

export default function HowItWorksPage() {
  return <HowItWorksContent />
}
