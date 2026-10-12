import { FiCheckCircle, FiClock } from 'react-icons/fi'

interface MonthlyChargesSummaryProps {
  paidAmount: number
  paidCount: number
  dueAmount: number
  dueCount: number
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function MonthlyChargesSummary({ paidAmount, paidCount, dueAmount, dueCount }: MonthlyChargesSummaryProps) {
  return (
    <section aria-labelledby="monthly-charges-summary-title" className="rounded-card border border-border bg-surface p-5 shadow-card sm:p-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold tracking-tight" id="monthly-charges-summary-title">Resumo deste mês</h2>
        <p className="mt-1 text-xs text-ink-muted">Pagamentos e cobranças previstos para o mês atual.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <article className="flex items-start gap-3 rounded-2xl bg-success-soft/65 p-4 sm:p-5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface text-success">
            <FiCheckCircle aria-hidden="true" size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-ink-muted">Pago neste mês</p>
            <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums text-ink">{currency.format(paidAmount)}</p>
            <p className="mt-1 text-xs text-ink-muted">{paidCount} {paidCount === 1 ? 'cobrança' : 'cobranças'} · vencimentos passados considerados pagos</p>
          </div>
        </article>

        <article className="flex items-start gap-3 rounded-2xl bg-warning-soft/70 p-4 sm:p-5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface text-warning">
            <FiClock aria-hidden="true" size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-ink-muted">A vencer neste mês</p>
            <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums text-ink">{currency.format(dueAmount)}</p>
            <p className="mt-1 text-xs text-ink-muted">{dueCount} {dueCount === 1 ? 'cobrança prevista' : 'cobranças previstas'}</p>
          </div>
        </article>
      </div>
    </section>
  )
}

export default MonthlyChargesSummary
