import { Link } from 'react-router-dom'

function LandingHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 text-brand-porcelain sm:px-8 lg:px-10">
      <Link aria-label="PayLeech, página inicial" className="shrink-0" to="/">
        <img alt="PayLeech" className="h-10 w-auto" src="/brand/payleech-horizontal-reverse.svg" />
      </Link>

      <a
        className="absolute left-1/2 -translate-x-1/2 rounded-control px-3 py-2 text-sm font-medium text-current/75 transition-colors hover:text-current focus-visible:outline-brand-gold"
        href="#visao-geral"
      >
        Visão geral
      </a>

      <Link
        className="rounded-control border border-current/25 px-4 py-2 text-sm font-medium text-current transition-colors hover:bg-white/10 focus-visible:outline-brand-gold"
        to="/login"
      >
        Login
      </Link>
    </header>
  )
}

export default LandingHeader
