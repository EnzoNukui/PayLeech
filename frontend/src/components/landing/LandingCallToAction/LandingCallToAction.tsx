import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import ScrollReveal from '../ScrollReveal/ScrollReveal'

function LandingCallToAction() {
  return (
    <section className="flex min-h-[68svh] items-center px-5 py-24 text-center sm:px-8 lg:px-10">
      <ScrollReveal className="mx-auto w-full max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Escolhas melhores começam com clareza</p>
        <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-current sm:text-6xl lg:text-7xl">
          Mais clareza para escolher o que fica.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-current/70 sm:text-lg sm:leading-8">
          Entenda seus gastos recorrentes e mantenha o que realmente faz sentido para você.
        </p>
        <Link
          className="mt-9 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-brand-espresso px-8 py-4 text-sm font-semibold text-brand-porcelain transition-transform hover:-translate-y-0.5 focus-visible:outline-accent"
          to="/cadastro"
        >
          Começar agora <FiArrowRight aria-hidden="true" size={17} />
        </Link>
      </ScrollReveal>
    </section>
  )
}

export default LandingCallToAction
