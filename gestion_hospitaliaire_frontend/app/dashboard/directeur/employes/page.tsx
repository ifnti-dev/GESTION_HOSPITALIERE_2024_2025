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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  Award,
  MoreHorizontal,
  Calendar,
  UserCheck,
  Building,
} from "lucide-react"
import { useState } from "react"

export default function EmployesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)

  const employes = [
    {
      id: "EMP001",
      personneId: "PER001",
      prenom: "Marie",
      nom: "Dubois",
      email: "marie.dubois@hopital.fr",
      horaire_debut: "08:00",
      horaire_fin: "18:00",
      dateAffectation: "2020-03-15",
      specialite: "Cardiologie",
      numeroOrdre: "12345",
      statut: "Actif",
      roles: ["Médecin", "Chef de service"],
    },
    {
      id: "EMP002",
      personneId: "PER002",
      prenom: "Jean",
      nom: "Martin",
      email: "jean.martin@hopital.fr",
      horaire_debut: "06:00",
      horaire_fin: "14:00",
      dateAffectation: "2019-09-10",
      specialite: "Soins généraux",
      numeroOrdre: "67890",
      statut: "Actif",
      roles: ["Infirmier"],
    },
    {
      id: "EMP003",
      personneId: "PER003",
      prenom: "Sophie",
      nom: "Bernard",
      email: "sophie.bernard@hopital.fr",
      horaire_debut: "07:00",
      horaire_fin: "19:00",
      dateAffectation: "2021-01-20",
      specialite: "Obstétrique",
      numeroOrdre: "54321",
      statut: "Congé",
      roles: ["Sage-femme"],
    },
    {
      id: "EMP004",
      personneId: "PER004",
      prenom: "Pierre",
      nom: "Leroy",
      email: "pierre.leroy@hopital.fr",
      horaire_debut: "08:30",
      horaire_fin: "17:30",
      dateAffectation: "2018-06-05",
      specialite: "Pharmacie clinique",
      numeroOrdre: "98765",
      statut: "Actif",
      roles: ["Pharmacien", "Responsable stock"],
    },
  ]

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "Actif":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Actif</Badge>
      case "Congé":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Congé</Badge>
      case "Absent":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Absent</Badge>
      case "Suspendu":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Suspendu</Badge>
      default:
        return <Badge variant="outline">{statut}</Badge>
    }
  }

  const stats = [
    { title: "Total Employés", value: "247", icon: <Users className="h-5 w-5" />, color: "text-blue-600" },
    { title: "Actifs", value: "231", icon: <UserCheck className="h-5 w-5" />, color: "text-green-600" },
    { title: "En Congé", value: "12", icon: <Calendar className="h-5 w-5" />, color: "text-orange-600" },
    { title: "Nouveaux ce mois", value: "8", icon: <Plus className="h-5 w-5" />, color: "text-purple-600" },
  ]

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      console.log("Suppression de:", id)
    }
  }

  const EmployeeForm = ({ employee = null, onClose }: { employee?: any; onClose: () => void }) => (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="personne">Personne associée</Label>
        <Select defaultValue={employee?.personneId || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une personne..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PER001">Marie Dubois</SelectItem>
            <SelectItem value="PER002">Jean Martin</SelectItem>
            <SelectItem value="PER003">Sophie Bernard</SelectItem>
            <SelectItem value="PER004">Pierre Leroy</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="horaire_debut">Heure de début</Label>
          <Input id="horaire_debut" type="time" defaultValue={employee?.horaire_debut || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="horaire_fin">Heure de fin</Label>
          <Input id="horaire_fin" type="time" defaultValue={employee?.horaire_fin || ""} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateAffectation">Date d'affectation</Label>
          <Input id="dateAffectation" type="date" defaultValue={employee?.dateAffectation || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numeroOrdre">Numéro d'ordre</Label>
          <Input id="numeroOrdre" defaultValue={employee?.numeroOrdre || ""} placeholder="12345" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="specialite">Spécialité</Label>
        <Input id="specialite" defaultValue={employee?.specialite || ""} placeholder="Spécialité médicale" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="statut">Statut</Label>
        <Select defaultValue={employee?.statut || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Actif">Actif</SelectItem>
            <SelectItem value="Congé">En congé</SelectItem>
            <SelectItem value="Absent">Absent</SelectItem>
            <SelectItem value="Suspendu">Suspendu</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <DashboardLayout userRole="Directeur">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Employés</h1>
            <p className="text-gray-600 mt-1">Gérez les employés et leurs affectations</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel Employé
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel employé</DialogTitle>
                <DialogDescription>Créez un profil employé pour une personne existante.</DialogDescription>
              </DialogHeader>
              <EmployeeForm onClose={() => setIsAddDialogOpen(false)} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsAddDialogOpen(false)}>
                  Ajouter
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
                  <Input placeholder="Rechercher un employé..." className="pl-10" />
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Employees Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-teal-600" />
              Liste des Employés
            </CardTitle>
            <CardDescription>Tous les employés avec leurs informations professionnelles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100">
                    <TableHead className="font-semibold text-teal-900">ID</TableHead>
                    <TableHead className="font-semibold text-teal-900">Employé</TableHead>
                    <TableHead className="font-semibold text-teal-900">Spécialité</TableHead>
                    <TableHead className="font-semibold text-teal-900">Horaires</TableHead>
                    <TableHead className="font-semibold text-teal-900">Rôles</TableHead>
                    <TableHead className="font-semibold text-teal-900">Statut</TableHead>
                    <TableHead className="font-semibold text-teal-900 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employes.map((emp, index) => (
                    <TableRow
                      key={emp.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      } hover:bg-teal-50/50 transition-colors duration-200`}
                    >
                      <TableCell className="font-medium text-gray-900">{emp.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900">
                            {emp.prenom} {emp.nom}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Award className="h-3 w-3" />
                            N° {emp.numeroOrdre}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            Depuis {new Date(emp.dateAffectation).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">{emp.specialite}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3 text-gray-400" />
                          {emp.horaire_debut} - {emp.horaire_fin}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {emp.roles.map((role, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(emp.statut)}</TableCell>
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
                            onClick={() => handleEdit(emp)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(emp.id)}
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
                              <DropdownMenuItem>Voir le profil complet</DropdownMenuItem>
                              <DropdownMenuItem>Gérer les rôles</DropdownMenuItem>
                              <DropdownMenuItem>Modifier les horaires</DropdownMenuItem>
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
              <DialogTitle>Modifier l'employé</DialogTitle>
              <DialogDescription>
                Modifiez les informations professionnelles de {selectedEmployee?.prenom} {selectedEmployee?.nom}.
              </DialogDescription>
            </DialogHeader>
            <EmployeeForm employee={selectedEmployee} onClose={() => setIsEditDialogOpen(false)} />
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
