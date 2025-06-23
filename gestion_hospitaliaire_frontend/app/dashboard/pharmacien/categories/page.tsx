"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tags, Plus, Search, Edit, Trash2, Package, Filter, Loader2, AlertCircle } from "lucide-react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { useCategories, useCategorieMutations, useCategorieSearch } from "@/hooks/useCategories"
import { toast } from "sonner"
import type { Categorie } from "@/types/pharmacie"

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Categorie | null>(null)
  const [formData, setFormData] = useState({ nom: "", description: "" })

  // Hooks pour l'API
  const { categories: allCategories, loading: loadingAll, error: errorAll, refetch } = useCategories()
  const { categories: searchResults, loading: loadingSearch, searchCategories } = useCategorieSearch()
  const { createCategorie, updateCategorie, deleteCategorie, loading: mutationLoading } = useCategorieMutations()

  // Utiliser les résultats de recherche si une recherche est active, sinon toutes les catégories
  const categories = searchTerm ? searchResults : allCategories
  const loading = searchTerm ? loadingSearch : loadingAll

  // Effet pour la recherche en temps réel
  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        searchCategories({
          nom: searchTerm,
          description: searchTerm,
        })
      }, 300) // Debounce de 300ms

      return () => clearTimeout(timeoutId)
    }
  }, [searchTerm, searchCategories])

  const handleEdit = (category: Categorie) => {
    setEditingCategory(category)
    setFormData({
      nom: category.nom,
      description: category.description,
    })
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingCategory(null)
    setFormData({ nom: "", description: "" })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nom.trim() || !formData.description.trim()) {
      toast.error("Veuillez remplir tous les champs")
      return
    }

    try {
      if (editingCategory) {
        await updateCategorie(editingCategory.id!, formData)
        toast.success("Catégorie modifiée avec succès")
      } else {
        await createCategorie(formData)
        toast.success("Catégorie créée avec succès")
      }

      setIsDialogOpen(false)
      setFormData({ nom: "", description: "" })
      refetch() // Recharger la liste
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue")
    }
  }

  const handleDelete = async (id: number, nom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${nom}" ?`)) {
      return
    }

    try {
      await deleteCategorie(id)
      toast.success("Catégorie supprimée avec succès")
      refetch() // Recharger la liste
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression")
    }
  }

  // Calcul des statistiques
  const totalCategories = allCategories.length
  const totalMedicaments = allCategories.reduce((sum, cat) => sum + (cat.medicaments?.length || 0), 0)
  const moyenneMedicaments = totalCategories > 0 ? Math.round(totalMedicaments / totalCategories) : 0
  const categorieImportante = allCategories.reduce(
    (max, cat) => ((cat.medicaments?.length || 0) > (max.medicaments?.length || 0) ? cat : max),
    allCategories[0] || { nom: "Aucune", medicaments: [] },
  )

  if (errorAll) {
    return (
      <PharmacienSidebar>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{errorAll}</p>
            <Button onClick={refetch} variant="outline">
              Réessayer
            </Button>
          </div>
        </div>
      </PharmacienSidebar>
    )
  }

  return (
    <PharmacienSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                <Tags className="h-8 w-8 text-white" />
              </div>
              Gestion des Catégories
            </h1>
            <p className="text-gray-600 mt-2">Organisez et gérez les catégories de médicaments</p>
          </div>
          <Button
            onClick={handleAdd}
            disabled={mutationLoading}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg"
          >
            {mutationLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Nouvelle Catégorie
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Total Catégories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">{totalCategories}</div>
              <p className="text-xs text-teal-600 mt-1">Catégories actives</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-700">Médicaments Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-900">{totalMedicaments}</div>
              <p className="text-xs text-cyan-600 mt-1">Tous médicaments</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Moyenne/Catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{moyenneMedicaments}</div>
              <p className="text-xs text-blue-600 mt-1">Médicaments par catégorie</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Plus Importante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-teal-900">{categorieImportante.nom}</div>
              <p className="text-xs text-teal-600 mt-1">{categorieImportante.medicaments?.length || 0} médicaments</p>
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
                  placeholder="Rechercher une catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Categories Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <Package className="h-5 w-5 text-teal-600" />
              Liste des Catégories
            </CardTitle>
            <CardDescription className="text-teal-600">
              {loading ? "Chargement..." : `${categories.length} catégorie(s) trouvée(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                      <TableHead className="font-semibold text-gray-700 py-4">ID</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Nom</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Description</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Médicaments</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700 py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category, index) => (
                      <TableRow
                        key={category.id}
                        className={`
                          hover:bg-teal-50/50 transition-all duration-200 border-b border-gray-100
                          ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                        `}
                      >
                        <TableCell className="font-medium text-gray-900 py-4">#{category.id}</TableCell>
                        <TableCell className="font-medium text-gray-900 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            {category.nom}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-gray-600 py-4">{category.description}</TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 font-medium">
                            {category.medicaments?.length || 0} médicaments
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(category)}
                              disabled={mutationLoading}
                              className="h-8 px-3 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Modifier
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(category.id!, category.nom)}
                              disabled={mutationLoading}
                              className="h-8 px-3 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Supprimer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Tags className="h-5 w-5 text-teal-600" />
                  {editingCategory ? "Modifier la Catégorie" : "Nouvelle Catégorie"}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory
                    ? "Modifiez les informations de la catégorie."
                    : "Ajoutez une nouvelle catégorie de médicaments."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nom">Nom de la catégorie *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Ex: Antalgiques"
                    className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description de la catégorie..."
                    className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                    rows={3}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={mutationLoading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={mutationLoading}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                >
                  {mutationLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {editingCategory ? "Modifier" : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PharmacienSidebar>
  )
}
