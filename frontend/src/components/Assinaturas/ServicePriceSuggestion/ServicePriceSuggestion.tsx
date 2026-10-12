import { useEffect, useMemo, useState } from 'react'
import { FiRefreshCw, FiTag } from 'react-icons/fi'
import Button from '../../ui/Button/Button'
import Select from '../../ui/Select/Select'
import { servicoPrecoService, type PlanoSugerido, type PrecoSugerido } from '../../../service/servicoPrecoService'
import { getManualServicePrice, priceForPeriod, type ManualServicePlan } from '../../../data/manualServicePrices'
import type { Periodicidade } from '../../../types/assinatura'

interface ServicePriceSuggestionProps {
  serviceName: string
  periodicidade: Periodicidade
  onUsePrice: (value: string) => void
}

const periodUnits: Record<Periodicidade, number> = { MENSAL: 1, TRIMESTRAL: 3, ANUAL: 12 }

function cadenceLabel(periodicidade: Periodicidade) {
  return periodicidade === 'MENSAL' ? 'mês' : periodicidade === 'TRIMESTRAL' ? '3 meses' : 'ano'
}

function quoteCadence(quote: PrecoSugerido): Periodicidade {
  const cadence = `${quote.periodicidade} ${quote.cadenciaCobranca}`.toLocaleLowerCase('pt-BR')
  if (/anual|annual|year|12\s*m|12\s*mes/.test(cadence)) return 'ANUAL'
  if (/trimestral|quarter|3\s*m|3\s*mes/.test(cadence)) return 'TRIMESTRAL'
  return 'MENSAL'
}

const providerNames: Record<string, string> = {
  netflix: 'Netflix', spotify: 'Spotify', 'disney+': 'Disney+', 'disney plus': 'Disney+',
  'youtube premium': 'YouTube Premium', revolut: 'Revolut',
  'adobe creative cloud': 'Adobe Creative Cloud', adobe: 'Adobe',
}

function getProviderName(serviceName: string) {
  return providerNames[serviceName.trim().toLocaleLowerCase('pt-BR')]
}

function formatSuggestedPrice(quote: PrecoSugerido) {
  if (quote.precoFormatado?.trim()) return quote.precoFormatado
  const amount = Number(quote.valor)
  if (!Number.isFinite(amount)) return 'Preço indisponível'
  const currency = /^[A-Z]{3}$/.test(quote.moeda ?? '') ? quote.moeda : quote.pais === 'BRA' ? 'BRL' : 'USD'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(amount)
}

function ServicePriceSuggestion({ serviceName, periodicidade, onUsePrice }: ServicePriceSuggestionProps) {
  const provider = getProviderName(serviceName)
  const manualPrice = getManualServicePrice(serviceName)
  const [manualPlanName, setManualPlanName] = useState('')
  const [plans, setPlans] = useState<PlanoSugerido[]>([])
  const [selectedPlan, setSelectedPlan] = useState('')
  const [quote, setQuote] = useState<PrecoSugerido | null>(null)
  const [loadingPlans, setLoadingPlans] = useState(false)
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [appliedSource, setAppliedSource] = useState<'manual' | 'online' | null>(null)
  const [appliedPlanName, setAppliedPlanName] = useState('')
  const [appliedOnlineAmount, setAppliedOnlineAmount] = useState<{ amount: number; period: Periodicidade } | null>(null)
  const [message, setMessage] = useState('')

  const manualPlans = useMemo<ManualServicePlan[]>(() => manualPrice ? [
    { planName: manualPrice.planName, amount: manualPrice.amount, amountPeriod: manualPrice.amountPeriod, periodAmounts: manualPrice.periodAmounts, currency: manualPrice.currency },
    ...(manualPrice.additionalPlans ?? []),
  ] : [], [manualPrice])
  const selectedManualPlan = manualPlans.find((plan) => plan.planName === manualPlanName) ?? manualPlans[0]
  const selectedManualPrice = selectedManualPlan ? priceForPeriod(selectedManualPlan, periodicidade) : null
  const appliedManualPlan = manualPlans.find((plan) => plan.planName === appliedPlanName)
  const manualCurrency = selectedManualPlan?.currency ?? 'BRL'
  const canApplyManual = manualCurrency === 'BRL' && Boolean(selectedManualPrice && selectedManualPrice.amount > 0)

  useEffect(() => {
    if (appliedSource === 'manual' && appliedManualPlan) {
      onUsePrice(priceForPeriod(appliedManualPlan, periodicidade).amount.toFixed(2))
    } else if (appliedSource === 'online' && appliedOnlineAmount) {
      const adjusted = appliedOnlineAmount.amount / periodUnits[appliedOnlineAmount.period] * periodUnits[periodicidade]
      onUsePrice((Math.round((adjusted + Number.EPSILON) * 100) / 100).toFixed(2))
    }
  }, [periodicidade, appliedSource, appliedManualPlan, appliedOnlineAmount, onUsePrice])

  useEffect(() => {
    setManualPlanName(manualPrice?.planName ?? '')
    setPlans([])
    setSelectedPlan('')
    setQuote(null)
    setAppliedSource(null)
    setAppliedPlanName('')
    setAppliedOnlineAmount(null)
    setMessage('')
  }, [provider, serviceName, manualPrice])

  if (!serviceName.trim()) return null

  async function loadPlans() {
    setMessage('')
    setQuote(null)
    setAppliedSource(null)
    setAppliedPlanName('')
    setAppliedOnlineAmount(null)
    setLoadingPlans(true)
    try {
      const result = await servicoPrecoService.listarPlanos(provider)
      setPlans(result)
      setSelectedPlan(result[0]?.slug ?? '')
      if (result.length === 0) setMessage('Nenhum plano disponível para consulta neste momento.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível carregar os planos.')
    } finally {
      setLoadingPlans(false)
    }
  }

  async function loadPrice() {
    if (!selectedPlan) return
    setMessage('')
    setQuote(null)
    setAppliedSource(null)
    setAppliedPlanName('')
    setAppliedOnlineAmount(null)
    setLoadingPrice(true)
    try {
      setQuote(await servicoPrecoService.buscarPreco(provider, selectedPlan))
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível consultar esse preço.')
    } finally {
      setLoadingPrice(false)
    }
  }

  const options = plans.map((plan) => ({ value: plan.slug, label: plan.nome }))
  const manualPlanOptions = manualPlans.map((plan) => ({ value: plan.planName, label: plan.planName }))
  const displayPrice = quote ? formatSuggestedPrice(quote) : ''
  const quoteCurrency = quote?.moeda?.toUpperCase() || (quote?.pais === 'BRA' ? 'BRL' : '')
  const validQuoteAmount = quote !== null && Number.isFinite(Number(quote.valor))

  return (
    <section className="rounded-2xl border border-accent/15 bg-accent/[0.035] p-3.5" aria-label="Sugestão de preço">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent"><FiTag aria-hidden="true" size={15} /></span>
          <div>
            <p className="text-xs font-semibold text-ink">Referência de preço: {serviceName}</p>
            <p className="mt-0.5 text-[11px] leading-4 text-ink-muted">Valores de referência no Brasil. Confira a cobrança atual na fonte antes de salvar.</p>
          </div>
        </div>
        {selectedManualPlan && selectedManualPrice && canApplyManual && (
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-sm font-semibold text-ink">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedManualPrice.amount)}/{cadenceLabel(periodicidade)}</span>
            <Button onClick={() => {
              onUsePrice(selectedManualPrice.amount.toFixed(2))
              setAppliedPlanName(selectedManualPlan.planName)
              setAppliedOnlineAmount(null)
              setAppliedSource('manual')
            }} size="sm">Usar valor</Button>
          </div>
        )}
      </div>

      {manualPrice ? (
        <div className="mt-3 rounded-xl border border-border bg-surface p-3">
          {manualPlans.length > 1 && <Select label="Plano de referência" name="plano-preco-referencia" onChange={(event) => {
            setManualPlanName(event.target.value)
            setAppliedSource(null)
            setAppliedPlanName('')
          }} options={manualPlanOptions} value={manualPlanName || manualPrice.planName} />}
          {selectedManualPlan && selectedManualPrice && selectedManualPrice.amount > 0 ? (
            <>
              <p className="mt-2 text-sm font-semibold text-ink">{selectedManualPlan.planName}: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: manualCurrency }).format(selectedManualPrice.amount)} / {cadenceLabel(periodicidade)}{selectedManualPrice.estimated ? ' (estimativa proporcional)' : ''}</p>
              {selectedManualPrice.estimated && <p className="mt-1 text-[11px] leading-4 text-ink-muted">Estimativa proporcional com base no valor pesquisado; o serviço pode cobrar outro preço ou não oferecer essa periodicidade.</p>}
              {manualCurrency !== 'BRL' && <p className="mt-1 text-[11px] leading-4 text-ink-muted">Preço em {manualCurrency}; não convertemos automaticamente para reais para evitar sugerir um valor incorreto.</p>}
            </>
          ) : <p className="mt-2 text-sm font-semibold text-ink">{selectedManualPlan?.planName}: sem preço recorrente publicado</p>}
          <p className="mt-1 text-[11px] leading-4 text-ink-muted">Referência pesquisada em {manualPrice.checkedAt} · {manualPrice.sourceLabel}.{manualPrice.note ? ` ${manualPrice.note}` : ''}</p>
          <a className="mt-1 inline-block text-[11px] font-medium text-accent underline underline-offset-2" href={manualPrice.sourceUrl} rel="noreferrer" target="_blank">Conferir fonte do preço</a>
        </div>
      ) : <p className="mt-3 rounded-xl border border-border bg-surface px-3 py-2 text-xs leading-5 text-ink-muted">Ainda não há um preço brasileiro pesquisado para este serviço. O valor pode ser preenchido manualmente no campo acima.</p>}

      {provider && <div className="mt-3">
        <Button className="shrink-0" loading={loadingPlans} onClick={() => void loadPlans()} size="sm" variant="secondary"><FiRefreshCw aria-hidden="true" size={13} /> Consultar outros planos online</Button>
        <p className="mt-1 text-[11px] leading-4 text-ink-muted">Consulta ao vivo pela API World Price Index; requer chave configurada no backend.</p>
      </div>}

      {plans.length > 0 && <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
        <Select label="Plano" name="plano-preco" onChange={(event) => { setSelectedPlan(event.target.value); setQuote(null); setAppliedSource(null); setAppliedOnlineAmount(null) }} options={options} value={selectedPlan} />
        <Button loading={loadingPrice} onClick={() => void loadPrice()} size="sm" variant="secondary"><FiTag aria-hidden="true" size={14} /> Consultar valor</Button>
      </div>}

      {quote && <div className="mt-3 flex flex-col gap-3 rounded-xl border border-border bg-surface p-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">{quote.nomePlano}: {displayPrice}</p>
          <p className="mt-1 text-[11px] leading-4 text-ink-muted">{quote.moeda === 'BRL' ? `Valor observado no Brasil, cobrado por ${cadenceLabel(quoteCadence(quote))}` : `Preço informado em ${quote.moeda}; confira a moeda antes de usar`} · atualizado em {quote.observadoEm}</p>
          {quote.fonte && <a className="mt-1 inline-block text-[11px] font-medium text-accent underline underline-offset-2" href={quote.fonte} rel="noreferrer" target="_blank">Ver fonte do preço</a>}
        </div>
        <Button disabled={quoteCurrency !== 'BRL' || !validQuoteAmount} onClick={() => {
          if (!quote || !validQuoteAmount) return
          const period = quoteCadence(quote)
          const adjusted = Number(quote.valor) / periodUnits[period] * periodUnits[periodicidade]
          onUsePrice((Math.round((adjusted + Number.EPSILON) * 100) / 100).toFixed(2))
          setAppliedOnlineAmount({ amount: Number(quote.valor), period })
          setAppliedPlanName('')
          setAppliedSource('online')
        }} size="sm">{appliedSource === 'online' ? 'Valor aplicado' : 'Usar este valor'}</Button>
      </div>}
      {appliedSource && <p className="mt-2 text-xs font-medium text-success" role="status">O valor foi preenchido. Ao mudar a periodicidade, o preço será recalculado{appliedSource === 'manual' && selectedManualPrice?.estimated ? ' por estimativa proporcional' : ''}.</p>}
      {message && <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-xs leading-5 text-ink-muted" role="status">{message}</p>}
    </section>
  )
}

export default ServicePriceSuggestion
