import type { Metadata } from 'next'
import { siteShareImage, SITE_SHARE_IMAGE_PATH } from '@/lib/seo/share-image'

export const metadata: Metadata = {
  title: 'Create Your Own World Chain WLD Raffle',
  description: 'Create Your Own World Chain WLD Raffle , Create World ID 50/50 Raffle',
  openGraph: {
    title: 'Create Your Own World Chain WLD Raffle',
    description: 'Create Your Own World Chain WLD Raffle , Create World ID 50/50 Raffle',
    images: siteShareImage,
  },
  twitter: {
    title: 'Create Your Own World Chain WLD Raffle',
    description: 'Create Your Own World Chain WLD Raffle , Create World ID 50/50 Raffle',
    images: [SITE_SHARE_IMAGE_PATH],
  },
}

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children
}
