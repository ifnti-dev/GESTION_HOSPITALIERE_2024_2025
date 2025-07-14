import { API_CONFIG, API_HEADERS, CORS_CONFIG } from "@/config/api"

interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
}


class SpringBootApiClient {

class ApiClient {

  private baseURL: string

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    console.log(`API Request: ${options.method || "GET"} ${url}`)

    // Récupérer le token depuis localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null


    const config: RequestInit = {
      ...CORS_CONFIG,
      ...options,
      headers: {
        ...API_HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    const token = this.getAuthToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }


    try {
      console.log(`🚀 API Request: ${options.method || "GET"} ${url}`)
      if (options.body) {
        console.log("📤 Request Body:", options.body)
      }
      if (token) {
        console.log(`🔑 Token utilisé: ${token.substring(0, 20)}...`)
      }

      const response = await fetch(url, config)
      console.log(`📥 API Response: ${response.status} ${response.statusText}`)

      // Lire le contenu une seule fois
      const responseText = await response.text()
      console.log(`📄 Response Text Length: ${responseText.length}`)

      if (!response.ok) {
        let errorText = `HTTP ${response.status}`

        if (responseText) {
          try {
            const errorData = JSON.parse(responseText)
            errorText = errorData.error || errorData.message || errorText
          } catch {
            errorText = responseText || errorText
          }
        }

        console.error(`❌ Erreur API: ${response.status} - ${errorText}`)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      // Parser le JSON si possible
      let data: T
      if (!responseText || responseText.trim() === "") {
        data = {} as T
      } else {
        try {
          data = JSON.parse(responseText)
        } catch (jsonError) {
          console.warn("⚠️ Erreur parsing JSON, retour texte brut")
          data = responseText as unknown as T
        }
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
      throw new ApiError(`Erreur ${response.status}: ${response.statusText}`, response.status)
    }
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token") 

      console.log("✅ Response Data:", Array.isArray(data) ? `Array[${(data as any).length}]` : typeof data)

      return {
        data,
        status: response.status,
        statusText: response.statusText,
      }
    } catch (error) {
      console.error(`💥 Erreur lors de la requête API vers ${url}:`, error)
      throw error
    }
  }

  async get<T = any>(endpoint: string): Promise<T> {
    const response = await this.request<T>(endpoint, { method: "GET" })
    return response.data
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
    return response.data
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
    return response.data
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    const response = await this.request<T>(endpoint, { method: "DELETE" })
    return response.data
  }
}

export const apiClient = new ApiClient()
