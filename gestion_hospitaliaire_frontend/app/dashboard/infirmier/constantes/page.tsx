'use client';
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Thermometer,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  AlertTriangle,
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { useState, useEffect } from "react"
import { DossierMedical } from "@/types/medical"
import { Consultation, CreateConsultationPayload } from "@/types/consultstionsTraitement"
import { PriseConstantesModal } from "@/components/modals/medical/prise-constantes"
import { dossierMedicalService } from "@/services/medical/dossier-medical.service"
import { addConsultation, getConsultations, updateConsultation } from "@/services/consultationTraitement/consultationService"
import { EditConstanteModal } from "@/components/modals/medical/edit-constante"

export default function InfirmierConstantesPage() {
  const [dossiers, setDossiers] = useState<DossierMedical[]>([])
  const [constantes, setConstantes] = useState<Consultation[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedDossier, setSelectedDossier] = useState<DossierMedical | null>(null)
  const [editingConstante, setEditingConstante] = useState<Consultation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Stats calculées
  const stats = [
    {
      title: "Constantes Prises",
      value: constantes.length.toString(),
      change: "Aujourd'hui",
      icon: <Thermometer className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "À Prendre",
      value: dossiers.length > 0 ? "12" : "0",
      change: "Programmées",
      icon: <Clock className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Alertes",
      value: constantes.filter(c => 
        c.temperature > 38 || 
        (c.tensionArterielle && parseFloat(c.tensionArterielle.split('/')[0]) > 140)
      ).length.toString(),
      change: "Valeurs anormales",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Patients Surveillés",
      value: dossiers.length.toString(),
      change: "Actifs",
      icon: <Activity className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ]

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Charger les dossiers médicaux
        const dossiersData = await dossierMedicalService.getAllDossiers()
        setDossiers(dossiersData)
        
        // Charger les consultations (constantes)
        const constantesData = await getConsultations()
        setConstantes(constantesData)
      } catch (err) {
        setError("Erreur lors du chargement des données")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Traiter la création de nouvelles constantes
  const handleCreateConstantes = async (data: {
    temperature: number
    poids: number
    tensionArterielle?: string
    pressionArterielle?: string
  }) => {
    if (!selectedDossier) return
    
    const payload: CreateConsultationPayload = {
      date: new Date().toISOString(),
      temperature: data.temperature,
      poids: data.poids,
      tensionArterielle: data.tensionArterielle || null,
      pressionArterielle: data.pressionArterielle || null,
      symptomes: null,
      diagnostic: null,
      dossierMedical: { id: selectedDossier.id },
      employe: { id: 1 } // À remplacer par l'ID de l'infirmier connecté
    }
    
    try {
      const newConsultation = await addConsultation(payload)
      setConstantes(prev => [newConsultation, ...prev])
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error("Erreur création constantes:", error)
    }
  }

  // Traiter la mise à jour des constantes
  const handleUpdateConstante = async (updatedData: Consultation) => {
    try {
      await updateConsultation(updatedData)
      
      setConstantes(prev => 
        prev.map(c => c.id === updatedData.id ? updatedData : c)
      )
      
      setIsEditModalOpen(false)
      setEditingConstante(null)
    } catch (error) {
      console.error("Erreur mise à jour constante:", error)
    }
  }

  // Ouvrir le modal d'édition
  const handleOpenEditModal = (constante: Consultation) => {
    setEditingConstante(constante)
    setIsEditModalOpen(true)
  }

  const getAlerteBadge = (constante: Consultation) => {
    const isAlerte = constante.temperature > 38 || 
                     (constante.tensionArterielle && 
                      parseFloat(constante.tensionArterielle.split('/')[0]) > 140)
    
    return isAlerte ? 
      "bg-red-100 text-red-800 border-red-200" : 
      "bg-green-100 text-green-800 border-green-200"
  }

  const getTendanceIcon = (tendance: string) => {
    switch (tendance) {
      case "hausse":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "baisse":
        return <TrendingDown className="h-4 w-4 text-blue-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getPrioriteColor = (priorite: string) => {
    return priorite === "urgent" ? "border-red-200 bg-red-50" : "border-gray-200 bg-white hover:bg-gray-50"
  }

  if (isLoading) {
    return (
      <DashboardLayout >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout >
        <div className="text-center p-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
            Réessayer
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout >
      <div className="space-y-6">
        {/* Modal de prise de constantes */}
        <PriseConstantesModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateConstantes}
          dossiers={dossiers}
          selectedDossier={selectedDossier}
          setSelectedDossier={setSelectedDossier}
        />

        {/* Modal d'édition des constantes */}
        <EditConstanteModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingConstante(null)
          }}
          onSubmit={handleUpdateConstante}
          constante={editingConstante}
          dossier={editingConstante?.dossierMedical}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Constantes Vitales</h1>
            <p className="text-gray-600 mt-1">Surveillance et enregistrement des constantes</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-orange-700 border-orange-200">
              <Clock className="w-3 h-3 mr-2" />
              {dossiers.length > 0 ? "12 à prendre" : "0 à prendre"}
            </Badge>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Prendre Constantes
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-red-600" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par patient, chambre..."
                    className="pl-10 border-gray-200 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aujourd-hui">Aujourd'hui</SelectItem>
                  <SelectItem value="hier">Hier</SelectItem>
                  <SelectItem value="semaine">Cette semaine</SelectItem>
                  <SelectItem value="mois">Ce mois</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Toutes</SelectItem>
                  <SelectItem value="completes">Complètes</SelectItem>
                  <SelectItem value="partielles">Partielles</SelectItem>
                  <SelectItem value="alertes">Avec alertes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="recentes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recentes">Constantes Récentes</TabsTrigger>
            <TabsTrigger value="programmees">À Programmer</TabsTrigger>
          </TabsList>

          <TabsContent value="recentes">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-red-600" />
                  Constantes Récentes
                </CardTitle>
                <CardDescription>Dernières constantes enregistrées</CardDescription>
              </CardHeader>
              <CardContent>
                {constantes.length === 0 ? (
                  <div className="text-center py-12">
                    <Thermometer className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-xl font-medium">Aucune constante enregistrée</p>
                    <p className="text-sm mt-2">Commencez par prendre des constantes</p>
                    <Button 
                      className="mt-4 bg-red-600 hover:bg-red-700"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Prendre des constantes
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left p-4 font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50">
                            Patient
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50">
                            Heure
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50">
                            Température
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50">
                            Tension
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50">
                            Poids
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50">
                            Tendance
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {constantes.map((constante, index) => {
                          const dossier = dossiers.find(d => d.id === constante.dossierMedical?.id)
                          const patient = dossier?.personne
                          const nomComplet = patient ? `${patient.prenom} ${patient.nom}` : "Patient inconnu"
                          
                          return (
                            <tr
                              key={index}
                              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                              }`}
                            >
                              <td className="p-4">
                                <div>
                                  <p className="font-medium text-gray-900">{nomComplet}</p>
                                  <p className="text-sm text-gray-500">Ch. {dossier?.id || "N/A"}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {new Date(constante.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`font-medium ${
                                    constante.temperature > 37.5 ? "text-red-600" : "text-gray-900"
                                  }`}
                                >
                                  {constante.temperature}°C
                                </span>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`font-medium ${
                                    constante.tensionArterielle?.includes("140") ? "text-red-600" : "text-gray-900"
                                  }`}
                                >
                                  {constante.tensionArterielle || "N/A"}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="font-medium text-gray-900">
                                  {constante.poids} kg
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  {getTendanceIcon("stable")}
                                  <Badge className={`text-xs border ${getAlerteBadge(constante)}`}>
                                    {constante.temperature > 38 ? "Alerte" : "Normal"}
                                  </Badge>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                    onClick={() => handleOpenEditModal(constante)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programmees">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Constantes Programmées
                </CardTitle>
                <CardDescription>Constantes à prendre selon le planning</CardDescription>
              </CardHeader>
              <CardContent>
                {dossiers.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-xl font-medium">Aucun patient à surveiller</p>
                    <p className="text-sm mt-2">Aucun dossier médical trouvé</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dossiers.slice(0, 3).map((dossier, index) => {
                      const patient = dossier.personne
                      const nomComplet = patient ? `${patient.prenom} ${patient.nom}` : "Patient inconnu"
                      
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border transition-all duration-200 ${getPrioriteColor("normale")}`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{nomComplet}</h3>
                                <Badge variant="outline" className="text-xs">
                                  Ch. {dossier.id}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-orange-500" />
                                  <span>Prévue: 14:00</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Thermometer className="h-4 w-4 text-red-500" />
                                  <span>Complètes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Activity className="h-4 w-4 text-blue-500" />
                                  <span>Dernière: 10:00</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Fréquence: Toutes les 4h</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Historique
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                  setSelectedDossier(dossier)
                                  setIsCreateModalOpen(true)
                                }}
                              >
                                <Thermometer className="h-4 w-4 mr-2" />
                                Prendre
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}