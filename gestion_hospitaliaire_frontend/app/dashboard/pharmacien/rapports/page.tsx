"use client"

import { useState } from "react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import {
  BarChart3,
  Download,
  TrendingUp,
  Package,
  ShoppingCart,
  Euro,
  AlertTriangle,
  FileText,
  PieChart,
  Activity,
  Clock,
  RefreshCw,
  FileSpreadsheet,
  FileImage,
  Loader2,
} from "lucide-react"
import { useRapports } from "@/hooks/pharmacie/useRapports"
import { RapportGenerator } from "@/utils/rapportGenerator"
import { formatPrice, formatDate } from "@/utils/formatters"
import { toast } from "sonner"

export default function RapportsPage() {
  const { data, loading, error, refreshData } = useRapports()
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState("")
  const [selectedFormat, setSelectedFormat] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [includeAnnulees, setIncludeAnnulees] = useState(false)

  const handleGenerateReport = async () => {
    if (!selectedReportType || !selectedFormat || !data) {
      toast.error("Veuillez sélectionner un type de rapport et un format")
      return
    }

    setIsGenerating(true)

    try {
      switch (selectedFormat) {
        case "pdf":
          if (selectedReportType === "stock") {
            RapportGenerator.generateStockReportPDF(data, includeAnnulees)
            toast.success("Rapport de stock PDF généré avec succès")
          } else if (selectedReportType === "ventes") {
            RapportGenerator.generateVentesReportPDF(data, includeAnnulees)
            toast.success("Rapport de ventes PDF généré avec succès")
          }
          break
        case "excel":
          RapportGenerator.generateInventaireExcel(data, includeAnnulees)
          toast.success("Rapport Excel généré avec succès")
          break
        case "csv":
          RapportGenerator.generateCSVReport(
            data,
            selectedReportType as "stock" | "ventes" | "inventaire",
            includeAnnulees,
          )
          toast.success("Rapport CSV généré avec succès")
          break
      }

      setIsGenerateModalOpen(false)
      setSelectedReportType("")
      setSelectedFormat("")
      setIncludeAnnulees(false)
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error)
      toast.error("Erreur lors de la génération du rapport")
    } finally {
      setIsGenerating(false)
    }
  }

  const typesRapports = [
    {
      id: "stock",
      nom: "Rapport de Stock",
      description: "État détaillé du stock avec niveaux et alertes",
      icon: Package,
      color: "from-teal-500 to-cyan-500",
    },
    {
      id: "ventes",
      nom: "Analyse des Ventes",
      description: "Performance des ventes et tendances",
      icon: TrendingUp,
      color: "from-green-500 to-teal-500",
    },
    {
      id: "financier",
      nom: "Rapport Financier",
      description: "Chiffre d'affaires, marges et rentabilité",
      icon: Euro,
      color: "from-blue-500 to-teal-500",
    },
    {
      id: "inventaire",
      nom: "Rapport d'Inventaire",
      description: "Inventaire complet avec écarts",
      icon: BarChart3,
      color: "from-teal-600 to-cyan-600",
    },
  ]

  if (loading) {
    return (
      <PharmacienSidebar>
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PharmacienSidebar>
    )
  }

  if (error) {
    return (
      <PharmacienSidebar>
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">Erreur lors du chargement des données: {error}</AlertDescription>
        </Alert>
      </PharmacienSidebar>
    )
  }

  if (!data) {
    return (
      <PharmacienSidebar>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Aucune donnée disponible pour générer les rapports.</AlertDescription>
        </Alert>
      </PharmacienSidebar>
    )
  }

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
          <div className="flex gap-2">
            <Button variant="outline" onClick={refreshData} className="border-teal-200 hover:bg-teal-50 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
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
                    Sélectionnez le type de rapport à générer et le format de sortie.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="typeRapport">Type de rapport</Label>
                    <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir le type de rapport" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="stock" className="bg-white hover:bg-gray-100 cursor-pointer px-3 py-2">
                          Rapport de Stock
                        </SelectItem>
                        <SelectItem value="ventes" className="bg-white hover:bg-gray-100 cursor-pointer px-3 py-2">
                          Analyse des Ventes
                        </SelectItem>
                        <SelectItem value="inventaire" className="bg-white hover:bg-gray-100 cursor-pointer px-3 py-2">
                          Inventaire Complet
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">Format de sortie</Label>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Format du fichier" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="pdf" className="bg-white hover:bg-gray-100 cursor-pointer px-3 py-2">
                          <div className="flex items-center gap-2">
                            <FileImage className="h-4 w-4" />
                            PDF
                          </div>
                        </SelectItem>
                        <SelectItem value="excel" className="bg-white hover:bg-gray-100 cursor-pointer px-3 py-2">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4" />
                            Excel (.xlsx)
                          </div>
                        </SelectItem>
                        <SelectItem value="csv" className="bg-white hover:bg-gray-100 cursor-pointer px-3 py-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            CSV
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Option pour inclure les commandes annulées */}
                  {(selectedReportType === "ventes" || selectedReportType === "inventaire") && (
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Checkbox id="includeAnnulees" checked={includeAnnulees} onCheckedChange={setIncludeAnnulees} />
                      <Label
                        htmlFor="includeAnnulees"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Inclure les commandes annulées
                      </Label>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsGenerateModalOpen(false)} disabled={isGenerating}>
                    Annuler
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Générer le Rapport
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistiques Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Chiffre d'Affaires</CardTitle>
              <Euro className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{formatPrice(data.venteStats.montantTotal)}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {data.venteStats.totalCommandes} commandes
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Stock Critique</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{data.stockStats.lotsExpires}</div>
              <p className="text-xs text-red-600 mt-1">Lots expirés</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Alertes Stock</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{data.stockStats.lotsExpirantBientot}</div>
              <p className="text-xs text-orange-600 mt-1">Lots expirant bientôt</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Valeur Stock</CardTitle>
              <Package className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">{formatPrice(data.stockStats.valeurTotaleStock)}</div>
              <div className="flex items-center text-xs text-teal-600 mt-1">
                <Package className="h-3 w-3 mr-1" />
                {data.stockStats.lotsDisponibles} lots disponibles
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
                <span className="font-medium text-gray-700">Lots Disponibles</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                    {data.stockStats.lotsDisponibles}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-700">Commandes ce Mois</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {data.venteStats.commandesMois}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">Moyenne par Commande</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {formatPrice(data.venteStats.moyenneCommande)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-teal-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-600" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                onClick={() => RapportGenerator.generateStockReportPDF(data, false)}
              >
                <FileImage className="h-4 w-4 mr-2" />
                Rapport Stock PDF
              </Button>
              <Button
                className="w-full justify-start bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                onClick={() => RapportGenerator.generateVentesReportPDF(data, false)}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Rapport Ventes PDF
              </Button>
              <Button
                className="w-full justify-start bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                onClick={() => RapportGenerator.generateInventaireExcel(data, false)}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Inventaire Excel
              </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {typesRapports.map((rapport) => {
                const IconComponent = rapport.icon
                return (
                  <Card
                    key={rapport.id}
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

        {/* Aperçu des Données */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lots Expirant Bientôt */}
          {data.lotsExpirants.length > 0 && (
            <Card className="shadow-lg border-orange-100">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Lots Expirant Bientôt
                </CardTitle>
                <CardDescription>Lots qui expirent dans les 30 prochains jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {data.lotsExpirants.slice(0, 5).map((lot, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{lot.numeroLot}</p>
                        <p className="text-sm text-gray-600">
                          {lot.medicamentReference?.medicament?.nom || "Produit non défini"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-orange-700">{formatDate(lot.dateExpiration)}</p>
                        <p className="text-sm text-gray-600">Qté: {lot.quantiteDisponible}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Commandes Récentes */}
          {data.commandesRecentes.length > 0 && (
            <Card className="shadow-lg border-green-100">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  Commandes Récentes
                </CardTitle>
                <CardDescription>Dernières commandes effectuées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {data.commandesRecentes.slice(0, 5).map((commande, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {commande.personne
                            ? `${commande.personne.prenom} ${commande.personne.nom}`
                            : "Client non défini"}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-600">{formatDate(commande.dateCommande)}</p>
                          {commande.statut === "ANNULEE" && (
                            <Badge variant="destructive" className="text-xs">
                              Annulée
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-700">
                          {formatPrice(Number.parseFloat(commande.montantTotal))}
                        </p>
                        <p className="text-sm text-gray-600">{commande.nombreLignes || 0} articles</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PharmacienSidebar>
  )
}
