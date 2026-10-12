import type { MouseEvent } from 'react'
import { FiArrowRight, FiCalendar, FiTrendingDown } from 'react-icons/fi'
import { motion, useMotionValue, useSpring } from 'motion/react'
import SubscriptionBrandIcon, { type SubscriptionBrand } from '../SubscriptionBrandIcon/SubscriptionBrandIcon'
import ScrollReveal from '../ScrollReveal/ScrollReveal'

const services: SubscriptionBrand[] = [
  { name: 'Netflix', icon: 'netflix', color: '#E50914' },
  { name: 'Spotify', icon: 'spotify', color: '#1ED760' },
  { name: 'iCloud', icon: 'icloud', color: '#3693F3' },
]

const nextCharges = [
  { name: 'Netflix', service: services[0], date: '12 out', amount: 'R$ 25,90' },
  { name: 'Spotify Premium', service: services[1], date: '18 out', amount: 'R$ 21,90' },
  { name: 'iCloud+', service: services[2], date: '25 out', amount: 'R$ 14,90' },
]

function SubscriptionShowcase() {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const cardX = useSpring(pointerX, { stiffness: 160, damping: 22, mass: 0.6 })
  const cardY = useSpring(pointerY, { stiffness: 160, damping: 22, mass: 0.6 })

  function handleCardPointerMove(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left - bounds.width / 2) * 0.035)
    pointerY.set((event.clientY - bounds.top - bounds.height / 2) * 0.035)
  }

  function resetCardPointer() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <ScrollReveal className="mx-auto w-full max-w-7xl px-5 pb-16 pt-5 sm:px-8 lg:pb-20 lg:pt-0">
      <div className="grid min-h-[47svh] items-stretch gap-5 md:grid-cols-[0.82fr_1.18fr] lg:gap-8">
        <motion.div
          className="relative flex min-h-64 flex-col justify-between overflow-hidden rounded-panel border border-white/15 bg-white/[0.06] p-6 text-brand-porcelain sm:p-8 lg:p-10"
          onMouseLeave={resetCardPointer}
          onMouseMove={handleCardPointerMove}
          style={{ x: cardX, y: cardY }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          whileHover={{ scale: 1.01 }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">Uma visão, tudo conectado</p>
            <p className="mt-4 max-w-sm text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
              Seus serviços favoritos. Um lugar só para acompanhar.
            </p>
          </div>
          <div className="relative mt-10 flex items-center gap-5 sm:gap-7">
            <span aria-hidden="true" className="absolute left-7 right-7 top-1/2 border-t border-dashed border-brand-gold/50" />
            {services.map((service, index) => (
              <motion.div
                className="relative z-10"
                key={service.name}
                initial={{ opacity: 0, y: 24, scale: 0.88 }}
                transition={{ delay: 0.12 + index * 0.14, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
              >
                <SubscriptionBrandIcon service={service} size={index === 1 ? 'large' : 'medium'} />
              </motion.div>
            ))}
          </div>
          <p className="mt-5 text-sm text-brand-porcelain/65">Netflix · Spotify · iCloud+ e tudo o que você assina</p>
        </motion.div>

        <motion.div
          className="flex flex-col justify-between rounded-panel border border-white/60 bg-brand-porcelain p-6 text-ink shadow-[0_28px_90px_-54px_rgba(0,0,0,0.65)] sm:p-8 lg:p-10"
          transition={{ type: 'spring', stiffness: 240, damping: 24 }}
          whileHover={{ y: -6, scale: 1.008, boxShadow: '0 36px 100px -54px rgba(0,0,0,0.72)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-ink-muted">Gasto no mês</p>
              <p className="mt-2 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">R$ 87,90</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-success">
                <FiTrendingDown aria-hidden="true" size={14} /> 12% em relação ao mês anterior
              </p>
            </div>
            <div aria-hidden="true" className="group/chart hidden h-20 items-end gap-2 pt-2 sm:flex">
              {[24, 32, 27, 43, 51, 63, 58, 72].map((height, index) => (
                <motion.span
                  className={`origin-bottom w-3 rounded-t-full transition-[filter,transform] duration-300 group-hover/chart:scale-y-110 group-hover/chart:brightness-110 ${index === 7 ? 'bg-brand-cocoa' : 'bg-brand-cocoa/25 group-hover/chart:bg-brand-cocoa/45'}`}
                  initial={{ height: 0 }}
                  key={index}
                  style={{ height }}
                  transition={{ delay: 0.15 + index * 0.06, duration: 0.45 }}
                  whileInView={{ height }}
                  viewport={{ once: true }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Próximas cobranças</p>
                <p className="mt-1 text-xs text-ink-muted">Outubro · tudo em dia</p>
              </div>
              <FiCalendar aria-hidden="true" className="text-ink-muted" size={16} />
            </div>
            <ul className="divide-y divide-border">
              {nextCharges.map(({ name, service, date, amount }) => (
                <motion.li
                  className="flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-brand-cocoa/[0.06]"
                  key={name}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  whileHover={{ x: 4 }}
                >
                  <SubscriptionBrandIcon service={service} size="small" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{name}</span>
                  <span className="text-xs text-ink-muted">{date}</span>
                  <span className="min-w-16 text-right text-sm font-medium">{amount}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <p className="mt-4 flex items-center gap-1 text-xs font-medium text-accent">
            Um resumo simples, sempre à mão <FiArrowRight aria-hidden="true" size={13} />
          </p>
        </motion.div>
      </div>
    </ScrollReveal>
  )
}

export default SubscriptionShowcase
