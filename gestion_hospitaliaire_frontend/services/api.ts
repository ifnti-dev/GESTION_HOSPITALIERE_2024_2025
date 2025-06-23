import { API_CONFIG, API_HEADERS, CORS_CONFIG } from "@/config/api"

// Gestion des erreurs Spring Boot
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public timestamp?: string,
    public path?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Interface pour les réponses d'erreur Spring Boot
interface SpringBootErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

// Client API adapté pour Spring Boot
class SpringBootApiClient {
  private baseURL: string
  private timeout: number

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    console.log(`🌐 API Request: ${options.method || "GET"} ${url}`)

    const config: RequestInit = {
      ...CORS_CONFIG,
      ...options,
      headers: {
        ...API_HEADERS,
        ...options.headers,
      },
    }

    // Ajouter le token JWT pour Spring Security
    const token = this.getAuthToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log(`📡 API Response: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        await this.handleSpringBootError(response)
      }

      // Spring Boot peut retourner du texte vide pour certaines opérations (DELETE)
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json()
        console.log(`✅ API Data:`, data)
        return data
      }

      // Pour les réponses vides (comme DELETE)
      return {} as T
    } catch (error) {
      console.error(`❌ API Error:`, error)

      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("Timeout de la requête", 408)
      }

      throw new ApiError("Erreur de connexion au serveur Spring Boot", 0)
    }
  }

  private async handleSpringBootError(response: Response): Promise<never> {
    try {
      const errorData: SpringBootErrorResponse = await response.json()
      throw new ApiError(
        errorData.message || "Une erreur est survenue",
        errorData.status,
        errorData.error,
        errorData.timestamp,
        errorData.path,
      )
    } catch (parseError) {
      // Si l'erreur n'est pas au format JSON Spring Boot
      throw new ApiError(`Erreur ${response.status}: ${response.statusText}`, response.status)
    }
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token") // JWT token pour Spring Security
    }
    return null
  }

  // Méthodes HTTP adaptées pour Spring Boot
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }

    const url = searchParams.toString() ? `${endpoint}?${searchParams}` : endpoint
    return this.request<T>(url, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

// Instance singleton du client API
export const apiClient = new SpringBootApiClient()

// Utilitaires pour les réponses Spring Boot
export function handleSpringBootResponse<T>(response: T): T {
  return response
}

// Gestion des réponses paginées Spring Boot (Page<T>)
export interface SpringBootPage<T> {
  content: T[]
  pageable: {
    sort: {
      sorted: boolean
      unsorted: boolean
    }
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
  sort: {
    sorted: boolean
    unsorted: boolean
  }
  empty: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const handleSpringBootPage = <T>(page: SpringBootPage<T>): PaginatedResponse<T> => {
  return {
    data: page.content,
    total: page.totalElements,
    page: page.number,
    limit: page.size,
    totalPages: page.totalPages,
  }
}
