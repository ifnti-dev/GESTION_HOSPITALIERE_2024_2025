"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Truck, Plus, Search, Edit, Trash2, Package, Filter, Eye, Calendar } from "lucide-react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"

export default function ApprovisionnementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAppro, setEditingAppro] = useState<any>(null)
  const [selectedFournisseur, setSelectedFournisseur] = useState("all")

  const approvisionnements = [
    {
      id: 1,
      numeroAppro: "APPRO-2025-001",
      dateAppro: "2025-06-01",
      fournisseur: "Pharma Plus",
      montantTotal: 2450.75,
      nombreProduits: 12,
      statut: "reçu",
      dateReception: "2025-06-05",
    },
    {
      id: 2,
      numeroAppro: "APPRO-2025-002",
      dateAppro: "2025-06-08",
      fournisseur: "MediSupply",
      montantTotal: 1875.3,
      nombreProduits: 8,
      statut: "en_cours",
      dateReception: null,
    },
    {
      id: 3,
      numeroAppro: "APPRO-2025-003",
      dateAppro: "2025-05-25",
      fournisseur: "Pharma Secure",
      montantTotal: 3250.0,
      nombreProduits: 15,
      statut: "reçu",
      dateReception: "2025-05-30",
    },
    {
      id: 4,
      numeroAppro: "APPRO-2025-004",
      dateAppro: "2025-06-10",
      fournisseur: "Emergency Med",
      montantTotal: 1250.45,
      nombreProduits: 5,
      statut: "planifié",
      dateReception: null,
    },
  ]

  const fournisseurs = ["Pharma Plus", "MediSupply", "Pharma Secure", "Emergency Med"]

  const filteredAppros = approvisionnements.filter((appro) => {
    const matchesSearch =
      appro.numeroAppro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appro.fournisseur.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFournisseur = selectedFournisseur === "all" || appro.fournisseur === selectedFournisseur
    return matchesSearch && matchesFournisseur
  })

  const getStatutBadge = (statut: string) => {
    if (statut === "reçu") {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Reçu</Badge>
    }
    if (statut === "en_cours") {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">En cours</Badge>
    }
    return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Planifié</Badge>
  }

  const handleEdit = (appro: any) => {
    setEditingAppro(appro)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingAppro(null)
    setIsDialogOpen(true)
  }

  return (
    <PharmacienSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              Gestion des Approvisionnements
            </h1>
            <p className="text-gray-600 mt-2">Gérez les livraisons et approvisionnements</p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Approvisionnement
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Total Approvisionnements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">{approvisionnements.length}</div>
              <p className="text-xs text-teal-600 mt-1">Ce mois</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Reçus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {approvisionnements.filter((a) => a.statut === "reçu").length}
              </div>
              <p className="text-xs text-green-600 mt-1">Livraisons terminées</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">En cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {approvisionnements.filter((a) => a.statut === "en_cours").length}
              </div>
              <p className="text-xs text-blue-600 mt-1">En transit</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Valeur Totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {approvisionnements.reduce((sum, a) => sum + a.montantTotal, 0).toFixed(0)}€
              </div>
              <p className="text-xs text-purple-600 mt-1">Montant total</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un approvisionnement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <Select value={selectedFournisseur} onValueChange={setSelectedFournisseur}>
                <SelectTrigger className="w-48 border-teal-200 focus:border-teal-500 focus:ring-teal-500">
                  <SelectValue placeholder="Fournisseur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les fournisseurs</SelectItem>
                  {fournisseurs.map((fournisseur) => (
                    <SelectItem key={fournisseur} value={fournisseur}>
                      {fournisseur}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Approvisionnements Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <Package className="h-5 w-5 text-teal-600" />
              Liste des Approvisionnements
            </CardTitle>
            <CardDescription className="text-teal-600">
              {filteredAppros.length} approvisionnement(s) trouvé(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 py-4">N° Approvisionnement</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Fournisseur</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Date Commande</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Produits</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Montant</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Statut</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 py-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppros.map((appro, index) => (
                    <TableRow
                      key={appro.id}
                      className={`
                        hover:bg-teal-50/50 transition-all duration-200 border-b border-gray-100
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                      `}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-teal-600" />
                          <span className="font-medium font-mono text-gray-900">{appro.numeroAppro}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 font-medium">
                          {appro.fournisseur}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 py-4">
                        {new Date(appro.dateAppro).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-medium text-gray-900">{appro.nombreProduits}</span>
                        <span className="text-sm text-gray-500 ml-1">produits</span>
                      </TableCell>
                      <TableCell className="font-medium text-green-700 py-4">
                        {appro.montantTotal.toFixed(2)}€
                      </TableCell>
                      <TableCell className="py-4">{getStatutBadge(appro.statut)}</TableCell>
                      <TableCell className="text-right py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 transition-all duration-200"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                           
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(appro)}
                            className="h-8 px-3 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                          
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                           
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

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-teal-600" />
                {editingAppro ? "Modifier l'Approvisionnement" : "Nouvel Approvisionnement"}
              </DialogTitle>
              <DialogDescription>
                {editingAppro
                  ? "Modifiez les informations de l'approvisionnement."
                  : "Créez un nouvel approvisionnement."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="numeroAppro">Numéro d'approvisionnement</Label>
                <Input
                  id="numeroAppro"
                  defaultValue={editingAppro?.numeroAppro || ""}
                  placeholder="Ex: APPRO-2025-001"
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dateAppro">Date de commande</Label>
                  <Input
                    id="dateAppro"
                    type="date"
                    defaultValue={editingAppro?.dateAppro || ""}
                    className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fournisseur">Fournisseur</Label>
                  <Select defaultValue={editingAppro?.fournisseur || ""}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500 focus:ring-teal-500">
                      <SelectValue placeholder="Sélectionner un fournisseur" />
                    </SelectTrigger>
                    <SelectContent>
                      {fournisseurs.map((fournisseur) => (
                        <SelectItem key={fournisseur} value={fournisseur}>
                          {fournisseur}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="montantTotal">Montant total (€)</Label>
                  <Input
                    id="montantTotal"
                    type="number"
                    step="0.01"
                    defaultValue={editingAppro?.montantTotal || ""}
                    placeholder="0.00"
                    className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="statut">Statut</Label>
                  <Select defaultValue={editingAppro?.statut || "planifié"}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500 focus:ring-teal-500">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planifié">Planifié</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="reçu">Reçu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                {editingAppro ? "Modifier" : "Créer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PharmacienSidebar>
  )
}
