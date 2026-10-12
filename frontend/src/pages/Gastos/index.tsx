import { useCallback, useEffect, useMemo, useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import AnnualSpendingChart from '../../components/Gastos/AnnualSpendingChart/AnnualSpendingChart'
import RecurringExpenseList from '../../components/Gastos/RecurringExpenseList/RecurringExpenseList'
import SpendingMetrics from '../../components/Gastos/SpendingMetrics/SpendingMetrics'
import Button from '../../components/ui/Button/Button'
import LoadingState from '../../components/ui/LoadingState/LoadingState'
import PageTitle from '../../components/ui/PageTitle/PageTitle'
import Select from '../../components/ui/Select/Select'
import { useAuth } from '../../contexts/AuthContext'
import { assinaturaService } from '../../service/assinaturaService'
import { cobrancaService } from '../../service/cobrancaService'
import { ApiError } from '../../service/apiClient'
import type { Assinatura } from '../../types/assinatura'
import type { Cobranca } from '../../types/cobranca'

type ExpenseFilter = 'TODAS' | 'PAGA' | 'PREVISTA'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function chargeYear(charge: Cobranca) {
  const relevantDate = charge.status === 'PAGA' ? charge.dataPagamento ?? charge.dataPrevista : charge.dataPrevista
  return Number(relevantDate.slice(0, 4))
}

function addMonthsToBillingDate(value: string, months: number) {
  const [year, month, day] = value.split('-').map(Number)
  const targetMonth = month - 1 + months
  const targetYear = year + Math.floor(targetMonth / 12)
  const normalizedMonth = targetMonth % 12
  const lastDay = new Date(targetYear, normalizedMonth + 1, 0).getDate()
  return `${targetYear}-${String(normalizedMonth + 1).padStart(2, '0')}-${String(Math.min(day, lastDay)).padStart(2, '0')}`
}

function monthsPerCharge(subscription: Assinatura) {
  if (subscription.periodicidade === 'TRIMESTRAL') return 3
  if (subscription.periodicidade === 'ANUAL') return 12
  return 1
}

function projectRemainingCharges(subscriptions: Assinatura[], year: number, todayDate: string) {
  const yearEnd = `${year}-12-31`

  return subscriptions.reduce((total, subscription) => {
    const interval = monthsPerCharge(subscription)
    let occurrence = 0
    let dueDate = subscription.dataPrimeiraCobranca

    while (dueDate <= todayDate) {
      occurrence += 1
      dueDate = addMonthsToBillingDate(subscription.dataPrimeiraCobranca, occurrence * interval)
    }

    while (dueDate <= yearEnd) {
      if (dueDate.startsWith(`${year}-`)) total += Number(subscription.valor)
      occurrence += 1
      dueDate = addMonthsToBillingDate(subscription.dataPrimeiraCobranca, occurrence * interval)
    }

    return total
  }, 0)
}

function Gastos() {
  const navigate = useNavigate()
  const { atualizarSessao } = useAuth()
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [assinaturasAtivas, setAssinaturasAtivas] = useState<Assinatura[]>([])
  const [calendar] = useState(() => {
    const today = new Date()
    return {
      year: today.getFullYear(),
      date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    }
  })
  const [ano, setAno] = useState(calendar.year)
  const [status, setStatus] = useState<ExpenseFilter>('TODAS')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const carregarCobrancas = useCallback(async (mostrarCarregamento = true) => {
    if (mostrarCarregamento) setCarregando(true)
    setErro(null)
    try {
      const [historico, assinaturas] = await Promise.all([
        cobrancaService.listar(),
        assinaturaService.listar({ status: 'ATIVA' }),
      ])
      setCobrancas(historico)
      setAssinaturasAtivas(assinaturas)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        try {
          const sessaoAtual = await atualizarSessao()
          if (!sessaoAtual) {
            navigate('/login', { replace: true, state: { from: { pathname: '/gastos' } } })
            return
          }
        } catch {
          // Preserva a falha original da consulta.
        }
      }
      setErro(error instanceof Error ? error.message : 'Não foi possível carregar o histórico agora.')
    } finally {
      if (mostrarCarregamento) setCarregando(false)
    }
  }, [atualizarSessao, navigate])

  useEffect(() => {
    void carregarCobrancas()
  }, [carregarCobrancas])

  const years = useMemo(() => {
    const availableYears = new Set(cobrancas.map(chargeYear))
    availableYears.add(calendar.year)
    return [...availableYears].sort((a, b) => b - a)
  }, [calendar.year, cobrancas])

  const yearOptions = years.map((year) => ({ value: String(year), label: String(year) }))
  const yearCharges = cobrancas.filter((charge) => chargeYear(charge) === ano && charge.status !== 'CANCELADA')
  const paidCharges = yearCharges.filter((charge) => charge.status === 'PAGA')
  const filteredCharges = yearCharges
    .filter((charge) => status === 'TODAS' || charge.status === status)
    .sort((a, b) => (a.status === 'PAGA' ? a.dataPagamento ?? a.dataPrevista : a.dataPrevista)
      .localeCompare(b.status === 'PAGA' ? b.dataPagamento ?? b.dataPrevista : b.dataPrevista))
  const paidTotal = paidCharges.reduce((sum, charge) => sum + Number(charge.valorPago ?? charge.valorPrevisto), 0)
  const averagePayment = paidCharges.length > 0 ? paidTotal / paidCharges.length : 0
  const projection = ano === calendar.year
    ? currency.format(paidTotal + projectRemainingCharges(assinaturasAtivas, ano, calendar.date))
    : undefined
  const months = monthLabels.map((label, monthIndex) => {
    const monthPayments = paidCharges.filter((charge) => {
      const paymentDate = charge.dataPagamento ?? charge.dataPrevista
      return Number(paymentDate.slice(5, 7)) === monthIndex + 1
    })
    return {
      label,
      amount: monthPayments.reduce((sum, charge) => sum + Number(charge.valorPago ?? charge.valorPrevisto), 0),
      count: monthPayments.length,
    }
  })

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <PageTitle
        action={<Select label="Ano" name="ano" onChange={(event) => setAno(Number(event.target.value))} options={yearOptions} value={String(ano)} />}
        description="Veja os gastos recorrentes ao longo do ano. Vencimentos passados são considerados pagos automaticamente."
        title="Gastos"
      />

      {carregando ? (
        <div className="mt-8 rounded-card border border-border bg-surface"><LoadingState label="Carregando cobranças…" /></div>
      ) : erro && cobrancas.length === 0 ? (
        <section aria-live="polite" className="mt-8 flex flex-col items-start gap-4 rounded-card border border-danger/20 bg-danger-soft p-5 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <div>
            <h2 className="font-semibold">Não foi possível carregar seus gastos</h2>
            <p className="mt-1 text-sm text-ink-muted">{erro}</p>
          </div>
          <Button onClick={() => void carregarCobrancas()} variant="secondary"><FiRefreshCw aria-hidden="true" size={16} /> Tentar novamente</Button>
        </section>
      ) : (
        <div className="mt-8 space-y-6 sm:space-y-8">
          {erro && <p className="rounded-control bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">{erro}</p>}
          <SpendingMetrics
            average={currency.format(averagePayment)}
            paymentCount={paidCharges.length}
            projection={projection}
            total={currency.format(paidTotal)}
            year={ano}
          />
          <AnnualSpendingChart currency={currency} months={months} year={ano} />
          <RecurringExpenseList
            items={filteredCharges}
            onStatusChange={setStatus}
            status={status}
            year={ano}
          />
        </div>
      )}
    </div>
  )
}

export default Gastos
