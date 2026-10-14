import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
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
  const verificacaoSessaoId = useRef(0)

  const atualizarSessao = useCallback(async () => {
    const verificacaoId = ++verificacaoSessaoId.current
    try {
      const atual = await authService.atual()
      if (verificacaoId === verificacaoSessaoId.current) setUsuario(atual)
      return atual
    } catch (error) {
      if (error instanceof ApiError && error.status !== 401) throw error
      if (verificacaoId === verificacaoSessaoId.current) setUsuario(null)
      return null
    }
  }, [])

  useEffect(() => {
    let ativo = true
    const verificacaoId = ++verificacaoSessaoId.current
    authService.atual()
      .then((atual) => {
        if (ativo && verificacaoId === verificacaoSessaoId.current) setUsuario(atual)
      })
      .catch(() => {
        if (ativo && verificacaoId === verificacaoSessaoId.current) setUsuario(null)
      })
      .finally(() => {
        if (ativo && verificacaoId === verificacaoSessaoId.current) setCarregando(false)
      })
    return () => { ativo = false }
  }, [])

  const entrar = useCallback(async (payload: LoginPayload) => {
    verificacaoSessaoId.current += 1
    setCarregando(false)
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
    verificacaoSessaoId.current += 1
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
