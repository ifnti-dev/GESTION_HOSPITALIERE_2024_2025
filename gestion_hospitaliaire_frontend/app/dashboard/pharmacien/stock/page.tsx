"use client"

import { useState, useEffect, useMemo } from "react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Package,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Download,
  RefreshCw,
  Loader2,
} from "lucide-react"
import { useLignesApprovisionnement } from "@/hooks/pharmacie/useLignesApprovisionnement"
import type { LigneApprovisionnement } from "@/types/pharmacie"
import { formatPrice } from "@/utils/formatters"

export default function StockPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false)
  const [inventoryType, setInventoryType] = useState("")

  // Récupération des données réelles
  const {
    lignes,
    loading: lignesLoading,
    error: lignesError,
    fetchLignes,
    fetchExpiringBefore,
    fetchByApprovisionnementId,
  } = useLignesApprovisionnement()

  // Charger les données au montage du composant
  useEffect(() => {
    fetchLignes()
  }, [fetchLignes])

  // Transformation des données pour l'affichage
  const stockData = useMemo(() => {
    if (!lignes) return []

    return lignes.map((ligne: LigneApprovisionnement) => {
      const quantiteDisponible = ligne.quantiteDisponible || 0
      const dateExpiration = new Date(ligne.dateExpiration)
      const today = new Date()
      const daysUntilExpiration = Math.ceil((dateExpiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      let statut = "Disponible"
      if (quantiteDisponible === 0) {
        statut = "Rupture"
      } else if (quantiteDisponible <= 10) {
        statut = quantiteDisponible <= 5 ? "Critique" : "Stock Faible"
      }

      const isExpiringSoon = daysUntilExpiration <= 90 && daysUntilExpiration > 0
      const isExpired = daysUntilExpiration <= 0

      // Récupération des informations du produit final (MedicamentReference)
      const medicamentReference = ligne.medicamentReference
      const medicament = medicamentReference?.medicament
      const reference = medicamentReference?.reference

      return {
        id: ligne.id,
        produitNom: `${medicament?.nom || "Médicament inconnu"} - ${reference?.nom || "Référence inconnue"}`,
        medicamentNom: medicament?.nom || "Médicament inconnu",
        referenceName: reference?.nom || "Référence inconnue",
        stockActuel: quantiteDisponible,
        stockMin: 10, // Valeur par défaut, pourrait être configurée
        stockMax: ligne.quantiteInitiale || 100,
        dateExpiration: ligne.dateExpiration,
        fournisseur: ligne.approvisionnement?.fournisseur || "Fournisseur inconnu",
        prixUnitaire: ligne.prixUnitaireVente || 0, // Garder en centimes pour les calculs
        statut,
        lot: ligne.numeroLot || `LOT-${ligne.id}`,
        dateReception: ligne.dateReception,
        isExpiringSoon,
        isExpired,
        daysUntilExpiration,
        quantiteInitiale: ligne.quantiteInitiale || 0,
        prixAchat: ligne.prixUnitaireAchat || 0, // Garder en centimes pour les calculs
        medicamentReferenceId: medicamentReference?.id,
      }
    })
  }, [lignes])

  // Filtrage des données
  const filteredItems = useMemo(() => {
    return stockData.filter((item) => {
      const matchesSearch =
        item.produitNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.medicamentNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.referenceName.toLowerCase().includes(searchTerm.toLowerCase())

      let matchesStatus = true
      if (statusFilter !== "all") {
        matchesStatus = item.statut === statusFilter
      }

      return matchesSearch && matchesStatus
    })
  }, [stockData, searchTerm, statusFilter])

  // Calcul des statistiques
  const stats = useMemo(() => {
    const totalLots = stockData.length
    const stockFaible = stockData.filter((item) => item.statut === "Stock Faible" || item.statut === "Critique").length
    const ruptures = stockData.filter((item) => item.statut === "Rupture").length
    const valeurStock = stockData.reduce((sum, item) => sum + item.stockActuel * item.prixUnitaire, 0)
    const expirantBientot = stockData.filter((item) => item.isExpiringSoon).length
    const expires = stockData.filter((item) => item.isExpired).length

    // Calcul des produits uniques (MedicamentReference)
    const produitsUniques = new Set(stockData.map((item) => item.medicamentReferenceId)).size

    return {
      totalLots,
      produitsUniques,
      stockFaible,
      ruptures,
      valeurStock,
      expirantBientot,
      expires,
    }
  }, [stockData])

  const getStatusBadge = (statut: string, isExpired: boolean, isExpiringSoon: boolean) => {
    if (isExpired) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Expiré
        </Badge>
      )
    }

    if (statut === "Rupture") {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Rupture
        </Badge>
      )
    } else if (statut === "Critique") {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Critique
        </Badge>
      )
    } else if (statut === "Stock Faible") {
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Stock Faible
        </Badge>
      )
    } else {
      const badgeClass = isExpiringSoon
        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        : "bg-green-100 text-green-800 hover:bg-green-100"

      return (
        <Badge className={`${badgeClass} flex items-center gap-1`}>
          <CheckCircle className="h-3 w-3" />
          {isExpiringSoon ? "Expire bientôt" : "Disponible"}
        </Badge>
      )
    }
  }

  const getStockProgress = (actuel: number, min: number, max: number) => {
    const percentage = max > 0 ? (actuel / max) * 100 : 0
    let color = "bg-green-500"
    if (actuel === 0) color = "bg-red-500"
    else if (actuel <= min * 0.5) color = "bg-red-500"
    else if (actuel <= min) color = "bg-orange-500"
    return { percentage, color }
  }

  const handleInventoryGeneration = () => {
    // Logique pour générer l'inventaire
    console.log("Génération d'inventaire:", inventoryType)
    setIsInventoryModalOpen(false)
    // Ici vous pourriez appeler une API pour générer le rapport
  }

  const handleRefresh = () => {
    fetchLignes()
  }

  const handleExport = () => {
    // Logique d'export
    console.log("Export des données de stock")
  }

  // Gestion des états de chargement et d'erreur
  if (lignesLoading) {
    return (
      <PharmacienSidebar>
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                <span className="ml-2 text-lg">Chargement des données de stock...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </PharmacienSidebar>
    )
  }

  if (lignesError) {
    return (
      <PharmacienSidebar>
        <div className="space-y-8">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Erreur lors du chargement des données: {lignesError}
            </AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button onClick={handleRefresh} className="bg-teal-600 hover:bg-teal-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </div>
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
                <Package className="h-8 w-8 text-white" />
              </div>
              Stock & Inventaire
            </h1>
            <p className="text-gray-600 mt-2">Gérez votre stock et suivez les niveaux d'inventaire par lots</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-teal-200 hover:bg-teal-50 bg-transparent"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button
              variant="outline"
              className="border-teal-200 hover:bg-teal-50 bg-transparent"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Dialog open={isInventoryModalOpen} onOpenChange={setIsInventoryModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Inventaire
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-teal-600" />
                    Lancer un Inventaire
                  </DialogTitle>
                  <DialogDescription>Générer un rapport d'inventaire complet du stock actuel.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type d'inventaire</Label>
                    <Select value={inventoryType} onValueChange={setInventoryType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complet">Inventaire Complet</SelectItem>
                        <SelectItem value="partiel">Inventaire Partiel</SelectItem>
                        <SelectItem value="critique">Stock Critique Uniquement</SelectItem>
                        <SelectItem value="expirant">Produits Expirants</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date de l'inventaire</Label>
                    <Input type="date" id="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInventoryModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                    onClick={handleInventoryGeneration}
                    disabled={!inventoryType}
                  >
                    Générer l'Inventaire
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Produits</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.produitsUniques}</div>
              <p className="text-xs text-blue-600 mt-1">Produits différents</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Total Lots</CardTitle>
              <Package className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">{stats.totalLots}</div>
              <p className="text-xs text-teal-600 mt-1">Lots en stock</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Stock Faible</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.stockFaible}</div>
              <p className="text-xs text-orange-600 mt-1">Nécessitent réapprovisionnement</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Ruptures</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{stats.ruptures}</div>
              <p className="text-xs text-red-600 mt-1">Stock épuisé</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Expirant</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">{stats.expirantBientot}</div>
              <p className="text-xs text-yellow-600 mt-1">Dans les 90 jours</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Valeur Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{formatPrice(stats.valeurStock)}</div>
              <p className="text-xs text-green-600 mt-1">Valeur totale</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et Recherche */}
        <Card className="shadow-lg border-teal-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="h-5 w-5 text-teal-600" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 border-teal-200 focus:border-teal-500">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="Stock Faible">Stock Faible</SelectItem>
                  <SelectItem value="Critique">Critique</SelectItem>
                  <SelectItem value="Rupture">Rupture</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste du Stock */}
        <Card className="shadow-lg border-teal-100">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
            <CardTitle className="text-lg font-semibold text-teal-800 flex items-center gap-2">
              <Package className="h-5 w-5 text-teal-600" />
              État du Stock par Lots
            </CardTitle>
            <CardDescription className="text-teal-600">{filteredItems.length} lot(s) trouvé(s)</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 py-4">Produit</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Stock</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Niveau</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Statut</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Expiration</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Prix Unit.</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Lot</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Fournisseur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        Aucun lot trouvé avec les critères de recherche actuels
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item, index) => {
                      const { percentage, color } = getStockProgress(item.stockActuel, item.stockMin, item.stockMax)

                      return (
                        <TableRow
                          key={item.id}
                          className={`
                            hover:bg-teal-50/50 transition-all duration-200 border-b border-gray-100
                            ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                          `}
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center">
                                <Package className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{item.medicamentNom}</div>
                                <div className="text-sm text-gray-500">{item.referenceName}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-gray-900">
                                {item.stockActuel} / {item.quantiteInitiale}
                              </div>
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 ${color} rounded-full transition-all duration-300`}
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Min: {item.stockMin}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            {getStatusBadge(item.statut, item.isExpired, item.isExpiringSoon)}
                          </TableCell>
                          <TableCell className="py-4">
                            <div
                              className={`text-sm ${
                                item.isExpired
                                  ? "text-red-600 font-medium"
                                  : item.isExpiringSoon
                                    ? "text-orange-600 font-medium"
                                    : "text-gray-600"
                              }`}
                            >
                              {new Date(item.dateExpiration).toLocaleDateString("fr-FR")}
                              {item.isExpired && <div className="text-xs text-red-500 font-medium">Expiré</div>}
                              {item.isExpiringSoon && !item.isExpired && (
                                <div className="text-xs text-orange-500 font-medium">
                                  {item.daysUntilExpiration} jours restants
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-green-700 py-4">
                            {formatPrice(item.prixUnitaire)}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-gray-600 py-4">
                            <div className="bg-gray-100 px-2 py-1 rounded">{item.lot}</div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 py-4">{item.fournisseur}</TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PharmacienSidebar>
  )
}
