import { apiRequest } from './apiClient'

export interface PlanoSugerido {
  slug: string
  nome: string
}

export interface PrecoSugerido {
  servico: string
  plano: string
  nomePlano: string
  pais: string
  moeda: string
  valor: number
  precoFormatado: string
  periodicidade: string
  cadenciaCobranca: string
  fonte: string
  observadoEm: string
}

export const servicoPrecoService = {
  listarPlanos(servico: string) {
    const params = new URLSearchParams({ servico })
    return apiRequest<PlanoSugerido[]>(`/servicos/precos/planos?${params.toString()}`)
  },

  buscarPreco(servico: string, plano: string, pais = 'BRA') {
    const params = new URLSearchParams({ servico, plano, pais })
    return apiRequest<PrecoSugerido>(`/servicos/precos?${params.toString()}`)
  },
}
