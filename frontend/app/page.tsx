import HeroSection from '@/components/home/HeroSection'
import PackageStrip from '@/components/home/PackageStrip'
import PopularRoutesStrip from '@/components/home/PopularRoutesStrip'
import DealsSection from '@/components/home/DealsSection'
import DestinationsSection from '@/components/home/DestinationsSection'
import TravelThemesSection from '@/components/home/TravelThemesSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import SocialProofSection from '@/components/home/SocialProofSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <PackageStrip />
      <PopularRoutesStrip />
      <DealsSection />
      <DestinationsSection />
      <TravelThemesSection />
      <FeaturesSection />
      <SocialProofSection />
    </>
  )
}
