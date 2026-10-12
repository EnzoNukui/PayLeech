import { useMemo, useState } from 'react'
import { FiCheck, FiPlus, FiSearch } from 'react-icons/fi'
import SubscriptionServiceIcon from '../SubscriptionServiceIcon/SubscriptionServiceIcon'
import { suggestedServices, type ServiceSuggestion } from '../../../data/subscriptionCatalog'

interface ServiceCatalogSelectProps {
  onSelect: (service: ServiceSuggestion) => void
  onCustom: () => void
}

function ServiceCatalogSelect({ onSelect, onCustom }: ServiceCatalogSelectProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todos')
  const categories = useMemo(() => ['Todos', ...new Set(suggestedServices.map((service) => service.categoria))], [])
  const filteredServices = useMemo(() => suggestedServices.filter((service) => {
    const matchesCategory = category === 'Todos' || service.categoria === category
    const matchesQuery = service.nome.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR'))
    return matchesCategory && matchesQuery
  }), [category, query])

  return (
    <section aria-labelledby="service-catalog-title" className="rounded-2xl border border-border bg-surface-raised/70 p-3.5 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink" id="service-catalog-title">Serviços conhecidos</h3>
          <p className="mt-1 text-xs leading-5 text-ink-muted">Escolha um para preencher o nome e a categoria.</p>
        </div>
        <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">{suggestedServices.length} opções</span>
      </div>

      <label className="relative mt-3 block">
        <span className="sr-only">Buscar serviços</span>
        <FiSearch aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={15} />
        <input
          className="h-10 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/80 focus:border-accent/50 focus:ring-2 focus:ring-accent/10"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar Netflix, Spotify, ChatGPT…"
          type="search"
          value={query}
        />
      </label>

      <div aria-label="Filtrar por categoria" className="mt-3 flex flex-wrap gap-1.5" role="group">
        {categories.map((item) => (
          <button
            aria-pressed={category === item}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${category === item ? 'bg-ink text-white' : 'bg-surface-muted text-ink-muted hover:bg-accent/10 hover:text-ink'}`}
            key={item}
            onClick={() => setCategory(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>

      <div
        aria-label="Serviços sugeridos. Role a lista para ver todas as opções."
        className="mt-3 max-h-60 overflow-y-auto overscroll-contain pr-1"
        role="region"
        tabIndex={0}
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {filteredServices.map((service) => {
            return (
              <button
                className="group flex min-w-0 items-center gap-2 rounded-xl border border-border bg-surface p-2 text-left transition duration-200 hover:-translate-y-0.5 hover:border-accent/35 hover:bg-accent/5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={`Escolher ${service.nome}`}
                key={service.id}
                onClick={() => onSelect(service)}
                type="button"
              >
                <SubscriptionServiceIcon name={service.nome} size="compact" />
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{service.nome}</span>
                <FiCheck aria-hidden="true" className="shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100" size={14} />
              </button>
            )
          })}
          {filteredServices.length === 0 && <p className="col-span-full rounded-xl bg-surface px-3 py-4 text-center text-xs text-ink-muted">Nenhum serviço encontrado. Você pode cadastrar outro.</p>}
        </div>
      </div>

      <button
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-ink"
        onClick={() => { setQuery(''); onCustom() }}
        type="button"
      >
        <FiPlus aria-hidden="true" size={14} /> Cadastrar outro serviço
      </button>
    </section>
  )
}

export default ServiceCatalogSelect
