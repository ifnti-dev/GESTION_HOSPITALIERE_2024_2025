import { API_CONFIG, API_HEADERS, CORS_CONFIG } from "@/config/api"

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...CORS_CONFIG,
    ...options,
    headers: {
      ...API_HEADERS,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erreur API: ${response.status} - ${errorText}`)
  }

  return response.json()
}
