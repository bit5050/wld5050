import type { Metadata } from 'next'
import HowItWorksContent from '@/components/sections/HowItWorksContent'
import { siteShareImage, SITE_SHARE_IMAGE_PATH } from '@/lib/seo/share-image'

export const metadata: Metadata = {
  title: 'How It Works WLD5050 | World Chain WLD Raffle Platform',
  description: 'How It Works WLD5050 , World Chain WLD Raffle Platform',
  openGraph: {
    title: 'How It Works WLD5050 | World Chain WLD Raffle Platform',
    description: 'How It Works WLD5050 , World Chain WLD Raffle Platform',
    images: siteShareImage,
  },
  twitter: {
    title: 'How It Works WLD5050 | World Chain WLD Raffle Platform',
    description: 'How It Works WLD5050 , World Chain WLD Raffle Platform',
    images: [SITE_SHARE_IMAGE_PATH],
  },
}

export default function HowItWorksPage() {
  return <HowItWorksContent />
}
