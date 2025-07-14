import { API_CONFIG, API_HEADERS, CORS_CONFIG } from "@/config/api"

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...CORS_CONFIG,
      ...options,
      headers: {
        ...API_HEADERS,
        ...options.headers,
      },
    })

    // Lire le contenu une seule fois
    const responseText = await response.text()

    if (!response.ok) {
      let errorMessage = `Erreur API: ${response.status} - ${response.statusText}`

      if (responseText) {
        try {
          const errorJson = JSON.parse(responseText)
          errorMessage += ` - ${errorJson.message || errorJson.error || responseText}`
        } catch {
          errorMessage += ` - ${responseText}`
        }
      }

      throw new Error(errorMessage)
    }

    // Si pas de contenu, retourner objet vide
    if (!responseText || responseText.trim() === "") {
      return {} as T
    }

    // Essayer de parser le JSON
    try {
      return JSON.parse(responseText)
    } catch (jsonError) {
      console.warn("Erreur lors du parsing JSON:", jsonError)
      console.warn("Contenu reçu:", responseText)
      return {} as T
    }
  } catch (error) {
    console.error(`Erreur lors de l'appel API vers ${url}:`, error)
    throw error
  }
}

// Client API avec méthodes CRUD
export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    try {
      console.log(`🚀 Requête API: ${options.method || "GET"} ${url}`)

      const response = await fetch(url, {
        ...CORS_CONFIG,
        ...options,
        headers: {
          ...API_HEADERS,
          ...options.headers,
        },
      })

      console.log(`📥 Réponse API: ${response.status} ${response.statusText}`)

      // Lire le contenu une seule fois
      const responseText = await response.text()
      console.log(`📄 Contenu reçu:`, responseText.substring(0, 200) + (responseText.length > 200 ? "..." : ""))

      if (!response.ok) {
        let errorMessage = `Erreur API: ${response.status} - ${response.statusText}`

        if (responseText) {
          try {
            const errorJson = JSON.parse(responseText)
            errorMessage += ` - ${errorJson.message || errorJson.error || responseText}`
          } catch {
            errorMessage += ` - ${responseText}`
          }
        }

        console.error(`❌ ${errorMessage}`)
        throw new Error(errorMessage)
      }

      // Si pas de contenu, retourner objet vide
      if (!responseText || responseText.trim() === "") {
        console.log("✅ Réponse vide, retour objet vide")
        return {} as T
      }

      // Essayer de parser le JSON
      try {
        const result = JSON.parse(responseText)
        console.log("✅ JSON parsé avec succès:", Array.isArray(result) ? `Array[${result.length}]` : typeof result)
        return result
      } catch (jsonError) {
        console.warn("⚠️ Erreur lors du parsing JSON:", jsonError)
        console.warn("Contenu reçu:", responseText)
        return {} as T
      }
    } catch (error) {
      console.error(`💥 Erreur lors de l'appel API vers ${url}:`, error)
      throw error
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    let url = endpoint
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value))
      })
      url += `?${searchParams.toString()}`
    }

    return this.request<T>(url, {
      method: "GET",
    })
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

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    })
  }
}

// Instance globale du client API
export const apiClient = new ApiClient()
