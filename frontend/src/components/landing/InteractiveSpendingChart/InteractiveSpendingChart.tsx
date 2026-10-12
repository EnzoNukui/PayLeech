import { useState } from 'react'
import { motion } from 'motion/react'

const monthlySpend = [
  { month: 'Jan', amount: 65 },
  { month: 'Fev', amount: 72 },
  { month: 'Mar', amount: 78 },
  { month: 'Abr', amount: 84 },
  { month: 'Mai', amount: 80 },
  { month: 'Jun', amount: 91 },
  { month: 'Jul', amount: 98 },
  { month: 'Ago', amount: 88 },
  { month: 'Set', amount: 96 },
  { month: 'Out', amount: 87.9 },
  { month: 'Nov', amount: 104 },
  { month: 'Dez', amount: 112 },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}

function InteractiveSpendingChart() {
  const [activeMonth, setActiveMonth] = useState(9)
  const selected = monthlySpend[activeMonth]

  return (
    <div className="w-full" aria-label="Gráfico interativo de gastos mensais">
      <div aria-live="polite" className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-current/70">Total em {selected.month}</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-current sm:text-4xl">{formatCurrency(selected.amount)}</p>
        </div>
        <p className="text-xs text-current/60">Últimos 12 meses</p>
      </div>

      <div className="relative flex h-64 items-end gap-1 border-b border-current/15 px-1 sm:h-72 sm:gap-2">
        {[40, 95, 150, 205].map((line) => (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-current/10"
            key={line}
            style={{ bottom: line }}
          />
        ))}
        {monthlySpend.map(({ month, amount }, index) => {
          const isActive = activeMonth === index
          const height = `${(amount / 120) * 100}%`

          return (
            <button
              aria-label={`${month}: ${formatCurrency(amount)}`}
              aria-pressed={isActive}
              className="group relative z-10 flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2 focus-visible:outline-accent"
              key={month}
              onClick={() => setActiveMonth(index)}
              onFocus={() => setActiveMonth(index)}
              onMouseEnter={() => setActiveMonth(index)}
              type="button"
            >
              <motion.span
                className={`w-full max-w-9 origin-bottom rounded-t-md transition-colors ${isActive ? 'bg-brand-gold' : 'bg-brand-cocoa/30 group-hover:bg-brand-cocoa/55'}`}
                initial={{ scaleY: 0 }}
                style={{ height }}
                transition={{ delay: 0.04 * index, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
              />
              <span className={`text-[10px] sm:text-xs ${isActive ? 'font-semibold text-current' : 'text-current/60'}`}>
                {month}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default InteractiveSpendingChart
