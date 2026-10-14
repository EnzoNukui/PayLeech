import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import LoadingState from '../../ui/LoadingState/LoadingState'

export function ProtectedRoute() {
  const { usuario, carregando } = useAuth()
  const location = useLocation()
  if (carregando) return <LoadingState label="Verificando sua sessão…" />
  if (!usuario) return <Navigate replace state={{ from: location }} to="/login" />
  return <Outlet />
}

export function GuestRoute() {
  const { usuario } = useAuth()
  if (usuario) return <Navigate replace to="/resumo" />
  // Keep login and sign-up usable while the session check runs in the background.
  // Private routes still wait for `carregando` in ProtectedRoute.
  return <Outlet />
}
