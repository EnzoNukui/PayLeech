import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import SubscriptionServiceIcon from '../SubscriptionServiceIcon/SubscriptionServiceIcon'
import type { Assinatura, StatusAssinatura } from '../../../types/assinatura'

interface SubscriptionCardProps {
  assinatura: Assinatura
  onEdit: (assinatura: Assinatura) => void
  onDelete: (assinatura: Assinatura) => void
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const statusLabels: Record<StatusAssinatura, string> = {
  ATIVA: 'Ativa',
  PAUSADA: 'Pausada',
  CANCELADA: 'Cancelada',
}
const statusStyles: Record<StatusAssinatura, string> = {
  ATIVA: 'bg-success-soft text-success',
  PAUSADA: 'bg-warning-soft text-warning',
  CANCELADA: 'bg-surface-muted text-ink-muted',
}
const periodicityLabels = {
  MENSAL: 'por mês',
  TRIMESTRAL: 'a cada 3 meses',
  ANUAL: 'por ano',
} as const

function SubscriptionCard({ assinatura, onEdit, onDelete }: SubscriptionCardProps) {
  return (
    <article className="group flex flex-col gap-4 rounded-card border border-border bg-surface p-4 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-[#d7c8b8] hover:shadow-lg sm:flex-row sm:items-center sm:gap-5 sm:p-5">
      <SubscriptionServiceIcon icon={assinatura.icone} name={assinatura.nome} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="truncate text-base font-semibold tracking-tight">{assinatura.nome}</h2>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[assinatura.statusAssinatura]}`}>
            {statusLabels[assinatura.statusAssinatura]}
          </span>
        </div>
        <p className="mt-1.5 truncate text-sm text-ink-muted">
          {assinatura.categoria.nome} <span aria-hidden="true">·</span> {periodicityLabels[assinatura.periodicidade]}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border pt-3 sm:border-0 sm:pt-0">
        <p className="whitespace-nowrap text-base font-semibold tabular-nums">
          {currency.format(assinatura.valor)}
          <span className="ml-1 text-xs font-normal text-ink-muted">{assinatura.periodicidade === 'MENSAL' ? '/mês' : ''}</span>
        </p>
        <div className="flex items-center gap-1">
          <button
            aria-label={`Editar ${assinatura.nome}`}
            className="grid size-10 place-items-center rounded-xl text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
            onClick={() => onEdit(assinatura)}
            type="button"
          >
            <FiEdit2 aria-hidden="true" size={17} />
          </button>
          <button
            aria-label={`Excluir ${assinatura.nome}`}
            className="grid size-10 place-items-center rounded-xl text-ink-muted transition-colors hover:bg-danger-soft hover:text-danger"
            onClick={() => onDelete(assinatura)}
            type="button"
          >
            <FiTrash2 aria-hidden="true" size={17} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default SubscriptionCard
