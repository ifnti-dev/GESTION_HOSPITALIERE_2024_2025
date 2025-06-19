"use client"

import { useState } from "react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  BarChart3,
  Download,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Euro,
  AlertTriangle,
  FileText,
  PieChart,
  Activity,
  Clock,
} from "lucide-react"

export default function RapportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)

  // Données simulées pour les rapports
  const rapportsDisponibles = [
    {
      id: "RPT-001",
      nom: "Rapport Mensuel Stock",
      type: "Stock",
      dateGeneration: "2024-06-01",
      periode: "Mai 2024",
      statut: "Disponible",
      taille: "2.3 MB",
      icon: Package,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      id: "RPT-002",
      nom: "Analyse des Ventes",
      type: "Ventes",
      dateGeneration: "2024-06-01",
      periode: "Mai 2024",
      statut: "Disponible",
      taille: "1.8 MB",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "RPT-003",
      nom: "Rapport Approvisionnements",
      type: "Approvisionnement",
      dateGeneration: "2024-05-28",
      periode: "Mai 2024",
      statut: "Disponible",
      taille: "1.2 MB",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "RPT-004",
      nom: "Inventaire Complet",
      type: "Inventaire",
      dateGeneration: "2024-05-25",
      periode: "T2 2024",
      statut: "En cours",
      taille: "En cours...",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const statistiquesRapides = {
    ventesJour: 1250.75,
    evolutionVentes: 12.5,
    stockCritique: 3,
    commandesEnCours: 8,
    valeurStock: 45780.5,
    evolutionStock: -2.3,
    rotationStock: 85,
    margeGlobale: 23.8,
  }

  const typesRapports = [
    {
      nom: "Rapport de Stock",
      description: "État détaillé du stock avec niveaux et alertes",
      icon: Package,
      color: "from-teal-500 to-cyan-500",
    },
    {
      nom: "Analyse des Ventes",
      description: "Performance des ventes et tendances",
      icon: TrendingUp,
      color: "from-green-500 to-teal-500",
    },
    {
      nom: "Rapport Financier",
      description: "Chiffre d'affaires, marges et rentabilité",
      icon: Euro,
      color: "from-blue-500 to-teal-500",
    },
    {
      nom: "Suivi Approvisionnements",
      description: "Commandes, livraisons et fournisseurs",
      icon: ShoppingCart,
      color: "from-cyan-500 to-blue-500",
    },
    {
      nom: "Rapport d'Inventaire",
      description: "Inventaire complet avec écarts",
      icon: BarChart3,
      color: "from-teal-600 to-cyan-600",
    },
    {
      nom: "Alertes et Notifications",
      description: "Historique des alertes et actions",
      icon: AlertTriangle,
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <PharmacienSidebar>
      <div className="space-y-8">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              Rapports & Analyses
            </h1>
            <p className="text-gray-600 mt-2">Tableaux de bord et rapports analytiques détaillés</p>
          </div>
          <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg">
                <FileText className="h-4 w-4 mr-2" />
                Générer un Rapport
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-teal-600" />
                  Générer un Nouveau Rapport
                </DialogTitle>
                <DialogDescription>
                  Sélectionnez le type de rapport à générer et la période d'analyse.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="typeRapport">Type de rapport</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir le type de rapport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Rapport de Stock</SelectItem>
                      <SelectItem value="ventes">Analyse des Ventes</SelectItem>
                      <SelectItem value="financier">Rapport Financier</SelectItem>
                      <SelectItem value="approvisionnement">Suivi Approvisionnements</SelectItem>
                      <SelectItem value="inventaire">Rapport d'Inventaire</SelectItem>
                      <SelectItem value="alertes">Alertes et Notifications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateDebut">Date de début</Label>
                    <Input type="date" id="dateDebut" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFin">Date de fin</Label>
                    <Input type="date" id="dateFin" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Format de sortie</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Format du fichier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGenerateModalOpen(false)}>
                  Annuler
                </Button>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
                  Générer le Rapport
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistiques Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Ventes Aujourd'hui</CardTitle>
              <Euro className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {statistiquesRapides.ventesJour.toLocaleString()}€
              </div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />+{statistiquesRapides.evolutionVentes}% vs hier
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Stock Critique</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{statistiquesRapides.stockCritique}</div>
              <p className="text-xs text-red-600 mt-1">Médicaments en rupture</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{statistiquesRapides.commandesEnCours}</div>
              <p className="text-xs text-blue-600 mt-1">En cours de traitement</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Valeur Stock</CardTitle>
              <Package className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">
                {statistiquesRapides.valeurStock.toLocaleString()}€
              </div>
              <div className="flex items-center text-xs text-red-600 mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                {statistiquesRapides.evolutionStock}% ce mois
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Indicateurs de Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg border-teal-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-teal-600" />
                Indicateurs Clés
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                <span className="font-medium text-gray-700">Rotation du Stock</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full"
                      style={{ width: `${statistiquesRapides.rotationStock}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-teal-700">{statistiquesRapides.rotationStock}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-700">Marge Globale</span>
                <span className="font-bold text-green-700">{statistiquesRapides.margeGlobale}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-teal-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-600" />
                Période d'Analyse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="border-teal-200 focus:border-teal-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Types de Rapports Disponibles */}
        <Card className="shadow-lg border-teal-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-teal-600" />
              Types de Rapports Disponibles
            </CardTitle>
            <CardDescription>Sélectionnez le type de rapport que vous souhaitez générer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typesRapports.map((rapport, index) => {
                const IconComponent = rapport.icon
                return (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer border-teal-100 hover:border-teal-300"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${rapport.color} shadow-lg`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{rapport.nom}</h3>
                          <p className="text-sm text-gray-600">{rapport.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Rapports Récents */}
        <Card className="shadow-lg border-teal-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600" />
              Rapports Récents
            </CardTitle>
            <CardDescription>Historique des rapports générés récemment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rapportsDisponibles.map((rapport) => {
                const IconComponent = rapport.icon
                return (
                  <div
                    key={rapport.id}
                    className={`p-4 rounded-lg border ${rapport.bgColor} hover:shadow-md transition-all duration-200`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white shadow-sm ${rapport.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{rapport.nom}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>Période: {rapport.periode}</span>
                            <span>Généré le: {new Date(rapport.dateGeneration).toLocaleDateString("fr-FR")}</span>
                            <span>Taille: {rapport.taille}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rapport.statut === "Disponible"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {rapport.statut}
                        </span>
                        {rapport.statut === "Disponible" && (
                          <Button size="sm" variant="outline" className="hover:bg-teal-50">
                            <Download className="h-4 w-4 mr-1" />
                            Télécharger
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PharmacienSidebar>
  )
}
