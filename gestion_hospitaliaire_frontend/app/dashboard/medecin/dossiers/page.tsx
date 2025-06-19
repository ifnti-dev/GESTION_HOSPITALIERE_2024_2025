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
import { FileText, Search, Filter, Eye, Edit, Trash2, FilePlus, Activity, AlertCircle, Clock } from "lucide-react"
import { useState } from "react"

export default function MedecinDossiersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Données simulées des dossiers médicaux
  const dossiers = [
    {
      id: 1,
      numeroDossier: "DM-2024-001",
      patient: {
        nom: "Dubois",
        prenom: "Marie",
        dateNaissance: "1985-03-15",
        numeroSecu: "1850315123456",
      },
      dateCreation: "2024-01-10",
      derniereMiseAJour: "2024-01-20",
      status: "actif",
      nombreConsultations: 12,
      nombrePrescriptions: 8,
      nombreExamens: 5,
      antecedents: ["Hypertension", "Diabète Type 2"],
      allergies: ["Pénicilline", "Arachides"],
      traitements: ["Metformine 500mg", "Lisinopril 10mg"],
      observations: "Patient suivi régulièrement pour diabète et hypertension",
      medecin: "Dr. Jean Dupont",
      urgence: false,
    },
    {
      id: 2,
      numeroDossier: "DM-2024-002",
      patient: {
        nom: "Martin",
        prenom: "Jean",
        dateNaissance: "1970-08-22",
        numeroSecu: "1700822987654",
      },
      dateCreation: "2024-01-05",
      derniereMiseAJour: "2024-01-22",
      status: "actif",
      nombreConsultations: 8,
      nombrePrescriptions: 6,
      nombreExamens: 3,
      antecedents: ["Asthme", "Cholestérol"],
      allergies: ["Aspirine"],
      traitements: ["Ventoline", "Atorvastatine 20mg"],
      observations: "Asthme bien contrôlé, surveillance du cholestérol",
      medecin: "Dr. Jean Dupont",
      urgence: true,
    },
    {
      id: 3,
      numeroDossier: "DM-2023-156",
      patient: {
        nom: "Laurent",
        prenom: "Sophie",
        dateNaissance: "1992-12-05",
        numeroSecu: "2921205147258",
      },
      dateCreation: "2023-06-15",
      derniereMiseAJour: "2023-11-20",
      status: "archivé",
      nombreConsultations: 4,
      nombrePrescriptions: 2,
      nombreExamens: 1,
      antecedents: ["Migraine"],
      allergies: [],
      traitements: [],
      observations: "Migraines occasionnelles, traitement symptomatique",
      medecin: "Dr. Jean Dupont",
      urgence: false,
    },
  ]

  const filteredDossiers = dossiers.filter((dossier) => {
    const matchesSearch =
      dossier.numeroDossier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.patient.numeroSecu.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || dossier.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "actif":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Actif</Badge>
      case "archivé":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Archivé</Badge>
      case "suspendu":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Suspendu</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <DashboardLayout userRole="Médecin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              Dossiers Médicaux
            </h1>
            <p className="text-gray-600 mt-2">Gérez les dossiers médicaux de vos patients</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg">
                <FilePlus className="h-4 w-4 mr-2" />
                Nouveau Dossier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un Nouveau Dossier Médical</DialogTitle>
                <DialogDescription>Créez un nouveau dossier médical pour un patient</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="patient">Patient</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un patient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Marie Dubois - 1850315123456</SelectItem>
                      <SelectItem value="2">Jean Martin - 1700822987654</SelectItem>
                      <SelectItem value="3">Sophie Laurent - 2921205147258</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="antecedents">Antécédents Médicaux</Label>
                  <Textarea id="antecedents" placeholder="Antécédents médicaux du patient" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea id="allergies" placeholder="Allergies connues du patient" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="observations">Observations Initiales</Label>
                  <Textarea id="observations" placeholder="Observations et notes initiales" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button className="bg-gradient-to-r from-indigo-600 to-blue-600">Créer Dossier</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-indigo-600">Total Dossiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-900">156</div>
              <p className="text-xs text-indigo-600 flex items-center mt-1">
                <FileText className="h-3 w-3 mr-1" />
                +8 ce mois
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Dossiers Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">142</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <Activity className="h-3 w-3 mr-1" />
                91% du total
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-600">Dossiers Urgents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">5</div>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                Attention requise
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Mis à Jour Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">12</div>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                Activité récente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-indigo-600" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par numéro de dossier, nom du patient..."
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
                  <SelectItem value="archivé">Archivés</SelectItem>
                  <SelectItem value="suspendu">Suspendus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Dossiers Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dossiers Médicaux ({filteredDossiers.length})
            </CardTitle>
            <CardDescription className="text-teal-100">
              Consultez et gérez les dossiers médicaux de vos patients
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Dossier</TableHead>
                    <TableHead className="font-semibold text-gray-700">Patient</TableHead>
                    <TableHead className="font-semibold text-gray-700">Informations Médicales</TableHead>
                    <TableHead className="font-semibold text-gray-700">Activité</TableHead>
                    <TableHead className="font-semibold text-gray-700">Statut</TableHead>
                    <TableHead className="font-semibold text-gray-700">Dernière MAJ</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDossiers.map((dossier, index) => (
                    <TableRow
                      key={dossier.id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {dossier.urgence && <AlertCircle className="h-4 w-4 text-red-500" />}
                            {dossier.numeroDossier}
                          </div>
                          <div className="text-sm text-gray-600">
                            Créé le {new Date(dossier.dateCreation).toLocaleDateString("fr-FR")}
                          </div>
                          <div className="text-xs text-gray-500">Par {dossier.medecin}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">
                            {dossier.patient.prenom} {dossier.patient.nom}
                          </div>
                          <div className="text-sm text-gray-600">
                            Né(e) le {new Date(dossier.patient.dateNaissance).toLocaleDateString("fr-FR")}
                          </div>
                          <div className="text-xs text-gray-500">N° SS: {dossier.patient.numeroSecu}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Antécédents:</span>
                            {dossier.antecedents.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {dossier.antecedents.slice(0, 2).map((antecedent, idx) => (
                                  <Badge key={idx} className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                                    {antecedent}
                                  </Badge>
                                ))}
                                {dossier.antecedents.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{dossier.antecedents.length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500 ml-1">Aucun</span>
                            )}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Allergies:</span>
                            {dossier.allergies.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {dossier.allergies.slice(0, 2).map((allergie, idx) => (
                                  <Badge key={idx} variant="destructive" className="text-xs">
                                    {allergie}
                                  </Badge>
                                ))}
                                {dossier.allergies.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{dossier.allergies.length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500 ml-1">Aucune</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">{dossier.nombreConsultations}</span> consultations
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{dossier.nombrePrescriptions}</span> prescriptions
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{dossier.nombreExamens}</span> examens
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {getStatusBadge(dossier.status)}
                          {dossier.urgence && (
                            <Badge variant="destructive" className="block w-fit">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {new Date(dossier.derniereMiseAJour).toLocaleDateString("fr-FR")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <Eye className="h-3 w-3 mr-1" />
                            Consulter
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Edit className="h-3 w-3 mr-1" />
                            Modifier
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Archiver
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
