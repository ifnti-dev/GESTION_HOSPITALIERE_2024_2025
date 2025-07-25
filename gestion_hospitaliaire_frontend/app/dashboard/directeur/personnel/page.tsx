"use client"

import { useState } from "react"
import { Plus, Search, Users, UserCheck, UserX, TrendingUp, Clock, Edit, AlertTriangle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import type { Personne } from "@/types/utilisateur"
import { usePersonne } from "@/hooks/utilisateur/usePersonne"
import { PersonneSearchFilters } from "@/components/personnel/personnel-search"
import { PersonneTable } from "@/components/personnel/personnel-table"
import { PersonneDialog } from "@/components/personnel/personnel-dialog"
import { PersonneDetailsDialog } from "@/components/personnel/personnel-details"

export default function PersonnesPage() {
  const {
    personnes,
    paginatedData,
    stats,
    loading,
    error,
    fetchAllPersonnes,
    fetchPersonnes,
    fetchStats,
    createPersonne,
    editPersonne,
    removePersonne,
    searchByNom,
    searchByEmail,
    searchPersonnesAdvanced,
    fetchEmployesOnly,
    fetchPatientsOnly,
    fetchPersonneById,
  } = usePersonne()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [editingPersonne, setEditingPersonne] = useState<Personne | null>(null)
  const [viewingPersonne, setViewingPersonne] = useState<Personne | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedSexe, setSelectedSexe] = useState("all")

  // Statistiques rapides basées sur les données
  const quickStats = [
    {
      title: "Total Personnes",
      value: stats?.totalPersonnes?.toString() || "0",
      change: "+12%",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      title: "Employés",
      value: stats?.totalEmployes?.toString() || "0",
      change: "+5%",
      icon: <UserCheck className="h-5 w-5" />,
      color: "text-green-600",
    },
    {
      title: "Patients",
      value: stats?.totalPatients?.toString() || "0",
      change: "+8%",
      icon: <UserX className="h-5 w-5" />,
      color: "text-orange-600",
    },
    {
      title: "Nouveaux ce mois",
      value: stats?.nouveauxCeMois?.toString() || "0",
      change: "+15%",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-purple-600",
    },
  ]

  // Statistiques par sexe
  const sexeStats = [
    { name: "Hommes", count: 45, total: 100, color: "bg-blue-500" },
    { name: "Femmes", count: 52, total: 100, color: "bg-pink-500" },
    { name: "Autre", count: 3, total: 100, color: "bg-gray-500" },
  ]

  // Activités récentes (simulées)
  const recentActivities = [
    { time: "09:30", action: "Nouvelle personne ajoutée", person: "Marie Dubois", type: "add" },
    { time: "09:15", action: "Informations modifiées", person: "Jean Martin", type: "update" },
    { time: "09:00", action: "Personne supprimée", person: "Sophie Laurent", type: "delete" },
    { time: "08:45", action: "Email mis à jour", person: "Emma Bernard", type: "update" },
    { time: "08:30", action: "Nouveau patient", person: "Pierre Moreau", type: "add" },
  ]

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.includes("@")) {
      searchByEmail(term)
    } else if (term.trim()) {
      searchByNom(term)
    } else {
      fetchAllPersonnes()
    }
  }

  const handleTypeFilter = (type: string) => {
    setSelectedType(type)
    if (type === "employes") {
      fetchEmployesOnly()
    } else if (type === "patients") {
      fetchPatientsOnly()
    } else {
      fetchAllPersonnes()
    }
  }

  const handleSexeFilter = (sexe: string) => {
    setSelectedSexe(sexe)
    // Implémentation du filtre par sexe si nécessaire
    fetchAllPersonnes()
  }

  const handleAddPersonne = () => {
    setEditingPersonne(null)
    setIsDialogOpen(true)
  }

  const handleEditPersonne = (personne: Personne) => {
    setEditingPersonne(personne)
    setIsDialogOpen(true)
  }

  const handleViewPersonne = (personne: Personne) => {
    setViewingPersonne(personne)
    setIsDetailsDialogOpen(true)
  }

  const handleDeletePersonne = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette personne ?")) {
      await removePersonne(id)
    }
  }

  const handleSavePersonne = async (data: any) => {
    try {
      if (editingPersonne) {
        await editPersonne(editingPersonne.id!, data)
      } else {
        await createPersonne(data)
      }
      setIsDialogOpen(false)
      setEditingPersonne(null)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Personnes</h1>
            <p className="text-gray-600 mt-1">Gérez toutes les personnes de votre établissement</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-blue-700 border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              {personnes.length} Personnes
            </Badge>
            <Button onClick={handleAddPersonne} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle Personne
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
                  {stat.change} ce mois
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Activités Récentes
              </CardTitle>
              <CardDescription>Dernières actions sur les personnes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-500 min-w-[60px]">{activity.time}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">Personne: {activity.person}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type === "add" && <Plus className="h-3 w-3 mr-1" />}
                      {activity.type === "update" && <Edit className="h-3 w-3 mr-1" />}
                      {activity.type === "delete" && <UserX className="h-3 w-3 mr-1" />}
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gender Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Répartition par Sexe
              </CardTitle>
              <CardDescription>Distribution démographique</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sexeStats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{stat.name}</span>
                      <span className="text-sm text-gray-500">{stat.count}%</span>
                    </div>
                    <Progress value={stat.count} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Recherche et Filtres
            </CardTitle>
            <CardDescription>Trouvez rapidement une personne</CardDescription>
          </CardHeader>
          <CardContent>
            <PersonneSearchFilters
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              selectedType={selectedType}
              onTypeChange={handleTypeFilter}
              selectedSexe={selectedSexe}
              onSexeChange={handleSexeFilter}
            />
          </CardContent>
        </Card>

        {/* Personnes Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Liste des Personnes</CardTitle>
            <CardDescription>
              {personnes.length} personne{personnes.length > 1 ? "s" : ""} trouvée{personnes.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PersonneTable
              personnes={personnes}
              loading={loading}
              onEdit={handleEditPersonne}
              onDelete={handleDeletePersonne}
              onView={handleViewPersonne}
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gestion Personnes</h3>
              <p className="text-sm text-gray-600">Toutes les personnes</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Employés</h3>
              <p className="text-sm text-gray-600">Personnel médical</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <UserX className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Patients</h3>
              <p className="text-sm text-gray-600">Dossiers médicaux</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Statistiques</h3>
              <p className="text-sm text-gray-600">Analyses et rapports</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {error && (
          <Card className="border-l-4 border-l-red-500 bg-red-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                Erreur Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-800">{error}</span>
                  <Button variant="outline" size="sm" className="text-red-700 border-red-300 bg-transparent">
                    Réessayer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialog pour ajouter/modifier une personne */}
        <PersonneDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          personne={editingPersonne}
          onSave={handleSavePersonne}
        />

        {/* Dialog pour voir les détails d'une personne */}
        <PersonneDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          personne={viewingPersonne}
        />
      </div>
    </DashboardLayout>
  )
}
