import { useRef, type MouseEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

interface LoginMagneticCardProps {
  children: ReactNode
  className: string
  delay?: number
}

function LoginMagneticCard({ children, className, delay = 0 }: LoginMagneticCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, { stiffness: 180, damping: 20, mass: 0.4 })
  const y = useSpring(pointerY, { stiffness: 180, damping: 20, mass: 0.4 })

  function moveCard(event: MouseEvent<HTMLElement>) {
    const bounds = cardRef.current?.getBoundingClientRect()
    if (!bounds) return
    pointerX.set((event.clientX - bounds.left - bounds.width / 2) * 0.035)
    pointerY.set((event.clientY - bounds.top - bounds.height / 2) * 0.035)
  }

  function resetCard() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <motion.article
      animate={{ opacity: 1 }}
      className={className}
      initial={{ opacity: 0 }}
      onMouseLeave={resetCard}
      onMouseMove={moveCard}
      ref={cardRef}
      style={{ x, y }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
      whileHover={{ scale: 1.015 }}
    >
      {children}
    </motion.article>
  )
}

export default LoginMagneticCard
