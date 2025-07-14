"use client"

import type React from "react"

import { useAuth } from "@/contexts/AuthContext"
import { DirecteurSidebar } from "@/components/sidebars/directeur-sidebar"
import { MedecinSidebar } from "@/components/sidebars/medecin-sidebar"
import { InfirmierSidebar } from "@/components/sidebars/infirmier-sidebar"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { SageFemmeSidebar } from "@/components/sidebars/sage-femme-sidebar"
import { CaissierSidebar } from "@/components/sidebars/caissier-sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, userProfile, isLoading, isAuthenticated } = useAuth()

  console.log("DashboardLayout - User:", user)
  console.log("DashboardLayout - UserProfile:", userProfile)
  console.log("DashboardLayout - IsLoading:", isLoading)

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="w-64 bg-gray-100">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Alert className="w-96">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Vous devez être connecté pour accéder à cette page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const userRole = user.role?.toLowerCase().trim()
  console.log("DashboardLayout - Role normalisé:", userRole)

  const renderSidebarWithLayout = () => {
    switch (userRole) {
      case "directeur":
        return <DirecteurSidebar>{children}</DirecteurSidebar>
      case "médecin":
      case "medecin":
        return <MedecinSidebar>{children}</MedecinSidebar>
      case "infirmier":
        return <InfirmierSidebar>{children}</InfirmierSidebar>
      case "pharmacien":
        return <PharmacienSidebar>{children}</PharmacienSidebar>
      case "sage-femme":
      case "sagefemme":
        return <SageFemmeSidebar>{children}</SageFemmeSidebar>
      case "caissier":
        return <CaissierSidebar>{children}</CaissierSidebar>
      default:
        console.warn(`Rôle non reconnu: ${userRole}, utilisation du sidebar Directeur par défaut`)
        return <DirecteurSidebar>{children}</DirecteurSidebar>
    }
  }

  return renderSidebarWithLayout()
}
