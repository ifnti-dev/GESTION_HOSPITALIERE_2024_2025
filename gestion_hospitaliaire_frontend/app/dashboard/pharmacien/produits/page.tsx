"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import {
  Package2,
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Eye,
  Loader2,
  Pill,
  BookOpen,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import {
  useMedicamentReferences,
  useMedicamentReferenceSearch,
  useMedicamentReferenceMutations,
} from "@/hooks/pharmacie/useMedicamentReferences"
import { useMedicaments } from "@/hooks/pharmacie/useMedicaments"
import { useReferences } from "@/hooks/pharmacie/useReferences"
import type { MedicamentReference } from "@/types/pharmacie"
import { toast } from "sonner"

export default function ProduitsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduit, setEditingProduit] = useState<MedicamentReference | null>(null)
  const [selectedMedicamentId, setSelectedMedicamentId] = useState<string>("all")
  const [selectedReferenceId, setSelectedReferenceId] = useState<string>("all")
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
  const [produitToDelete, setProduitToDelete] = useState<MedicamentReference | null>(null)

  const { medicamentReferences, loading, error, refetch } = useMedicamentReferences()
  const { medicaments } = useMedicaments()
  const { references } = useReferences()
  const { search, medicamentReferences: searchResults, loading: searchLoading } = useMedicamentReferenceSearch()
  const {
    createMedicamentReference,
    updateMedicamentReference,
    deleteMedicamentReference,
    loading: mutationLoading,
  } = useMedicamentReferenceMutations()

  const produitList = searchTerm ? searchResults : medicamentReferences

  const filteredProduits = (produitList || []).filter((produit) => {
    const matchesSearch =
      produit.medicament?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produit.reference?.nom.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMedicament =
      selectedMedicamentId === "all" || produit.medicament?.id?.toString() === selectedMedicamentId

    const matchesReference = selectedReferenceId === "all" || produit.reference?.id?.toString() === selectedReferenceId

    return matchesSearch && matchesMedicament && matchesReference
  })

  useEffect(() => {
    if (searchTerm) {
      // Recherche globale - on peut améliorer plus tard
      const timer = setTimeout(() => {
        // Pour l'instant, on filtre côté client
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [searchTerm])

  const getQuantiteStatus = (quantite: number) => {
    if (quantite === 0) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Épuisé</Badge>
    }
    if (quantite < 5) {
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Stock Faible</Badge>
    }
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Disponible</Badge>
  }

  const handleEdit = (produit: MedicamentReference) => {
    setEditingProduit(produit)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingProduit(null)
    setIsDialogOpen(true)
  }

  const handleCreate = async (produitData: Omit<MedicamentReference, "id">) => {
    try {
      await createMedicamentReference(produitData)
      setIsDialogOpen(false)
      refetch()
      toast.success("Produit créé avec succès!")
    } catch (err: any) {
      toast.error(`Erreur lors de la création du produit: ${err?.message || "Inconnue"}`)
    }
  }

  const handleUpdate = async (produitData: MedicamentReference) => {
    try {
      if (!produitData.id) return
      await updateMedicamentReference(produitData.id, produitData)
      setIsDialogOpen(false)
      refetch()
      toast.success("Produit mis à jour avec succès!")
    } catch (err: any) {
      toast.error(`Erreur lors de la mise à jour du produit: ${err?.message || "Inconnue"}`)
    }
  }

  const handleDeleteConfirmation = (produit: MedicamentReference) => {
    setProduitToDelete(produit)
    setIsDeleteConfirmationOpen(true)
  }

  const handleDelete = async () => {
    if (!produitToDelete?.id) return

    try {
      await deleteMedicamentReference(produitToDelete.id)
      setIsDeleteConfirmationOpen(false)
      setProduitToDelete(null)
      refetch()
      toast.success("Produit supprimé avec succès!")
    } catch (err: any) {
      toast.error(`Erreur lors de la suppression du produit: ${err?.message || "Inconnue"}`)
    }
  }

  return (
    <PharmacienSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Package2 className="h-8 w-8 text-white" />
              </div>
              Produits Finaux
            </h1>
            <p className="text-gray-600 mt-2">Gérez vos produits finaux (Médicament + Référence) prêts pour commande</p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
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
                Nouveau Produit
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
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">Total Produits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">{medicamentReferences?.length || 0}</div>
                  <p className="text-xs text-purple-600 mt-1">Produits finaux</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Quantité Totale</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">
                    {medicamentReferences?.reduce((sum, p) => sum + p.quantite, 0) || 0}
                  </div>
                  <p className="text-xs text-green-600 mt-1">Unités disponibles</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-orange-700">Stock Faible</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900">
                    {medicamentReferences?.filter((p) => p.quantite < 5 && p.quantite > 0).length || 0}
                  </div>
                  <p className="text-xs text-orange-600 mt-1">À réapprovisionner</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Épuisés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900">
                    {medicamentReferences?.filter((p) => p.quantite === 0).length || 0}
                  </div>
                  <p className="text-xs text-red-600 mt-1">Rupture de stock</p>
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
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <Select value={selectedMedicamentId} onValueChange={setSelectedMedicamentId}>
                    <SelectTrigger className="w-48 border-purple-200 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Médicament" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les médicaments</SelectItem>
                      {medicaments?.map((med) => (
                        <SelectItem key={med.id} value={med.id?.toString() || ""}>
                          {med.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedReferenceId} onValueChange={setSelectedReferenceId}>
                    <SelectTrigger className="w-48 border-purple-200 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Référence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les références</SelectItem>
                      {references?.map((ref) => (
                        <SelectItem key={ref.id} value={ref.id?.toString() || ""}>
                          {ref.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Produits Table */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <ShoppingCart className="h-5 w-5 text-purple-600" />
                  Liste des Produits Finaux
                </CardTitle>
                <CardDescription className="text-purple-600">
                  {filteredProduits.length} produit(s) trouvé(s)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                        <TableHead className="font-semibold text-gray-700 py-4">Médicament</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">Référence</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">Quantité</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">Statut</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700 py-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProduits.map((produit, index) => (
                        <TableRow
                          key={produit.id}
                          className={`
                        hover:bg-purple-50/50 transition-all duration-200 border-b border-gray-100
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                      `}
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center">
                                <Pill className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{produit.medicament?.nom}</div>
                                <div className="text-sm text-gray-500">{produit.medicament?.categorie?.nom}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{produit.reference?.nom}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {produit.reference?.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg text-gray-900">{produit.quantite}</span>
                              <TrendingUp
                                className={`h-4 w-4 ${
                                  produit.quantite > 10
                                    ? "text-green-500"
                                    : produit.quantite > 0
                                      ? "text-orange-500"
                                      : "text-red-500"
                                }`}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="py-4">{getQuantiteStatus(produit.quantite)}</TableCell>
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
                                onClick={() => handleEdit(produit)}
                                className="h-8 px-3 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Modifier
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteConfirmation(produit)}
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
                <Package2 className="h-5 w-5 text-purple-600" />
                {editingProduit ? "Modifier le Produit" : "Nouveau Produit Final"}
              </DialogTitle>
              <DialogDescription>
                {editingProduit
                  ? "Modifiez les informations du produit final."
                  : "Créez un nouveau produit final en associant un médicament et une référence."}
              </DialogDescription>
            </DialogHeader>
            <ProduitForm
              produit={editingProduit}
              medicaments={medicaments || []}
              references={references || []}
              onClose={() => setIsDialogOpen(false)}
              onSubmit={editingProduit ? handleUpdate : handleCreate}
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
                Êtes-vous sûr de vouloir supprimer ce produit final ? Cette action est irréversible.
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

interface ProduitFormProps {
  produit: MedicamentReference | null
  medicaments: any[]
  references: any[]
  onClose: () => void
  onSubmit: (data: MedicamentReference | Omit<MedicamentReference, "id">) => Promise<void>
  loading?: boolean
}

const ProduitForm: React.FC<ProduitFormProps> = ({ produit, medicaments, references, onClose, onSubmit, loading }) => {
  const [medicamentId, setMedicamentId] = useState(produit?.medicament?.id?.toString() || "")
  const [referenceId, setReferenceId] = useState(produit?.reference?.id?.toString() || "")
  const [quantite, setQuantite] = useState(produit?.quantite?.toString() || "")

  const handleSubmit = async () => {
    if (!medicamentId || !referenceId) {
      toast.error("Veuillez sélectionner un médicament et une référence")
      return
    }

    const selectedMedicament = medicaments.find((med) => med.id?.toString() === medicamentId)
    const selectedReference = references.find((ref) => ref.id?.toString() === referenceId)

    const produitData = {
      quantite: Number.parseInt(quantite) || 0,
      medicamentId: Number.parseInt(medicamentId),
      referenceId: Number.parseInt(referenceId),
      medicament: selectedMedicament,
      reference: selectedReference,
    }

    if (produit) {
      await onSubmit({ ...produit, ...produitData })
    } else {
      await onSubmit(produitData)
    }
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="medicament">Médicament *</Label>
          <Select value={medicamentId} onValueChange={setMedicamentId} required>
            <SelectTrigger className="border-purple-200 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder="Sélectionner un médicament" />
            </SelectTrigger>
            <SelectContent>
              {medicaments.map((med) => (
                <SelectItem key={med.id} value={med.id?.toString() || ""}>
                  <div className="flex flex-col">
                    <span className="font-medium">{med.nom}</span>
                    <span className="text-xs text-gray-500">{med.categorie?.nom}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="reference">Référence *</Label>
          <Select value={referenceId} onValueChange={setReferenceId} required>
            <SelectTrigger className="border-purple-200 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder="Sélectionner une référence" />
            </SelectTrigger>
            <SelectContent>
              {references.map((ref) => (
                <SelectItem key={ref.id} value={ref.id?.toString() || ""}>
                  <div className="flex flex-col">
                    <span className="font-medium">{ref.nom}</span>
                    <span className="text-xs text-gray-500 truncate max-w-xs">{ref.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="quantite">Quantité</Label>
        <Input
          id="quantite"
          type="number"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
          placeholder="0"
          className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
          min="0"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : produit ? (
            "Modifier"
          ) : (
            "Créer"
          )}
        </Button>
      </DialogFooter>
    </div>
  )
}
