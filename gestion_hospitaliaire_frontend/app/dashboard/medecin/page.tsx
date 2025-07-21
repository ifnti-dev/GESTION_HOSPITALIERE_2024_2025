"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Activity,
  Stethoscope,
  Pill,
  Calendar,
  UserCheck,
  FileText,
  AlertCircle,
  TrendingUp,
} from "lucide-react"

import { useState, useEffect } from "react" // Import useState and useEffect
import { CreateDossierPatientModal, DossierFormData } from "@/components/modals/medical/create-dossier-patient-modal" // Import the new modal
import type { Personne } from "@/types/utilisateur" // Import Personne type
import { getPersonnes } from "@/services/utilisateur/personne.service" // Import the service for fetching persons

export default function MedecinDashboardPage() {
  const [isCreateDossierModalOpen, setIsCreateDossierModalOpen] = useState(false)
  const [patients, setPatients] = useState<Personne[]>([])
  const [isLoadingPatients, setIsLoadingPatients] = useState(true)
  const [patientsError, setPatientsError] = useState<Error | null>(null)

  // Fetch patients when the component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPersonnes()
        setPatients(data)
      } catch (error) {
        console.error("Error fetching patients:", error)
        setPatientsError(error as Error)
      } finally {
        setIsLoadingPatients(false)
      }
    }
    fetchPatients()
  }, [])
  
  const quickStats = [
    {
      title: "Mes Patients",
      value: "23",
      change: "+2 aujourd'hui",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      title: "Consultations Prévues",
      value: "12",
      change: "Aujourd'hui",
      icon: <Stethoscope className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      title: "Patients Hospitalisés",
      value: "23",
      change: "+2 aujourd'hui",
      icon: <UserCheck className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      title: "Prescriptions en Attente",
      value: "5",
      change: "2 urgentes",
      icon: <Pill className="h-5 w-5" />,
      color: "text-blue-600",
    },
  ]

  const prochainRendezVous = [
    {
      time: "09:30",
      patient: "Marie Dubois",
      type: "Consultation de suivi",
      cabinet: "Cabinet 1",
      status: "confirmed",
    },
    {
      time: "10:00",
      patient: "Jean Martin",
      type: "Première consultation",
      cabinet: "Cabinet 1",
      status: "confirmed",
    },
    {
      time: "10:30",
      patient: "Sophie Laurent",
      type: "Consultation urgente",
      cabinet: "Cabinet 1",
      status: "urgent",
    },
    {
      time: "11:00",
      patient: "Pierre Moreau",
      type: "Contrôle post-opératoire",
      cabinet: "Cabinet 1",
      status: "important",
    },
  ]

  const actionsRapides = [
    { title: "Nouvelle Consultation", icon: <Stethoscope className="h-5 w-5" /> },
    { title: "Créer Dossier Patient", icon: <FileText className="h-5 w-5" /> },
    { title: "Prescrire Médicament", icon: <Pill className="h-5 w-5" /> },
    { title: "Référer Spécialiste", icon: <UserCheck className="h-5 w-5" /> },
    { title: "Hospitaliser Patient", icon: <Activity className="h-5 w-5" /> },
  ]

  return (
    <DashboardLayout userRole="Médecin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Médecin</h1>
            <p className="text-gray-600 mt-1">Dr. Jean Dupont - Médecine Générale</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-blue-700 border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              En consultation
            </Badge>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Stethoscope className="h-4 w-4 mr-2" />
              Nouvelle Consultation
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={stat.color}>{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Prochains Rendez-vous */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Prochains Rendez-vous
              </CardTitle>
              <CardDescription>Planning de la journée</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prochainRendezVous.map((rdv, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-500 min-w-[60px]">{rdv.time}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{rdv.patient}</p>
                      <p className="text-xs text-gray-600">{rdv.type}</p>
                      <p className="text-xs text-gray-500">{rdv.cabinet}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {rdv.status === "urgent" && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                      {rdv.status === "important" && (
                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                          Important
                        </Badge>
                      )}
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Consulter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions Rapides */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {actionsRapides.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start hover:bg-blue-50 hover:border-blue-200"
                  >
                    <div className="text-blue-600 mr-3">{action.icon}</div>
                    {action.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
