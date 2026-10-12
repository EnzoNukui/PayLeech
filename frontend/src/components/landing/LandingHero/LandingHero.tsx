import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

function LandingHero() {
  return (
    <motion.div
      className="mx-auto flex min-h-[40svh] max-w-5xl flex-col items-center justify-center px-5 pb-8 pt-5 text-center sm:px-8 lg:min-h-[43svh]"
      initial={{ opacity: 0, y: 36, filter: 'blur(5px)' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold sm:text-sm">
        PayLeech · assinaturas em foco
      </p>
      <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-brand-porcelain sm:text-6xl lg:text-7xl">
        Suas assinaturas, sob controle.
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-7 text-brand-porcelain/75 sm:text-lg sm:leading-8">
        Veja o que você paga, quando será cobrado e quanto isso soma no seu mês.
      </p>
      <Link
        className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-espresso transition-transform hover:-translate-y-0.5 focus-visible:outline-brand-gold"
        to="/cadastro"
      >
        Começar agora <FiArrowRight aria-hidden="true" size={17} />
      </Link>
    </motion.div>
  )
}

export default LandingHero
