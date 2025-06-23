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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Lock,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Shield,
  Key,
  MoreHorizontal,
  Users,
  Settings,
} from "lucide-react"
import { useState } from "react"

export default function PermissionsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<any>(null)

  const permissions = [
    {
      id: "PERM001",
      nom: "Consulter patients",
      description: "Permet de consulter les dossiers patients en lecture seule",
      categorie: "Patients",
      niveau: "Lecture",
      rolesCount: 4,
      roles: ["Médecin", "Infirmier", "Sage-femme", "Directeur"],
      dateCreation: "2020-01-15",
      statut: "Actif",
    },
    {
      id: "PERM002",
      nom: "Modifier patients",
      description: "Permet de modifier les informations des patients",
      categorie: "Patients",
      niveau: "Écriture",
      rolesCount: 3,
      roles: ["Médecin", "Sage-femme", "Directeur"],
      dateCreation: "2020-01-15",
      statut: "Actif",
    },
    {
      id: "PERM003",
      nom: "Prescrire médicaments",
      description: "Permet de créer et modifier des prescriptions médicales",
      categorie: "Médical",
      niveau: "Écriture",
      rolesCount: 2,
      roles: ["Médecin", "Directeur"],
      dateCreation: "2020-01-15",
      statut: "Actif",
    },
    {
      id: "PERM004",
      nom: "Gérer stock",
      description: "Permet de gérer les stocks de médicaments et fournitures",
      categorie: "Pharmacie",
      niveau: "Écriture",
      rolesCount: 2,
      roles: ["Pharmacien", "Directeur"],
      dateCreation: "2020-01-15",
      statut: "Actif",
    },
    {
      id: "PERM005",
      nom: "Accéder finances",
      description: "Permet de consulter les données financières et comptables",
      categorie: "Finance",
      niveau: "Lecture",
      rolesCount: 2,
      roles: ["Caissier", "Directeur"],
      dateCreation: "2020-01-15",
      statut: "Actif",
    },
    {
      id: "PERM006",
      nom: "Gérer personnel",
      description: "Permet de gérer les employés, leurs rôles et affectations",
      categorie: "Administration",
      niveau: "Écriture",
      rolesCount: 1,
      roles: ["Directeur"],
      dateCreation: "2020-01-15",
      statut: "Actif",
    },
    {
      id: "PERM007",
      nom: "Modifier paramètres",
      description: "Permet de configurer les paramètres système",
      categorie: "Système",
      niveau: "Administration",
      rolesCount: 1,
      roles: ["Directeur"],
      dateCreation: "2020-01-15",
      statut: "Actif",
    },
    {
      id: "PERM008",
      nom: "Générer rapports",
      description: "Permet de créer et exporter des rapports statistiques",
      categorie: "Rapports",
      niveau: "Lecture",
      rolesCount: 3,
      roles: ["Pharmacien", "Médecin", "Directeur"],
      dateCreation: "2020-01-15",
      statut: "Actif",
    },
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

  const getNiveauBadge = (niveau: string) => {
    const colors = {
      Lecture: "bg-blue-100 text-blue-800 border-blue-200",
      Écriture: "bg-green-100 text-green-800 border-green-200",
      Administration: "bg-red-100 text-red-800 border-red-200",
    }
    return (
      <Badge className={colors[niveau as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"}>
        {niveau}
      </Badge>
    )
  }

  const getCategorieBadge = (categorie: string) => {
    const colors = {
      Patients: "bg-purple-100 text-purple-800 border-purple-200",
      Médical: "bg-green-100 text-green-800 border-green-200",
      Pharmacie: "bg-blue-100 text-blue-800 border-blue-200",
      Finance: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Administration: "bg-red-100 text-red-800 border-red-200",
      Système: "bg-gray-100 text-gray-800 border-gray-200",
      Rapports: "bg-teal-100 text-teal-800 border-teal-200",
    }
    return (
      <Badge className={colors[categorie as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"}>
        {categorie}
      </Badge>
    )
  }

  const stats = [
    { title: "Total Permissions", value: "45", icon: <Lock className="h-5 w-5" />, color: "text-blue-600" },
    { title: "Permissions Actives", value: "42", icon: <Key className="h-5 w-5" />, color: "text-green-600" },
    { title: "Catégories", value: "7", icon: <Settings className="h-5 w-5" />, color: "text-purple-600" },
    { title: "Rôles utilisant", value: "12", icon: <Shield className="h-5 w-5" />, color: "text-orange-600" },
  ]

  const handleEdit = (permission: any) => {
    setSelectedPermission(permission)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette permission ?")) {
      console.log("Suppression de:", id)
    }
  }

  const PermissionForm = ({ permission = null, onClose }: { permission?: any; onClose: () => void }) => (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom de la permission</Label>
        <Input id="nom" defaultValue={permission?.nom || ""} placeholder="Ex: Consulter patients..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          defaultValue={permission?.description || ""}
          placeholder="Description détaillée de la permission..."
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categorie">Catégorie</Label>
          <Select defaultValue={permission?.categorie || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Patients">Patients</SelectItem>
              <SelectItem value="Médical">Médical</SelectItem>
              <SelectItem value="Pharmacie">Pharmacie</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Administration">Administration</SelectItem>
              <SelectItem value="Système">Système</SelectItem>
              <SelectItem value="Rapports">Rapports</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="niveau">Niveau d'accès</Label>
          <Select defaultValue={permission?.niveau || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lecture">Lecture</SelectItem>
              <SelectItem value="Écriture">Écriture</SelectItem>
              <SelectItem value="Administration">Administration</SelectItem>
            </SelectContent>
          </Select>
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
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Permissions</h1>
            <p className="text-gray-600 mt-1">Gérez les permissions et droits d'accès</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Permission
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle permission</DialogTitle>
                <DialogDescription>Définissez une nouvelle permission avec ses caractéristiques.</DialogDescription>
              </DialogHeader>
              <PermissionForm onClose={() => setIsAddDialogOpen(false)} />
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
                  <Input placeholder="Rechercher une permission..." className="pl-10" />
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Permissions Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-teal-600" />
              Liste des Permissions
            </CardTitle>
            <CardDescription>Toutes les permissions définies dans le système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100">
                    <TableHead className="font-semibold text-teal-900">ID</TableHead>
                    <TableHead className="font-semibold text-teal-900">Permission</TableHead>
                    <TableHead className="font-semibold text-teal-900">Description</TableHead>
                    <TableHead className="font-semibold text-teal-900">Catégorie</TableHead>
                    <TableHead className="font-semibold text-teal-900">Niveau</TableHead>
                    <TableHead className="font-semibold text-teal-900">Rôles</TableHead>
                    <TableHead className="font-semibold text-teal-900">Statut</TableHead>
                    <TableHead className="font-semibold text-teal-900 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((perm, index) => (
                    <TableRow
                      key={perm.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      } hover:bg-teal-50/50 transition-colors duration-200`}
                    >
                      <TableCell className="font-medium text-gray-900">{perm.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            <Key className="h-3 w-3 text-teal-500" />
                            {perm.nom}
                          </div>
                          <div className="text-xs text-gray-500">
                            Créé le {new Date(perm.dateCreation).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[250px]">
                          <p className="text-sm text-gray-600 line-clamp-2">{perm.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getCategorieBadge(perm.categorie)}</TableCell>
                      <TableCell>{getNiveauBadge(perm.niveau)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-sm font-medium">{perm.rolesCount} rôles</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {perm.roles.slice(0, 2).map((role, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                            {perm.roles.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{perm.roles.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(perm.statut)}</TableCell>
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
                            onClick={() => handleEdit(perm)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(perm.id)}
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
                              <DropdownMenuItem>Voir les rôles associés</DropdownMenuItem>
                              <DropdownMenuItem>Dupliquer la permission</DropdownMenuItem>
                              <DropdownMenuItem>Historique d'utilisation</DropdownMenuItem>
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
              <DialogTitle>Modifier la permission</DialogTitle>
              <DialogDescription>
                Modifiez les informations de la permission {selectedPermission?.nom}.
              </DialogDescription>
            </DialogHeader>
            <PermissionForm permission={selectedPermission} onClose={() => setIsEditDialogOpen(false)} />
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
