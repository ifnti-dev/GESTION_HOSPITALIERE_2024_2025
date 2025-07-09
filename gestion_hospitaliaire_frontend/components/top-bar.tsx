"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  Calendar,
  ChevronDown,
  Shield,
  Phone,
  MapPin,
  Mail,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface TopBarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  isMobile: boolean
}

interface Notification {
  id: string
  type: "info" | "warning" | "success" | "urgent"
  title: string
  message: string
  time: string
  read: boolean
}

export function TopBar({ sidebarOpen, setSidebarOpen, isMobile }: TopBarProps) {
  const { user, userProfile, logout, isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "urgent",
      title: "Urgence Médicale",
      message: "Patient en détresse respiratoire - Salle 204",
      time: "Il y a 2 min",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Stock Faible",
      message: "Médicament Paracétamol - Stock critique",
      time: "Il y a 15 min",
      read: false,
    },
    {
      id: "3",
      type: "info",
      title: "Nouveau Message",
      message: "Dr. Martin vous a envoyé un message",
      time: "Il y a 1h",
      read: false,
    },
    {
      id: "4",
      type: "success",
      title: "Opération Réussie",
      message: "Intervention chirurgicale terminée avec succès",
      time: "Il y a 2h",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

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
        // specialite: "",
        // numOrdre: "",
        // telephone: "",
        // adresse: "",
        // dateNaissance: "",
        // statut: "Inconnu",
      }
    }

    return {
      nom: profile.nom || "Utilisateur",
      prenom: profile.prenom || "",
      email: profile.email || "",
      role: profile.employe?.roles?.[0]?.nom || "Utilisateur",
      // specialite: profile.employe?.specialite || "",
      // numOrdre: profile.employe?.numOrdre || "",
      // telephone: profile.telephone || "",
      // adresse: profile.adresse || "",
      // dateNaissance: profile.dateNaissance || "",
      // statut: "Actif", // Par défaut si connecté
    }
  }

  const userInfo = getUserInfo()
  const fullName = `${userInfo.prenom} ${userInfo.nom}`.trim() || "Utilisateur"

  // Couleurs thématiques selon le rôle
  const getRoleTheme = (role: string) => {
    const normalizedRole = role.toLowerCase()

    switch (normalizedRole) {
      case "médecin":
      case "medecin":
        return {
          gradient: "from-blue-500 to-blue-600",
          bgGradient: "from-blue-50 to-blue-100",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          hoverBg: "hover:bg-blue-50",
          badgeColor: "bg-blue-500",
        }
      case "infirmier":
      case "infirmière":
        return {
          gradient: "from-emerald-500 to-emerald-600",
          bgGradient: "from-emerald-50 to-emerald-100",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
          hoverBg: "hover:bg-emerald-50",
          badgeColor: "bg-emerald-500",
        }
      case "sage-femme":
      case "sage_femme":
        return {
          gradient: "from-rose-500 to-rose-600",
          bgGradient: "from-rose-50 to-rose-100",
          textColor: "text-rose-700",
          borderColor: "border-rose-200",
          hoverBg: "hover:bg-rose-50",
          badgeColor: "bg-rose-500",
        }
      case "pharmacien":
      case "pharmacienne":
        return {
          gradient: "from-teal-500 to-teal-600",
          bgGradient: "from-teal-50 to-teal-100",
          textColor: "text-teal-700",
          borderColor: "border-teal-200",
          hoverBg: "hover:bg-teal-50",
          badgeColor: "bg-teal-500",
        }
      case "caissier":
      case "caissière":
        return {
          gradient: "from-amber-500 to-amber-600",
          bgGradient: "from-amber-50 to-amber-100",
          textColor: "text-amber-700",
          borderColor: "border-amber-200",
          hoverBg: "hover:bg-amber-50",
          badgeColor: "bg-amber-500",
        }
      case "directeur":
      case "directrice":
        return {
          gradient: "from-purple-500 to-purple-600",
          bgGradient: "from-purple-50 to-purple-100",
          textColor: "text-purple-700",
          borderColor: "border-purple-200",
          hoverBg: "hover:bg-purple-50",
          badgeColor: "bg-purple-500",
        }
      default:
        return {
          gradient: "from-slate-600 to-slate-700",
          bgGradient: "from-slate-50 to-slate-100",
          textColor: "text-slate-700",
          borderColor: "border-slate-200",
          hoverBg: "hover:bg-slate-50",
          badgeColor: "bg-slate-600",
        }
    }
  }

  const theme = getRoleTheme(userInfo.role)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const currentTime = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "Non spécifié"
    try {
      return new Date(dateString).toLocaleDateString("fr-FR")
    } catch {
      return "Date invalide"
    }
  }

  // Affichage de chargement
  if (isLoading) {
    return (
      <header className="sticky top-0 z-40 w-full">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"></div>
        <div className="relative px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-32 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"></div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.bgGradient} opacity-30`}></div>

      {/* Content */}
      <div className="relative px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-6">
            {/* Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`group relative p-2 rounded-xl ${theme.hoverBg} transition-all duration-300 hover:shadow-lg hover:scale-105`}
            >
              <div className="relative">
                {sidebarOpen && !isMobile ? (
                  <X className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
                )}
              </div>
              <span className="sr-only">Toggle Sidebar</span>
            </Button>

            {/* Role Badge */}
            <div className="hidden sm:flex items-center space-x-3">
              <Badge
                className={`bg-gradient-to-r ${theme.gradient} text-white shadow-lg px-4 py-2 text-sm font-bold border-0 hover:shadow-xl transition-all duration-300`}
              >
                <Activity className="h-3 w-3 mr-2" />
                {userInfo.role}
              </Badge>

              {/* {userInfo.specialite && (
                <Badge variant="outline" className="text-gray-700 border-gray-200 bg-gray-50 px-3 py-1">
                  <Shield className="h-3 w-3 mr-1" />
                  {userInfo.specialite}
                </Badge>
              )}

              {userInfo.numOrdre && (
                <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50 px-2 py-1 text-xs">
                  N° {userInfo.numOrdre}
                </Badge>
              )}

              <div className="h-6 w-px bg-gray-300"></div>

              <Badge
                variant="outline"
                className={`px-3 py-1 ${
                  userInfo.statut === "Actif"
                    ? "text-green-700 border-green-200 bg-green-50"
                    : "text-orange-700 border-orange-200 bg-orange-50"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
                    userInfo.statut === "Actif" ? "bg-green-500" : "bg-orange-500"
                  }`}
                ></div>
                {userInfo.statut}
              </Badge> */}
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
              <Input
                type="text"
                placeholder="Rechercher patients, dossiers, médicaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-white/70 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 hover:bg-white/90"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Date & Time */}
            <div className="hidden lg:flex flex-col items-end text-sm">
              <div className="text-gray-900 font-semibold">{currentTime}</div>
              <div className="text-gray-600 text-xs">{currentDate}</div>
            </div>

            {/* Quick Actions */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className={`p-2 rounded-xl ${theme.hoverBg} transition-all duration-300 hover:shadow-lg hover:scale-105`}
              >
                <Calendar className="h-4 w-4 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`p-2 rounded-xl ${theme.hoverBg} transition-all duration-300 hover:shadow-lg hover:scale-105`}
              >
                <MessageSquare className="h-4 w-4 text-gray-600" />
              </Button>
            </div>

            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative p-2 rounded-xl ${theme.hoverBg} transition-all duration-300 hover:shadow-lg hover:scale-105`}
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 flex items-center justify-center">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <span className="text-xs font-bold text-white">{unreadCount}</span>
                      </div>
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 shadow-2xl border-0 bg-white/95 backdrop-blur-xl" align="end">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} nouvelles
                    </Badge>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer ${
                        !notification.read ? "bg-blue-50/30" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900 truncate">{notification.title}</p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100">
                  <Button variant="ghost" size="sm" className="w-full text-sm">
                    Voir toutes les notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl ${theme.hoverBg} transition-all duration-300 hover:shadow-lg hover:scale-105`}
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-gray-600" /> : <Moon className="h-4 w-4 text-gray-600" />}
            </Button>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center space-x-3 p-2 rounded-xl ${theme.hoverBg} transition-all duration-300 hover:shadow-lg hover:scale-105 group`}
                >
                  <div className="relative">
                    <Avatar className="h-9 w-9 ring-2 ring-white shadow-lg">
                      <AvatarImage src="/images/user.png" />
                      <AvatarFallback className={`bg-gradient-to-r ${theme.gradient} text-white font-bold text-sm`}>
                        {getInitials(userInfo.nom, userInfo.prenom)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      // className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                      //   userInfo.statut === "Actif" ? "bg-green-500" : "bg-orange-500"
                      // }`}
                    ></div>
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {fullName}
                    </span>
                    <span className={`text-xs ${theme.textColor} font-medium`}>{userInfo.role}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                <DropdownMenuLabel className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 ring-2 ring-gray-200">
                      <AvatarImage src="/images/user.png" />
                      <AvatarFallback className={`bg-gradient-to-r ${theme.gradient} text-white font-bold`}>
                        {getInitials(userInfo.nom, userInfo.prenom)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{fullName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={`text-xs ${theme.badgeColor} text-white`}>{userInfo.role}</Badge>
                        {/* {userInfo.statut && (
                          <Badge variant="outline" className="text-xs">
                            {userInfo.statut}
                          </Badge>
                        )} */}
                      </div>

                      {/* Informations détaillées */}
                      <div className="mt-3 space-y-2 text-xs text-gray-600">
                        {userInfo.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="h-3 w-3" />
                            <span>{userInfo.email}</span>
                          </div>
                        )}

                        {/* {userInfo.specialite && (
                          <div className="flex items-center space-x-2">
                            <Shield className="h-3 w-3" />
                            <span>Spécialité: {userInfo.specialite}</span>
                          </div>
                        )}

                        {userInfo.numOrdre && (
                          <div className="flex items-center space-x-2">
                            <User className="h-3 w-3" />
                            <span>N° Ordre: {userInfo.numOrdre}</span>
                          </div>
                        )}

                        {userInfo.telephone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3" />
                            <span>{userInfo.telephone}</span>
                          </div>
                        )}

                        {userInfo.adresse && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-3 w-3" />
                            <span>{userInfo.adresse}</span>
                          </div>
                        )}

                        {userInfo.dateNaissance && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3" />
                            <span>Né(e) le: {formatDate(userInfo.dateNaissance)}</span>
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem className={`${theme.hoverBg} transition-colors`}>
                  <User className="mr-3 h-4 w-4" />
                  Mon Profil
                </DropdownMenuItem>

                <DropdownMenuItem className={`${theme.hoverBg} transition-colors`}>
                  <Settings className="mr-3 h-4 w-4" />
                  Paramètres
                </DropdownMenuItem>

                <DropdownMenuItem className={`${theme.hoverBg} transition-colors`}>
                  <Bell className="mr-3 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-red-600 hover:bg-red-50 transition-colors" onClick={handleLogout}>
                  <LogOut className="mr-3 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search */}
        {isMobile && (
          <div className="mt-4 sm:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-white/70 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
