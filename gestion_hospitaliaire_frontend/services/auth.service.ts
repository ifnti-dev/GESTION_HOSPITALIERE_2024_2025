import { apiClient } from "./api"
import { API_ENDPOINTS } from "@/config/api"
import type { SpringBootAuthResponse } from "@/types/spring-boot"

export interface LoginCredentials {
  username: string
  password: string
}

export class AuthService {
  // Login avec Spring Security
  static async login(credentials: LoginCredentials): Promise<SpringBootAuthResponse> {
    const response = await apiClient.post<SpringBootAuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)

    // Stocker le JWT token
    if (response.token) {
      localStorage.setItem("jwt_token", response.token)
      if (response.refreshToken) {
        localStorage.setItem("refresh_token", response.refreshToken)
      }
    }

    return response
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } finally {
      // Nettoyer le localStorage même si la requête échoue
      localStorage.removeItem("jwt_token")
      localStorage.removeItem("refresh_token")
    }
  }

  // Refresh token
  static async refreshToken(): Promise<SpringBootAuthResponse> {
    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const response = await apiClient.post<SpringBootAuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })

    // Mettre à jour les tokens
    localStorage.setItem("jwt_token", response.token)
    if (response.refreshToken) {
      localStorage.setItem("refresh_token", response.refreshToken)
    }

    return response
  }

  // Vérifier si l'utilisateur est connecté
  static isAuthenticated(): boolean {
    return !!localStorage.getItem("jwt_token")
  }

  // Obtenir le token actuel
  static getToken(): string | null {
    return localStorage.getItem("jwt_token")
  }
}
