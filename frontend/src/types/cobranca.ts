export type StatusCobranca = 'PREVISTA' | 'PAGA' | 'CANCELADA'

export interface Cobranca {
  id: number
  assinaturaId: number | null
  nomeAssinatura: string
  categoriaNome: string
  dataPrevista: string
  valorPrevisto: number
  dataPagamento: string | null
  valorPago: number | null
  status: StatusCobranca
}

