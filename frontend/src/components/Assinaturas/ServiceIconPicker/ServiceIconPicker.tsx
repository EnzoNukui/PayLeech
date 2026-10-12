import { useEffect, useState } from 'react'
import { serviceIconColors } from '../../../data/serviceIconColors'
import IconifyImage from '../IconifyImage/IconifyImage'

interface IconifySearchResponse {
  icons?: string[]
}

interface ServiceIconPickerProps {
  serviceName: string
  value: string
  onChange: (value: string) => void
}

function ServiceIconPicker({ serviceName, value, onChange }: ServiceIconPickerProps) {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [choosing, setChoosing] = useState(false)
  const [skippedForName, setSkippedForName] = useState('')
  const skipped = serviceName.trim().length > 0 && !value && skippedForName === serviceName

  useEffect(() => {
    const query = serviceName.trim()
    if (query.length < 2 || skipped) {
      setResults([])
      setFailed(false)
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setLoading(true)
      setFailed(false)
      try {
        const params = new URLSearchParams({ query, prefix: 'simple-icons', limit: '32' })
        let data: IconifySearchResponse | undefined
        for (const host of ['api.iconify.design', 'api.simplesvg.com', 'api.unisvg.com']) {
          try {
            const response = await fetch(`https://${host}/search?${params}`, { signal: controller.signal })
            if (!response.ok) continue
            data = await response.json() as IconifySearchResponse
            break
          } catch (error) {
            if (controller.signal.aborted) throw error
          }
        }
        if (!data) throw new Error('Falha na busca de ícones')
        setResults(data.icons ?? [])
      } catch (error) {
        if (!controller.signal.aborted) {
          setResults([])
          setFailed(true)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 350)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [serviceName, skipped])

  return (
    <fieldset className="rounded-2xl border border-border bg-surface-raised/70 p-3.5">
      <legend className="px-1 text-sm font-medium text-ink">Ícone do serviço</legend>
      <p className="mb-3 text-xs leading-5 text-ink-muted">
        Escolha o logo da marca. A busca usa o catálogo Simple Icons do Iconify.
      </p>
      {skipped ? (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-muted px-3 py-2.5">
          <span className="text-xs text-ink-muted">Você continuará sem logo para este serviço.</span>
          <button className="shrink-0 text-xs font-medium text-accent underline underline-offset-2 hover:text-ink" onClick={() => setSkippedForName('')} type="button">
            Escolher logo
          </button>
        </div>
      ) : <>
      {value ? (
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 p-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-white">
            <IconifyImage className="size-6 object-contain" icon={value} color={serviceIconColors[value.split(':')[1]] ?? '765548'} />
          </span>
          <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{value.split(':')[1]}</span>
          <span className="flex shrink-0 items-center gap-3">
            <button className="text-xs font-medium text-accent underline underline-offset-2 hover:text-ink" onClick={() => setChoosing((current) => !current)} type="button">
              {choosing ? 'Cancelar' : 'Trocar'}
            </button>
            {!choosing && <button className="text-xs font-medium text-ink-muted underline underline-offset-2 hover:text-ink" onClick={() => onChange('')} type="button">Remover</button>}
          </span>
        </div>
      ) : !choosing ? (
        <p className="mb-3 rounded-xl bg-surface-muted px-3 py-2 text-xs text-ink-muted">
          {serviceName.trim().length < 2
            ? 'Digite o nome do serviço para buscar o logo.'
            : loading
              ? 'Buscando logos…'
              : failed
                ? 'Não foi possível acessar o catálogo agora. Tente novamente em instantes.'
                : results.length === 0
                  ? 'Nenhum logo encontrado. Tente outro nome ou cadastre sem logo.'
                  : `Selecione o logo que corresponde a ${serviceName.trim()}.`}
        </p>
      ) : null}
      {choosing && value && <p className="mb-3 rounded-xl bg-surface-muted px-3 py-2 text-xs text-ink-muted">Escolha outro logo; o atual será substituído ao selecionar.</p>}
      {results.length > 0 && (!value || choosing) && (
        <div aria-label="Resultados de ícones" className="grid grid-cols-4 gap-2 sm:grid-cols-6" role="group">
          {results.map((icon) => (
            <button
              aria-label={`Usar ícone ${icon.split(':')[1]}`}
              className="grid aspect-square place-items-center rounded-xl border border-border bg-surface p-2 transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              key={icon}
              onClick={() => { onChange(icon); setChoosing(false); setSkippedForName('') }}
              title={icon.split(':')[1]}
              type="button"
            >
              <IconifyImage className="size-7 object-contain" icon={icon} color={serviceIconColors[icon.split(':')[1]] ?? '765548'} />
            </button>
          ))}
        </div>
      )}
      {!value && serviceName.trim().length > 0 && (
        <button className="mt-3 text-xs font-medium text-ink-muted underline underline-offset-2 hover:text-ink" onClick={() => { onChange(''); setChoosing(false); setSkippedForName(serviceName) }} type="button">
          Continuar sem logo
        </button>
      )}
      </>}
    </fieldset>
  )
}

export default ServiceIconPicker
