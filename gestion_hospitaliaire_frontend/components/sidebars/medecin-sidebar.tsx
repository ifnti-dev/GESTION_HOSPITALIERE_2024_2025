"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Stethoscope,
  Users,
  FileText,
  Calendar,
  Pill,
  Activity,
  UserCheck,
  Settings,
  LogOut,
  User,
  ChevronRight,
  AlertCircle,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { TopBar } from "../top-bar"

interface MedecinSidebarProps {
  children: React.ReactNode
}

export function MedecinSidebar({ children }: MedecinSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const menuItems = [
    {
      title: "Tableau de Bord",
      icon: <Activity className="h-5 w-5" />,
      href: "/dashboard/medecin",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Mes Patients",
      icon: <Users className="h-5 w-5" />,
      href: "/dashboard/medecin/patients",
      badge: "23",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Dossiers Médicaux",
      icon: <FileText className="h-5 w-5" />,
      gradient: "from-indigo-500 to-blue-500",
      subItems: [
        {
          title: "Dossiers Médicaux",
          href: "/dashboard/medecin/dossiers/medical",
        },
        {
          title: "Dossiers Grossesse",
          href: "/dashboard/medecin/dossiers/grossesse",
        },
      ],
    },
    {
      title: "Consultations",
      icon: <Stethoscope className="h-5 w-5" />,
      href: "/dashboard/medecin/consultations",
      badge: "12",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      title: "Prescriptions",
      icon: <Pill className="h-5 w-5" />,
      href: "/dashboard/medecin/prescriptions",
      badge: "5",
      gradient: "from-blue-600 to-cyan-600",
    },
     {
      title: "Suivi état",
      icon: <FileText className="h-5 w-5" />,
      href: "/dashboard/medecin/suivieEtats",
      gradient: "from-indigo-500 to-cyan-500",
    },
    {
      title: "Hospitalisations",
      icon: <UserCheck className="h-5 w-5" />,
      href: "/dashboard/medecin/hospitalisations",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Allergies",
      icon: <AlertCircle className="h-5 w-5" />,
      href: "/dashboard/medecin/allergies",
      gradient: "from-red-500 to-orange-500",
    },
  ]

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`
        ${sidebarOpen ? "w-80" : "w-0"}
        ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"}
        bg-gradient-to-br from-blue-50 via-white to-cyan-50
        border-r border-blue-100 shadow-2xl
        transition-all duration-300 ease-in-out
        backdrop-blur-sm overflow-hidden
        flex flex-col h-full
      `}
      >
        {/* Header - Fixed */}
        <div className="relative p-6 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 animate-pulse"></div>
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-2xl blur-sm"></div>
              <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/30">
                <Stethoscope className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">Médecin</h2>
              <p className="text-blue-100 text-sm font-medium drop-shadow">Espace Médical</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 px-2">
                Navigation Principale
              </h3>
              <nav className="space-y-2">
                {menuItems.map((item, index) => (
                  item.subItems ? (
                    <div key={index}>
                      <button
                        onClick={() => setOpenMenu(openMenu === item.title ? null : item.title)}
                        className="w-full group relative flex items-center justify-between p-4 rounded-xl
                                 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50
                                 hover:shadow-lg hover:shadow-blue-100/50
                                 transition-all duration-300 ease-out
                                 border border-transparent hover:border-blue-100
                                 transform hover:scale-[1.02] hover:-translate-y-0.5"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                          >
                            <div className="text-white drop-shadow">{item.icon}</div>
                          </div>
                          <span className="font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-blue-400 transition-transform duration-300 ${
                            openMenu === item.title ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openMenu === item.title && (
                        <div className="pl-12 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={closeSidebar}
                              className="flex items-center p-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors"
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={closeSidebar}
                      className="group relative flex items-center justify-between p-4 rounded-xl
                               hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50
                               hover:shadow-lg hover:shadow-blue-100/50
                               transition-all duration-300 ease-out
                               border border-transparent hover:border-blue-100
                               transform hover:scale-[1.02] hover:-translate-y-0.5"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        >
                          <div className="text-white drop-shadow">{item.icon}</div>
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg px-3 py-1 text-xs font-bold">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  )
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-blue-100 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full p-4 h-auto hover:bg-blue-100/50 rounded-xl transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-4 ring-blue-200 shadow-lg">
                      <AvatarImage src="/images/user.png" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg">
                        MD
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                      Dr. Jean Dupont
                    </p>
                    <p className="text-xs text-blue-600 font-medium">Médecin Généraliste</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 shadow-xl border-blue-100">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-blue-50">
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-blue-50">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TopBar */}
        {/* <TopBar
          userRole="Médecin"
          userName="Dr. Jean Dupont"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
        /> */}
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} />
        

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}