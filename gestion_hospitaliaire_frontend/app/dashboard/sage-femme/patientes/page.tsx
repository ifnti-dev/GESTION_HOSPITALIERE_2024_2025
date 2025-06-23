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
  Plus,
  Eye,
  Edit,
  Heart,
  Baby,
  Calendar,
  AlertTriangle,
  TrendingUp,
  FileText,
  Phone,
  MapPin,
} from "lucide-react"
import { useState } from "react"

export default function SageFemmePatientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const stats = [
    {
      title: "Total Patientes",
      value: "45",
      change: "+3",
      icon: <Users className="h-5 w-5" />,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      title: "Grossesses Actives",
      value: "38",
      change: "+2",
      icon: <Heart className="h-5 w-5" />,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Accouchements Prévus",
      value: "12",
      change: "Ce mois",
      icon: <Baby className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Consultations Aujourd'hui",
      value: "8",
      change: "Programmées",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ]

  const patientes = [
    {
      id: 1,
      nom: "Emma Bernard",
      prenom: "Emma",
      age: 28,
      telephone: "06.12.34.56.78",
      adresse: "15 rue des Roses, Paris",
      numeroSS: "2950678123456",
      grossesse: {
        semaines: 38,
        jours: 2,
        terme: "2024-02-15",
        risque: "normal",
        suivi: "régulier",
      },
      derniereConsultation: "2024-01-10",
      prochaineConsultation: "2024-01-17",
      statut: "active",
      complications: false,
      accouchements: 1,
    },
    {
      id: 2,
      nom: "Claire Rousseau",
      prenom: "Claire",
      age: 32,
      telephone: "06.23.45.67.89",
      adresse: "8 avenue Victor Hugo, Lyon",
      numeroSS: "2820445123789",
      grossesse: {
        semaines: 32,
        jours: 5,
        terme: "2024-03-20",
        risque: "surveillance",
        suivi: "renforcé",
      },
      derniereConsultation: "2024-01-08",
      prochaineConsultation: "2024-01-15",
      statut: "surveillance",
      complications: true,
      accouchements: 0,
    },
    {
      id: 3,
      nom: "Sophie Martin",
      prenom: "Sophie",
      age: 25,
      telephone: "06.34.56.78.90",
      adresse: "22 boulevard Saint-Michel, Marseille",
      numeroSS: "2951234567890",
      grossesse: {
        semaines: 28,
        jours: 1,
        terme: "2024-04-10",
        risque: "normal",
        suivi: "régulier",
      },
      derniereConsultation: "2024-01-05",
      prochaineConsultation: "2024-01-19",
      statut: "active",
      complications: false,
      accouchements: 0,
    },
    {
      id: 4,
      nom: "Marie Dubois",
      prenom: "Marie",
      age: 35,
      telephone: "06.45.67.89.01",
      adresse: "5 place de la République, Toulouse",
      numeroSS: "2851123456789",
      grossesse: {
        semaines: 39,
        jours: 4,
        terme: "2024-01-25",
        risque: "terme",
        suivi: "intensif",
      },
      derniereConsultation: "2024-01-12",
      prochaineConsultation: "2024-01-14",
      statut: "terme",
      complications: false,
      accouchements: 2,
    },
    {
      id: 5,
      nom: "Lisa Petit",
      prenom: "Lisa",
      age: 29,
      telephone: "06.56.78.90.12",
      adresse: "18 rue de la Paix, Nice",
      numeroSS: "2940567890123",
      grossesse: {
        semaines: 12,
        jours: 3,
        terme: "2024-07-15",
        risque: "normal",
        suivi: "début",
      },
      derniereConsultation: "2024-01-11",
      prochaineConsultation: "2024-01-25",
      statut: "debut",
      complications: false,
      accouchements: 1,
    },
  ]

  const filteredPatientes = patientes.filter((patiente) => {
    const matchesSearch =
      patiente.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patiente.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patiente.numeroSS.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || patiente.statut === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatutBadge = (statut: string, complications: boolean) => {
    if (complications) {
      return (
        <Badge variant="destructive" className="text-xs">
          Complications
        </Badge>
      )
    }

    switch (statut) {
      case "active":
        return (
          <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 text-xs">
            Active
          </Badge>
        )
      case "surveillance":
        return (
          <Badge variant="outline" className="text-orange-700 border-orange-200 bg-orange-50 text-xs">
            Surveillance
          </Badge>
        )
      case "terme":
        return (
          <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50 text-xs">
            À terme
          </Badge>
        )
      case "debut":
        return (
          <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50 text-xs">
            Début
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            Inconnue
          </Badge>
        )
    }
  }

  const getRisqueBadge = (risque: string) => {
    switch (risque) {
      case "normal":
        return (
          <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 text-xs">
            Normal
          </Badge>
        )
      case "surveillance":
        return (
          <Badge variant="outline" className="text-orange-700 border-orange-200 bg-orange-50 text-xs">
            Surveillance
          </Badge>
        )
      case "terme":
        return (
          <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50 text-xs">
            Terme
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            Non défini
          </Badge>
        )
    }
  }

  return (
    <DashboardLayout userRole="Sage-femme">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Patientes</h1>
            <p className="text-gray-600 mt-1">Gestion des patientes en suivi obstétrical</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-rose-700 border-rose-200">
              <Heart className="w-3 h-3 mr-2" />
              {patientes.length} Patientes
            </Badge>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Patiente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-rose-600" />
                    Ajouter une Nouvelle Patiente
                  </DialogTitle>
                  <DialogDescription>Enregistrer une nouvelle patiente pour le suivi obstétrical</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" placeholder="Nom de famille" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input id="prenom" placeholder="Prénom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Âge</Label>
                    <Input id="age" type="number" placeholder="Âge" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input id="telephone" placeholder="06.12.34.56.78" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input id="adresse" placeholder="Adresse complète" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numeroSS">N° Sécurité Sociale</Label>
                    <Input id="numeroSS" placeholder="N° SS" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terme">Date Terme Prévue</Label>
                    <Input id="terme" type="date" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="observations">Observations</Label>
                    <Textarea id="observations" placeholder="Observations initiales..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Annuler</Button>
                  <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                    Enregistrer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-rose-600" />
              Recherche et Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher par nom, prénom ou N° SS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="surveillance">Surveillance</SelectItem>
                  <SelectItem value="terme">À terme</SelectItem>
                  <SelectItem value="debut">Début grossesse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-rose-600" />
              Liste des Patientes ({filteredPatientes.length})
            </CardTitle>
            <CardDescription>Patientes en suivi obstétrical avec informations détaillées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100">
                    <TableHead className="font-semibold text-rose-700">Patiente</TableHead>
                    <TableHead className="font-semibold text-rose-700">Contact</TableHead>
                    <TableHead className="font-semibold text-rose-700">Grossesse</TableHead>
                    <TableHead className="font-semibold text-rose-700">Terme</TableHead>
                    <TableHead className="font-semibold text-rose-700">Statut</TableHead>
                    <TableHead className="font-semibold text-rose-700">Consultations</TableHead>
                    <TableHead className="font-semibold text-rose-700 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatientes.map((patiente, index) => (
                    <TableRow
                      key={patiente.id}
                      className={`hover:bg-rose-50/50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {patiente.prenom} {patiente.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patiente.age} ans • {patiente.numeroSS}
                          </div>
                          <div className="text-xs text-gray-400">
                            {patiente.accouchements} accouchement{patiente.accouchements > 1 ? "s" : ""}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {patiente.telephone}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {patiente.adresse.split(",")[0]}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {patiente.grossesse.semaines} SA + {patiente.grossesse.jours}j
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {getRisqueBadge(patiente.grossesse.risque)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Suivi {patiente.grossesse.suivi}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(patiente.grossesse.terme).toLocaleDateString("fr-FR")}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.ceil(
                            (new Date(patiente.grossesse.terme).getTime() - new Date().getTime()) /
                              (1000 * 60 * 60 * 24),
                          )}{" "}
                          jours
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatutBadge(patiente.statut, patiente.complications)}
                          {patiente.complications && (
                            <div className="flex items-center text-xs text-red-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Complications
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-600">
                            <span className="text-xs text-gray-500">Dernière:</span>
                            <br />
                            {new Date(patiente.derniereConsultation).toLocaleDateString("fr-FR")}
                          </div>
                          <div className="text-sm font-medium text-rose-600">
                            <span className="text-xs text-gray-500">Prochaine:</span>
                            <br />
                            {new Date(patiente.prochaineConsultation).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 hover:border-green-300"
                          >
                            <Eye className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
                          >
                            <FileText className="h-4 w-4 text-rose-600" />
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
