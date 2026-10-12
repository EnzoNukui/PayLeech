import { apiRequest } from './apiClient'
import type { Cobranca, StatusCobranca } from '../types/cobranca'

export const cobrancaService = {
  listar(status?: StatusCobranca) {
    const query = status ? `?status=${encodeURIComponent(status)}` : ''
    return apiRequest<Cobranca[]>(`/cobrancas${query}`)
  },
}
