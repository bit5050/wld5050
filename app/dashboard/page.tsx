import type { Metadata } from 'next'
import DashboardContent from '@/components/dashboard/DashboardContent'
import { siteShareImage, SITE_SHARE_IMAGE_PATH } from '@/lib/seo/share-image'

export const metadata: Metadata = {
  title: 'Dashboard WLD5050 | 50/50 Raffles World Chain',
  description:
    'Dashboard WLD5050 , 50/50 Raffles World Chain , World ID Raffle , World ID 50/50 Raffle Platform',
  openGraph: {
    title: 'Dashboard WLD5050 | 50/50 Raffles World Chain',
    description:
      'Dashboard WLD5050 , 50/50 Raffles World Chain , World ID Raffle , World ID 50/50 Raffle Platform',
    images: siteShareImage,
  },
  twitter: {
    title: 'Dashboard WLD5050 | 50/50 Raffles World Chain',
    description:
      'Dashboard WLD5050 , 50/50 Raffles World Chain , World ID Raffle , World ID 50/50 Raffle Platform',
    images: [SITE_SHARE_IMAGE_PATH],
  },
}

export default function DashboardPage() {
  return <DashboardContent />
}
