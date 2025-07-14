"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import AuthService, { type UserProfile } from "@/services/auth.service"

interface User {
  token: string
  profile: UserProfile
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      setIsLoading(true)
      console.log("🔍 Vérification de l'authentification...")

      if (!AuthService.isAuthenticated()) {
        console.log("❌ Utilisateur non authentifié")
        setUser(null)
        setUserProfile(null)
        setIsAuthenticated(false)
        return
      }

      const token = AuthService.getToken()
      let profile = AuthService.getUserData()

      if (!profile && token) {
        try {
          console.log("📥 Récupération du profil depuis l'API...")
          profile = await AuthService.getUserProfile()
          AuthService.setUserData(profile)
        } catch (error) {
          console.error("❌ Erreur lors de la récupération du profil:", error)
          AuthService.logout()
          setUser(null)
          setUserProfile(null)
          setIsAuthenticated(false)
          return
        }
      }

      if (token && profile) {
        console.log("✅ Utilisateur authentifié:", profile.email)
        setUser({ token, profile })
        setUserProfile(profile)
        setIsAuthenticated(true)
      } else {
        console.log("❌ Token ou profil manquant")
        setUser(null)
        setUserProfile(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("❌ Erreur lors de la vérification de l'authentification:", error)
      setUser(null)
      setUserProfile(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true)
      console.log("🔐 Début du processus de connexion...")

      const response = await AuthService.login(credentials)

      if (response.token) {
        console.log("✅ Token reçu, récupération du profil...")
        const profile = await AuthService.getUserProfile()
        const userData = { token: response.token, profile }

        setUser(userData)
        setUserProfile(profile)
        setIsAuthenticated(true)

        console.log("🎯 Redirection basée sur le rôle:", profile.employe.roles[0]?.nom)

        // Redirection basée sur le rôle
        const role = profile.employe.roles[0]?.nom?.toUpperCase()
        switch (role) {
          case "DIRECTEUR":
            router.push("/dashboard/directeur")
            break
          case "MEDECIN":
            router.push("/dashboard/medecin")
            break
          case "INFIRMIER":
            router.push("/dashboard/infirmier")
            break
          case "PHARMACIEN":
            router.push("/dashboard/pharmacien")
            break
          case "CAISSIER":
            router.push("/dashboard/caissier")
            break
          case "SAGE_FEMME":
            router.push("/dashboard/sage-femme")
            break
          default:
            router.push("/dashboard")
        }
      }
    } catch (error) {
      console.error("❌ Erreur lors de la connexion:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log("🚪 Déconnexion de l'utilisateur")
    AuthService.logout()
    setUser(null)
    setUserProfile(null)
    setIsAuthenticated(false)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        login,
        logout,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
