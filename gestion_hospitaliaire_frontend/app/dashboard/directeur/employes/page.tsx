"use client"

import { useState } from "react"
import { Plus, Search, Users, UserCheck, UserX, TrendingUp, Clock, Edit, AlertTriangle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { EmployeTable } from "@/components/employe/employe-table"
import { EmployeDialog } from "@/components/employe/employe-dialog"
import { SearchFilters } from "@/components/employe/search-filters"
import type { Employe } from "@/types/utilisateur"
import { useEmploye } from "@/hooks/utilisateur/useEmploye"
import { EmployeDetailsDialog } from "@/components/employe/employe-details"

export default function EmployesPage() {
  const {
    employes,
    paginatedData,
    stats,
    loading,
    error,
    selectedEmploye,
    fetchAllEmployes,
    fetchEmployes,
    fetchStats,
    createEmploye,
    editEmploye,
    removeEmploye,
    searchBySpecialite,
    searchByStatut,
    addRole,
    removeRole,
    assignPerson,
    fetchEmployeById,
    searchByRole,
    searchByPersonne,
  } = useEmploye()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [editingEmploye, setEditingEmploye] = useState<Employe | null>(null)
  const [viewingEmploye, setViewingEmploye] = useState<Employe | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialite, setSelectedSpecialite] = useState("")
  const [selectedStatut, setSelectedStatut] = useState("")

  // Ajouter la gestion de pagination
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchEmployes(page, pageSize)
  }

  // Ajouter ces nouvelles fonctions
  const handleSearchByRole = async (roleId: number) => {
    await searchByRole(roleId)
  }

  const handleSearchByPersonne = async (personneId: number) => {
    await searchByPersonne(personneId)
  }

  const handleAddRole = async (employeId: number, roleId: number) => {
    await addRole(employeId, roleId)
  }

  const handleRemoveRole = async (employeId: number, roleId: number) => {
    await removeRole(employeId, roleId)
  }

  const handleAssignPerson = async (employeId: number, personneId: number) => {
    await assignPerson(employeId, personneId)
  }

  // Statistiques rapides basées sur les données
  const quickStats = [
    {
      title: "Total Employés",
      value: stats?.totalEmployes?.toString() || "0",
      change: "+12%",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      title: "Employés Actifs",
      value: stats?.employes_actifs?.toString() || "0",
      change: "+5%",
      icon: <UserCheck className="h-5 w-5" />,
      color: "text-green-600",
    },
    {
      title: "En Congé",
      value: stats?.employes_conge?.toString() || "0",
      change: "-3%",
      icon: <UserX className="h-5 w-5" />,
      color: "text-orange-600",
    },
    {
      title: "Nouveaux ce mois",
      value: stats?.nouveauxCeMois?.toString() || "0",
      change: "+8%",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-purple-600",
    },
  ]

  // Statistiques par spécialité
  const specialiteStats = [
    { name: "Médecine générale", count: 15, total: 20, color: "bg-blue-500" },
    { name: "Cardiologie", count: 8, total: 10, color: "bg-red-500" },
    { name: "Pédiatrie", count: 12, total: 15, color: "bg-green-500" },
    { name: "Gynécologie", count: 6, total: 8, color: "bg-pink-500" },
    { name: "Chirurgie", count: 10, total: 12, color: "bg-purple-500" },
  ]

  // Activités récentes (simulées)
  const recentActivities = [
    { time: "09:30", action: "Nouvel employé ajouté", employee: "Dr. Marie Dubois", type: "add" },
    { time: "09:15", action: "Horaire modifié", employee: "Inf. Jean Martin", type: "update" },
    { time: "09:00", action: "Congé approuvé", employee: "Dr. Sophie Laurent", type: "leave" },
    { time: "08:45", action: "Formation terminée", employee: "Tech. Emma Bernard", type: "training" },
    { time: "08:30", action: "Rôle assigné", employee: "Adm. Pierre Moreau", type: "role" },
  ]

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleSpecialiteFilter = (specialite: string) => {
    setSelectedSpecialite(specialite)
    if (specialite && specialite !== "all") {
      searchBySpecialite(specialite)
    } else {
      fetchAllEmployes()
    }
  }

  const handleStatutFilter = (statut: string) => {
    setSelectedStatut(statut)
    if (statut && statut !== "all") {
      searchByStatut(statut)
    } else {
      fetchAllEmployes()
    }
  }

  const handleAddEmploye = () => {
    setEditingEmploye(null)
    setIsDialogOpen(true)
  }

  const handleEditEmploye = (employe: Employe) => {
    setEditingEmploye(employe)
    setIsDialogOpen(true)
  }

  const handleViewEmploye = (employe: Employe) => {
    setViewingEmploye(employe)
    setIsDetailsDialogOpen(true)
  }

  const handleDeleteEmploye = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      await removeEmploye(id)
    }
  }

  const handleSaveEmploye = async (data: any) => {
    try {
      if (editingEmploye) {
        await editEmploye(editingEmploye.id!, data)
      } else {
        await createEmploye(data)
      }
      setIsDialogOpen(false)
      setEditingEmploye(null)
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
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Employés</h1>
            <p className="text-gray-600 mt-1">Gérez le personnel de votre établissement hospitalier</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {employes.length} Employés Actifs
            </Badge>
            <Button onClick={handleAddEmploye} className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Nouvel Employé
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

        

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <Search className="h-5 w-5 text-blue-600" />
              Recherche et Filtres
            </CardTitle>
            <CardDescription className="text-black">Trouvez rapidement un employé</CardDescription>
          </CardHeader>
          <CardContent>
            <SearchFilters
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              selectedSpecialite={selectedSpecialite}
              onSpecialiteChange={handleSpecialiteFilter}
              selectedStatut={selectedStatut}
              onStatutChange={handleStatutFilter}
            />
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card className="border-0 shadow-lg text-black">
          <CardHeader>
            <CardTitle>Liste des Employés</CardTitle>
            <CardDescription>
              {employes.length} employé{employes.length > 1 ? "s" : ""} trouvé{employes.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeTable
              employes={employes}
              loading={loading}
              onEdit={handleEditEmploye}
              onDelete={handleDeleteEmploye}
              onView={handleViewEmploye}
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
              <h3 className="font-semibold text-gray-900 mb-2">Gestion Personnel</h3>
              <p className="text-sm text-gray-600">Employés et affectations</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Planning</h3>
              <p className="text-sm text-gray-600">Horaires et gardes</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Formations</h3>
              <p className="text-sm text-gray-600">Certifications et compétences</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Évaluations</h3>
              <p className="text-sm text-gray-600">Performance et objectifs</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Activités Récentes
              </CardTitle>
              <CardDescription>Dernières actions sur les employés</CardDescription>
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
                      <p className="text-xs text-gray-600">Employé: {activity.employee}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type === "add" && <Plus className="h-3 w-3 mr-1" />}
                      {activity.type === "update" && <Edit className="h-3 w-3 mr-1" />}
                      {activity.type === "leave" && <UserX className="h-3 w-3 mr-1" />}
                      {activity.type === "training" && <TrendingUp className="h-3 w-3 mr-1" />}
                      {activity.type === "role" && <UserCheck className="h-3 w-3 mr-1" />}
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Speciality Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Répartition par Spécialité
              </CardTitle>
              <CardDescription>Effectifs par service médical</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {specialiteStats.map((spec, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{spec.name}</span>
                      <span className="text-sm text-gray-500">
                        {spec.count}/{spec.total}
                      </span>
                    </div>
                    <Progress value={(spec.count / spec.total) * 100} className="h-2" />
                  </div>
                ))}
              </div>
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

        {/* System Alerts */}
        <Card className="border-l-4 border-l-yellow-500 bg-yellow-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Alertes Personnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-800">3 employés en fin de contrat ce mois</span>
                <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-300 bg-transparent">
                  Voir
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-800">Formation obligatoire: 5 employés en retard</span>
                <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-300 bg-transparent">
                  Détails
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dialog pour ajouter/modifier un employé */}
        <EmployeDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          employe={editingEmploye}
          onSave={handleSaveEmploye}
        />

        {/* Dialog pour voir les détails d'un employé */}
        <EmployeDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          employe={viewingEmploye}
        />
      </div>
    </DashboardLayout>
  )
}
