import { Link } from 'react-router-dom'

function LandingFooter() {
  return (
    <footer className="bg-brand-espresso text-brand-porcelain">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-10">
        <div className="flex flex-col gap-3">
          <img alt="PayLeech" className="h-11 w-auto self-start" src="/brand/payleech-horizontal-reverse.svg" />
          <p className="max-w-sm text-sm leading-6 text-brand-porcelain/75">
            Mais clareza para acompanhar suas assinaturas e cobranças recorrentes.
          </p>
        </div>

        <nav aria-label="Links do rodapé" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <a className="text-brand-porcelain/80 transition-colors hover:text-white" href="#visao-geral">
            Visão geral
          </a>
          <Link className="text-brand-porcelain/80 transition-colors hover:text-white" to="/login">
            Login
          </Link>
          <Link className="text-brand-porcelain/80 transition-colors hover:text-white" to="/cadastro">
            Criar conta
          </Link>
        </nav>
      </div>
    </footer>
  )
}

export default LandingFooter
