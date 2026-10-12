import { Link } from 'react-router-dom'

function AuthHeader({ variant = 'default' }: { variant?: 'default' | 'split' }) {
  if (variant === 'split') {
    return (
      <header className="pointer-events-none absolute left-0 top-0 z-20 flex h-[76px] w-full items-center px-6 sm:px-10 lg:w-[59%] lg:px-[clamp(2.5rem,5.2vw,5.5rem)]">
        <Link aria-label="PayLeech, página inicial" className="pointer-events-auto inline-flex items-center" to="/">
          <img alt="PayLeech" className="h-8 w-auto" src="/brand/payleech-horizontal.svg" />
        </Link>
      </header>
    )
  }

  return (
    <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-border/70 px-5 sm:px-8 lg:px-12">
      <Link aria-label="PayLeech, página inicial" className="inline-flex items-center" to="/">
        <img alt="PayLeech" className="h-9 w-auto" src="/brand/payleech-lockup.svg" />
      </Link>
      <Link className="text-sm font-medium text-ink-muted transition-colors hover:text-ink" to="/">
        Voltar à visão geral
      </Link>
    </header>
  )
}

export default AuthHeader
