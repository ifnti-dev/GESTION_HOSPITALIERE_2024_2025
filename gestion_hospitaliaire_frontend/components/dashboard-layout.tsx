"use client"

import type React from "react"
import { useState, useEffect } from "react"

// Import des sidebars spécifiques
import { MedecinSidebar } from "./sidebars/medecin-sidebar"
import { InfirmierSidebar } from "./sidebars/infirmier-sidebar"
import { SageFemmeSidebar } from "./sidebars/sage-femme-sidebar"
import { PharmacienSidebar } from "./sidebars/pharmacien-sidebar"
import { CaissierSidebar } from "./sidebars/caissier-sidebar"
import { DirecteurSidebar } from "./sidebars/directeur-sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: string
}

export function DashboardLayout({ children, userRole = "Directeur" }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Détection du mode mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Fonction pour rendre la sidebar appropriée selon le rôle avec TopBar intégrée
  const renderSidebarWithLayout = () => {
    switch (userRole) {
      case "Médecin":
        return <MedecinSidebar>{children}</MedecinSidebar>
      case "Infirmier":
        return <InfirmierSidebar>{children}</InfirmierSidebar>
      case "Sage-femme":
        return <SageFemmeSidebar>{children}</SageFemmeSidebar>
      case "Pharmacien":
        return <PharmacienSidebar>{children}</PharmacienSidebar>
      case "Caissier":
        return <CaissierSidebar>{children}</CaissierSidebar>
      case "Directeur":
      default:
        return <DirecteurSidebar>{children}</DirecteurSidebar>
    }
  }

  return renderSidebarWithLayout()
}
