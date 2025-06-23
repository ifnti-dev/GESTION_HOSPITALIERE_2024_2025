"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Pill, Plus, Search, Edit, Trash2, Package, Filter, AlertTriangle, Eye, Loader2 } from "lucide-react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { useMedicaments, useMedicamentSearch, useMedicamentMutations } from "@/hooks/useMedicaments"
import { useCategories } from "@/hooks/useCategories"
import type { Medicament } from "@/types/pharmacie"
import { toast } from "sonner"

export default function MedicamentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMedicament, setEditingMedicament] = useState<Medicament | null>(null)
  const [selectedCategorieId, setSelectedCategorieId] = useState<string>("all")
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
  const [medicamentToDelete, setMedicamentToDelete] = useState<Medicament | null>(null)

  const { medicaments, loading, error, refetch } = useMedicaments()
  const { categories, loading: categoriesLoading } = useCategories()
  const { search, medicaments: searchResults, loading: searchLoading } = useMedicamentSearch()
  const { createMedicament, updateMedicament, deleteMedicament, loading: mutationLoading } = useMedicamentMutations()

  const medicamentList = searchTerm ? searchResults : medicaments

  const filteredMedicaments = (medicamentList || []).filter((medicament) => {
    const matchesSearch =
      medicament.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicament.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategorieId === "all" || medicament.categorie?.id?.toString() === selectedCategorieId
    return matchesSearch && matchesCategory
  })

  useEffect(() => {
    if (searchTerm) {
      search({ nom: searchTerm })
    }
  }, [searchTerm, search])

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rupture</Badge>
    }
    if (stock < 10) {
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Stock Faible</Badge>
    }
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Disponible</Badge>
  }

  const handleEdit = (medicament: Medicament) => {
    setEditingMedicament(medicament)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingMedicament(null)
    setIsDialogOpen(true)
  }

  const handleCreate = async (medicamentData: Omit<Medicament, "id">) => {
    try {
      await createMedicament(medicamentData)
      setIsDialogOpen(false)
      refetch()
      toast.success("Médicament créé avec succès!")
    } catch (err: any) {
      toast.error(`Erreur lors de la création du médicament: ${err?.message || "Inconnue"}`)
    }
  }

  const handleUpdate = async (medicamentData: Medicament) => {
    try {
      await updateMedicament(medicamentData)
      setIsDialogOpen(false)
      refetch()
      toast.success("Médicament mis à jour avec succès!")
    } catch (err: any) {
      toast.error(`Erreur lors de la mise à jour du médicament: ${err?.message || "Inconnue"}`)
    }
  }

  const handleDeleteConfirmation = (medicament: Medicament) => {
    setMedicamentToDelete(medicament)
    setIsDeleteConfirmationOpen(true)
  }

  const handleDelete = async () => {
    if (!medicamentToDelete?.id) return

    try {
      await deleteMedicament(medicamentToDelete.id)
      setIsDeleteConfirmationOpen(false)
      setMedicamentToDelete(null)
      refetch()
      toast.success("Médicament supprimé avec succès!")
    } catch (err: any) {
      toast.error(`Erreur lors de la suppression du médicament: ${err?.message || "Inconnue"}`)
    }
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
            <p className="text-gray-600 mt-2">Gérez votre inventaire de médicaments par catégorie</p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg"
            disabled={mutationLoading}
          >
            {mutationLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Médicament
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500">Erreur: {error}</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-teal-700">Total Médicaments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-teal-900">{medicaments?.length || 0}</div>
                  <p className="text-xs text-teal-600 mt-1">Références actives</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Stock Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">
                    {medicaments?.reduce((sum, m) => sum + m.stockTotal, 0) || 0}
                  </div>
                  <p className="text-xs text-green-600 mt-1">Unités en stock</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-orange-700">Stock Faible</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900">
                    {medicaments?.filter((m) => m.stockTotal < 10 && m.stockTotal > 0).length || 0}
                  </div>
                  <p className="text-xs text-orange-600 mt-1">Nécessitent attention</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Ruptures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900">
                    {medicaments?.filter((m) => m.stockTotal === 0).length || 0}
                  </div>
                  <p className="text-xs text-red-600 mt-1">Stock épuisé</p>
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
                  <Select value={selectedCategorieId} onValueChange={setSelectedCategorieId}>
                    <SelectTrigger className="w-48 border-teal-200 focus:border-teal-500 focus:ring-teal-500">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id?.toString() || ""}>
                          {cat.nom}
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
                        <TableHead className="font-semibold text-gray-700 py-4">Description</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">Stock Total</TableHead>
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
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 font-medium">
                              {medicament.categorie?.nom || "Non catégorisé"}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-sm text-gray-600 max-w-xs truncate">{medicament.description}</div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{medicament.stockTotal}</span>
                              {medicament.stockTotal < 10 && medicament.stockTotal > 0 && (
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                              )}
                              {medicament.stockTotal === 0 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">{getStockStatus(medicament.stockTotal)}</TableCell>
                          <TableCell className="text-right py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 transition-all duration-200"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Voir
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(medicament)}
                                className="h-8 px-3 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Modifier
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteConfirmation(medicament)}
                                className="h-8 px-3 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                                disabled={mutationLoading}
                              >
                                {mutationLoading ? (
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <>
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Supprimer
                                  </>
                                )}
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
          </>
        )}

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
            <MedicamentForm
              medicament={editingMedicament}
              categories={categories || []}
              onClose={() => setIsDialogOpen(false)}
              onSubmit={editingMedicament ? handleUpdate : handleCreate}
              loading={mutationLoading}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteConfirmationOpen} onOpenChange={setIsDeleteConfirmationOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirmation de Suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer le médicament "{medicamentToDelete?.nom}
                "? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsDeleteConfirmationOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={mutationLoading}>
                {mutationLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Supprimer"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PharmacienSidebar>
  )
}

interface MedicamentFormProps {
  medicament: Medicament | null
  categories: any[]
  onClose: () => void
  onSubmit: (data: Medicament | Omit<Medicament, "id">) => Promise<void>
  loading?: boolean
}

const MedicamentForm: React.FC<MedicamentFormProps> = ({ medicament, categories, onClose, onSubmit, loading }) => {
  const [nom, setNom] = useState(medicament?.nom || "")
  const [description, setDescription] = useState(medicament?.description || "")
  const [stockTotal, setStockTotal] = useState(medicament?.stockTotal?.toString() || "")
  const [categorieId, setCategorieId] = useState(medicament?.categorie?.id?.toString() || "")

  const handleSubmit = async () => {
    if (!categorieId) {
      toast.error("Veuillez sélectionner une catégorie")
      return
    }

    const selectedCategorie = categories.find((cat) => cat.id?.toString() === categorieId)

    const medicamentData = {
      nom,
      description,
      stockTotal: Number.parseInt(stockTotal) || 0,
      categorieId: Number.parseInt(categorieId),
      categorie: selectedCategorie, // Inclure l'objet catégorie complet
    }

    if (medicament) {
      await onSubmit({ ...medicament, ...medicamentData })
    } else {
      await onSubmit(medicamentData)
    }
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="nom">Nom du médicament</Label>
          <Input
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Paracétamol 1000mg"
            className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="categorie">Catégorie *</Label>
          <Select value={categorieId} onValueChange={setCategorieId} required>
            <SelectTrigger className="border-teal-200 focus:border-teal-500 focus:ring-teal-500">
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id?.toString() || ""}>
                  {cat.nom}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du médicament..."
          className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
          rows={2}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="stockTotal">Stock Total</Label>
        <Input
          id="stockTotal"
          type="number"
          value={stockTotal}
          onChange={(e) => setStockTotal(e.target.value)}
          placeholder="0"
          className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
          min="0"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button
          className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : medicament ? (
            "Modifier"
          ) : (
            "Créer"
          )}
        </Button>
      </DialogFooter>
    </div>
  )
}
