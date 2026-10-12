import type { CadastroPayload, LoginPayload, Usuario } from '../types/auth'
import { apiRequest, clearCsrfToken, getCsrfToken } from './apiClient'

export const authService = {
  async cadastrar(payload: CadastroPayload) {
    await getCsrfToken(true)
    return apiRequest<Usuario>('/auth/cadastro', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async entrar(payload: LoginPayload) {
    await getCsrfToken(true)
    const usuario = await apiRequest<Usuario>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    clearCsrfToken()
    await getCsrfToken(true)
    return usuario
  },

  atual() {
    return apiRequest<Usuario>('/auth/me')
  },

  atualizarLimiteMensal(limiteMensalAssinaturas: number) {
    return apiRequest<Usuario>('/auth/limite-mensal', {
      method: 'PATCH',
      body: JSON.stringify({ limiteMensalAssinaturas }),
    })
  },

  async sair() {
    try {
      await apiRequest<void>('/auth/logout', { method: 'POST' })
    } finally {
      clearCsrfToken()
    }
  },
}
