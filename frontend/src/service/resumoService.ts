import { apiRequest } from './apiClient'
import type { ProximaCobranca, ResumoFinanceiro } from '../types/resumo'

export const resumoService = {
  buscarResumo() {
    return apiRequest<ResumoFinanceiro>('/resumo')
  },

  buscarProximasCobrancas() {
    return apiRequest<ProximaCobranca[]>('/assinaturas/proximas-cobrancas')
  },
}
