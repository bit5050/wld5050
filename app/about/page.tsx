import type { Metadata } from 'next'
import AboutContent from '@/components/sections/AboutContent'
import { siteShareImage, SITE_SHARE_IMAGE_PATH } from '@/lib/seo/share-image'

export const metadata: Metadata = {
  title: 'About WLD5050 | World Chain 50/50 Raffles',
  description:
    'About WLD5050 , World Chain 50/50 Raffles , World ID Raffle , World ID 50/50 Raffle Platform',
  openGraph: {
    title: 'About WLD5050 | World Chain 50/50 Raffles',
    description:
      'About WLD5050 , World Chain 50/50 Raffles , World ID Raffle , World ID 50/50 Raffle Platform',
    images: siteShareImage,
  },
  twitter: {
    title: 'About WLD5050 | World Chain 50/50 Raffles',
    description:
      'About WLD5050 , World Chain 50/50 Raffles , World ID Raffle , World ID 50/50 Raffle Platform',
    images: [SITE_SHARE_IMAGE_PATH],
  },
}

export default function AboutPage() {
  return <AboutContent />
}
