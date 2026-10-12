export interface ResumoFinanceiro {
  custoMensalEquivalente: number
  custoAnualEstimado: number
  quantidadeAssinaturasAtivas: number
}

export interface ProximaCobranca {
  assinaturaId: number
  nomeAssinatura: string
  valor: number
  periodicidade: 'MENSAL' | 'TRIMESTRAL' | 'ANUAL'
  dataProximaCobranca: string
  categoriaNome: string
}
