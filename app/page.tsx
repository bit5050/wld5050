import HeroSection from '@/components/sections/HeroSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import CreateRaffleSection from '@/components/sections/CreateRaffleSection'
import ActiveRafflesSection from '@/components/sections/ActiveRafflesSection'
import CompletedRafflesSection from '@/components/sections/CompletedRafflesSection'
import TrustSection from '@/components/sections/TrustSection'
import FairEntrySection from '@/components/sections/FairEntrySection'
import { fetchRafflesFromContract } from '@/lib/contracts/fetch-raffles'

export const revalidate = 30

export default async function HomePage() {
  const { active, completed } = await fetchRafflesFromContract()

  return (
    <>
      <HeroSection />
      <CreateRaffleSection />
      <HowItWorksSection />
      <TrustSection />
      <FairEntrySection />
      <ActiveRafflesSection raffles={active.slice(0, 9)} />
      <CompletedRafflesSection raffles={completed.slice(0, 3)} />
    </>
  )
}
