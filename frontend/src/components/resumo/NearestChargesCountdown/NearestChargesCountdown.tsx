import { FiClock } from 'react-icons/fi'
import SubscriptionServiceIcon from '../../Assinaturas/SubscriptionServiceIcon/SubscriptionServiceIcon'
import type { Assinatura } from '../../../types/assinatura'
import type { ProximaCobranca } from '../../../types/resumo'

interface NearestChargesCountdownProps {
  items: ProximaCobranca[]
  subscriptions: Assinatura[]
}

function daysUntil(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  const today = new Date()
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const targetUtc = Date.UTC(year, month - 1, day)
  return Math.max(0, Math.round((targetUtc - todayUtc) / 86_400_000))
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
    .format(new Date(year, month - 1, day))
    .replace('.', '')
}

function formatCountdown(days: number) {
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Amanhã'
  return `${days} dias`
}

function NearestChargesCountdown({ items, subscriptions }: NearestChargesCountdownProps) {
  const nearestItems = [...items]
    .sort((a, b) => a.dataProximaCobranca.localeCompare(b.dataProximaCobranca))
    .slice(0, 3)

  return (
    <section aria-labelledby="nearest-charges-title" className="rounded-card border border-border bg-surface p-5 shadow-card sm:p-6">
      <div className="flex items-center gap-2">
        <FiClock aria-hidden="true" className="text-accent" size={17} />
        <h2 className="text-base font-semibold tracking-tight" id="nearest-charges-title">Vencem em breve</h2>
      </div>

      {nearestItems.length === 0 ? (
        <p className="mt-5 rounded-control bg-surface-muted px-4 py-5 text-sm text-ink-muted">
          Nenhuma cobrança próxima por enquanto.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {nearestItems.map((item, index) => {
            const subscription = subscriptions.find(({ codigo }) => codigo === item.assinaturaId)
            const days = daysUntil(item.dataProximaCobranca)

            return (
              <li className="flex items-center gap-3 rounded-2xl bg-surface-raised/60 px-3 py-3" key={`${item.assinaturaId}-${item.dataProximaCobranca}`}>
                <SubscriptionServiceIcon icon={subscription?.icone} name={item.nomeAssinatura} size="compact" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{item.nomeAssinatura}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{formatDate(item.dataProximaCobranca)} · R$ {Number(item.valor).toFixed(2).replace('.', ',')}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ${index === 0 ? 'bg-accent/10 text-accent-strong' : 'bg-surface text-ink-muted'}`}>
                  {formatCountdown(days)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default NearestChargesCountdown
