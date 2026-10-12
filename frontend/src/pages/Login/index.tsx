import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ApiError } from '../../service/apiClient'
import AuthMessage from '../../components/auth/AuthMessage/AuthMessage'
import AuthPageLayout from '../../components/auth/AuthPageLayout/AuthPageLayout'
import PasswordField from '../../components/auth/PasswordField/PasswordField'
import LoginShowcase from '../../components/auth/LoginShowcase/LoginShowcase'
import Button from '../../components/ui/Button/Button'
import TextField from '../../components/ui/TextField/TextField'
import { useAuth } from '../../contexts/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { entrar } = useAuth()
  const cadastroConcluido = (location.state as { cadastroConcluido?: boolean } | null)?.cadastroConcluido

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    if (!email.trim() || !senha) {
      setErro('Preencha seu e-mail e sua senha para continuar.')
      return
    }
    setCarregando(true)
    try {
      await entrar({ email: email.trim(), senha })
      const destino = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/resumo'
      navigate(destino, { replace: true })
    } catch (error) {
      setErro(error instanceof ApiError ? error.message : 'Não foi possível entrar. Verifique sua conexão e tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <AuthPageLayout fullScreen mode="login" showcase={<LoginShowcase />}>
      <motion.div animate={{ opacity: 1, y: 0 }} initial={false}>
        <p className="mb-2 text-sm font-medium text-[#9a8072]">Bem-vindo de volta</p>
        <h1 className="text-[2rem] font-semibold tracking-[-0.045em] text-[#432c22] sm:text-[2.2rem]">Entre na sua conta</h1>
        <p className="mt-1 text-sm leading-6 text-[#9a8072]">Acompanhe tudo em um só lugar.</p>

        <nav aria-label="Acesso à conta" className="mt-7 grid grid-cols-2 rounded-xl border border-[#eadfd5] bg-[#fcfaf7] p-1">
          <Link aria-current="page" className="rounded-[0.65rem] bg-[#eee5dc] px-3 py-2.5 text-center text-xs font-semibold text-[#543b2d] shadow-sm" to="/login">Entrar</Link>
          <Link className="rounded-[0.65rem] px-3 py-2.5 text-center text-xs font-medium text-[#9a8072] transition-colors hover:text-[#543b2d]" to="/cadastro">Criar conta</Link>
        </nav>

        <form className="mt-5 space-y-4" noValidate onSubmit={handleSubmit}>
          {cadastroConcluido && <AuthMessage tone="success">Conta criada. Entre com seu e-mail e sua senha para continuar.</AuthMessage>}
          {erro && <AuthMessage>{erro}</AuthMessage>}
          <TextField
            autoComplete="email"
            autoFocus
            label="E-mail"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@exemplo.com"
            type="email"
            value={email}
          />
          <PasswordField
            autoComplete="current-password"
            label="Senha"
            name="senha"
            onChange={setSenha}
            placeholder="Digite sua senha"
            value={senha}
          />
          <Button className="!bg-brand-espresso w-full !text-white hover:!bg-brand-cocoa" loading={carregando} size="lg" type="submit">
            {carregando ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-[#9a8072]">
          Ainda não tem uma conta?{' '}
          <Link className="font-semibold text-accent transition-colors hover:text-accent-strong" to="/cadastro">Criar conta</Link>
        </p>
      </motion.div>
    </AuthPageLayout>
  )
}

export default Login
