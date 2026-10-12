import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService } from '../service/authService'
import type { CadastroPayload, LoginPayload, Usuario } from '../types/auth'
import { ApiError } from '../service/apiClient'

interface AuthContextValue {
  usuario: Usuario | null
  carregando: boolean
  entrar: (payload: LoginPayload) => Promise<Usuario>
  cadastrar: (payload: CadastroPayload) => Promise<Usuario>
  atualizarLimiteMensal: (limiteMensalAssinaturas: number) => Promise<Usuario>
  sair: () => Promise<void>
  atualizarSessao: () => Promise<Usuario | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  const atualizarSessao = useCallback(async () => {
    try {
      const atual = await authService.atual()
      setUsuario(atual)
      return atual
    } catch (error) {
      if (error instanceof ApiError && error.status !== 401) throw error
      setUsuario(null)
      return null
    }
  }, [])

  useEffect(() => {
    let ativo = true
    authService.atual()
      .then((atual) => { if (ativo) setUsuario(atual) })
      .catch(() => { if (ativo) setUsuario(null) })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [])

  const entrar = useCallback(async (payload: LoginPayload) => {
    const autenticado = await authService.entrar(payload)
    setUsuario(autenticado)
    return autenticado
  }, [])

  const cadastrar = useCallback((payload: CadastroPayload) => authService.cadastrar(payload), [])

  const atualizarLimiteMensal = useCallback(async (limiteMensalAssinaturas: number) => {
    const atualizado = await authService.atualizarLimiteMensal(limiteMensalAssinaturas)
    setUsuario(atualizado)
    return atualizado
  }, [])

  const sair = useCallback(async () => {
    try {
      await authService.sair()
    } finally {
      setUsuario(null)
    }
  }, [])

  const value = useMemo(() => ({ usuario, carregando, entrar, cadastrar, atualizarLimiteMensal, sair, atualizarSessao }), [
    usuario, carregando, entrar, cadastrar, atualizarLimiteMensal, sair, atualizarSessao,
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.')
  return context
}
