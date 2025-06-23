"use client"

import { useState } from "react"
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
} from "lucide-react"

export default function StockPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false)

  // Données simulées pour le stock
  const stockItems = [
    {
      id: "MED-001",
      nom: "Paracétamol 500mg",
      categorie: "Antalgiques",
      stockActuel: 150,
      stockMin: 50,
      stockMax: 500,
      dateExpiration: "2025-03-15",
      fournisseur: "PharmaCorp",
      prixUnitaire: 0.25,
      statut: "Disponible",
      lot: "LOT-2024-001",
    },
    {
      id: "MED-002",
      nom: "Amoxicilline 250mg",
      categorie: "Antibiotiques",
      stockActuel: 25,
      stockMin: 30,
      stockMax: 200,
      dateExpiration: "2024-12-20",
      fournisseur: "BioPharm",
      prixUnitaire: 1.5,
      statut: "Stock Faible",
      lot: "LOT-2024-002",
    },
    {
      id: "MED-003",
      nom: "Aspirine 100mg",
      categorie: "Cardiologie",
      stockActuel: 5,
      stockMin: 20,
      stockMax: 300,
      dateExpiration: "2024-08-10",
      fournisseur: "MediSupply",
      prixUnitaire: 0.15,
      statut: "Critique",
      lot: "LOT-2024-003",
    },
    {
      id: "MED-004",
      nom: "Doliprane 1000mg",
      categorie: "Antalgiques",
      stockActuel: 0,
      stockMin: 40,
      stockMax: 400,
      dateExpiration: "2025-01-30",
      fournisseur: "PharmaCorp",
      prixUnitaire: 0.35,
      statut: "Rupture",
      lot: "LOT-2024-004",
    },
    {
      id: "MED-005",
      nom: "Lidocaïne 2%",
      categorie: "Anesthésie",
      stockActuel: 80,
      stockMin: 15,
      stockMax: 100,
      dateExpiration: "2024-11-25",
      fournisseur: "HealthCare Plus",
      prixUnitaire: 3.2,
      statut: "Disponible",
      lot: "LOT-2024-005",
    },
  ]

  const getStatusBadge = (statut: string, stockActuel: number, stockMin: number) => {
    if (stockActuel === 0) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Rupture
        </Badge>
      )
    } else if (stockActuel <= stockMin) {
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {stockActuel < stockMin * 0.5 ? "Critique" : "Stock Faible"}
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Disponible
        </Badge>
      )
    }
  }

  const getStockProgress = (actuel: number, min: number, max: number) => {
    const percentage = (actuel / max) * 100
    let color = "bg-green-500"
    if (actuel <= min * 0.5) color = "bg-red-500"
    else if (actuel <= min) color = "bg-orange-500"
    return { percentage, color }
  }

  const filteredItems = stockItems.filter((item) => {
    const matchesSearch =
      item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categorie.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.statut === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalMedicaments: stockItems.length,
    stockFaible: stockItems.filter((item) => item.stockActuel <= item.stockMin && item.stockActuel > 0).length,
    ruptures: stockItems.filter((item) => item.stockActuel === 0).length,
    valeurStock: stockItems.reduce((sum, item) => sum + item.stockActuel * item.prixUnitaire, 0),
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
            <p className="text-gray-600 mt-2">Gérez votre stock et suivez les niveaux d'inventaire</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-teal-200 hover:bg-teal-50">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Dialog open={isInventoryModalOpen} onOpenChange={setIsInventoryModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg">
                  <RefreshCw className="h-4 w-4 mr-2" />
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
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complet">Inventaire Complet</SelectItem>
                        <SelectItem value="partiel">Inventaire Partiel</SelectItem>
                        <SelectItem value="critique">Stock Critique Uniquement</SelectItem>
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
                  <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
                    Générer l'Inventaire
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Total Médicaments</CardTitle>
              <Package className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">{stats.totalMedicaments}</div>
              <p className="text-xs text-teal-600 mt-1">Références en stock</p>
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

          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Valeur Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.valeurStock.toLocaleString()}€</div>
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
                  placeholder="Rechercher par nom ou catégorie..."
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
              État du Stock
            </CardTitle>
            <CardDescription className="text-teal-600">{filteredItems.length} médicament(s) trouvé(s)</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 py-4">Médicament</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Catégorie</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Stock</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Niveau</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Statut</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Expiration</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Prix Unit.</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Lot</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item, index) => {
                    const { percentage, color } = getStockProgress(item.stockActuel, item.stockMin, item.stockMax)
                    const isExpiringSoon =
                      new Date(item.dateExpiration) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)

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
                              <div className="font-medium text-gray-900">{item.nom}</div>
                              <div className="text-sm text-gray-500 font-mono">{item.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className="text-teal-700 border-teal-300 font-medium">
                            {item.categorie}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-900">
                              {item.stockActuel} / {item.stockMax}
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
                          {getStatusBadge(item.statut, item.stockActuel, item.stockMin)}
                        </TableCell>
                        <TableCell className="py-4">
                          <div
                            className={`text-sm ${isExpiringSoon ? "text-orange-600 font-medium" : "text-gray-600"}`}
                          >
                            {new Date(item.dateExpiration).toLocaleDateString("fr-FR")}
                            {isExpiringSoon && (
                              <div className="text-xs text-orange-500 font-medium">Expire bientôt</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-green-700 py-4">
                          {item.prixUnitaire.toFixed(2)}€
                        </TableCell>
                        <TableCell className="font-mono text-xs text-gray-600 py-4">
                          <div className="bg-gray-100 px-2 py-1 rounded">{item.lot}</div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PharmacienSidebar>
  )
}
