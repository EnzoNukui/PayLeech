import { FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'

interface LogoutButtonProps {
  variant?: 'sidebar' | 'mobile'
}

function LogoutButton({ variant = 'sidebar' }: LogoutButtonProps) {
  const { sair } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await sair()
    } catch {
      // A sessão local também é encerrada quando o backend já não reconhece o cookie.
    } finally {
      navigate('/login', { replace: true })
    }
  }

  if (variant === 'mobile') {
    return (
      <button
        aria-label="Sair da conta"
        className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1.5 py-1.5 text-[11px] font-medium text-ink-muted transition-colors hover:text-ink"
        onClick={handleLogout}
        type="button"
      >
        <FiLogOut aria-hidden="true" size={20} strokeWidth={1.8} />
        <span>Sair</span>
      </button>
    )
  }

  return (
    <button
      className="flex min-h-10 w-full items-center gap-2.5 rounded-control px-3 text-sm font-medium text-ink-muted transition-colors hover:bg-surface hover:text-ink"
      onClick={handleLogout}
      type="button"
    >
      <FiLogOut aria-hidden="true" size={17} strokeWidth={1.8} />
      Sair da conta
    </button>
  )
}

export default LogoutButton
