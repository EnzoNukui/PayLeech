import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FiCalendar, FiCreditCard } from 'react-icons/fi'

interface AnnualSpendingChartProps {
  months: Array<{ label: string; amount: number; count: number }>
  currency: Intl.NumberFormat
  year: number
}

function AnnualSpendingChart({ months, currency, year }: AnnualSpendingChartProps) {
  const [activeMonth, setActiveMonth] = useState<string | null>(null)
  const maxAmount = Math.max(...months.map((month) => month.amount), 0)
  const hasData = maxAmount > 0
  const peak = months.reduce((current, month) => month.amount > current.amount ? month : current, months[0])
  const magnitude = hasData ? 10 ** Math.floor(Math.log10(maxAmount)) : 1
  const normalizedMax = maxAmount / magnitude
  const axisMax = (normalizedMax <= 1 ? 1 : normalizedMax <= 2 ? 2 : normalizedMax <= 5 ? 5 : 10) * magnitude
  const axisCurrency = new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1,
  })
  const axisTicks = [1, 0.75, 0.5, 0.25, 0]

  return (
    <section aria-labelledby="annual-spending-title" className="rounded-card border border-border bg-surface p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight" id="annual-spending-title">Gastos ao longo do ano</h2>
          <p className="mt-1 text-sm text-ink-muted">Cada vencimento passado é considerado pago na data cadastrada.</p>
        </div>
        {hasData && <p className="text-xs text-ink-muted">Maior gasto: <span className="font-semibold text-ink">{peak.label} · {currency.format(peak.amount)}</span></p>}
      </div>

      {hasData ? (
        <div aria-label="Gráfico de cobranças por mês" className="mt-7" role="group">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 sm:gap-4">
            <div aria-label="Escala de gastos em reais" className="flex h-40 flex-col justify-between pb-0.5 text-right text-[10px] tabular-nums text-ink-muted sm:h-48 sm:text-xs">
              {axisTicks.map((tick) => <span key={tick}>{axisCurrency.format(axisMax * tick)}</span>)}
            </div>
            <div>
              <div className="relative h-40 sm:h-48">
                {axisTicks.map((tick) => (
                  <div className="pointer-events-none absolute inset-x-0 border-t border-border/70" key={tick} style={{ top: `${(1 - tick) * 100}%` }} />
                ))}
                <div className="relative grid h-full grid-cols-6 items-end gap-2 px-1 sm:grid-cols-12 sm:gap-3">
                  {months.map((month, index) => {
                    const height = month.amount > 0 ? Math.max((month.amount / axisMax) * 100, 2) : 0
                    const tooltipPosition = index === 0
                      ? 'left-0'
                      : index === months.length - 1
                        ? 'right-0'
                        : 'left-1/2 -translate-x-1/2'
                    return (
                      <button
                        aria-label={`${month.label}: ${currency.format(month.amount)}, ${month.count} ${month.count === 1 ? 'cobrança' : 'cobranças'}`}
                        className="group relative flex h-full min-w-0 items-end justify-center bg-transparent p-0 focus-visible:z-30"
                        key={month.label}
                        onBlur={() => setActiveMonth((current) => current === month.label ? null : current)}
                        onClick={() => setActiveMonth(month.label)}
                        onFocus={() => setActiveMonth(month.label)}
                        onMouseEnter={() => setActiveMonth(month.label)}
                        onMouseLeave={() => setActiveMonth((current) => current === month.label ? null : current)}
                        type="button"
                      >
                        <div
                          className={`w-full max-w-10 rounded-t-lg transition-[height,background-color,box-shadow] duration-300 ${activeMonth === month.label ? 'bg-accent shadow-[0_0_0_3px_rgb(128_99_75_/_12%)]' : 'bg-accent/70 group-hover:bg-accent'}`}
                          style={{ height: `${height}%` }}
                        />
                        <AnimatePresence>
                          {activeMonth === month.label && (
                            <motion.div
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              className={`pointer-events-none absolute bottom-full z-50 mb-3 w-40 sm:w-44 ${tooltipPosition}`}
                              exit={{ opacity: 0, y: 5, scale: 0.97 }}
                              initial={{ opacity: 0, y: 8, scale: 0.96 }}
                              role="tooltip"
                              transition={{ duration: 0.16, ease: 'easeOut' }}
                            >
                              <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface-raised text-left shadow-[0_16px_38px_-18px_rgba(48,40,32,0.38)] ring-1 ring-white/70">
                                <div className="flex items-center gap-2 border-b border-border/70 bg-accent-soft/65 px-3 py-2">
                                  <span className="grid size-6 place-items-center rounded-lg bg-surface text-accent shadow-sm"><FiCalendar aria-hidden="true" size={13} /></span>
                                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-strong">{month.label} · {year}</span>
                                </div>
                                <div className="px-3 pb-3 pt-2.5">
                                  <p className="text-[10px] font-medium text-ink-muted">Total previsto</p>
                                  <p className="mt-0.5 text-lg font-semibold tracking-tight tabular-nums text-ink">{currency.format(month.amount)}</p>
                                  <div className="mt-2 flex items-center justify-between border-t border-border/70 pt-2">
                                    <span className="flex items-center gap-1.5 text-[10px] font-medium text-ink-muted"><FiCreditCard aria-hidden="true" size={12} /> Cobranças</span>
                                    <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold tabular-nums text-ink">{month.count}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="grid grid-cols-6 gap-2 px-1 pt-2 sm:grid-cols-12 sm:gap-3">
                {months.map((month) => <span className="text-center text-[10px] font-medium text-ink-muted sm:text-xs" key={month.label}>{month.label}</span>)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex min-h-48 items-center justify-center rounded-control bg-surface-muted px-6 text-center">
          <div>
            <p className="text-sm font-medium text-ink">Ainda não há vencimentos neste ano.</p>
            <p className="mt-1 text-xs leading-5 text-ink-muted">Quando suas assinaturas tiverem cobranças no período, os gastos aparecerão aqui automaticamente.</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default AnnualSpendingChart
