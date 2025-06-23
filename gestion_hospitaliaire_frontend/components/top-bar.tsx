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
} from "lucide-react"

interface TopBarProps {
  userRole?: string
  userName?: string
  userAvatar?: string
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

export function TopBar({
  userRole = "Directeur",
  userName = "Dr. Jean Dupont",
  userAvatar,
  sidebarOpen,
  setSidebarOpen,
  isMobile,
}: TopBarProps) {
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

  // Couleurs thématiques selon le rôle
  const getRoleTheme = () => {
    switch (userRole) {
      case "Médecin":
        return {
          gradient: "from-blue-500 to-blue-600",
          bgGradient: "from-blue-50 to-blue-100",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          hoverBg: "hover:bg-blue-50",
          badgeColor: "bg-blue-500",
        }
      case "Infirmier":
        return {
          gradient: "from-emerald-500 to-emerald-600",
          bgGradient: "from-emerald-50 to-emerald-100",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
          hoverBg: "hover:bg-emerald-50",
          badgeColor: "bg-emerald-500",
        }
      case "Sage-femme":
        return {
          gradient: "from-rose-500 to-rose-600",
          bgGradient: "from-rose-50 to-rose-100",
          textColor: "text-rose-700",
          borderColor: "border-rose-200",
          hoverBg: "hover:bg-rose-50",
          badgeColor: "bg-rose-500",
        }
      case "Pharmacien":
        return {
          gradient: "from-teal-500 to-teal-600",
          bgGradient: "from-teal-50 to-teal-100",
          textColor: "text-teal-700",
          borderColor: "border-teal-200",
          hoverBg: "hover:bg-teal-50",
          badgeColor: "bg-teal-500",
        }
      case "Caissier":
        return {
          gradient: "from-amber-500 to-amber-600",
          bgGradient: "from-amber-50 to-amber-100",
          textColor: "text-amber-700",
          borderColor: "border-amber-200",
          hoverBg: "hover:bg-amber-50",
          badgeColor: "bg-amber-500",
        }
      case "Directeur":
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

  const theme = getRoleTheme()

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
                {userRole}
              </Badge>
              <div className="h-6 w-px bg-gray-300"></div>
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                En ligne
              </Badge>
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
                      <AvatarImage src={userAvatar || "/images/user.png"} />
                      <AvatarFallback className={`bg-gradient-to-r ${theme.gradient} text-white font-bold text-sm`}>
                        {userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {userName}
                    </span>
                    <span className={`text-xs ${theme.textColor} font-medium`}>{userRole}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                <DropdownMenuLabel className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 ring-2 ring-gray-200">
                      <AvatarImage src={userAvatar || "/images/user.png"} />
                      <AvatarFallback className={`bg-gradient-to-r ${theme.gradient} text-white font-bold`}>
                        {userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{userName}</p>
                      <p className={`text-sm ${theme.textColor} font-medium`}>{userRole}</p>
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
                <DropdownMenuItem className="text-red-600 hover:bg-red-50 transition-colors">
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
