// Types pour les réponses Spring Boot
export interface SpringBootPage<T> {
  content: T[]
  pageable: {
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    pageSize: number
    pageNumber: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  numberOfElements: number
  empty: boolean
}

// Types pour l'authentification
export interface SpringBootAuthResponse {
  token: string
  refreshToken?: string
  type?: string
  id?: number
  username?: string
  email?: string
  roles?: Array<{
    id: number
    nom: string
  }>
  personne?: {
    id: number
    nom: string
    prenom: string
    email: string
    adresse?: string
    telephone?: string
    sexe?: string
    dateNaissance?: string
    situationMatrimoniale?: string
  }
}

// Types pour les erreurs Spring Boot
export interface SpringBootError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}
