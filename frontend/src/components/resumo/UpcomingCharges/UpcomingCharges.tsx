import { FiArrowUpRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import SubscriptionServiceIcon from '../../Assinaturas/SubscriptionServiceIcon/SubscriptionServiceIcon'
import type { Assinatura } from '../../../types/assinatura'
import type { ProximaCobranca } from '../../../types/resumo'

interface UpcomingChargesProps {
  items: ProximaCobranca[]
  subscriptions: Assinatura[]
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function formatDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
    .format(new Date(year, month - 1, day))
    .replace('.', '')
}

function getYear(value: string) {
  return value.split('-')[0]
}

function billingCadence(periodicidade: ProximaCobranca['periodicidade']) {
  if (periodicidade === 'TRIMESTRAL') return 'a cada 3 meses'
  if (periodicidade === 'ANUAL') return 'por ano'
  return 'por mês'
}

function UpcomingCharges({ items, subscriptions }: UpcomingChargesProps) {
  const sortedItems = [...items].sort((a, b) => a.dataProximaCobranca.localeCompare(b.dataProximaCobranca))

  return (
    <section className="rounded-card border border-border bg-surface p-5 shadow-card sm:p-6" aria-labelledby="upcoming-charges-title">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight" id="upcoming-charges-title">Próximas cobranças</h2>
          <p className="mt-1 text-sm text-ink-muted">Veja quando cada serviço será cobrado.</p>
        </div>
        <Link className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-strong" to="/assinaturas">
          Ver assinaturas <FiArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 flex min-h-28 items-center justify-center rounded-control bg-surface-muted px-5 text-center text-sm text-ink-muted">
          Nenhuma cobrança próxima por enquanto.
        </div>
      ) : (
        <ul className="mt-5 space-y-2">
          {sortedItems.map((item, index) => {
            const subscription = subscriptions.find(({ codigo }) => codigo === item.assinaturaId)
            const isNearest = index === 0

            return (
              <li className={`flex items-center gap-3 rounded-2xl border px-3 py-3 sm:gap-5 sm:px-4 ${isNearest ? 'border-accent/20 bg-accent-soft/45' : 'border-transparent bg-surface-raised/60'}`} key={`${item.assinaturaId}-${item.dataProximaCobranca}`}>
                <SubscriptionServiceIcon icon={subscription?.icone} name={item.nomeAssinatura} size="compact" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="truncate text-sm font-medium">{item.nomeAssinatura}</p>
                    {isNearest && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent-strong">Mais próxima</span>}
                  </div>
                  <p className="mt-1 truncate text-xs text-ink-muted">{item.categoriaNome}</p>
                </div>
                <div className="ml-auto grid shrink-0 grid-cols-[4.25rem_5.25rem] gap-x-2 text-right sm:grid-cols-[5rem_6rem] sm:gap-x-5">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">Data</p>
                    <p className={`mt-0.5 whitespace-nowrap text-sm font-semibold tabular-nums tracking-tight ${isNearest ? 'text-accent-strong' : 'text-ink'}`}>
                      {formatDate(item.dataProximaCobranca)}
                    </p>
                    <p className="text-[10px] font-medium tabular-nums text-ink-muted">{getYear(item.dataProximaCobranca)} · {billingCadence(item.periodicidade)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">Valor</p>
                    <p className={`mt-0.5 whitespace-nowrap text-sm font-semibold tabular-nums tracking-tight ${isNearest ? 'text-accent-strong' : 'text-ink'}`}>
                      {currency.format(item.valor)}
                    </p>
                    <p className="text-[10px] font-medium text-ink-muted">{billingCadence(item.periodicidade)}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default UpcomingCharges
