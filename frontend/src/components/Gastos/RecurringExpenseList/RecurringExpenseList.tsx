import { useState } from 'react'
import type { Cobranca } from '../../../types/cobranca'

interface RecurringExpenseListProps {
  items: Cobranca[]
  year: number
  status: 'TODAS' | 'PAGA' | 'PREVISTA'
  onStatusChange: (status: 'TODAS' | 'PAGA' | 'PREVISTA') => void
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function formatDate(value: string | null) {
  if (!value) return 'Data não informada'
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
    .format(new Date(year, month - 1, day))
    .replace('.', '')
}

function chargeDate(item: Cobranca) {
  return item.status === 'PAGA' ? item.dataPagamento ?? item.dataPrevista : item.dataPrevista
}

function formatMonth(value: string) {
  const [year, month] = value.split('-').map(Number)
  const label = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
    .format(new Date(year, month - 1, 1))
  return label.charAt(0).toLocaleUpperCase('pt-BR') + label.slice(1)
}

const monthNames = Array.from({ length: 12 }, (_, index) =>
  new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(2020, index, 1)),
)
const shortMonthNames = Array.from({ length: 12 }, (_, index) =>
  new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(2020, index, 1)).replace('.', ''),
)

function currentMonthKey() {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
}

function RecurringExpenseList({ items, year, status, onStatusChange }: RecurringExpenseListProps) {
  const [currentMonth] = useState(currentMonthKey)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const statuses: Array<{ value: 'TODAS' | 'PAGA' | 'PREVISTA'; label: string }> = [
    { value: 'TODAS', label: 'Todas' }, { value: 'PAGA', label: 'Já venceram' }, { value: 'PREVISTA', label: 'Próximas' },
  ]
  const currentYear = Number(currentMonth.slice(0, 4))
  const months = monthNames.map((name, index) => ({
    value: `${year}-${String(index + 1).padStart(2, '0')}`,
    label: `${name.charAt(0).toLocaleUpperCase('pt-BR')}${name.slice(1)}`,
    shortLabel: `${shortMonthNames[index].charAt(0).toLocaleUpperCase('pt-BR')}${shortMonthNames[index].slice(1)}`,
  }))
  const activeMonth = selectedMonth.startsWith(`${year}-`) && months.some((month) => month.value === selectedMonth)
    ? selectedMonth
    : year === currentYear
      ? currentMonth
      : `${year}-01`
  const monthItems = items.filter((item) => chargeDate(item).slice(0, 7) === activeMonth)
  const monthTotal = monthItems.reduce((sum, item) => sum + Number(
    item.status === 'PAGA' ? item.valorPago ?? item.valorPrevisto : item.valorPrevisto,
  ), 0)

  return (
    <section aria-labelledby="recurring-expenses-title" className="rounded-card border border-border bg-surface p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight" id="recurring-expenses-title">Despesas do período</h2>
          <p className="mt-1 text-sm text-ink-muted">Vencimentos passados são considerados pagos automaticamente na data prevista.</p>
        </div>
        <div>
          <p className="mb-2.5 text-xs font-medium text-ink-muted">Mês de vencimento</p>
          <div aria-label="Filtrar despesas por mês" className="grid grid-cols-4 gap-2 sm:grid-cols-6 xl:grid-cols-12" role="group">
            {months.map((month) => {
              const count = items.filter((item) => chargeDate(item).slice(0, 7) === month.value).length
              const isSelected = activeMonth === month.value
              return (
                <button
                  aria-label={`${month.label} de ${year}: ${count} ${count === 1 ? 'cobrança' : 'cobranças'}`}
                  aria-pressed={isSelected}
                  className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-2 transition-all duration-200 ${isSelected ? 'border-accent bg-accent text-white shadow-card' : 'border-border bg-surface-raised/60 text-ink-muted hover:border-accent/40 hover:bg-surface-muted hover:text-ink'}`}
                  key={month.value}
                  onClick={() => setSelectedMonth(month.value)}
                  type="button"
                >
                  <span className={`text-xs font-semibold ${isSelected ? '' : 'text-ink'}`}>{month.shortLabel}</span>
                  <span className={`text-[10px] tabular-nums ${isSelected ? 'text-white/75' : 'text-ink-muted'}`}>
                    {count > 0 ? count : '—'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex justify-start sm:justify-end">
          <div aria-label="Filtrar despesas por vencimento" className="flex flex-wrap gap-1 rounded-control bg-surface-muted p-1" role="group">
            {statuses.map((option) => (
              <button
                aria-pressed={status === option.value}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${status === option.value ? 'bg-surface text-ink shadow-card' : 'text-ink-muted hover:text-ink'}`}
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                type="button"
              >{option.label}</button>
            ))}
          </div>
        </div>
      </div>

      {monthItems.length === 0 ? (
        <div className="mt-6 flex min-h-32 items-center justify-center rounded-control bg-surface-muted px-5 text-center text-sm text-ink-muted">
          Não há despesas neste mês com esse filtro.
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-2xl border border-border">
          <div className="flex items-center justify-between gap-4 bg-surface-raised/60 px-4 py-3.5 sm:px-5">
            <span className="text-sm font-semibold text-ink">{formatMonth(activeMonth)}</span>
            <span className="text-xs text-ink-muted">
              {monthItems.length} {monthItems.length === 1 ? 'cobrança' : 'cobranças'} · {currency.format(monthTotal)}
            </span>
          </div>
          <ul className="divide-y divide-border px-4 sm:px-5">
            {monthItems.map((item) => {
              const jaVenceu = item.status === 'PAGA'
              const amount = jaVenceu ? item.valorPago ?? item.valorPrevisto : item.valorPrevisto
              return (
                <li className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4 first:pt-4 last:pb-4" key={item.id}>
                  <div className="min-w-0 flex-1 basis-44">
                    <p className="truncate text-sm font-medium text-ink">{item.nomeAssinatura}</p>
                    <p className="mt-1 truncate text-xs text-ink-muted">{item.categoriaNome || 'Sem categoria'} · {formatDate(chargeDate(item))}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${jaVenceu ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'}`}>
                    {jaVenceu ? 'Pago' : 'Próxima'}
                  </span>
                  <p className="min-w-24 text-right text-sm font-semibold tabular-nums text-ink">{currency.format(amount)}</p>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}

export default RecurringExpenseList
