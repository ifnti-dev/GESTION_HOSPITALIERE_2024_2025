"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Pill, Plus, Search, Edit, Trash2, Package, Filter, AlertTriangle, Eye } from "lucide-react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"

export default function MedicamentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMedicament, setEditingMedicament] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const medicaments = [
    {
      id: 1,
      nom: "Paracétamol 1000mg",
      description: "Antalgique et antipyrétique",
      categorie: "Antalgiques",
      stockTotal: 450,
      stockMinimum: 100,
      prixUnitaire: 0.25,
      dateExpiration: "2025-12-31",
      statut: "disponible",
      fournisseur: "Pharma Plus",
    },
    {
      id: 2,
      nom: "Amoxicilline 500mg",
      description: "Antibiotique à large spectre",
      categorie: "Antibiotiques",
      stockTotal: 25,
      stockMinimum: 50,
      prixUnitaire: 1.5,
      dateExpiration: "2025-08-15",
      statut: "stock_faible",
      fournisseur: "MediSupply",
    },
    {
      id: 3,
      nom: "Morphine 10mg",
      description: "Antalgique opioïde fort",
      categorie: "Anesthésie",
      stockTotal: 8,
      stockMinimum: 20,
      prixUnitaire: 5.75,
      dateExpiration: "2025-06-30",
      statut: "critique",
      fournisseur: "Pharma Secure",
    },
    {
      id: 4,
      nom: "Aspirine 100mg",
      description: "Antiagrégant plaquettaire",
      categorie: "Cardiologie",
      stockTotal: 180,
      stockMinimum: 80,
      prixUnitaire: 0.15,
      dateExpiration: "2026-03-20",
      statut: "disponible",
      fournisseur: "Pharma Plus",
    },
    {
      id: 5,
      nom: "Adrénaline 1mg/ml",
      description: "Médicament d'urgence",
      categorie: "Urgences",
      stockTotal: 35,
      stockMinimum: 25,
      prixUnitaire: 12.5,
      dateExpiration: "2025-09-10",
      statut: "disponible",
      fournisseur: "Emergency Med",
    },
  ]

  const categories = ["Antalgiques", "Antibiotiques", "Cardiologie", "Anesthésie", "Urgences"]

  const filteredMedicaments = medicaments.filter((medicament) => {
    const matchesSearch =
      medicament.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicament.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || medicament.categorie === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatutBadge = (statut: string, stock: number, stockMin: number) => {
    if (statut === "critique" || stock < stockMin * 0.5) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critique</Badge>
    }
    if (statut === "stock_faible" || stock < stockMin) {
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Stock Faible</Badge>
    }
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Disponible</Badge>
  }

  const handleEdit = (medicament: any) => {
    setEditingMedicament(medicament)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingMedicament(null)
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
                <Pill className="h-8 w-8 text-white" />
              </div>
              Gestion des Médicaments
            </h1>
            <p className="text-gray-600 mt-2">Gérez votre inventaire de médicaments</p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Médicament
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Total Médicaments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">{medicaments.length}</div>
              <p className="text-xs text-teal-600 mt-1">Références actives</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {medicaments.filter((m) => m.statut === "disponible").length}
              </div>
              <p className="text-xs text-green-600 mt-1">Stock suffisant</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Alertes Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {medicaments.filter((m) => m.statut === "stock_faible" || m.statut === "critique").length}
              </div>
              <p className="text-xs text-orange-600 mt-1">Nécessitent attention</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Valeur Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {medicaments.reduce((sum, m) => sum + m.stockTotal * m.prixUnitaire, 0).toFixed(0)}€
              </div>
              <p className="text-xs text-blue-600 mt-1">Valeur totale</p>
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
                  placeholder="Rechercher un médicament..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 border-teal-200 focus:border-teal-500 focus:ring-teal-500">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
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

        {/* Medicaments Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <Package className="h-5 w-5 text-teal-600" />
              Liste des Médicaments
            </CardTitle>
            <CardDescription className="text-teal-600">
              {filteredMedicaments.length} médicament(s) trouvé(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 py-4">Nom</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Catégorie</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Stock</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Prix</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Expiration</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Statut</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 py-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicaments.map((medicament, index) => (
                    <TableRow
                      key={medicament.id}
                      className={`
                        hover:bg-teal-50/50 transition-all duration-200 border-b border-gray-100
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                      `}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center">
                            <Pill className="h-5 w-5 text-teal-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{medicament.nom}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{medicament.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 font-medium">
                          {medicament.categorie}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{medicament.stockTotal}</span>
                          {medicament.stockTotal < medicament.stockMinimum && (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500">Min: {medicament.stockMinimum}</div>
                      </TableCell>
                      <TableCell className="font-medium text-green-700 py-4">{medicament.prixUnitaire}€</TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm text-gray-600">
                          {new Date(medicament.dateExpiration).toLocaleDateString("fr-FR")}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatutBadge(medicament.statut, medicament.stockTotal, medicament.stockMinimum)}
                      </TableCell>
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
                            onClick={() => handleEdit(medicament)}
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
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-teal-600" />
                {editingMedicament ? "Modifier le Médicament" : "Nouveau Médicament"}
              </DialogTitle>
              <DialogDescription>
                {editingMedicament
                  ? "Modifiez les informations du médicament."
                  : "Ajoutez un nouveau médicament à l'inventaire."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nom">Nom du médicament</Label>
                  <Input
                    id="nom"
                    defaultValue={editingMedicament?.nom || ""}
                    placeholder="Ex: Paracétamol 1000mg"
                    className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categorie">Catégorie</Label>
                  <Select defaultValue={editingMedicament?.categorie || ""}>
                    <SelectTrigger className="border-teal-200 focus:border-teal-500 focus:ring-teal-500">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue={editingMedicament?.description || ""}
                  placeholder="Description du médicament..."
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="stockTotal">Stock Total</Label>
                  <Input
                    id="stockTotal"
                    type="number"
                    defaultValue={editingMedicament?.stockTotal || ""}
                    placeholder="0"
                    className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stockMinimum">Stock Minimum</Label>
                  <Input
                    id="stockMinimum"
                    type="number"
                    defaultValue={editingMedicament?.stockMinimum || ""}
                    placeholder="0"
                    className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prixUnitaire">Prix Unitaire (€)</Label>
                  <Input
                    id="prixUnitaire"
                    type="number"
                    step="0.01"
                    defaultValue={editingMedicament?.prixUnitaire || ""}
                    placeholder="0.00"
                    className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dateExpiration">Date d'Expiration</Label>
                  <Input
                    id="dateExpiration"
                    type="date"
                    defaultValue={editingMedicament?.dateExpiration || ""}
                    className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fournisseur">Fournisseur</Label>
                  <Input
                    id="fournisseur"
                    defaultValue={editingMedicament?.fournisseur || ""}
                    placeholder="Nom du fournisseur"
                    className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                {editingMedicament ? "Modifier" : "Créer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PharmacienSidebar>
  )
}
