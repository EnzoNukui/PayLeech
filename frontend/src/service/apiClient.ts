const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

let csrfToken: string | null = null
let csrfHeaderName = 'X-CSRF-TOKEN'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function readError(response: Response, unauthorizedMessage: string): Promise<string> {
  const body = await response.text()
  if (!body) {
    if (response.status === 401) return unauthorizedMessage
    if (response.status === 403) return 'Sua sessão de segurança expirou. Tente novamente.'
    if (response.status === 409) return 'Este e-mail já está cadastrado.'
    return 'Não foi possível concluir a solicitação. Tente novamente.'
  }

  try {
    const parsed: unknown = JSON.parse(body)
    if (typeof parsed === 'string') return parsed
    if (parsed && typeof parsed === 'object') {
      const data = parsed as Record<string, unknown>
      for (const key of ['message', 'detail', 'error', 'mensagem']) {
        if (typeof data[key] === 'string') return data[key]
      }
      const validation = data.errors
      if (Array.isArray(validation)) {
        const firstMessage = validation.find((item) => item && typeof item === 'object' && 'defaultMessage' in item)
        if (firstMessage && typeof firstMessage.defaultMessage === 'string') return firstMessage.defaultMessage
      }
    }
  } catch {
    return body
  }
  return `Não foi possível concluir a solicitação (HTTP ${response.status}). Verifique os dados e tente novamente.`
}

export async function getCsrfToken(forceRefresh = false): Promise<string> {
  if (csrfToken && !forceRefresh) return csrfToken

  const response = await fetch(`${API_BASE_URL}/auth/csrf`, { credentials: 'include' })
  if (!response.ok) throw new ApiError(await readError(response, 'Não foi possível validar a sessão.'), response.status)
  const data = (await response.json()) as { token: string; headerName?: string }
  csrfToken = data.token
  csrfHeaderName = data.headerName || 'X-CSRF-TOKEN'
  return csrfToken
}

export function clearCsrfToken() {
  csrfToken = null
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase()
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    headers.set(csrfHeaderName, await getCsrfToken())
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  })

  if (!response.ok) {
    const unauthorizedMessage = path === '/auth/login'
      ? 'E-mail ou senha incorretos.'
      : 'Sua sessão não foi reconhecida. Entre novamente.'
    throw new ApiError(await readError(response, unauthorizedMessage), response.status)
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
