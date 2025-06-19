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
  Heart,
  Search,
  Plus,
  Eye,
  Edit,
  FileText,
  AlertTriangle,
  TrendingUp,
  Baby,
  Activity,
  Clock,
  User,
  Stethoscope,
} from "lucide-react"
import { useState } from "react"

export default function SageFemmeGrossessesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [trimesterFilter, setTrimesterFilter] = useState("all")

  const stats = [
    {
      title: "Grossesses Actives",
      value: "38",
      change: "+2 ce mois",
      icon: <Heart className="h-5 w-5" />,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      title: "1er Trimestre",
      value: "8",
      change: "Nouvelles",
      icon: <Activity className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "2ème Trimestre",
      value: "15",
      change: "En suivi",
      icon: <Stethoscope className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "3ème Trimestre",
      value: "15",
      change: "Proche terme",
      icon: <Baby className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const grossesses = [
    {
      id: 1,
      patiente: {
        nom: "Emma Bernard",
        age: 28,
        numeroSS: "2950678123456",
      },
      grossesse: {
        numero: "G2P1",
        semaines: 38,
        jours: 2,
        trimestre: 3,
        terme: "2024-02-15",
        ddr: "2023-05-10",
        risque: "normal",
      },
      suivi: {
        dernierRDV: "2024-01-10",
        prochainRDV: "2024-01-17",
        frequence: "hebdomadaire",
        medecin: "Dr. Martin",
      },
      examens: {
        echographies: 3,
        prisesSang: 5,
        dernierExamen: "Échographie 3T",
      },
      complications: [],
      statut: "normal",
      notes: "Grossesse évoluant normalement",
    },
    {
      id: 2,
      patiente: {
        nom: "Claire Rousseau",
        age: 32,
        numeroSS: "2820445123789",
      },
      grossesse: {
        numero: "G1P0",
        semaines: 32,
        jours: 5,
        trimestre: 3,
        terme: "2024-03-20",
        ddr: "2023-06-15",
        risque: "surveillance",
      },
      suivi: {
        dernierRDV: "2024-01-08",
        prochainRDV: "2024-01-15",
        frequence: "bi-hebdomadaire",
        medecin: "Dr. Dubois",
      },
      examens: {
        echographies: 4,
        prisesSang: 6,
        dernierExamen: "Doppler utérin",
      },
      complications: ["HTA gravidique"],
      statut: "surveillance",
      notes: "Surveillance renforcée pour HTA",
    },
    {
      id: 3,
      patiente: {
        nom: "Sophie Martin",
        age: 25,
        numeroSS: "2951234567890",
      },
      grossesse: {
        numero: "G1P0",
        semaines: 28,
        jours: 1,
        trimestre: 3,
        terme: "2024-04-10",
        ddr: "2023-07-05",
        risque: "normal",
      },
      suivi: {
        dernierRDV: "2024-01-05",
        prochainRDV: "2024-01-19",
        frequence: "mensuelle",
        medecin: "Dr. Laurent",
      },
      examens: {
        echographies: 2,
        prisesSang: 4,
        dernierExamen: "Échographie morphologique",
      },
      complications: [],
      statut: "normal",
      notes: "Évolution favorable",
    },
    {
      id: 4,
      patiente: {
        nom: "Marie Dubois",
        age: 35,
        numeroSS: "2851123456789",
      },
      grossesse: {
        numero: "G3P2",
        semaines: 39,
        jours: 4,
        trimestre: 3,
        terme: "2024-01-25",
        ddr: "2023-04-20",
        risque: "terme",
      },
      suivi: {
        dernierRDV: "2024-01-12",
        prochainRDV: "2024-01-14",
        frequence: "bi-hebdomadaire",
        medecin: "Dr. Martin",
      },
      examens: {
        echographies: 4,
        prisesSang: 7,
        dernierExamen: "Monitoring fœtal",
      },
      complications: [],
      statut: "terme",
      notes: "Prête pour l'accouchement",
    },
    {
      id: 5,
      patiente: {
        nom: "Lisa Petit",
        age: 29,
        numeroSS: "2940567890123",
      },
      grossesse: {
        numero: "G2P1",
        semaines: 12,
        jours: 3,
        trimestre: 1,
        terme: "2024-07-15",
        ddr: "2023-10-10",
        risque: "normal",
      },
      suivi: {
        dernierRDV: "2024-01-11",
        prochainRDV: "2024-01-25",
        frequence: "mensuelle",
        medecin: "Dr. Rousseau",
      },
      examens: {
        echographies: 1,
        prisesSang: 2,
        dernierExamen: "Échographie datation",
      },
      complications: [],
      statut: "debut",
      notes: "Début de grossesse",
    },
  ]

  const filteredGrossesses = grossesses.filter((grossesse) => {
    const matchesSearch =
      grossesse.patiente.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grossesse.patiente.numeroSS.includes(searchTerm) ||
      grossesse.grossesse.numero.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTrimester = trimesterFilter === "all" || grossesse.grossesse.trimestre.toString() === trimesterFilter

    return matchesSearch && matchesTrimester
  })

  const getStatutBadge = (statut: string, complications: string[]) => {
    if (complications.length > 0) {
      return (
        <Badge variant="destructive" className="text-xs">
          Complications
        </Badge>
      )
    }

    switch (statut) {
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

  const getTrimestreBadge = (trimestre: number) => {
    const colors = {
      1: "text-blue-700 border-blue-200 bg-blue-50",
      2: "text-green-700 border-green-200 bg-green-50",
      3: "text-purple-700 border-purple-200 bg-purple-50",
    }

    return (
      <Badge variant="outline" className={`text-xs ${colors[trimestre as keyof typeof colors]}`}>
        T{trimestre}
      </Badge>
    )
  }

  return (
    <DashboardLayout userRole="Sage-femme">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dossiers de Grossesse</h1>
            <p className="text-gray-600 mt-1">Suivi détaillé des grossesses en cours</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-rose-700 border-rose-200">
              <Heart className="w-3 h-3 mr-2" />
              {grossesses.length} Grossesses
            </Badge>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Dossier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-600" />
                    Créer un Nouveau Dossier de Grossesse
                  </DialogTitle>
                  <DialogDescription>Enregistrer une nouvelle grossesse pour le suivi obstétrical</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="patiente">Patiente</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une patiente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Emma Bernard</SelectItem>
                        <SelectItem value="2">Claire Rousseau</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ddr">Date Dernières Règles</Label>
                    <Input id="ddr" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terme">Date Terme Calculée</Label>
                    <Input id="terme" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parite">Parité (G_P_)</Label>
                    <Input id="parite" placeholder="ex: G2P1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medecin">Médecin Référent</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un médecin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="martin">Dr. Martin</SelectItem>
                        <SelectItem value="dubois">Dr. Dubois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="risque">Niveau de Risque</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Évaluer le risque" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="surveillance">Surveillance</SelectItem>
                        <SelectItem value="haut">Haut risque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="antecedents">Antécédents</Label>
                    <Textarea id="antecedents" placeholder="Antécédents médicaux et obstétricaux..." />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="notes">Notes Initiales</Label>
                    <Textarea id="notes" placeholder="Observations et notes..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Annuler</Button>
                  <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                    Créer le Dossier
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
                  placeholder="Rechercher par nom, N° SS ou parité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={trimesterFilter} onValueChange={setTrimesterFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par trimestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les trimestres</SelectItem>
                  <SelectItem value="1">1er Trimestre</SelectItem>
                  <SelectItem value="2">2ème Trimestre</SelectItem>
                  <SelectItem value="3">3ème Trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Grossesses Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-600" />
              Dossiers de Grossesse ({filteredGrossesses.length})
            </CardTitle>
            <CardDescription>Suivi détaillé des grossesses avec informations complètes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100">
                    <TableHead className="font-semibold text-rose-700">Patiente</TableHead>
                    <TableHead className="font-semibold text-rose-700">Grossesse</TableHead>
                    <TableHead className="font-semibold text-rose-700">Terme</TableHead>
                    <TableHead className="font-semibold text-rose-700">Suivi</TableHead>
                    <TableHead className="font-semibold text-rose-700">Examens</TableHead>
                    <TableHead className="font-semibold text-rose-700">Statut</TableHead>
                    <TableHead className="font-semibold text-rose-700 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrossesses.map((grossesse, index) => (
                    <TableRow
                      key={grossesse.id}
                      className={`hover:bg-rose-50/50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{grossesse.patiente.nom}</div>
                          <div className="text-sm text-gray-500">{grossesse.patiente.age} ans</div>
                          <div className="text-xs text-gray-400">{grossesse.patiente.numeroSS}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {grossesse.grossesse.semaines} SA + {grossesse.grossesse.jours}j
                            </span>
                            {getTrimestreBadge(grossesse.grossesse.trimestre)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{grossesse.grossesse.numero}</div>
                          <div className="text-xs text-gray-400">
                            DDR: {new Date(grossesse.grossesse.ddr).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {new Date(grossesse.grossesse.terme).toLocaleDateString("fr-FR")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.ceil(
                              (new Date(grossesse.grossesse.terme).getTime() - new Date().getTime()) /
                                (1000 * 60 * 60 * 24),
                            )}{" "}
                            jours
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-600">
                            <User className="h-3 w-3 inline mr-1" />
                            {grossesse.suivi.medecin}
                          </div>
                          <div className="text-xs text-gray-500">Fréquence: {grossesse.suivi.frequence}</div>
                          <div className="text-xs font-medium text-rose-600">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {new Date(grossesse.suivi.prochainRDV).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-600">{grossesse.examens.echographies} échographies</div>
                          <div className="text-sm text-gray-600">{grossesse.examens.prisesSang} prises de sang</div>
                          <div className="text-xs text-gray-500">Dernier: {grossesse.examens.dernierExamen}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatutBadge(grossesse.statut, grossesse.complications)}
                          {grossesse.complications.length > 0 && (
                            <div className="flex items-center text-xs text-red-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {grossesse.complications.join(", ")}
                            </div>
                          )}
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
