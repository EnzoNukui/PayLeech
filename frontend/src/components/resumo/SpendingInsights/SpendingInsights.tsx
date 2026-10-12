import { useState, type FormEvent } from 'react'
import { FiArrowDownRight, FiArrowUpRight, FiEdit2, FiLayers } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import SubscriptionServiceIcon from '../../Assinaturas/SubscriptionServiceIcon/SubscriptionServiceIcon'
import Button from '../../ui/Button/Button'
import type { Assinatura } from '../../../types/assinatura'

interface SpendingInsightsProps {
  subscriptions: Assinatura[]
  monthlyLimit: number
  onUpdateMonthlyLimit: (value: number) => Promise<void>
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const monthsPerCharge = { MENSAL: 1, TRIMESTRAL: 3, ANUAL: 12 } as const

function monthlyCost(subscription: Assinatura) {
  return Number(subscription.valor) / monthsPerCharge[subscription.periodicidade]
}

function billingLabel(subscription: Assinatura) {
  const cadence = subscription.periodicidade === 'MENSAL'
    ? 'por mês'
    : subscription.periodicidade === 'TRIMESTRAL'
      ? 'a cada 3 meses'
      : 'por ano'
  return `${currency.format(subscription.valor)} ${cadence}`
}

function SpendingInsights({ subscriptions, monthlyLimit, onUpdateMonthlyLimit }: SpendingInsightsProps) {
  const [editingLimit, setEditingLimit] = useState(false)
  const [draftLimit, setDraftLimit] = useState(String(monthlyLimit))
  const [savingLimit, setSavingLimit] = useState(false)
  const [limitError, setLimitError] = useState<string | null>(null)

  const ranked = [...subscriptions].sort((a, b) => monthlyCost(b) - monthlyCost(a))
  const highest = ranked[0]
  const lowest = ranked.at(-1)
  const monthlyTotal = subscriptions.reduce((total, subscription) => total + monthlyCost(subscription), 0)
  const categories = Object.values(subscriptions.reduce<Record<string, { name: string; amount: number; count: number }>>((result, subscription) => {
    const name = subscription.categoria?.nome || 'Sem categoria'
    const key = name.toLocaleLowerCase('pt-BR')
    result[key] ??= { name, amount: 0, count: 0 }
    result[key].amount += monthlyCost(subscription)
    result[key].count += 1
    return result
  }, {})).sort((a, b) => b.amount - a.amount)
  const biggestCategory = categories[0]?.amount ?? 0
  const isOverLimit = monthlyTotal > monthlyLimit
  const usedPercent = monthlyLimit > 0 ? monthlyTotal / monthlyLimit * 100 : monthlyTotal > 0 ? 100 : 0
  const gaugePercent = Math.min(usedPercent, 100)
  const amountAvailable = Math.max(monthlyLimit - monthlyTotal, 0)
  const amountOver = Math.max(monthlyTotal - monthlyLimit, 0)

  async function saveLimit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = Number(draftLimit)
    if (!Number.isFinite(value) || value < 0) {
      setLimitError('Informe um limite igual ou maior que zero.')
      return
    }

    setSavingLimit(true)
    setLimitError(null)
    try {
      await onUpdateMonthlyLimit(value)
      setEditingLimit(false)
    } catch (error) {
      setLimitError(error instanceof Error ? error.message : 'Não foi possível salvar o limite.')
    } finally {
      setSavingLimit(false)
    }
  }

  function startEditingLimit() {
    setDraftLimit(String(monthlyLimit))
    setLimitError(null)
    setEditingLimit(true)
  }

  return (
    <section aria-labelledby="spending-insights-title" className="rounded-card border border-border bg-surface p-5 shadow-card sm:p-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight" id="spending-insights-title">Análise financeira</h2>
        <p className="mt-1 text-sm text-ink-muted">Seu custo mensal equivalente comparado ao limite definido para as assinaturas.</p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {highest && <article className="relative overflow-hidden rounded-2xl border border-accent/15 bg-accent-soft/55 p-4 sm:p-5">
            <span aria-hidden="true" className="absolute -right-5 -top-8 size-28 rounded-full bg-white/35 blur-2xl" />
            <div className="relative flex items-start gap-3.5">
              <SubscriptionServiceIcon icon={highest.icone} name={highest.nome} size="compact" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-strong"><FiArrowUpRight aria-hidden="true" size={13} /> Maior custo mensal</div>
                <p className="mt-1 truncate text-sm font-semibold text-ink" title={highest.nome}>{highest.nome}</p>
                <p className="mt-0.5 truncate text-xs text-ink-muted">{highest.categoria?.nome || 'Sem categoria'} · {billingLabel(highest)}</p>
                <p className="mt-3 text-lg font-semibold tabular-nums tracking-tight text-ink">{currency.format(monthlyCost(highest))}<span className="ml-1 text-xs font-medium text-ink-muted">/mês equivalente</span></p>
              </div>
            </div>
          </article>}

          {lowest && <article className="rounded-2xl border border-border bg-surface-raised p-4 sm:p-5">
            <div className="flex items-start gap-3.5">
              <SubscriptionServiceIcon icon={lowest.icone} name={lowest.nome} size="compact" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-success"><FiArrowDownRight aria-hidden="true" size={13} /> Menor custo mensal</div>
                <p className="mt-1 truncate text-sm font-semibold text-ink" title={lowest.nome}>{lowest.nome}</p>
                <p className="mt-0.5 truncate text-xs text-ink-muted">{lowest.categoria?.nome || 'Sem categoria'} · {billingLabel(lowest)}</p>
                <p className="mt-3 text-lg font-semibold tabular-nums tracking-tight text-ink">{currency.format(monthlyCost(lowest))}<span className="ml-1 text-xs font-medium text-ink-muted">/mês equivalente</span></p>
              </div>
            </div>
          </article>}

          {subscriptions.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-surface-muted/60 px-5 py-7 text-center sm:col-span-2 lg:col-span-1">
            <p className="text-sm font-semibold text-ink">Ainda não há serviços ativos</p>
            <p className="mt-1 text-xs leading-5 text-ink-muted">Cadastre assinaturas para acompanhar o custo mensal e a distribuição por categoria.</p>
            <Link className="mt-3 inline-flex text-sm font-semibold text-accent hover:text-accent-strong" to="/assinaturas">Adicionar assinatura</Link>
          </div>}
        </div>

        <div className="rounded-2xl border border-border bg-canvas/65 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-ink">Limite mensal</h3>
              <p className="mt-0.5 text-[11px] text-ink-muted">Gasto equivalente · {currency.format(monthlyLimit)} definidos</p>
            </div>
            {!editingLimit && <Button aria-label="Editar limite mensal" className="-mr-2 -mt-2" onClick={startEditingLimit} size="sm" variant="quiet">
              <FiEdit2 aria-hidden="true" size={14} /> Editar
            </Button>}
          </div>

          {editingLimit ? (
            <form className="mt-4" onSubmit={(event) => void saveLimit(event)}>
              <label className="text-xs font-medium text-ink" htmlFor="monthly-subscription-limit">Novo limite por mês</label>
              <div className="mt-1.5 flex items-center gap-2">
                <span aria-hidden="true" className="text-sm text-ink-muted">R$</span>
                <input
                  autoFocus
                  className="min-w-0 flex-1 rounded-control border border-border bg-surface px-3 py-2 text-sm tabular-nums outline-none focus:border-accent"
                  id="monthly-subscription-limit"
                  min="0"
                  onChange={(event) => setDraftLimit(event.target.value)}
                  required
                  step="0.01"
                  type="number"
                  value={draftLimit}
                />
                <Button disabled={savingLimit} loading={savingLimit} size="sm" type="submit">Salvar</Button>
                <Button aria-label="Cancelar edição do limite" disabled={savingLimit} onClick={() => setEditingLimit(false)} size="sm" variant="quiet">Cancelar</Button>
              </div>
              {limitError && <p className="mt-2 text-xs text-danger" role="alert">{limitError}</p>}
            </form>
          ) : (
            <div className="mt-1">
              <div aria-label={`${Math.round(usedPercent)}% do limite mensal utilizado`} className="relative mx-auto h-[112px] w-full max-w-56" role="img">
                <svg aria-hidden="true" className="absolute inset-0 size-full overflow-visible" fill="none" viewBox="0 0 192 110">
                  <path d="M 16 98 A 80 80 0 0 1 176 98" pathLength="100" stroke="var(--color-border)" strokeLinecap="round" strokeWidth="13" />
                  <path
                    d="M 16 98 A 80 80 0 0 1 176 98"
                    pathLength="100"
                    stroke={isOverLimit ? 'var(--color-danger)' : 'var(--color-accent)'}
                    strokeDasharray={`${gaugePercent} 100`}
                    strokeLinecap="round"
                    strokeWidth="13"
                  />
                </svg>
                <div className="absolute inset-x-0 bottom-0 text-center">
                  <p className="text-xl font-semibold tracking-tight tabular-nums text-ink">{currency.format(monthlyTotal)}</p>
                  <p className="text-[10px] font-medium text-ink-muted">gasto mensal equivalente</p>
                </div>
              </div>
              <p className={`mt-2 text-center text-xs font-medium ${isOverLimit ? 'text-danger' : 'text-ink-muted'}`}>
                {isOverLimit
                  ? `${currency.format(amountOver)} acima do limite`
                  : `${currency.format(amountAvailable)} disponíveis neste limite`}
                {monthlyLimit > 0 && <span> · {Math.round(usedPercent)}% utilizado</span>}
              </p>
            </div>
          )}

          <div className="mt-5 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-surface text-accent"><FiLayers aria-hidden="true" size={15} /></span>
              <div>
                <h3 className="text-sm font-semibold text-ink">Por categoria</h3>
                <p className="text-[11px] text-ink-muted">Gasto mensal equivalente</p>
              </div>
            </div>
            {categories.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {categories.map((category) => (
                  <li key={category.name}>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="min-w-0 truncate font-medium text-ink">{category.name}<span className="ml-1.5 font-normal text-ink-muted">· {category.count}</span></span>
                      <span className="shrink-0 font-semibold tabular-nums text-ink">{currency.format(category.amount)}</span>
                    </div>
                    <div aria-hidden="true" className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border/70">
                      <div className="h-full rounded-full bg-accent/75 transition-[width] duration-500" style={{ width: `${Math.max((category.amount / biggestCategory) * 100, 3)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-3 text-xs text-ink-muted">A distribuição por categoria aparecerá quando você cadastrar uma assinatura.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SpendingInsights
