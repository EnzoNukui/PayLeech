import type { IconType } from 'react-icons'

interface MetricCardProps {
  label: string
  value: string
  detail: string
  icon: IconType
}

function MetricCard({ label, value, detail, icon: Icon }: MetricCardProps) {
  return (
    <article className="rounded-card border border-border bg-surface p-5 shadow-card sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-ink-muted">{label}</p>
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
          <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">{value}</p>
      <p className="mt-1.5 text-xs leading-5 text-ink-muted">{detail}</p>
    </article>
  )
}

export default MetricCard
