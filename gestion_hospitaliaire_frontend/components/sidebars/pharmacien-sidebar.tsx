"use client"

import type React from "react"
import { useState, useEffect } from "react"
// import { Pill, Package, Package2, ShoppingCart, Activity, Truck, Tags, Bell, BarChart3, BookOpen } from "lucide-react"
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
      // icon: <Activity className="h-5 w-5" />,
      href: "/dashboard/pharmacien",
    },
    {
      title: "Catégories",
      // icon: <Tags className="h-5 w-5" />,
      href: "/dashboard/pharmacien/categories",
    },
    {
      title: "Médicaments",
      // icon: <Pill className="h-5 w-5" />,
      href: "/dashboard/pharmacien/medicaments",
    },
    {
      title: "Références",
      // icon: <BookOpen className="h-5 w-5" />,
      href: "/dashboard/pharmacien/references",
    },
    {
      title: "Produits Finaux",
      // icon: <Package2 className="h-5 w-5" />,
      href: "/dashboard/pharmacien/produits",
    },
    {
      title: "Stock & Inventaire",
      // icon: <Package className="h-5 w-5" />,
      href: "/dashboard/pharmacien/stock",
    },
    {
      title: "Approvisionnements",
      // icon: <Truck className="h-5 w-5" />,
      href: "/dashboard/pharmacien/approvisionnements",
    },
    {
      title: "Commandes",
      // icon: <ShoppingCart className="h-5 w-5" />,
      href: "/dashboard/pharmacien/commandes",
    },
    {
      title: "Rapports",
      // icon: <BarChart3 className="h-5 w-5" />,
      href: "/dashboard/pharmacien/rapports",
    },
    // {
    //   title: "Notifications",
    //   icon: <Bell className="h-5 w-5" />,
    //   href: "/dashboard/pharmacien/notifications",
    // },
  ]

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`
        ${sidebarOpen ? "w-80" : "w-0"}
        ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"}
        bg-white
        border-r border-gray-200
        overflow-hidden
        flex flex-col h-full
      `}
      >
        <div className="p-6 bg-gray-100 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 p-3 rounded">
              {/* <Pill className="h-6 w-6 text-gray-600" /> */}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Pharmacien</h2>
              <p className="text-gray-600 text-sm">Espace Pharmacie</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-4">
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 px-2">
                Navigation Principale
              </h3>
              <nav className="space-y-1">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={closeSidebar}
                    className="flex items-center space-x-3 p-3 rounded hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                  >
                    {/* <div className="text-gray-500">{item.icon}</div> */}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
