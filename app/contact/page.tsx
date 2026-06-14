import type { Metadata } from 'next'
import ContactContent from '@/components/sections/ContactContent'
import { siteShareImage, SITE_SHARE_IMAGE_PATH } from '@/lib/seo/share-image'

export const metadata: Metadata = {
  title: 'Contact | WLD5050 | World Chain WLD Raffle Platform',
  description: 'Contact , WLD5050 , World Chain WLD Raffle Platform',
  openGraph: {
    title: 'Contact | WLD5050 | World Chain WLD Raffle Platform',
    description: 'Contact , WLD5050 , World Chain WLD Raffle Platform',
    images: siteShareImage,
  },
  twitter: {
    title: 'Contact | WLD5050 | World Chain WLD Raffle Platform',
    description: 'Contact , WLD5050 , World Chain WLD Raffle Platform',
    images: [SITE_SHARE_IMAGE_PATH],
  },
}

export default function ContactPage() {
  return <ContactContent />
}
