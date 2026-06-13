import type { Metadata } from 'next'
import ContactContent from '@/components/sections/ContactContent'

export const metadata: Metadata = {
  title: 'Contact — WLD5050',
  description:
    'Contact BIT5050 INC. — info@bit5050.com · partnerships, support, and World Chain raffle integrations.',
}

export default function ContactPage() {
  return <ContactContent />
}
