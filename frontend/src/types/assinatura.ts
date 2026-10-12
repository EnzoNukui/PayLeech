export type Periodicidade = 'MENSAL' | 'TRIMESTRAL' | 'ANUAL'
export type StatusAssinatura = 'ATIVA' | 'PAUSADA' | 'CANCELADA'

export interface Categoria {
  id: number
  nome: string
  descricao: string | null
}

export interface Assinatura {
  codigo: number
  nome: string
  valor: number
  periodicidade: Periodicidade
  dataPrimeiraCobranca: string
  statusAssinatura: StatusAssinatura
  icone: string | null
  categoria: Categoria
}

export interface AssinaturaPayload {
  nome: string
  valor: number
  periodicidade: Periodicidade
  dataPrimeiraCobranca: string
  statusAssinatura: StatusAssinatura
  categoriaId: number
  icone?: string | null
}

export interface CategoriaPayload {
  nome: string
  descricao?: string
}
