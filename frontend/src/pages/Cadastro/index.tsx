import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ApiError } from '../../service/apiClient'
import AuthMessage from '../../components/auth/AuthMessage/AuthMessage'
import AuthPageLayout from '../../components/auth/AuthPageLayout/AuthPageLayout'
import PasswordField from '../../components/auth/PasswordField/PasswordField'
import RegistrationShowcase from '../../components/auth/RegistrationShowcase/RegistrationShowcase'
import Button from '../../components/ui/Button/Button'
import TextField from '../../components/ui/TextField/TextField'
import { useAuth } from '../../contexts/AuthContext'

type Field = 'nome' | 'email' | 'senha'

function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [campoAtivo, setCampoAtivo] = useState<Field>('nome')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()
  const { cadastrar } = useAuth()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    const nomeNormalizado = nome.trim()
    const emailNormalizado = email.trim()
    if (!nomeNormalizado || nomeNormalizado.length > 100) {
      setCampoAtivo('nome')
      setErro('Informe seu nome (até 100 caracteres).')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado) || emailNormalizado.length > 254) {
      setCampoAtivo('email')
      setErro('Informe um e-mail válido.')
      return
    }
    if (senha.length < 8 || senha.length > 72) {
      setCampoAtivo('senha')
      setErro('A senha deve ter entre 8 e 72 caracteres.')
      return
    }
    if (senha !== confirmacao) {
      setCampoAtivo('senha')
      setErro('As senhas não coincidem.')
      return
    }

    setCarregando(true)
    try {
      await cadastrar({ nome: nomeNormalizado, email: emailNormalizado, senha })
      navigate('/login', { replace: true, state: { cadastroConcluido: true } })
    } catch (error) {
      setErro(error instanceof ApiError ? error.message : 'Não foi possível criar sua conta. Verifique sua conexão e tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <AuthPageLayout
      fullScreen
      activeField={campoAtivo}
      mode="cadastro"
      showcase={<RegistrationShowcase activeField={campoAtivo} email={email} nome={nome} senha={senha} />}
    >
      <motion.div animate={{ opacity: 1, y: 0 }} initial={false}>
        <p className="mb-2 text-sm font-medium text-[#9a8072]">Vamos começar</p>
        <h1 className="text-[2rem] font-semibold tracking-[-0.045em] text-[#432c22] sm:text-[2.2rem]">Crie sua conta</h1>
        <p className="mt-1 text-sm leading-6 text-[#9a8072]">Suas assinaturas, em um só lugar.</p>

        <nav aria-label="Acesso à conta" className="mt-6 grid grid-cols-2 rounded-xl border border-[#eadfd5] bg-[#fcfaf7] p-1">
          <Link className="rounded-[0.65rem] px-3 py-2.5 text-center text-xs font-medium text-[#9a8072] transition-colors hover:text-[#543b2d]" to="/login">Entrar</Link>
          <Link aria-current="page" className="rounded-[0.65rem] bg-[#eee5dc] px-3 py-2.5 text-center text-xs font-semibold text-[#543b2d] shadow-sm" to="/cadastro">Criar conta</Link>
        </nav>

        <form className="mt-5 space-y-3.5" noValidate onSubmit={handleSubmit}>
          {erro && <AuthMessage>{erro}</AuthMessage>}
          <TextField
            autoComplete="name"
            autoFocus
            label="Como podemos chamar você?"
            maxLength={100}
            name="nome"
            onChange={(event) => setNome(event.target.value)}
            onFocus={() => setCampoAtivo('nome')}
            placeholder="Seu nome"
            value={nome}
          />
          <TextField
            autoComplete="email"
            label="E-mail"
            maxLength={254}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            onFocus={() => setCampoAtivo('email')}
            placeholder="voce@exemplo.com"
            type="email"
            value={email}
          />
          <PasswordField
            autoComplete="new-password"
            hint="Use entre 8 e 72 caracteres."
            label="Senha"
            name="senha"
            onChange={setSenha}
            onFocus={() => setCampoAtivo('senha')}
            value={senha}
          />
          <PasswordField
            autoComplete="new-password"
            label="Confirme sua senha"
            name="confirmacao"
            onChange={setConfirmacao}
            onFocus={() => setCampoAtivo('senha')}
            value={confirmacao}
          />
          <Button className="mt-2 w-full" loading={carregando} size="lg" type="submit">
            {carregando ? 'Criando conta…' : 'Criar conta'}
          </Button>
          <p className="pt-1 text-center text-xs leading-5 text-ink-muted">
            Ao continuar, seus dados serão usados para manter suas assinaturas vinculadas à sua conta.
          </p>
        </form>

        <p className="mt-4 text-center text-xs text-[#9a8072]">
          Já tem uma conta?{' '}
          <Link className="font-semibold text-[#543b2d] transition-colors hover:text-[#8b6149]" to="/login">Entrar</Link>
        </p>
      </motion.div>
    </AuthPageLayout>
  )
}

export default Cadastro
