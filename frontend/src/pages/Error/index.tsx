import { Link } from 'react-router-dom'
import PageTitle from '../../components/ui/PageTitle/PageTitle'

function ErrorPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-5 py-16 text-center sm:px-8">
      <p className="text-sm font-semibold text-accent">404</p>
      <div className="mt-3">
        <PageTitle title="Essa página não existe" description="Confira o endereço ou volte para o início." />
      </div>
      <Link className="mt-7 inline-flex rounded-control bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-strong" to="/">
        Voltar ao início
      </Link>
    </div>
  )
}

export default ErrorPage
