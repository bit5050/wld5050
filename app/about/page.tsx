import type { Metadata } from 'next'
import AboutContent from '@/components/sections/AboutContent'

export const metadata: Metadata = {
  title: 'About — WLD5050',
  description:
    'Human-verified 50/50 raffles on World Chain. Built by BIT5050 INC. with World ID, Chainlink CRE, and ENS.',
}

export default function AboutPage() {
  return <AboutContent />
}
