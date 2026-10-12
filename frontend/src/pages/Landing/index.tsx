import AnnualSpendingSection from '../../components/landing/AnnualSpendingSection/AnnualSpendingSection'
import CategorySection from '../../components/landing/CategorySection/CategorySection'
import LandingCallToAction from '../../components/landing/LandingCallToAction/LandingCallToAction'
import LandingHero from '../../components/landing/LandingHero/LandingHero'
import SubscriptionShowcase from '../../components/landing/SubscriptionShowcase/SubscriptionShowcase'
import UpcomingChargesSection from '../../components/landing/UpcomingChargesSection/UpcomingChargesSection'

function Landing() {
  return (
    <div>
      <section aria-label="Apresentação do PayLeech" className="scroll-mt-8" id="visao-geral">
        <LandingHero />
        <SubscriptionShowcase />
      </section>
      <UpcomingChargesSection />
      <AnnualSpendingSection />
      <CategorySection />
      <LandingCallToAction />
    </div>
  )
}

export default Landing
