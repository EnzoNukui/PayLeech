import { FiSearch, FiX } from 'react-icons/fi'
import Select, { type SelectOption } from '../../ui/Select/Select'
import type { StatusAssinatura } from '../../../types/assinatura'

interface SubscriptionFiltersProps {
  search: string
  status: StatusAssinatura | ''
  categoryId: number | ''
  categories: SelectOption[]
  onSearchChange: (value: string) => void
  onStatusChange: (value: StatusAssinatura | '') => void
  onCategoryChange: (value: number | '') => void
  onClear: () => void
}

const statusOptions: SelectOption[] = [
  { value: 'ATIVA', label: 'Ativas' },
  { value: 'PAUSADA', label: 'Pausadas' },
  { value: 'CANCELADA', label: 'Canceladas' },
]

function SubscriptionFilters({
  search,
  status,
  categoryId,
  categories,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onClear,
}: SubscriptionFiltersProps) {
  const hasFilters = Boolean(search || status || categoryId)

  return (
    <section aria-label="Filtros de assinaturas" className="rounded-card border border-border bg-surface p-4 shadow-card sm:p-5">
      <div className="grid gap-4 md:grid-cols-[minmax(14rem,1.5fr)_minmax(10rem,1fr)_minmax(10rem,1fr)_auto] md:items-end">
        <div className="w-full">
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="subscription-search">Buscar assinatura</label>
          <div className="relative">
            <FiSearch aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={17} />
            <input
              className="h-11 w-full rounded-control border border-border bg-surface-raised pl-10 pr-3.5 text-sm text-ink outline-none transition placeholder:text-ink-muted/75 hover:border-[#c9b9a8] focus:border-accent focus:ring-4 focus:ring-accent/10"
              id="subscription-search"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Nome do serviço"
              type="search"
              value={search}
            />
          </div>
        </div>
        <Select
          label="Status"
          name="status-filter"
          onChange={(event) => onStatusChange(event.target.value as StatusAssinatura | '')}
          options={statusOptions}
          placeholder="Todos os status"
          value={status}
        />
        <Select
          label="Categoria"
          name="category-filter"
          onChange={(event) => onCategoryChange(event.target.value ? Number(event.target.value) : '')}
          options={categories}
          placeholder="Todas as categorias"
          value={categoryId}
        />
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-control px-3 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink disabled:pointer-events-none disabled:opacity-0"
          disabled={!hasFilters}
          onClick={onClear}
          type="button"
        >
          <FiX aria-hidden="true" size={16} />
          Limpar
        </button>
      </div>
    </section>
  )
}

export default SubscriptionFilters
