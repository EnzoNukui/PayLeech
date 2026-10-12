import { useRef, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { FiArrowUpRight, FiCalendar, FiCheck, FiCreditCard } from 'react-icons/fi'

type AuthShowcaseProps = {
  mode: 'login' | 'cadastro'
  activeField?: 'nome' | 'email' | 'senha'
}

const subscriptions = [
  { name: 'Netflix', detail: 'Entretenimento', value: 'R$ 39,90', mark: 'N', color: 'bg-[#e50914]', x: '-7%', y: '6%', rotate: -8 },
  { name: 'Spotify', detail: 'Música', value: 'R$ 21,90', mark: '●', color: 'bg-[#1ed760] text-[#14291b]', x: '61%', y: '1%', rotate: 7 },
  { name: 'YouTube', detail: 'Premium', value: 'R$ 24,90', mark: '▶', color: 'bg-[#ff0033]', x: '9%', y: '64%', rotate: 5 },
  { name: 'Prime Video', detail: 'Entretenimento', value: 'R$ 19,90', mark: 'a', color: 'bg-[#0878be]', x: '63%', y: '58%', rotate: -5 },
]

function AuthShowcase({ mode, activeField = 'email' }: AuthShowcaseProps) {
  const boardRef = useRef<HTMLDivElement>(null)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, { stiffness: 120, damping: 22, mass: 0.5 })
  const y = useSpring(pointerY, { stiffness: 120, damping: 22, mass: 0.5 })

  function handlePointerMove(event: MouseEvent<HTMLDivElement>) {
    const bounds = boardRef.current?.getBoundingClientRect()
    if (!bounds) return
    pointerX.set((event.clientX - bounds.left - bounds.width / 2) * 0.025)
    pointerY.set((event.clientY - bounds.top - bounds.height / 2) * 0.025)
  }

  function resetPointer() {
    pointerX.set(0)
    pointerY.set(0)
  }

  const adjustments = activeField === 'nome'
    ? [[-4, 0], [2, -3], [0, 3], [5, 1]]
    : activeField === 'senha'
      ? [[4, -1], [-3, 2], [3, -2], [-4, 1]]
      : [[0, 0], [0, 0], [0, 0], [0, 0]]

  return (
    <section
      aria-label="Prévia do PayLeech"
      className="relative flex min-h-[370px] flex-col overflow-hidden rounded-[1.7rem] bg-brand-espresso px-6 py-7 text-brand-porcelain sm:min-h-[430px] sm:px-9 sm:py-9 lg:min-h-0 lg:flex-1 lg:rounded-none lg:px-12 lg:py-12 xl:px-[clamp(3rem,7vw,8rem)]"
      onMouseLeave={resetPointer}
      onMouseMove={handlePointerMove}
    >
      <div className="absolute -right-24 -top-28 size-80 rounded-full bg-brand-cocoa/55 blur-3xl" />
      <div className="relative z-10 max-w-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">PayLeech · organização leve</p>
        <h2 className="max-w-[19rem] text-3xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-4xl">
          {mode === 'cadastro' ? 'Sua rotina financeira começa a se organizar.' : 'Todas as assinaturas, em perspectiva.'}
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-brand-porcelain/70">
          {mode === 'cadastro' ? 'Um lugar tranquilo para acompanhar cada serviço e saber o que vem pela frente.' : 'Entre para ver seus serviços, valores e próximas cobranças sem procurar em vários lugares.'}
        </p>
      </div>

      <motion.div ref={boardRef} className="relative mx-auto mt-5 min-h-[205px] w-full max-w-[440px] flex-1 sm:mt-7" style={{ x, y }}>
        {subscriptions.map((item, index) => {
          const [adjustX, adjustY] = adjustments[index]
          return (
            <motion.article
              animate={{ x: adjustX * 5, y: adjustY * 5, rotate: item.rotate }}
              className="absolute w-[min(48%,13.5rem)] rounded-2xl border border-white/15 bg-[#fffdfa] p-3.5 text-ink shadow-[0_18px_45px_-26px_rgba(0,0,0,0.75)] sm:p-4"
              initial={false}
              key={item.name}
              style={{ left: item.x, top: item.y }}
              transition={{ type: 'spring', stiffness: 160, damping: 20, delay: index * 0.035 }}
              whileHover={{ y: -7, rotate: 0, scale: 1.035, zIndex: 5 }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className={`grid size-9 shrink-0 place-items-center rounded-xl text-lg font-bold text-white ${item.color}`}>{item.mark}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="truncate text-[11px] text-ink-muted">{item.detail}</p>
                  </div>
                </div>
                <FiArrowUpRight aria-hidden="true" className="shrink-0 text-ink-muted" size={14} />
              </div>
              <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
                <span className="text-[10px] text-ink-muted">por mês</span>
                <span className="text-sm font-semibold tabular-nums">{item.value}</span>
              </div>
            </motion.article>
          )
        })}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          className="absolute left-[36%] top-[39%] z-[6] flex items-center gap-2 rounded-full border border-white/15 bg-brand-cocoa px-3 py-2 text-xs font-medium text-white shadow-lg"
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {mode === 'cadastro' && activeField === 'senha' ? <FiCheck aria-hidden="true" /> : <FiCalendar aria-hidden="true" />}
          {mode === 'cadastro' && activeField === 'senha' ? 'Tudo pronto' : 'Próxima: dia 12'}
        </motion.div>
      </motion.div>

      <div className="relative z-10 mt-2 flex items-center justify-between border-t border-white/15 pt-4 text-xs text-brand-porcelain/65">
        <span className="inline-flex items-center gap-2"><FiCreditCard aria-hidden="true" /> Sem conectar sua conta bancária</span>
        <span>01 / 03</span>
      </div>
    </section>
  )
}

export default AuthShowcase
