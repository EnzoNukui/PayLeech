import { FiArrowUpRight, FiCalendar, FiCheck } from 'react-icons/fi'
import { motion } from 'motion/react'
import ScrollReveal from '../ScrollReveal/ScrollReveal'
import SubscriptionBrandIcon from '../SubscriptionBrandIcon/SubscriptionBrandIcon'
import type { SubscriptionBrand } from '../SubscriptionBrandIcon/SubscriptionBrandIcon'

const charges: { date: string; day: string; name: string; category: string; amount: string; service: SubscriptionBrand }[] = [
  { date: '12 out', day: '12', name: 'Netflix', category: 'Entretenimento', amount: 'R$ 25,90', service: { name: 'Netflix', icon: 'netflix', color: '#E50914' } },
  { date: '18 out', day: '18', name: 'Spotify Premium', category: 'Música', amount: 'R$ 21,90', service: { name: 'Spotify', icon: 'spotify', color: '#1ED760' } },
  { date: '25 out', day: '25', name: 'iCloud+', category: 'Armazenamento', amount: 'R$ 14,90', service: { name: 'iCloud', icon: 'icloud', color: '#3693F3' } },
]

const services = charges.map(({ service }) => service)

function UpcomingChargesSection() {
  return (
    <section className="my-8 flex min-h-[92svh] items-center rounded-[1.75rem] bg-brand-porcelain px-5 py-16 text-brand-espresso sm:my-10 sm:px-8 sm:py-20 lg:my-12 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <ScrollReveal className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-cocoa">Planeje com tranquilidade</p>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-current sm:text-5xl lg:text-6xl">
            Saiba o que vem pela frente.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-current/70 sm:text-lg sm:leading-8">
            Veja suas cobranças organizadas e tenha tempo para decidir o que fica no seu mês.
          </p>
        </ScrollReveal>

        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-5">
          <ScrollReveal className="md:col-span-7 md:row-span-2">
            <motion.div
              className="h-full rounded-panel border border-brand-espresso/[0.08] bg-white p-6 shadow-[0_20px_60px_-48px_rgba(48,40,32,0.32)] sm:p-8 lg:p-9"
              transition={{ type: 'spring', stiffness: 240, damping: 24 }}
              whileHover={{ y: -4, boxShadow: '0 30px 72px -46px rgba(48,40,32,0.42)' }}
            >
              <div className="flex flex-wrap items-start justify-between gap-5 border-b border-border pb-6">
                <div>
                  <p className="text-sm font-semibold text-ink">Calendário de cobranças</p>
                  <p className="mt-1 text-sm text-ink-muted">Outubro · 3 serviços</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-ink-muted">Total previsto</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">R$ 62,70</p>
                </div>
              </div>

              <ul className="divide-y divide-border">
                {charges.map(({ day, date, name, category, amount, service }, index) => (
                  <motion.li
                    className="group/charge flex items-center gap-3 rounded-2xl px-2 py-5 transition-colors hover:bg-brand-porcelain/70 sm:gap-5 sm:py-6"
                    key={name}
                    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                    whileHover={{ x: 4 }}
                  >
                    <span className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-brand-porcelain px-2 py-2 text-brand-espresso transition-colors group-hover/charge:bg-brand-gold/35">
                      <span className="text-lg font-semibold leading-none">{day}</span>
                      <span className="mt-1 text-[10px] font-semibold uppercase text-brand-cocoa">out</span>
                    </span>
                    <SubscriptionBrandIcon service={service} size="medium" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink sm:text-base">{name}</span>
                      <span className="mt-1 block text-xs text-ink-muted sm:text-sm">{category} · {date}</span>
                    </span>
                    <span className="text-right text-sm font-semibold text-ink sm:text-base">{amount}</span>
                    {index === 0 && (
                      <span className="hidden rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-medium text-success sm:inline-flex sm:items-center sm:gap-1">
                        <FiCheck aria-hidden="true" size={12} /> no radar
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal className="md:col-span-5" delay={0.1}>
            <motion.div
              className="flex h-full min-h-52 flex-col justify-between rounded-panel border border-brand-espresso/[0.08] bg-white p-6 shadow-[0_20px_60px_-48px_rgba(48,40,32,0.32)] sm:p-7"
              transition={{ type: 'spring', stiffness: 240, damping: 24 }}
              whileHover={{ y: -4, boxShadow: '0 30px 72px -46px rgba(48,40,32,0.42)' }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">Próxima cobrança</p>
                <FiCalendar aria-hidden="true" className="text-ink-muted" size={18} />
              </div>
              <div className="mt-8 flex items-center gap-4">
                <SubscriptionBrandIcon service={services[0]} size="large" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-ink">Netflix</p>
                  <p className="mt-1 text-sm text-ink-muted">12 de outubro</p>
                </div>
                <p className="text-right text-lg font-semibold text-ink">R$ 25,90</p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
                <span className="text-ink-muted">Lembrete da renovação</span>
                <span className="grid size-8 place-items-center rounded-full bg-brand-gold/35 text-brand-espresso">
                  <FiArrowUpRight aria-hidden="true" size={16} />
                </span>
              </div>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal className="md:col-span-5" delay={0.18}>
            <motion.div
              className="flex h-full min-h-52 flex-col rounded-panel border border-brand-espresso/[0.08] bg-white p-6 shadow-[0_20px_60px_-48px_rgba(48,40,32,0.32)] sm:p-7"
              transition={{ type: 'spring', stiffness: 240, damping: 24 }}
              whileHover={{ y: -4, boxShadow: '0 30px 72px -46px rgba(48,40,32,0.42)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">Tudo em dia</p>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">3 assinaturas acompanhadas</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1.5 text-xs font-semibold text-success">
                  <FiCheck aria-hidden="true" size={13} /> Ativas
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {charges.map(({ name, date, service }) => (
                  <motion.li
                    className="flex items-center gap-3 rounded-xl bg-brand-porcelain/60 px-3 py-2 transition-colors hover:bg-brand-gold/20"
                    key={name}
                    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                    whileHover={{ x: 3 }}
                  >
                    <SubscriptionBrandIcon service={service} size="small" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{name}</span>
                    <span className="shrink-0 text-xs text-ink-muted">{date}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

export default UpcomingChargesSection
