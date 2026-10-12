import ScrollReveal from '../ScrollReveal/ScrollReveal'
import InteractiveSpendingChart from '../InteractiveSpendingChart/InteractiveSpendingChart'

function AnnualSpendingSection() {
  return (
    <section className="flex min-h-[92svh] items-center px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-[1.2fr_0.8fr] lg:gap-24">
        <ScrollReveal>
          <div className="rounded-panel border border-brand-espresso/10 bg-brand-porcelain p-6 shadow-[0_24px_72px_-54px_rgba(48,40,32,0.35)] sm:p-8 lg:p-10">
            <InteractiveSpendingChart />
          </div>
        </ScrollReveal>
        <ScrollReveal className="md:pl-2" delay={0.12}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Visão completa</p>
          <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-current sm:text-5xl lg:text-6xl">
            Enxergue o custo ao longo do ano.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-current/75 sm:text-lg sm:leading-8">
            Acompanhe quanto suas assinaturas somam mês a mês e identifique tendências com facilidade.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default AnnualSpendingSection
