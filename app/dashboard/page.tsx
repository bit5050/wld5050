import type { Metadata } from 'next'
import DashboardContent from '@/components/dashboard/DashboardContent'

export const metadata: Metadata = {
  title: 'Dashboard WLD5050 | 50/50 Raffles World Chain',
  description:
    'Dashboard WLD5050 , 50/50 Raffles World Chain , World ID Raffle , World ID 50/50 Raffle Platform',
  openGraph: {
    title: 'Dashboard WLD5050 | 50/50 Raffles World Chain',
    description:
      'Dashboard WLD5050 , 50/50 Raffles World Chain , World ID Raffle , World ID 50/50 Raffle Platform',
  },
  twitter: {
    title: 'Dashboard WLD5050 | 50/50 Raffles World Chain',
    description:
      'Dashboard WLD5050 , 50/50 Raffles World Chain , World ID Raffle , World ID 50/50 Raffle Platform',
  },
}

export default function DashboardPage() {
  return <DashboardContent />
}
