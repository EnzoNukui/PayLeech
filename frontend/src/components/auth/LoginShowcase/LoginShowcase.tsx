import { FiChevronRight, FiMoreHorizontal } from 'react-icons/fi'
import { SiIcloud, SiNetflix, SiSpotify, SiYoutube } from 'react-icons/si'
import LoginMagneticCard from '../LoginMagneticCard/LoginMagneticCard'

const services = [
  { name: 'Netflix', Icon: SiNetflix, color: '#e50914', amount: 'R$ 55,90' },
  { name: 'Spotify', Icon: SiSpotify, color: '#1ed760', amount: 'R$ 34,90' },
  { name: 'YouTube', Icon: SiYoutube, color: '#ff0000', amount: 'R$ 24,90' },
  { name: 'iCloud', Icon: SiIcloud, color: '#3693f3', amount: 'R$ 19,90' },
]

function LoginShowcase() {
  return (
    <section
      aria-label="Prévia do PayLeech"
      className="relative flex min-h-[630px] flex-1 flex-col overflow-hidden bg-[#f5eee6] px-6 pb-7 pt-[5.75rem] sm:px-10 lg:min-h-dvh lg:px-[clamp(2.5rem,5.2vw,5.5rem)] lg:pb-8 lg:pt-[6rem]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-[22rem] -top-[31rem] size-[59rem] rounded-full border border-[#b68d70]/35" />
        <div className="absolute -left-[18rem] -top-[27rem] size-[52rem] rounded-full border-[2.5rem] border-[#e8dbce]/55" />
        <div className="absolute -bottom-[26rem] left-[12%] size-[51rem] rounded-full border border-[#b68d70]/20" />
        <div className="absolute right-[7%] top-[17%] h-[48%] w-[32%] rounded-full bg-[#e7d8ca]/35 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[680px]">
        <h1 className="max-w-[470px] text-[2.4rem] font-semibold leading-[0.99] tracking-[-0.055em] text-[#432c22] sm:text-[3.1rem] lg:text-[clamp(2.7rem,4vw,4.15rem)]">
          Suas assinaturas,<br />em ordem.
        </h1>
        <p className="mt-4 max-w-[370px] text-[1.05rem] leading-[1.42] text-[#8c7668] sm:text-lg">
          Uma visão simples dos serviços, datas e valores que fazem parte da sua rotina.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-7 grid min-h-[410px] w-full max-w-[680px] grid-cols-1 gap-3 md:absolute md:bottom-5 md:left-[clamp(2.5rem,5.2vw,5.5rem)] md:right-[clamp(2.5rem,5.2vw,5.5rem)] md:top-[215px] md:mx-0 md:mt-0 md:min-h-0 md:w-auto md:max-w-none md:block">
        <LoginMagneticCard
          className="relative rounded-[1.15rem] border border-white/80 bg-[#fffdfa]/95 p-4 text-[#4b352a] shadow-[0_15px_40px_-25px_rgba(69,45,32,0.36)] md:absolute md:left-[2%] md:top-[18%] md:z-[2] md:w-[39%] md:p-[clamp(0.9rem,1.3vw,1.25rem)]"
          delay={0.14}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#7f6a5d]">Próxima cobrança</p>
              <div className="mt-3 flex items-center gap-3">
                <SiSpotify aria-hidden="true" className="size-9 shrink-0" style={{ color: '#1ed760' }} />
                <div>
                  <p className="text-xs font-medium">Spotify <span className="font-normal text-[#9c887a]">· 18 out.</span></p>
                  <p className="mt-1 text-sm font-semibold tabular-nums">R$ 34,90</p>
                </div>
              </div>
            </div>
            <FiMoreHorizontal aria-hidden="true" className="text-[#917d70]" />
          </div>
        </LoginMagneticCard>

        <LoginMagneticCard
          className="relative rounded-[1.15rem] border border-white/80 bg-[#fffdfa]/95 p-4 text-[#4b352a] shadow-[0_18px_42px_-25px_rgba(69,45,32,0.38)] md:absolute md:left-[44%] md:top-[1%] md:z-[3] md:w-[54%] md:p-[clamp(1rem,1.5vw,1.4rem)]"
          delay={0.24}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium text-[#7f6a5d]">Gastos do mês</p>
              <p className="mt-1 text-[1.65rem] font-semibold tracking-[-0.04em] tabular-nums sm:text-3xl">R$ 286,70</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#fae8df] px-2.5 py-1 text-[10px] font-semibold text-[#a65d42]">↑ 12%</span>
              <FiMoreHorizontal aria-hidden="true" className="text-[#917d70]" />
            </div>
          </div>
          <svg aria-label="Gráfico ilustrativo dos gastos ao longo do mês" className="mt-2 h-[100px] w-full" role="img" viewBox="0 0 300 105" preserveAspectRatio="none">
            <defs>
              <linearGradient id="login-spending-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#95664d" stopOpacity=".17" />
                <stop offset="100%" stopColor="#95664d" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M6 78 C25 59, 37 43, 56 58 S89 76, 106 58 S137 37, 157 54 S190 77, 208 53 S237 33, 257 43 S278 40, 294 19 L294 99 L6 99 Z" fill="url(#login-spending-area)" />
            <path d="M6 78 C25 59, 37 43, 56 58 S89 76, 106 58 S137 37, 157 54 S190 77, 208 53 S237 33, 257 43 S278 40, 294 19" fill="none" stroke="#95664d" strokeLinecap="round" strokeWidth="2" />
            <circle cx="294" cy="19" r="4" fill="#95664d" />
          </svg>
          <div className="flex justify-between text-[9px] text-[#9b887b]">
            <span>1 out.</span><span>8 out.</span><span>15 out.</span><span>22 out.</span><span>31 out.</span>
          </div>
        </LoginMagneticCard>

        <LoginMagneticCard
          className="relative rounded-[1.15rem] border border-white/80 bg-[#fffdfa]/95 p-4 text-[#4b352a] shadow-[0_15px_40px_-25px_rgba(69,45,32,0.36)] md:absolute md:left-0 md:top-[53%] md:z-[2] md:w-[48%] md:p-4"
          delay={0.34}
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold">Seus serviços</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#9a6c53]">Ver todos <FiChevronRight aria-hidden="true" size={12} /></span>
          </div>
          <div className="divide-y divide-[#eee6df]">
            {services.map((service) => (
              <div className="flex items-center gap-2.5 py-1.5" key={service.name}>
                <span className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-white">
                  <service.Icon aria-hidden="true" className="size-[19px]" style={{ color: service.color }} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[11px]">{service.name}</span>
                <span className="text-[10px] font-medium tabular-nums text-[#746052]">{service.amount}</span>
                <FiChevronRight aria-hidden="true" className="text-[#b39f90]" size={13} />
              </div>
            ))}
          </div>
        </LoginMagneticCard>

        <LoginMagneticCard
          className="relative flex items-center gap-3 rounded-[1.15rem] border border-white/80 bg-[#fffdfa]/95 p-4 text-[#4b352a] shadow-[0_15px_40px_-25px_rgba(69,45,32,0.36)] md:absolute md:right-[1%] md:top-[57%] md:z-[2] md:w-[48%] md:items-start md:p-4"
          delay={0.44}
        >
          <div
            aria-label="Gráfico de gastos por categoria"
            className="grid size-[92px] shrink-0 place-items-center rounded-full"
            role="img"
            style={{ background: 'conic-gradient(#8d5e46 0 58%, #d1b39d 58% 80%, #aaa98f 80% 92%, #e5d9ce 92% 100%)' }}
          >
            <div className="grid size-[58px] place-items-center rounded-full bg-[#fffdfa] text-center">
              <span className="text-[10px] font-semibold leading-tight">R$<br />286,70</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-[11px] font-semibold">Por categoria (mês)</p>
            <div className="space-y-1.5 text-[9px] text-[#78675b]">
              <p className="flex justify-between gap-2"><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-[#8d5e46]" />Entretenimento</span><span>58%</span></p>
              <p className="flex justify-between gap-2"><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-[#d1b39d]" />Produtividade</span><span>22%</span></p>
              <p className="flex justify-between gap-2"><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-[#aaa98f]" />Armazenamento</span><span>12%</span></p>
              <p className="flex justify-between gap-2"><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-[#e5d9ce]" />Outros</span><span>8%</span></p>
            </div>
          </div>
        </LoginMagneticCard>
      </div>
    </section>
  )
}

export default LoginShowcase
