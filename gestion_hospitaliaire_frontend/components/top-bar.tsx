"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Menu, X, Settings } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface TopBarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  isMobile: boolean
}

export function TopBar({ sidebarOpen, setSidebarOpen, isMobile }: TopBarProps) {
  const { user, userProfile, logout, isLoading } = useAuth()

  // Extraction des informations utilisateur avec gestion des cas null/undefined
  const getUserInfo = () => {
    // Priorité au userProfile, puis au user.profile
    const profile = userProfile || user?.profile

    if (!profile) {
      return {
        nom: "Utilisateur",
        prenom: "",
        email: "",
        role: "Utilisateur",
      }
    }

    return {
      nom: profile.nom || "Utilisateur",
      prenom: profile.prenom || "",
      email: profile.email || "",
      role: profile.employe?.roles?.[0]?.nom || "Utilisateur",
    }
  }

  const userInfo = getUserInfo()
  const fullName = `${userInfo.prenom} ${userInfo.nom}`.trim() || "Utilisateur"

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  const getInitials = (nom: string, prenom: string) => {
    const n = nom || "U"
    const p = prenom || "T"
    return `${p.charAt(0)}${n.charAt(0)}`.toUpperCase()
  }

  // Affichage de chargement
  if (isLoading) {
    return (
      <header className="w-full border-b bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="w-full border-b bg-white">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
              {sidebarOpen && !isMobile ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
              <span className="sr-only">Toggle Sidebar</span>
            </Button>

            <div className="hidden sm:block">
              <span className="text-sm font-medium text-gray-700">{userInfo.role}</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/images/user.png" />
                    <AvatarFallback className="bg-gray-500 text-white text-sm">
                      {getInitials(userInfo.nom, userInfo.prenom)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <span className="text-sm font-medium text-gray-900">{fullName}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{fullName}</p>
                    <p className="text-xs text-gray-500">{userInfo.role}</p>
                    {userInfo.email && <p className="text-xs text-gray-500">{userInfo.email}</p>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Mon Profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
