// Types spécifiques pour Spring Boot

// Réponse d'authentification Spring Security
export interface SpringBootAuthResponse {
  token: string
  type: string // "Bearer"
  refreshToken?: string
  expiresIn: number
  user: {
    id: string
    username: string
    email: string
    roles: string[]
    authorities: string[]
  }
}

// Réponse d'erreur Spring Boot
export interface SpringBootErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
  trace?: string
}

// Réponse de validation Spring Boot
export interface SpringBootValidationError {
  timestamp: string
  status: 400
  error: "Bad Request"
  message: "Validation failed"
  path: string
  subErrors: Array<{
    object: string
    field: string
    rejectedValue: any
    message: string
  }>
}

// Page Spring Boot (réponse paginée)
export interface SpringBootPage<T> {
  content: T[]
  pageable: {
    sort: { sorted: boolean; unsorted: boolean }
    pageNumber: number
    pageSize: number
    offset: number
    paged: boolean
    unpaged: boolean
  }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  numberOfElements: number
  size: number
  number: number
  sort: { sorted: boolean; unsorted: boolean }
  empty: boolean
}

// Paramètres de pagination Spring Boot
export interface SpringBootPageRequest {
  page?: number // 0-based
  size?: number
  sort?: string[] // ["field,direction"]
}
