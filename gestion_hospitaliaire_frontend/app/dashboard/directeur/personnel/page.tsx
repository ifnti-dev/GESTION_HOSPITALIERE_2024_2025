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
  Phone,
  Mail,
  MoreHorizontal,
  Calendar,
  MapPin,
  Heart,
} from "lucide-react"
import { useState } from "react"

export default function PersonnelPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<any>(null)

  const personnel = [
    {
      id: "PER001",
      prenom: "Marie",
      nom: "Dubois",
      email: "marie.dubois@hopital.fr",
      tel: "01.23.45.67.89",
      adresse: "15 rue de la Santé, 75014 Paris",
      dateNaissance: "1985-03-15",
      situationMatrimonial: "Mariée",
      isEmploye: true,
    },
    {
      id: "PER002",
      prenom: "Jean",
      nom: "Martin",
      email: "jean.martin@hopital.fr",
      tel: "01.23.45.67.90",
      adresse: "22 avenue des Soins, 75015 Paris",
      dateNaissance: "1990-09-10",
      situationMatrimonial: "Célibataire",
      isEmploye: true,
    },
    {
      id: "PER003",
      prenom: "Sophie",
      nom: "Bernard",
      email: "sophie.bernard@hopital.fr",
      tel: "01.23.45.67.91",
      adresse: "8 place du Bien-être, 75016 Paris",
      dateNaissance: "1988-01-20",
      situationMatrimonial: "Divorcée",
      isEmploye: true,
    },
    {
      id: "PER004",
      prenom: "Pierre",
      nom: "Leroy",
      email: "pierre.leroy@hopital.fr",
      tel: "01.23.45.67.92",
      adresse: "33 boulevard de la Guérison, 75017 Paris",
      dateNaissance: "1982-06-05",
      situationMatrimonial: "Marié",
      isEmploye: false,
    },
    {
      id: "PER005",
      prenom: "Amélie",
      nom: "Rousseau",
      email: "amelie.rousseau@hopital.fr",
      tel: "01.23.45.67.93",
      adresse: "12 rue de l'Espoir, 75018 Paris",
      dateNaissance: "1992-02-14",
      situationMatrimonial: "Célibataire",
      isEmploye: true,
    },
  ]

  const getSituationBadge = (situation: string) => {
    const colors = {
      Marié: "bg-green-100 text-green-800 border-green-200",
      Mariée: "bg-green-100 text-green-800 border-green-200",
      Célibataire: "bg-blue-100 text-blue-800 border-blue-200",
      Divorcé: "bg-orange-100 text-orange-800 border-orange-200",
      Divorcée: "bg-orange-100 text-orange-800 border-orange-200",
      Veuf: "bg-gray-100 text-gray-800 border-gray-200",
      Veuve: "bg-gray-100 text-gray-800 border-gray-200",
    }
    return (
      <Badge className={colors[situation as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"}>
        {situation}
      </Badge>
    )
  }

  const stats = [
    { title: "Total Personnes", value: "1,247", icon: <Users className="h-5 w-5" />, color: "text-blue-600" },
    { title: "Employés", value: "247", icon: <Users className="h-5 w-5" />, color: "text-green-600" },
    { title: "Patients", value: "1,000", icon: <Heart className="h-5 w-5" />, color: "text-red-600" },
    { title: "Nouveaux ce mois", value: "45", icon: <Calendar className="h-5 w-5" />, color: "text-purple-600" },
  ]

  const handleEdit = (person: any) => {
    setSelectedPerson(person)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette personne ?")) {
      // Logique de suppression
      console.log("Suppression de:", id)
    }
  }

  const PersonForm = ({ person = null, onClose }: { person?: any; onClose: () => void }) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom</Label>
          <Input id="prenom" defaultValue={person?.prenom || ""} placeholder="Prénom" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" defaultValue={person?.nom || ""} placeholder="Nom" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" defaultValue={person?.email || ""} placeholder="email@hopital.fr" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tel">Téléphone</Label>
          <Input id="tel" defaultValue={person?.tel || ""} placeholder="01.23.45.67.89" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateNaissance">Date de naissance</Label>
          <Input id="dateNaissance" type="date" defaultValue={person?.dateNaissance || ""} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="adresse">Adresse</Label>
        <Input id="adresse" defaultValue={person?.adresse || ""} placeholder="Adresse complète" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="situation">Situation matrimoniale</Label>
        <Select defaultValue={person?.situationMatrimonial || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Célibataire">Célibataire</SelectItem>
            <SelectItem value="Marié">Marié(e)</SelectItem>
            <SelectItem value="Divorcé">Divorcé(e)</SelectItem>
            <SelectItem value="Veuf">Veuf/Veuve</SelectItem>
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
            <h1 className="text-3xl font-bold text-gray-900">Gestion du Personnel</h1>
            <p className="text-gray-600 mt-1">Gérez toutes les personnes dans le système</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Personne
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle personne</DialogTitle>
                <DialogDescription>Remplissez les informations de base de la personne.</DialogDescription>
              </DialogHeader>
              <PersonForm onClose={() => setIsAddDialogOpen(false)} />
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
                  <Input placeholder="Rechercher une personne..." className="pl-10" />
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Personnel Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              Liste du Personnel
            </CardTitle>
            <CardDescription>Toutes les personnes enregistrées dans le système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100">
                    <TableHead className="font-semibold text-teal-900">ID</TableHead>
                    <TableHead className="font-semibold text-teal-900">Personne</TableHead>
                    <TableHead className="font-semibold text-teal-900">Contact</TableHead>
                    <TableHead className="font-semibold text-teal-900">Adresse</TableHead>
                    <TableHead className="font-semibold text-teal-900">Situation</TableHead>
                    <TableHead className="font-semibold text-teal-900">Statut</TableHead>
                    <TableHead className="font-semibold text-teal-900 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personnel.map((person, index) => (
                    <TableRow
                      key={person.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      } hover:bg-teal-50/50 transition-colors duration-200`}
                    >
                      <TableCell className="font-medium text-gray-900">{person.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900">
                            {person.prenom} {person.nom}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            {new Date(person.dateNaissance).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            {person.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            {person.tel}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span className="max-w-[200px] truncate">{person.adresse}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getSituationBadge(person.situationMatrimonial)}</TableCell>
                      <TableCell>
                        {person.isEmploye ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Employé</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 border-gray-200">Patient</Badge>
                        )}
                      </TableCell>
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
                            onClick={() => handleEdit(person)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(person.id)}
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
                              {person.isEmploye && <DropdownMenuItem>Gérer comme employé</DropdownMenuItem>}
                              <DropdownMenuItem>Historique</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
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
              <DialogTitle>Modifier les informations</DialogTitle>
              <DialogDescription>
                Modifiez les informations de {selectedPerson?.prenom} {selectedPerson?.nom}.
              </DialogDescription>
            </DialogHeader>
            <PersonForm person={selectedPerson} onClose={() => setIsEditDialogOpen(false)} />
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
