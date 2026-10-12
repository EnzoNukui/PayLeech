import type { MouseEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { SiIcloud, SiNetflix, SiSpotify } from 'react-icons/si'

const brandIcons = {
  icloud: SiIcloud,
  netflix: SiNetflix,
  spotify: SiSpotify,
}

export type SubscriptionBrand = {
  name: string
  icon: keyof typeof brandIcons
  color: string
}

type SubscriptionBrandIconProps = {
  service: SubscriptionBrand
  size?: 'small' | 'medium' | 'large'
}

const sizeClasses = {
  small: 'size-9',
  medium: 'size-12',
  large: 'size-16',
}

function SubscriptionBrandIcon({ service, size = 'medium' }: SubscriptionBrandIconProps) {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, { stiffness: 220, damping: 18, mass: 0.35 })
  const y = useSpring(pointerY, { stiffness: 220, damping: 18, mass: 0.35 })
  const BrandIcon = brandIcons[service.icon]

  function handlePointerMove(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left - bounds.width / 2) * 0.24)
    pointerY.set((event.clientY - bounds.top - bounds.height / 2) * 0.24)
  }

  function resetPointer() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <motion.div
      aria-label={service.name}
      className={`grid ${sizeClasses[size]} shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/95 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.5)]`}
      onMouseLeave={resetPointer}
      onMouseMove={handlePointerMove}
      role="img"
      style={{ x, y }}
      whileHover={{ scale: 1.1, rotate: 3 }}
      whileTap={{ scale: 0.98 }}
    >
      <BrandIcon
        aria-hidden="true"
        className={size === 'small' ? 'size-5' : size === 'large' ? 'size-8' : 'size-6'}
        style={{ color: service.color }}
      />
    </motion.div>
  )
}

export default SubscriptionBrandIcon
