import { apiRequest } from './apiClient'
import type { Assinatura, AssinaturaPayload, Categoria, CategoriaPayload, StatusAssinatura } from '../types/assinatura'

interface AssinaturaFilters {
  status?: StatusAssinatura | ''
  categoriaId?: number | ''
}

export const assinaturaService = {
  listar({ status, categoriaId }: AssinaturaFilters = {}) {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (categoriaId) params.set('categoriaId', String(categoriaId))
    const query = params.size ? `?${params.toString()}` : ''
    return apiRequest<Assinatura[]>(`/assinaturas${query}`)
  },

  criar(payload: AssinaturaPayload) {
    return apiRequest<Assinatura>('/assinaturas', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  atualizar(id: number, payload: AssinaturaPayload) {
    return apiRequest<Assinatura>(`/assinaturas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  excluir(id: number) {
    return apiRequest<void>(`/assinaturas/${id}`, { method: 'DELETE' })
  },
}

export const categoriaService = {
  listar() {
    return apiRequest<Categoria[]>('/categorias')
  },

  criar(payload: CategoriaPayload) {
    return apiRequest<Categoria>('/categorias', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
