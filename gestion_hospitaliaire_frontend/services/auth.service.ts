import { apiClient } from "./api"

export interface UserProfile {
  id: number
  nom: string
  prenom: string
  email: string
  telephone?: string
  adresse?: string
  dateNaissance?: string
  sexe?: string
  situationMatrimoniale?: string
  employe: {
    id: number
    numOrdre?: string
    specialite?: string
    dateAffectation?: string
    horaire?: string
    roles: Array<{
      id: number
      nom: string
      description?: string
      permissions: Array<{
        id: number
        nom: string
        description?: string
      }>
    }>
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  message: string
  email: string
}

class AuthService {
  private static readonly TOKEN_KEY = "auth_token"
  private static readonly USER_KEY = "user_profile"

  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log("🔐 Tentative de connexion avec:", credentials.email)

      // Préparer les données de connexion
      const loginData = {
        email: credentials.email.trim(),
        password: credentials.password,
      }

      console.log("📤 Données de connexion:", { email: loginData.email, password: "[PROTECTED]" })

      // Envoyer la requête de connexion
      const response = await apiClient.post<LoginResponse>("/api/auth/login", loginData)

      console.log("✅ Réponse de connexion reçue:", {
        token: response.token ? "Present" : "Absent",
        message: response.message,
      })

      if (response.token) {
        // Stocker le token
        this.setToken(response.token)
        console.log("💾 Token stocké avec succès")
      }

      return response
    } catch (error) {
      console.error("❌ Erreur lors de la connexion:", error)
      throw error
    }
  }

  static async getUserProfile(): Promise<UserProfile> {
    try {
      console.log("👤 Récupération du profil utilisateur...")

      const response = await apiClient.get<UserProfile>("/api/auth/profile")

      console.log("✅ Profil utilisateur récupéré:", {
        nom: response.nom,
        prenom: response.prenom,
        email: response.email,
        roles: response.employe?.roles?.map((r) => r.nom) || [],
      })

      if (response) {
        this.setUserData(response)
      }

      return response
    } catch (error) {
      console.error("❌ Erreur lors de la récupération du profil:", error)
      throw error
    }
  }

  static logout(): void {
    console.log("🚪 Déconnexion...")
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)
    }
  }

  static isAuthenticated(): boolean {
    if (typeof window === "undefined") return false

    const token = this.getToken()
    if (!token) return false

    try {
      // Vérification basique de la validité du token
      const payload = JSON.parse(atob(token.split(".")[1]))
      const currentTime = Date.now() / 1000
      const isValid = payload.exp > currentTime

      console.log("🔍 Vérification token:", {
        valid: isValid,
        exp: new Date(payload.exp * 1000).toLocaleString(),
      })

      return isValid
    } catch (error) {
      console.error("❌ Erreur lors de la validation du token:", error)
      return false
    }
  }

  static getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token)
    }
  }

  static getUserData(): UserProfile | null {
    if (typeof window === "undefined") return null

    const userData = localStorage.getItem(this.USER_KEY)
    if (!userData) return null

    try {
      return JSON.parse(userData)
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des données utilisateur:", error)
      return null
    }
  }

  static setUserData(userData: UserProfile): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData))
    }
  }

  static getUserRole(): string | null {
    const userData = this.getUserData()
    if (!userData || !userData.employe.roles || userData.employe.roles.length === 0) {
      return null
    }
    return userData.employe.roles[0].nom
  }

  static hasRole(roleName: string): boolean {
    const userData = this.getUserData()
    if (!userData || !userData.employe.roles) return false

    return userData.employe.roles.some((role) => role.nom === roleName)
  }

  static hasPermission(permissionName: string): boolean {
    const userData = this.getUserData()
    if (!userData || !userData.employe.roles) return false

    return userData.employe.roles.some((role) =>
      role.permissions.some((permission) => permission.nom === permissionName),
    )
  }
}

export default AuthService
