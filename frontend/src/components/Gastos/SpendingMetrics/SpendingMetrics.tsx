import { FiActivity, FiCalendar, FiCheckCircle, FiTrendingUp } from 'react-icons/fi'
import MetricCard from '../../resumo/MetricCard/MetricCard'

interface SpendingMetricsProps {
  total: string
  average: string
  paymentCount: number
  year: number
  projection?: string
}

function SpendingMetrics({ total, average, paymentCount, year, projection }: SpendingMetricsProps) {
  return (
    <section aria-label="Resumo dos gastos" className={`grid gap-4 sm:grid-cols-2 ${projection ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}>
      <MetricCard detail={`Despesas assumidas até a data de vencimento em ${year}`} icon={FiCalendar} label="Gasto no ano" value={total} />
      <MetricCard detail="Média por vencimento no período" icon={FiActivity} label="Média por cobrança" value={average} />
      <MetricCard detail={`Vencimentos considerados pagos em ${year}`} icon={FiCheckCircle} label="Cobranças no período" value={String(paymentCount)} />
      {projection && <MetricCard detail="Gastos realizados + cobranças previstas até dezembro" icon={FiTrendingUp} label="Projeção do ano" value={projection} />}
    </section>
  )
}

export default SpendingMetrics
