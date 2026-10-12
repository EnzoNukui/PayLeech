import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { FiLock, FiMail, FiUser } from 'react-icons/fi'

type RegistrationField = 'nome' | 'email' | 'senha'

interface RegistrationShowcaseProps {
  activeField: RegistrationField
  nome: string
  email: string
  senha: string
}

const cards = [
  {
    field: 'nome',
    label: 'Seu nome',
    icon: FiUser,
    positions: {
      nome: { left: '8%', top: '25%', width: '62%', rotate: -1 },
      email: { left: '5%', top: '1%', width: '48%', rotate: -1.5 },
      senha: { left: '4%', top: '55%', width: '48%', rotate: -1 },
    },
  },
  {
    field: 'email',
    label: 'Seu e-mail',
    icon: FiMail,
    positions: {
      nome: { left: '49%', top: '2%', width: '47%', rotate: 1 },
      email: { left: '14%', top: '25%', width: '62%', rotate: 0.5 },
      senha: { left: '48%', top: '2%', width: '47%', rotate: 1 },
    },
  },
  {
    field: 'senha',
    label: 'Sua senha',
    icon: FiLock,
    positions: {
      nome: { left: '31%', top: '55%', width: '48%', rotate: -0.5 },
      email: { left: '48%', top: '55%', width: '47%', rotate: 1 },
      senha: { left: '15%', top: '25%', width: '62%', rotate: -0.5 },
    },
  },
] as const

function RegistrationShowcase({ activeField, nome, email, senha }: RegistrationShowcaseProps) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const breakpoint = window.matchMedia('(min-width: 768px)')
    const updateLayout = () => setIsDesktop(breakpoint.matches)

    updateLayout()
    breakpoint.addEventListener('change', updateLayout)
    return () => breakpoint.removeEventListener('change', updateLayout)
  }, [])

  const values: Record<RegistrationField, string> = {
    nome: nome.trim() || 'Seu nome aparece aqui',
    email: email.trim() || 'voce@exemplo.com',
    senha: senha ? '•'.repeat(Math.min(senha.length, 12)) : '••••••••',
  }

  return (
    <section
      aria-label="Etapas para criar sua conta PayLeech"
      className="relative flex min-h-[630px] flex-1 flex-col overflow-hidden bg-[#f5eee6] px-6 pb-7 pt-[5.75rem] sm:px-10 lg:h-full lg:min-h-0 lg:px-[clamp(2.5rem,5.2vw,5.5rem)] lg:pb-8 lg:pt-[6rem]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-[22rem] -top-[31rem] size-[59rem] rounded-full border border-[#b68d70]/35" />
        <div className="absolute -left-[18rem] -top-[27rem] size-[52rem] rounded-full border-[2.5rem] border-[#e8dbce]/55" />
        <div className="absolute -bottom-[26rem] left-[12%] size-[51rem] rounded-full border border-[#b68d70]/20" />
        <div className="absolute right-[7%] top-[17%] h-[48%] w-[32%] rounded-full bg-[#e7d8ca]/35 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[680px]">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.19em] text-[#9a725a]">Um começo tranquilo</p>
        <h1
          className="max-w-2xl text-[2.35rem] font-medium leading-[1.01] tracking-[-0.045em] text-[#432c22] sm:text-[3.05rem] lg:text-[clamp(2.65rem,4vw,4rem)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Um lugar só seu para<br />o que você assina.
        </h1>
        <p className="mt-4 max-w-[370px] text-[1.02rem] leading-[1.42] text-[#8c7668] sm:text-lg">
          Preencha seus dados. Aos poucos, cada coisa encontra o seu lugar.
        </p>
      </div>

      <div
        className="relative z-10 mx-auto mt-7 grid w-full max-w-[680px] grid-cols-1 gap-3 pb-2 md:absolute md:left-[clamp(2.5rem,5.2vw,5.5rem)] md:right-[clamp(2.5rem,5.2vw,5.5rem)] md:mx-0 md:mt-0 md:block md:w-auto md:max-w-none md:pb-0"
        style={isDesktop ? { top: '43%', bottom: '1.75rem' } : undefined}
      >
        {cards.map((card, index) => {
          const isActive = activeField === card.field
          const Icon = card.icon
          const position = card.positions[activeField]
          const desktopPosition = isDesktop
            ? position
            : { left: '0%', top: '0%', width: '100%', rotate: 0 }

          return (
            <motion.article
              animate={{
                left: desktopPosition.left,
                top: desktopPosition.top,
                width: desktopPosition.width,
                rotate: desktopPosition.rotate,
                scale: isActive ? 1 : 0.96,
                zIndex: isActive ? 3 : 1,
                opacity: isActive ? 1 : 0.82,
              }}
              className={`relative flex items-center gap-3 rounded-[1.15rem] border p-4 transition-colors md:absolute md:p-5 ${isActive ? 'order-1 min-h-32 border-[#76533d] bg-[#fffdfa] text-[#432c22] shadow-[0_24px_50px_-25px_rgba(69,45,32,0.4)] md:min-h-36' : 'order-2 min-h-32 border-white/85 bg-[#fffdfa]/75 text-[#715c4e] shadow-[0_14px_35px_-26px_rgba(69,45,32,0.3)] md:min-h-32'}`}
              initial={{ opacity: 0, y: 10 }}
              key={card.field}
              layout
              transition={{ type: 'spring', stiffness: 145, damping: 20, delay: index * 0.035 }}
              whileHover={{ y: isActive ? -3 : -1 }}
            >
              <motion.span
                animate={{ backgroundColor: isActive ? '#efe5dc' : '#f5eee8', scale: isActive ? 1 : 0.94 }}
                className="grid size-11 shrink-0 place-items-center rounded-full text-[#76553f]"
                transition={{ type: 'spring', stiffness: 210, damping: 18 }}
              >
                <Icon aria-hidden="true" size={19} />
              </motion.span>
              <span className="min-w-0 flex-1">
                <span className={`block text-[10px] font-semibold uppercase tracking-[0.12em] ${isActive ? 'text-[#9a725a]' : 'text-[#a18b7b]'}`}>
                  {card.label}
                </span>
                <motion.span
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-1 block truncate ${isActive ? 'text-base font-semibold sm:text-lg' : 'text-sm font-medium'}`}
                  key={`${card.field}-${values[card.field]}`}
                  initial={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.18 }}
                >
                  {values[card.field]}
                </motion.span>
              </span>
              {isActive && <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-[#8b6149]" />}
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

export default RegistrationShowcase
