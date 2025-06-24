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
  Pill,
  Package,
  Package2,
  ShoppingCart,
  Activity,
  Settings,
  LogOut,
  User,
  ChevronRight,
  Beaker,
  Truck,
  Tags,
  Bell,
  BarChart3,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { TopBar } from "../top-bar"

interface PharmacienSidebarProps {
  children: React.ReactNode
}

export function PharmacienSidebar({ children }: PharmacienSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [medicamentReferences, setMedicamentReferences] = useState<any[]>([]) // Added state for medicamentReferences

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    // Mock data for medicamentReferences (replace with actual data fetching)
    const mockMedicamentReferences = [
      { id: 1, quantite: 3 },
      { id: 2, quantite: 7 },
      { id: 3, quantite: 1 },
      { id: 4, quantite: 5 },
    ]
    setMedicamentReferences(mockMedicamentReferences)

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const menuItems = [
    {
      title: "Tableau de Bord",
      icon: <Activity className="h-5 w-5" />,
      href: "/dashboard/pharmacien",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      title: "Catégories",
      icon: <Tags className="h-5 w-5" />,
      href: "/dashboard/pharmacien/categories",
      gradient: "from-teal-500 to-blue-500",
    },
    {
      title: "Médicaments",
      icon: <Pill className="h-5 w-5" />,
      href: "/dashboard/pharmacien/medicaments",
      badge: "1,247",
      gradient: "from-cyan-500 to-teal-500",
    },
    {
      title: "Références",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/dashboard/pharmacien/references",
      gradient: "from-blue-500 to-teal-500",
    },
    {
      title: "Produits Finaux",
      icon: <Package2 className="h-5 w-5" />,
      href: "/dashboard/pharmacien/produits",
      badge: medicamentReferences?.filter((p) => p.quantite < 5).length?.toString(),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Stock & Inventaire",
      icon: <Package className="h-5 w-5" />,
      href: "/dashboard/pharmacien/stock",
      badge: "3",
      gradient: "from-teal-600 to-cyan-600",
    },
    {
      title: "Approvisionnements",
      icon: <Truck className="h-5 w-5" />,
      href: "/dashboard/pharmacien/approvisionnements",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      title: "Commandes",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/dashboard/pharmacien/commandes",
      gradient: "from-teal-500 to-cyan-600",
    },
    {
      title: "Dispensation",
      icon: <Beaker className="h-5 w-5" />,
      href: "/dashboard/pharmacien/dispensation",
      badge: "7",
      gradient: "from-blue-600 to-teal-600",
    },
    {
      title: "Rapports",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/dashboard/pharmacien/rapports",
      gradient: "from-teal-600 to-blue-500",
    },
    {
      title: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      href: "/dashboard/pharmacien/notifications",
      badge: "5",
      gradient: "from-orange-500 to-red-500",
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
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"}
        w-80 bg-gradient-to-br from-teal-50 via-white to-cyan-50
        border-r border-teal-100 shadow-2xl
        transition-all duration-300 ease-in-out
        backdrop-blur-sm
      `}
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-600 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 animate-pulse"></div>
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-2xl blur-sm"></div>
              <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/30">
                <Pill className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">Pharmacien</h2>
              <p className="text-teal-100 text-sm font-medium drop-shadow">Espace Pharmacie</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-4 px-2">
              Navigation Principale
            </h3>
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={closeSidebar}
                  className="group relative flex items-center justify-between p-4 rounded-xl
                           hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50
                           hover:shadow-lg hover:shadow-teal-100/50
                           transition-all duration-300 ease-out
                           border border-transparent hover:border-teal-100
                           transform hover:scale-[1.02] hover:-translate-y-0.5"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <div className="text-white drop-shadow">{item.icon}</div>
                    </div>
                    <span className="font-semibold text-gray-700 group-hover:text-teal-700 transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <Badge
                        className={`${
                          item.title === "Notifications"
                            ? "bg-gradient-to-r from-orange-500 to-red-500"
                            : "bg-gradient-to-r from-teal-500 to-cyan-500"
                        } text-white shadow-lg px-3 py-1 text-xs font-bold`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="h-4 w-4 text-teal-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-teal-100 bg-gradient-to-r from-teal-50/50 to-cyan-50/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full p-4 h-auto hover:bg-teal-100/50 rounded-xl transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-4 ring-teal-200 shadow-lg">
                      <AvatarImage src="/images/user.png" />
                      <AvatarFallback className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold text-lg">
                        PH
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                      Pierre Moreau
                    </p>
                    <p className="text-xs text-teal-600 font-medium">Pharmacien</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 shadow-xl border-teal-100">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-teal-50">
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-teal-50">
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
        <TopBar
          userRole="Pharmacien"
          userName="Pierre Moreau"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
