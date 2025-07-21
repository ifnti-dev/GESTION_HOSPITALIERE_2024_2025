"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  AlertCircle,
  Heart,
} from "lucide-react"
import { useState } from "react"

export default function MedecinPatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Données simulées des patients
  const patients = [
    {
      id: 1,
      nom: "Dubois",
      prenom: "Marie",
      dateNaissance: "1985-03-15",
      age: 38,
      sexe: "F",
      telephone: "0123456789",
      email: "marie.dubois@email.com",
      adresse: "123 Rue de la Paix, Paris",
      numeroSecu: "1850315123456",
      status: "actif",
      derniereConsultation: "2024-01-15",
      prochainRdv: "2024-01-25",
      urgence: false,
      allergies: ["Pénicilline", "Arachides"],
      antecedents: ["Hypertension", "Diabète Type 2"],
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Jean",
      dateNaissance: "1970-08-22",
      age: 53,
      sexe: "M",
      telephone: "0987654321",
      email: "jean.martin@email.com",
      adresse: "456 Avenue des Champs, Lyon",
      numeroSecu: "1700822987654",
      status: "actif",
      derniereConsultation: "2024-01-10",
      prochainRdv: "2024-01-30",
      urgence: true,
      allergies: ["Aspirine"],
      antecedents: ["Asthme", "Cholestérol"],
    },
    {
      id: 3,
      nom: "Laurent",
      prenom: "Sophie",
      dateNaissance: "1992-12-05",
      age: 31,
      sexe: "F",
      telephone: "0147258369",
      email: "sophie.laurent@email.com",
      adresse: "789 Boulevard Saint-Michel, Marseille",
      numeroSecu: "2921205147258",
      status: "inactif",
      derniereConsultation: "2023-11-20",
      prochainRdv: null,
      urgence: false,
      allergies: [],
      antecedents: ["Migraine"],
    },
  ]

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.numeroSecu.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || patient.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "actif":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Actif</Badge>
      case "inactif":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactif</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getSexeBadge = (sexe: string) => {
    return sexe === "M" ? (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Homme</Badge>
    ) : (
      <Badge className="bg-pink-100 text-pink-800 border-pink-200">Femme</Badge>
    )
  }

  return (
    <DashboardLayout >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              Gestion des Patients
            </h1>
            <p className="text-gray-600 mt-2">Gérez vos patients et leurs dossiers médicaux</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg">
                <UserPlus className="h-4 w-4 mr-2" />
                Nouveau Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouveau Patient</DialogTitle>
                <DialogDescription>Remplissez les informations du nouveau patient</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" placeholder="Nom du patient" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input id="prenom" placeholder="Prénom du patient" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateNaissance">Date de Naissance</Label>
                  <Input id="dateNaissance" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexe">Sexe</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Homme</SelectItem>
                      <SelectItem value="F">Femme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" placeholder="Numéro de téléphone" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Adresse email" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Textarea id="adresse" placeholder="Adresse complète" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroSecu">Numéro de Sécurité Sociale</Label>
                  <Input id="numeroSecu" placeholder="Numéro de sécurité sociale" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">Ajouter Patient</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">156</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <Activity className="h-3 w-3 mr-1" />
                +12 ce mois
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Patients Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">142</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <Heart className="h-3 w-3 mr-1" />
                91% du total
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-600">Cas Urgents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">8</div>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                Attention requise
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">RDV Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">23</div>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                Planning chargé
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par nom, prénom ou numéro de sécurité sociale..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="actif">Actifs</SelectItem>
                  <SelectItem value="inactif">Inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Liste des Patients ({filteredPatients.length})
            </CardTitle>
            <CardDescription className="text-teal-100">
              Gérez vos patients et accédez à leurs dossiers médicaux
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Patient</TableHead>
                    <TableHead className="font-semibold text-gray-700">Contact</TableHead>
                    <TableHead className="font-semibold text-gray-700">Informations</TableHead>
                    <TableHead className="font-semibold text-gray-700">Statut</TableHead>
                    <TableHead className="font-semibold text-gray-700">Dernière Consultation</TableHead>
                    <TableHead className="font-semibold text-gray-700">Prochain RDV</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient, index) => (
                    <TableRow
                      key={patient.id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {patient.urgence && <AlertCircle className="h-4 w-4 text-red-500" />}
                            {patient.prenom} {patient.nom}
                          </div>
                          <div className="text-sm text-gray-600">
                            {patient.age} ans • {getSexeBadge(patient.sexe)}
                          </div>
                          <div className="text-xs text-gray-500">N° SS: {patient.numeroSecu}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {patient.telephone}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {patient.email}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            {patient.adresse.split(",")[0]}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">Allergies:</span>
                            {patient.allergies.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {patient.allergies.map((allergie, idx) => (
                                  <Badge key={idx} variant="destructive" className="text-xs">
                                    {allergie}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500 ml-1">Aucune</span>
                            )}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Antécédents:</span>
                            {patient.antecedents.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {patient.antecedents.map((antecedent, idx) => (
                                  <Badge key={idx} className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                                    {antecedent}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500 ml-1">Aucun</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {getStatusBadge(patient.status)}
                          {patient.urgence && (
                            <Badge variant="destructive" className="block w-fit">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {new Date(patient.derniereConsultation).toLocaleDateString("fr-FR")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {patient.prochainRdv ? (
                          <div className="text-sm text-gray-600">
                            {new Date(patient.prochainRdv).toLocaleDateString("fr-FR")}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Aucun</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <Eye className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Edit className="h-3 w-3 mr-1" />
                            Modifier
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
