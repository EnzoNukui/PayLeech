export interface Usuario {
  id: number
  nome: string
  email: string
  limiteMensalAssinaturas: number
}

export interface LoginPayload {
  email: string
  senha: string
}

export interface CadastroPayload extends LoginPayload {
  nome: string
}

interface CsrfResponse {
  token: string
  headerName: string
}

export type { CsrfResponse }
