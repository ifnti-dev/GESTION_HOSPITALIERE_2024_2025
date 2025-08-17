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
  Baby,
  Users,
  Calendar,
  Heart,
  Activity,
  Settings,
  LogOut,
  User,
  ChevronRight,
  Stethoscope,
  Shield,
  FileText,
  AlertTriangle,
  UserCheck,
} from "lucide-react"
import Link from "next/link"
import { TopBar } from "../top-bar"

interface SageFemmeSidebarProps {
  children: React.ReactNode
}

export function SageFemmeSidebar({ children }: SageFemmeSidebarProps) {
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
      href: "/dashboard/sage-femme",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      title: "Mes Patientes",
      icon: <Users className="h-5 w-5" />,
      href: "/dashboard/sage-femme/patientes",
      
      gradient: "from-rose-500 to-purple-500",
    },
    {
      title: "Dossiers Grossesse",
      icon: <Heart className="h-5 w-5" />,
      href: "/dashboard/sage-femme/grossesses",
      
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "Consultations Prénatales",
      icon: <Stethoscope className="h-5 w-5" />,
      href: "/dashboard/sage-femme/consultations",
      
      gradient: "from-rose-600 to-pink-600",
    },
    {
      title: "Accouchements",
      icon: <Baby className="h-5 w-5" />,
      href: "/dashboard/sage-femme/accouchements",
      
      gradient: "from-purple-500 to-rose-500",
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
        w-80 bg-gradient-to-br from-rose-50 via-white to-pink-50
        border-r border-rose-100 shadow-2xl
        transition-all duration-300 ease-in-out
        backdrop-blur-sm
      `}
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-rose-600 via-rose-700 to-pink-600 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-pink-400/20 animate-pulse"></div>
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-2xl blur-sm"></div>
              <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/30">
                <Baby className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">Sage-femme</h2>
              <p className="text-rose-100 text-sm font-medium drop-shadow">Espace Maternité</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-4 px-2">
              Navigation Principale
            </h3>
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={closeSidebar}
                  className="group relative flex items-center justify-between p-4 rounded-xl
                           hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50
                           hover:shadow-lg hover:shadow-rose-100/50
                           transition-all duration-300 ease-out
                           border border-transparent hover:border-rose-100
                           transform hover:scale-[1.02] hover:-translate-y-0.5"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <div className="text-white drop-shadow">{item.icon}</div>
                    </div>
                    <span className="font-semibold text-gray-700 group-hover:text-rose-700 transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg px-3 py-1 text-xs font-bold">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="h-4 w-4 text-rose-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer */}
        
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
          userRole="Sage-femme"
          userName="Sophie Martin"
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
