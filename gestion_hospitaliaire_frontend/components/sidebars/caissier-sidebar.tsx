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
  CreditCard,
  Receipt,
  DollarSign,
  Activity,
  TrendingUp,
  Settings,
  LogOut,
  User,
  ChevronRight,
  Wallet,
  Calculator,
  FileText,
  Shield,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
// import { TopBar } from "../top-bar"

interface CaissierSidebarProps {
  children: React.ReactNode
}

export function CaissierSidebar({ children }: CaissierSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

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
      href: "/dashboard/caissier",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "Ordonnances",
      icon: <Receipt className="h-5 w-5" />,
      href: "/dashboard/caissier/ordonnances",
      badge: "23",
      gradient: "from-amber-500 to-yellow-500",
    },
    {
      title: "Actes Médicaux",
      icon: <Activity className="h-5 w-5" />,
      href: "/dashboard/caissier/actes-medicaux",
      badge: "18",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      title: "Factures",
      icon: <FileText className="h-5 w-5" />,
      href: "/dashboard/caissier/factures",
      badge: "45",
      gradient: "from-yellow-500 to-amber-500",
    },
    {
      title: "Encaissements",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/dashboard/caissier/encaissements",
      badge: "18",
      gradient: "from-amber-600 to-orange-600",
    },
    {
      title: "Paiements",
      icon: <Wallet className="h-5 w-5" />,
      href: "/dashboard/caissier/paiements",
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Prises en Charge",
      icon: <Shield className="h-5 w-5" />,
      href: "/dashboard/caissier/prises-en-charge",
      badge: "12",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Remboursements",
      icon: <RefreshCw className="h-5 w-5" />,
      href: "/dashboard/caissier/remboursements",
      gradient: "from-yellow-600 to-orange-600",
    },
    {
      title: "Rapports",
      icon: <TrendingUp className="h-5 w-5" />,
      href: "/dashboard/caissier/rapports",
      gradient: "from-amber-600 to-orange-600",
    },
    {
      title: "Calculatrice",
      icon: <Calculator className="h-5 w-5" />,
      href: "/dashboard/caissier/calculatrice",
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
        w-80 bg-gradient-to-br from-amber-50 via-white to-orange-50
        border-r border-amber-100 shadow-2xl
        transition-all duration-300 ease-in-out
        backdrop-blur-sm
      `}
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 animate-pulse"></div>
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-2xl blur-sm"></div>
              <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/30">
                <DollarSign className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">Caissier</h2>
              <p className="text-amber-100 text-sm font-medium drop-shadow">Espace Financier</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4 px-2">
              Navigation Principale
            </h3>
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={closeSidebar}
                  className="group relative flex items-center justify-between p-4 rounded-xl
                           hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50
                           hover:shadow-lg hover:shadow-amber-100/50
                           transition-all duration-300 ease-out
                           border border-transparent hover:border-amber-100
                           transform hover:scale-[1.02] hover:-translate-y-0.5"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <div className="text-white drop-shadow">{item.icon}</div>
                    </div>
                    <span className="font-semibold text-gray-700 group-hover:text-amber-700 transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg px-3 py-1 text-xs font-bold">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="h-4 w-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-amber-100 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full p-4 h-auto hover:bg-amber-100/50 rounded-xl transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-4 ring-amber-200 shadow-lg">
                      <AvatarImage src="/images/user.png" />
                      <AvatarFallback className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg">
                        CA
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                      Julie Bernard
                    </p>
                    <p className="text-xs text-amber-600 font-medium">Caissière</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 shadow-xl border-amber-100">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-amber-50">
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-amber-50">
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
          userRole="Caissier"
          userName="Julie Bernard"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
        /> */}

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
