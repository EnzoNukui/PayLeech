import type { ReactNode } from 'react'
import { motion } from 'motion/react'

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 44, filter: 'blur(5px)' }}
      transition={{ duration: 0.82, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.16, once: true }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
