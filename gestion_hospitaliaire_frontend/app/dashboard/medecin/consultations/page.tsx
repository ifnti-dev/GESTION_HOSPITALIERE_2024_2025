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
  Stethoscope,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Calendar,
  Clock,
  Activity,
  AlertCircle,
  FileText,
  CheckCircle,
} from "lucide-react"
import { useState } from "react"

export default function MedecinConsultationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Données simulées des consultations
  const consultations = [
    {
      id: 1,
      numeroConsultation: "CONS-2024-001",
      patient: {
        nom: "Dubois",
        prenom: "Marie",
        age: 38,
        numeroSecu: "1850315123456",
      },
      dateConsultation: "2024-01-20",
      heureConsultation: "09:30",
      typeConsultation: "Consultation de suivi",
      motifConsultation: "Contrôle diabète et hypertension",
      diagnostic: "Diabète type 2 bien équilibré, HTA contrôlée",
      traitement: "Poursuite du traitement actuel",
      observations: "Patient compliant au traitement, glycémie stable",
      prescriptions: ["Metformine 500mg", "Lisinopril 10mg"],
      examens: ["Glycémie à jeun", "HbA1c"],
      status: "terminée",
      duree: 30,
      cabinet: "Cabinet 1",
      urgence: false,
      suiviNecessaire: true,
      prochainRdv: "2024-02-20",
    },
    {
      id: 2,
      numeroConsultation: "CONS-2024-002",
      patient: {
        nom: "Martin",
        prenom: "Jean",
        age: 53,
        numeroSecu: "1700822987654",
      },
      dateConsultation: "2024-01-22",
      heureConsultation: "10:00",
      typeConsultation: "Consultation urgente",
      motifConsultation: "Crise d'asthme sévère",
      diagnostic: "Exacerbation asthmatique",
      traitement: "Corticothérapie orale, bronchodilatateurs",
      observations: "Amélioration après traitement, surveillance nécessaire",
      prescriptions: ["Prednisolone 20mg", "Ventoline", "Seretide"],
      examens: ["Radiographie thoracique", "Gaz du sang"],
      status: "en_cours",
      duree: 45,
      cabinet: "Cabinet 2",
      urgence: true,
      suiviNecessaire: true,
      prochainRdv: "2024-01-29",
    },
    {
      id: 3,
      numeroConsultation: "CONS-2024-003",
      patient: {
        nom: "Laurent",
        prenom: "Sophie",
        age: 31,
        numeroSecu: "2921205147258",
      },
      dateConsultation: "2024-01-25",
      heureConsultation: "14:30",
      typeConsultation: "Première consultation",
      motifConsultation: "Migraines récurrentes",
      diagnostic: "Migraine sans aura",
      traitement: "Traitement symptomatique et préventif",
      observations: "Facteurs déclenchants identifiés, conseils hygiéno-diététiques",
      prescriptions: ["Sumatriptan 50mg", "Propranolol 40mg"],
      examens: [],
      status: "programmée",
      duree: 30,
      cabinet: "Cabinet 1",
      urgence: false,
      suiviNecessaire: false,
      prochainRdv: null,
    },
  ]

  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      consultation.numeroConsultation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.motifConsultation.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || consultation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "terminée":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Terminée</Badge>
      case "en_cours":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En cours</Badge>
      case "programmée":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Programmée</Badge>
      case "annulée":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Annulée</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeConsultationBadge = (type: string) => {
    switch (type) {
      case "Consultation urgente":
        return (
          <Badge variant="destructive" className="text-xs">
            Urgente
          </Badge>
        )
      case "Première consultation":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Première</Badge>
      case "Consultation de suivi":
        return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">Suivi</Badge>
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {type}
          </Badge>
        )
    }
  }

  return (
    <DashboardLayout userRole="Médecin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              Consultations
            </h1>
            <p className="text-gray-600 mt-2">Gérez vos consultations et générez des rapports</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Consultation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Créer une Nouvelle Consultation</DialogTitle>
                <DialogDescription>Enregistrez une nouvelle consultation médicale</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
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
                <div className="space-y-2">
                  <Label htmlFor="typeConsultation">Type de Consultation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Type de consultation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premiere">Première consultation</SelectItem>
                      <SelectItem value="suivi">Consultation de suivi</SelectItem>
                      <SelectItem value="urgente">Consultation urgente</SelectItem>
                      <SelectItem value="controle">Consultation de contrôle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateConsultation">Date</Label>
                  <Input id="dateConsultation" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heureConsultation">Heure</Label>
                  <Input id="heureConsultation" type="time" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="motifConsultation">Motif de Consultation</Label>
                  <Textarea id="motifConsultation" placeholder="Motif de la consultation" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="diagnostic">Diagnostic</Label>
                  <Textarea id="diagnostic" placeholder="Diagnostic médical" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="traitement">Traitement Prescrit</Label>
                  <Textarea id="traitement" placeholder="Traitement et prescriptions" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="observations">Observations</Label>
                  <Textarea id="observations" placeholder="Observations et notes" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">Créer Consultation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-600">Total Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-900">234</div>
              <p className="text-xs text-cyan-600 flex items-center mt-1">
                <Activity className="h-3 w-3 mr-1" />
                +18 ce mois
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Terminées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">198</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                85% du total
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-600">Urgentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">12</div>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                Priorité haute
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">8</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                Planning du jour
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-cyan-600" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par numéro, patient ou motif..."
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
                  <SelectItem value="terminée">Terminées</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="programmée">Programmées</SelectItem>
                  <SelectItem value="annulée">Annulées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Consultations Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Consultations ({filteredConsultations.length})
            </CardTitle>
            <CardDescription className="text-teal-100">
              Gérez vos consultations et générez des rapports médicaux
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Consultation</TableHead>
                    <TableHead className="font-semibold text-gray-700">Patient</TableHead>
                    <TableHead className="font-semibold text-gray-700">Date & Heure</TableHead>
                    <TableHead className="font-semibold text-gray-700">Motif & Diagnostic</TableHead>
                    <TableHead className="font-semibold text-gray-700">Prescriptions</TableHead>
                    <TableHead className="font-semibold text-gray-700">Statut</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultations.map((consultation, index) => (
                    <TableRow
                      key={consultation.id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {consultation.urgence && <AlertCircle className="h-4 w-4 text-red-500" />}
                            {consultation.numeroConsultation}
                          </div>
                          <div className="flex items-center gap-2">
                            {getTypeConsultationBadge(consultation.typeConsultation)}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {consultation.duree} min - {consultation.cabinet}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">
                            {consultation.patient.prenom} {consultation.patient.nom}
                          </div>
                          <div className="text-sm text-gray-600">{consultation.patient.age} ans</div>
                          <div className="text-xs text-gray-500">N° SS: {consultation.patient.numeroSecu}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(consultation.dateConsultation).toLocaleDateString("fr-FR")}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {consultation.heureConsultation}
                          </div>
                          {consultation.prochainRdv && (
                            <div className="text-xs text-blue-600">
                              Prochain: {new Date(consultation.prochainRdv).toLocaleDateString("fr-FR")}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Motif:</span>
                            <div className="text-gray-600 text-xs mt-1">{consultation.motifConsultation}</div>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Diagnostic:</span>
                            <div className="text-gray-600 text-xs mt-1">{consultation.diagnostic}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {consultation.prescriptions.length > 0 ? (
                            <div className="space-y-1">
                              {consultation.prescriptions.slice(0, 2).map((prescription, idx) => (
                                <Badge
                                  key={idx}
                                  className="bg-blue-100 text-blue-800 border-blue-200 text-xs block w-fit"
                                >
                                  {prescription}
                                </Badge>
                              ))}
                              {consultation.prescriptions.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{consultation.prescriptions.length - 2} autres
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">Aucune</span>
                          )}
                          {consultation.examens.length > 0 && (
                            <div className="text-xs text-gray-600 mt-2">
                              <span className="font-medium">Examens:</span> {consultation.examens.length}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {getStatusBadge(consultation.status)}
                          {consultation.suiviNecessaire && (
                            <Badge className="bg-orange-100 text-orange-800 border-orange-200 block w-fit text-xs">
                              Suivi requis
                            </Badge>
                          )}
                        </div>
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
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                            <FileText className="h-3 w-3 mr-1" />
                            Rapport
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
