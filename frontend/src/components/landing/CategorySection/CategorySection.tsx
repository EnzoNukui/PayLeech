import { motion } from 'motion/react'
import { FiCloud, FiHeart, FiPlay, FiTool } from 'react-icons/fi'
import ScrollReveal from '../ScrollReveal/ScrollReveal'

const categories = [
  { name: 'Entretenimento', amount: 'R$ 47,90', share: 55, icon: FiPlay },
  { name: 'Produtividade', amount: 'R$ 21,90', share: 25, icon: FiTool },
  { name: 'Armazenamento', amount: 'R$ 14,90', share: 17, icon: FiCloud },
  { name: 'Saúde e bem-estar', amount: 'R$ 3,20', share: 3, icon: FiHeart },
]

function CategorySection() {
  return (
    <section className="flex min-h-[88svh] items-center px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-[0.78fr_1.22fr] lg:gap-24">
        <ScrollReveal className="md:pb-10">
          <p className="inline-flex rounded-full bg-brand-porcelain px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-espresso shadow-sm">
            Organize do seu jeito
          </p>
          <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-current sm:text-5xl lg:text-6xl">
            Tudo separado por categoria.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-current/75 sm:text-lg sm:leading-8">
            Entenda quanto cada grupo representa no seu gasto mensal e onde seu dinheiro está indo.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <motion.div
            className="min-h-[52svh] rounded-panel border border-brand-espresso/10 bg-brand-porcelain p-6 shadow-[0_24px_72px_-54px_rgba(48,40,32,0.35)] sm:p-8 lg:p-10"
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            whileHover={{ y: -5, boxShadow: '0 32px 80px -48px rgba(48,40,32,0.45)' }}
          >
            <div className="mb-8 flex items-end justify-between border-b border-border pb-6 text-ink">
              <div>
                <p className="text-sm text-ink-muted">Total organizado</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">R$ 87,90</p>
              </div>
              <p className="text-sm text-ink-muted">4 categorias</p>
            </div>
            <div className="flex min-h-[32svh] flex-col justify-around gap-7">
              {categories.map(({ name, amount, share, icon: Icon }, index) => (
                <motion.div
                  className="group grid grid-cols-[3rem_minmax(0,1fr)_5.5rem] items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-brand-cocoa/[0.07] sm:grid-cols-[3.25rem_minmax(0,1fr)_6rem] sm:gap-5"
                  key={name}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.span
                    className="grid size-12 place-items-center rounded-2xl bg-brand-gold/30 text-brand-espresso sm:size-13"
                    transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                    whileHover={{ rotate: -6, scale: 1.1 }}
                  >
                    <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                  </motion.span>
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-medium text-current sm:text-base">{name}</span>
                      <span className="text-xs text-current/60">{share}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-brand-espresso/10 transition-colors group-hover:bg-brand-espresso/15">
                      <motion.div
                        className="h-full rounded-full bg-brand-cocoa"
                        initial={{ width: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                        whileInView={{ width: `${Math.min(share, 100)}%` }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                  <span className="text-right text-sm font-semibold text-current sm:text-base">{amount}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default CategorySection
