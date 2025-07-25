"use client"

import { useState } from "react"
import { Plus, Search, Shield, Users, Settings, TrendingUp, Clock, Edit, AlertTriangle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Role } from "@/types/utilisateur"
import { useRole } from "@/hooks/utilisateur/useRole"
import { RoleSearchFilters } from "@/components/roles/role-search-filters"
import { RoleTable } from "@/components/roles/role-table"
import { RoleDialog } from "@/components/roles/role-dialog"
import { RoleDetailsDialog } from "@/components/roles/role-detail-dialog"

export default function RolesPage() {
  const { roles, loading, error, fetchRoles, addRole, updateRole, deleteRole, getEmployeeCountByRole } = useRole()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [viewingRole, setViewingRole] = useState<Role | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  // Statistiques rapides bas�es sur les donn�es
  const quickStats = [
    {
      title: "Total R�les",
      value: roles.length.toString(),
      change: "+2%",
      icon: <Shield className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      title: "R�les Actifs",
      value: roles.filter((role) => role.employes && role.employes.length > 0).length.toString(),
      change: "+5%",
      icon: <Users className="h-5 w-5" />,
      color: "text-green-600",
    },
    {
      title: "Permissions",
      value: roles.reduce((acc, role) => acc + (role.permissions?.length || 0), 0).toString(),
      change: "+8%",
      icon: <Settings className="h-5 w-5" />,
      color: "text-orange-600",
    },
    {
      title: "Employ�s Assign�s",
      value: roles.reduce((acc, role) => acc + (role.employes?.length || 0), 0).toString(),
      change: "+12%",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-purple-600",
    },
  ]

  // Statistiques par r�le (simul�es)
  const roleStats = [
    { name: "M�decin", count: 25, total: 30, color: "bg-blue-500" },
    { name: "Infirmier", count: 40, total: 45, color: "bg-green-500" },
    { name: "Administrateur", count: 8, total: 10, color: "bg-purple-500" },
    { name: "Technicien", count: 15, total: 20, color: "bg-orange-500" },
    { name: "Pharmacien", count: 6, total: 8, color: "bg-pink-500" },
  ]

  // Activit�s r�centes (simul�es)
  const recentActivities = [
    { time: "09:30", action: "Nouveau r�le cr��", role: "Sp�cialiste", type: "add" },
    { time: "09:15", action: "Permissions modifi�es", role: "M�decin", type: "update" },
    { time: "09:00", action: "R�le supprim�", role: "Stagiaire", type: "delete" },
    { time: "08:45", action: "Employ� assign�", role: "Infirmier", type: "assign" },
    { time: "08:30", action: "Description mise � jour", role: "Administrateur", type: "update" },
  ]

  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))

    if (selectedFilter === "all") return matchesSearch
    if (selectedFilter === "active") return matchesSearch && role.employes && role.employes.length > 0
    if (selectedFilter === "inactive") return matchesSearch && (!role.employes || role.employes.length === 0)

    return matchesSearch
  })

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter)
  }

  const handleAddRole = () => {
    setEditingRole(null)
    setIsDialogOpen(true)
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setIsDialogOpen(true)
  }

  const handleViewRole = (role: Role) => {
    setViewingRole(role)
    setIsDetailsDialogOpen(true)
  }

  const handleDeleteRole = async (id: number) => {
    if (confirm("�tes-vous s�r de vouloir supprimer ce r�le ?")) {
      await deleteRole(id)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des R�les</h1>
            <p className="text-gray-600 mt-1">G�rez les r�les et permissions de votre �tablissement</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-purple-700 border-purple-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              {roles.length} R�les
            </Badge>
            <Button onClick={handleAddRole} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouveau R�le
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
                Activit�s R�centes
              </CardTitle>
              <CardDescription>Derni�res actions sur les r�les</CardDescription>
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
                      <p className="text-xs text-gray-600">R�le: {activity.role}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type === "add" && <Plus className="h-3 w-3 mr-1" />}
                      {activity.type === "update" && <Edit className="h-3 w-3 mr-1" />}
                      {activity.type === "delete" && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {activity.type === "assign" && <Users className="h-3 w-3 mr-1" />}
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Role Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                R�partition des R�les
              </CardTitle>
              <CardDescription>Employ�s par r�le</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roleStats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{stat.name}</span>
                      <span className="text-sm text-gray-500">
                        {stat.count}/{stat.total}
                      </span>
                    </div>
                    <Progress value={(stat.count / stat.total) * 100} className="h-2" />
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
            <CardDescription>Trouvez rapidement un r�le</CardDescription>
          </CardHeader>
          <CardContent>
            <RoleSearchFilters
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              selectedFilter={selectedFilter}
              onFilterChange={handleFilterChange}
            />
          </CardContent>
        </Card>

        {/* Roles Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Liste des R�les</CardTitle>
            <CardDescription>
              {filteredRoles.length} r�le{filteredRoles.length > 1 ? "s" : ""} trouv�
              {filteredRoles.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoleTable
              roles={filteredRoles}
              loading={loading}
              onEdit={handleEditRole}
              onDelete={handleDeleteRole}
              onView={handleViewRole}
              getEmployeeCount={getEmployeeCountByRole}
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gestion R�les</h3>
              <p className="text-sm text-gray-600">Cr�er et modifier</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Permissions</h3>
              <p className="text-sm text-gray-600">G�rer les acc�s</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Assignations</h3>
              <p className="text-sm text-gray-600">Employ�s par r�le</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Statistiques</h3>
              <p className="text-sm text-gray-600">Analyses des r�les</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {error && (
          <Card className="border-l-4 border-l-red-500 bg-red-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                Erreur Syst�me
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-800">{error}</span>
                  <Button variant="outline" size="sm" className="text-red-700 border-red-300 bg-transparent">
                    R�essayer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialog pour ajouter/modifier un r�le */}
        <RoleDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          role={editingRole}
          onRoleAdded={() => {
            fetchRoles()
            setIsDialogOpen(false)
            setEditingRole(null)
          }}
          onRoleUpdated={() => {
            fetchRoles()
            setIsDialogOpen(false)
            setEditingRole(null)
          }}
        />

        {/* Dialog pour voir les d�tails d'un r�le */}
        <RoleDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          role={viewingRole}
          getEmployeeCount={getEmployeeCountByRole}
        />
      </div>
    </DashboardLayout>
  )
}
