import type { Metadata } from 'next'
import DashboardContent from '@/components/dashboard/DashboardContent'

export const metadata: Metadata = {
  title: 'Dashboard — WLD5050',
  description:
    'Your WLD5050 raffle stats — USDC and WLD winnings, created raffles, and participation on World Chain.',
}

export default function DashboardPage() {
  return <DashboardContent />
}
