import type { Metadata } from 'next'
import ContactContent from '@/components/sections/ContactContent'

export const metadata: Metadata = {
  title: 'Contact | WLD5050 | World Chain WLD Raffle Platform',
  description: 'Contact , WLD5050 , World Chain WLD Raffle Platform',
  openGraph: {
    title: 'Contact | WLD5050 | World Chain WLD Raffle Platform',
    description: 'Contact , WLD5050 , World Chain WLD Raffle Platform',
  },
  twitter: {
    title: 'Contact | WLD5050 | World Chain WLD Raffle Platform',
    description: 'Contact , WLD5050 , World Chain WLD Raffle Platform',
  },
}

export default function ContactPage() {
  return <ContactContent />
}
