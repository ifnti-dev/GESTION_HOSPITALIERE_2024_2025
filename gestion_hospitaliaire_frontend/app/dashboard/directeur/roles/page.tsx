"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Shield, Plus, Search, Filter, Eye, Edit, Trash2, Users, MoreHorizontal, Key, Lock } from "lucide-react"
import { useState } from "react"

export default function RolesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<any>(null)

  const roles = [
    {
      id: "ROL001",
      nom: "Médecin",
      description: "Professionnel de santé autorisé à diagnostiquer et traiter les patients",
      permissions: ["Consulter patients", "Prescrire médicaments", "Accéder dossiers médicaux", "Modifier diagnostics"],
      employesCount: 45,
      dateCreation: "2020-01-15",
      statut: "Actif",
    },
    {
      id: "ROL002",
      nom: "Infirmier",
      description: "Professionnel de santé chargé des soins aux patients",
      permissions: ["Consulter patients", "Administrer soins", "Accéder planning", "Modifier observations"],
      employesCount: 120,
      dateCreation: "2020-01-15",
      statut: "Actif",
    },
    {
      id: "ROL003",
      nom: "Pharmacien",
      description: "Professionnel responsable de la gestion des médicaments",
      permissions: ["Gérer stock", "Valider prescriptions", "Consulter médicaments", "Générer rapports"],
      employesCount: 8,
      dateCreation: "2020-01-15",
      statut: "Actif",
    },
    {
      id: "ROL004",
      nom: "Directeur",
      description: "Direction générale de l'établissement",
      permissions: ["Accès total", "Gérer personnel", "Consulter finances", "Modifier paramètres système"],
      employesCount: 3,
      dateCreation: "2020-01-15",
      statut: "Actif",
    },
    {
      id: "ROL005",
      nom: "Sage-femme",
      description: "Professionnel spécialisé dans l'accompagnement des grossesses",
      permissions: [
        "Consulter patientes",
        "Gérer accouchements",
        "Accéder suivi grossesse",
        "Modifier dossiers maternité",
      ],
      employesCount: 15,
      dateCreation: "2020-01-15",
      statut: "Actif",
    },
  ]

  const permissions = [
    { id: "PERM001", nom: "Consulter patients", description: "Accès en lecture aux dossiers patients" },
    { id: "PERM002", nom: "Modifier patients", description: "Modification des informations patients" },
    { id: "PERM003", nom: "Prescrire médicaments", description: "Création et modification de prescriptions" },
    { id: "PERM004", nom: "Gérer stock", description: "Gestion des stocks de médicaments" },
    { id: "PERM005", nom: "Accéder finances", description: "Consultation des données financières" },
    { id: "PERM006", nom: "Gérer personnel", description: "Gestion des employés et affectations" },
    { id: "PERM007", nom: "Modifier paramètres", description: "Configuration du système" },
    { id: "PERM008", nom: "Générer rapports", description: "Création de rapports et statistiques" },
  ]

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "Actif":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Actif</Badge>
      case "Inactif":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Inactif</Badge>
      case "Suspendu":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Suspendu</Badge>
      default:
        return <Badge variant="outline">{statut}</Badge>
    }
  }

  const stats = [
    { title: "Total Rôles", value: "12", icon: <Shield className="h-5 w-5" />, color: "text-blue-600" },
    { title: "Rôles Actifs", value: "10", icon: <Key className="h-5 w-5" />, color: "text-green-600" },
    { title: "Permissions", value: "45", icon: <Lock className="h-5 w-5" />, color: "text-purple-600" },
    { title: "Employés assignés", value: "247", icon: <Users className="h-5 w-5" />, color: "text-orange-600" },
  ]

  const handleEdit = (role: any) => {
    setSelectedRole(role)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?")) {
      console.log("Suppression de:", id)
    }
  }

  const RoleForm = ({ role = null, onClose }: { role?: any; onClose: () => void }) => (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom du rôle</Label>
        <Input id="nom" defaultValue={role?.nom || ""} placeholder="Ex: Médecin, Infirmier..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          defaultValue={role?.description || ""}
          placeholder="Description détaillée du rôle..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Permissions associées</Label>
        <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto border rounded-lg p-4">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-start space-x-3">
              <Checkbox id={permission.id} defaultChecked={role?.permissions?.includes(permission.nom)} />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={permission.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {permission.nom}
                </label>
                <p className="text-xs text-muted-foreground">{permission.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <DashboardLayout userRole="Directeur">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Rôles</h1>
            <p className="text-gray-600 mt-1">Gérez les rôles et leurs permissions</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Rôle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Créer un nouveau rôle</DialogTitle>
                <DialogDescription>Définissez un nouveau rôle avec ses permissions associées.</DialogDescription>
              </DialogHeader>
              <RoleForm onClose={() => setIsAddDialogOpen(false)} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsAddDialogOpen(false)}>
                  Créer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={stat.color}>{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Rechercher un rôle..." className="pl-10" />
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Roles Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal-600" />
              Liste des Rôles
            </CardTitle>
            <CardDescription>Tous les rôles définis dans le système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100">
                    <TableHead className="font-semibold text-teal-900">ID</TableHead>
                    <TableHead className="font-semibold text-teal-900">Rôle</TableHead>
                    <TableHead className="font-semibold text-teal-900">Description</TableHead>
                    <TableHead className="font-semibold text-teal-900">Permissions</TableHead>
                    <TableHead className="font-semibold text-teal-900">Employés</TableHead>
                    <TableHead className="font-semibold text-teal-900">Statut</TableHead>
                    <TableHead className="font-semibold text-teal-900 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role, index) => (
                    <TableRow
                      key={role.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      } hover:bg-teal-50/50 transition-colors duration-200`}
                    >
                      <TableCell className="font-medium text-gray-900">{role.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            {role.nom}
                          </div>
                          <div className="text-xs text-gray-500">
                            Créé le {new Date(role.dateCreation).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <p className="text-sm text-gray-600 line-clamp-2">{role.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Key className="h-3 w-3 text-gray-400" />
                            <span className="text-sm font-medium">{role.permissions.length} permissions</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 2).map((perm, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                            {role.permissions.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="font-medium text-gray-900">{role.employesCount}</span>
                          <span className="text-sm text-gray-500">employés</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(role.statut)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={() => handleEdit(role)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(role.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 border-gray-200 text-gray-600 hover:bg-gray-50"
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Voir les permissions</DropdownMenuItem>
                              <DropdownMenuItem>Gérer les employés</DropdownMenuItem>
                              <DropdownMenuItem>Dupliquer le rôle</DropdownMenuItem>
                              <DropdownMenuItem>Historique</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Désactiver</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Modifier le rôle</DialogTitle>
              <DialogDescription>
                Modifiez les informations et permissions du rôle {selectedRole?.nom}.
              </DialogDescription>
            </DialogHeader>
            <RoleForm role={selectedRole} onClose={() => setIsEditDialogOpen(false)} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsEditDialogOpen(false)}>
                Sauvegarder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
