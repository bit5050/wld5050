import type { Metadata } from 'next'

/** Open Graph / social share image (1200×630). */
export const SITE_SHARE_IMAGE_PATH = '/images/WLD5050_featuredimage.jpg'

export const siteShareImage: NonNullable<NonNullable<Metadata['openGraph']>['images']> = [
  {
    url: SITE_SHARE_IMAGE_PATH,
    width: 1200,
    height: 630,
    alt: 'WLD5050 — Human-Verified 50/50 Raffles On World Chain',
    type: 'image/jpeg',
  },
]
