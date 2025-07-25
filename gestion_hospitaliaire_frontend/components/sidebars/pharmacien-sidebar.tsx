"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Pill,
  Package,
  Package2,
  ShoppingCart,
  Activity,
  Beaker,
  Truck,
  Tags,
  Bell,
  BarChart3,
  BookOpen,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { TopBar } from "../top-bar"

interface PharmacienSidebarProps {
  children: React.ReactNode
}

export function PharmacienSidebar({ children }: PharmacienSidebarProps) {
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
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Stock & Inventaire",
      icon: <Package className="h-5 w-5" />,
      href: "/dashboard/pharmacien/stock",
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
      title: "Rapports",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/dashboard/pharmacien/rapports",
      gradient: "from-teal-600 to-blue-500",
    },
    {
      title: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      href: "/dashboard/pharmacien/notifications",
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
        ${sidebarOpen ? "w-80" : "w-0"}
        ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"}
        bg-gradient-to-br from-teal-50 via-white to-cyan-50
        border-r border-teal-100 shadow-2xl
        transition-all duration-300 ease-in-out
        backdrop-blur-sm overflow-hidden
        flex flex-col h-full
      `}
      >
        {/* Header - Fixed */}
        <div className="relative p-6 bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-600 overflow-hidden flex-shrink-0">
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

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6 space-y-6">
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
                
                  </Link>
                ))}
              </nav>
            </div>
          </div>
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
          userRole="Pharmacien"
          userName="Pierre Moreau"
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
