import { useCallback, useEffect, useState } from 'react'
import { FiCalendar, FiRefreshCw, FiRepeat, FiTrendingUp } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import MetricCard from '../../components/resumo/MetricCard/MetricCard'
import MonthlyChargesSummary from '../../components/resumo/MonthlyChargesSummary/MonthlyChargesSummary'
import NearestChargesCountdown from '../../components/resumo/NearestChargesCountdown/NearestChargesCountdown'
import SpendingInsights from '../../components/resumo/SpendingInsights/SpendingInsights'
import UpcomingCharges from '../../components/resumo/UpcomingCharges/UpcomingCharges'
import Button from '../../components/ui/Button/Button'
import LoadingState from '../../components/ui/LoadingState/LoadingState'
import PageTitle from '../../components/ui/PageTitle/PageTitle'
import { resumoService } from '../../service/resumoService'
import { assinaturaService } from '../../service/assinaturaService'
import { cobrancaService } from '../../service/cobrancaService'
import { ApiError } from '../../service/apiClient'
import type { Assinatura } from '../../types/assinatura'
import type { Cobranca } from '../../types/cobranca'
import type { ProximaCobranca, ResumoFinanceiro } from '../../types/resumo'
import { useAuth } from '../../contexts/AuthContext'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function billingIntervalMonths(periodicidade: Assinatura['periodicidade']) {
  if (periodicidade === 'TRIMESTRAL') return 3
  if (periodicidade === 'ANUAL') return 12
  return 1
}

function addMonthsToBillingDate(value: string, months: number) {
  const [year, month, day] = value.split('-').map(Number)
  const targetMonth = month - 1 + months
  const targetYear = year + Math.floor(targetMonth / 12)
  const normalizedMonth = targetMonth % 12
  const lastDay = new Date(targetYear, normalizedMonth + 1, 0).getDate()
  const nextDay = Math.min(day, lastDay)
  return `${targetYear}-${String(normalizedMonth + 1).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`
}

function billingDateInMonth(subscription: Assinatura, currentMonth: string) {
  const [firstYear, firstMonth] = subscription.dataPrimeiraCobranca.split('-').map(Number)
  const [targetYear, targetMonth] = currentMonth.split('-').map(Number)
  const monthsSinceFirst = (targetYear - firstYear) * 12 + targetMonth - firstMonth
  const interval = billingIntervalMonths(subscription.periodicidade)
  let occurrence = Math.max(0, Math.floor(monthsSinceFirst / interval))
  let date = addMonthsToBillingDate(subscription.dataPrimeiraCobranca, occurrence * interval)
  const monthStart = `${currentMonth}-01`

  while (date < monthStart) {
    occurrence += 1
    date = addMonthsToBillingDate(subscription.dataPrimeiraCobranca, occurrence * interval)
  }

  return date.startsWith(currentMonth) ? date : null
}

function Resumo() {
  const navigate = useNavigate()
  const { atualizarSessao, usuario, atualizarLimiteMensal } = useAuth()
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null)
  const [proximasCobrancas, setProximasCobrancas] = useState<ProximaCobranca[]>([])
  const [assinaturasAtivas, setAssinaturasAtivas] = useState<Assinatura[]>([])
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [currentMonth] = useState(() => {
    const date = new Date()
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  })
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const carregarResumo = useCallback(async () => {
    try {
      const [dadosResumo, cobrancasFuturas, assinaturas, historicoCobrancas] = await Promise.all([
        resumoService.buscarResumo(),
        resumoService.buscarProximasCobrancas(),
        assinaturaService.listar({ status: 'ATIVA' }),
        cobrancaService.listar(),
      ])
      setResumo(dadosResumo)
      setProximasCobrancas(cobrancasFuturas)
      setAssinaturasAtivas(assinaturas)
      setCobrancas(historicoCobrancas)
      setErro(null)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        try {
          const sessaoAtual = await atualizarSessao()
          if (!sessaoAtual) {
            navigate('/login', { replace: true, state: { from: { pathname: '/resumo' } } })
            return
          }
        } catch {
          // Mantém a mensagem original caso a verificação da sessão também falhe.
        }
      }
      setErro(error instanceof Error ? error.message : 'Não foi possível carregar seu resumo agora.')
    } finally {
      setCarregando(false)
    }
  }, [atualizarSessao, navigate])

  useEffect(() => {
    void carregarResumo()
  }, [carregarResumo])

  const persistedMonthCharges = cobrancas.filter((charge) => {
    if (charge.status === 'CANCELADA') return false
    return charge.dataPrevista.startsWith(currentMonth)
  })
  const today = new Date()
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const missingMonthCharges = assinaturasAtivas.flatMap((subscription) => {
    const dueDate = billingDateInMonth(subscription, currentMonth)
    const chargeAlreadyExists = dueDate && cobrancas.some((charge) => (
      charge.assinaturaId === subscription.codigo && charge.dataPrevista === dueDate
    ))

    if (!dueDate || chargeAlreadyExists) return []

    const alreadyDue = dueDate <= todayDate
    return [{
      id: -subscription.codigo,
      assinaturaId: subscription.codigo,
      nomeAssinatura: subscription.nome,
      categoriaNome: subscription.categoria.nome,
      dataPrevista: dueDate,
      valorPrevisto: Number(subscription.valor),
      dataPagamento: alreadyDue ? dueDate : null,
      valorPago: alreadyDue ? Number(subscription.valor) : null,
      status: alreadyDue ? 'PAGA' as const : 'PREVISTA' as const,
    }]
  })
  const monthCharges = [...persistedMonthCharges, ...missingMonthCharges]
  const paidCharges = monthCharges.filter((charge) => charge.dataPrevista <= todayDate)
  const dueCharges = monthCharges.filter((charge) => charge.dataPrevista > todayDate)
  const paidAmount = paidCharges.reduce((total, charge) => total + Number(charge.valorPago ?? charge.valorPrevisto), 0)
  const dueAmount = dueCharges.reduce((total, charge) => total + Number(charge.valorPrevisto), 0)
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <PageTitle title={usuario ? `Olá, ${usuario.nome.trim().split(/\s+/)[0]}` : 'Visão geral'} description="Aqui está o panorama das suas assinaturas e do mês atual." />

      {carregando ? (
        <div className="mt-8 rounded-card border border-border bg-surface">
          <LoadingState label="Carregando seu resumo…" />
        </div>
      ) : erro ? (
        <section aria-live="polite" className="mt-8 flex flex-col items-start gap-4 rounded-card border border-danger/20 bg-danger-soft p-5 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <div>
            <h2 className="font-semibold">Não foi possível carregar o resumo</h2>
            <p className="mt-1 text-sm text-ink-muted">{erro}</p>
          </div>
          <Button onClick={() => { setCarregando(true); setErro(null); void carregarResumo() }} variant="secondary">
            <FiRefreshCw aria-hidden="true" size={16} /> Tentar novamente
          </Button>
        </section>
      ) : resumo ? (
        <div className="mt-8 space-y-8">
          <section aria-label="Indicadores financeiros" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              detail="Equivalente mensal das assinaturas ativas"
              icon={FiCalendar}
              label="Gasto mensal"
              value={currency.format(resumo.custoMensalEquivalente)}
            />
            <MetricCard
              detail="Estimativa para os próximos 12 meses"
              icon={FiTrendingUp}
              label="Projeção anual"
              value={currency.format(resumo.custoAnualEstimado)}
            />
            <MetricCard
              detail="Assinaturas ativas no momento"
              icon={FiRepeat}
              label="Serviços ativos"
              value={String(resumo.quantidadeAssinaturasAtivas)}
            />
          </section>

          <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
            <MonthlyChargesSummary
              dueAmount={dueAmount}
              dueCount={dueCharges.length}
              paidAmount={paidAmount}
              paidCount={paidCharges.length}
            />
            <NearestChargesCountdown items={proximasCobrancas} subscriptions={assinaturasAtivas} />
          </div>
          <SpendingInsights
            monthlyLimit={usuario?.limiteMensalAssinaturas ?? 500}
            onUpdateMonthlyLimit={async (value) => { await atualizarLimiteMensal(value) }}
            subscriptions={assinaturasAtivas}
          />
          <UpcomingCharges items={proximasCobrancas} subscriptions={assinaturasAtivas} />
        </div>
      ) : null}
    </div>
  )
}

export default Resumo
