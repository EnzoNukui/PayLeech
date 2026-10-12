import { FiLoader } from 'react-icons/fi'

interface LoadingStateProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const iconSizes = { sm: 16, md: 22, lg: 30 }

function LoadingState({ label = 'Carregando…', size = 'md' }: LoadingStateProps) {
  return (
    <div aria-live="polite" className="flex min-h-32 items-center justify-center gap-3 text-sm text-ink-muted" role="status">
      <FiLoader aria-hidden="true" className="motion-safe:animate-spin text-accent" size={iconSizes[size]} />
      <span>{label}</span>
    </div>
  )
}

export default LoadingState
