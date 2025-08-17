"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { useCategories, useCategorieMutations, useCategorieSearch } from "@/hooks/pharmacie/useCategories"
import { toast } from "sonner"
import type { Categorie } from "@/types/pharmacie"
import { Edit, Trash2 } from "lucide-react"

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Categorie | null>(null)
  const [formData, setFormData] = useState({ nom: "", description: "" })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: number; nom: string } | null>(null)

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
      }, 300)

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
      refetch()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue")
    }
  }

  const handleDelete = async (id: number, nom: string) => {
    setCategoryToDelete({ id, nom })
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!categoryToDelete) return

    try {
      await deleteCategorie(categoryToDelete.id)
      toast.success("Catégorie supprimée avec succès")
      refetch()
      setIsDeleteDialogOpen(false)
      setCategoryToDelete(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression")
    }
  }

  if (errorAll) {
    return (
      <PharmacienSidebar>
        <div className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{errorAll}</p>
            <button onClick={refetch} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Réessayer
            </button>
          </div>
        </div>
      </PharmacienSidebar>
    )
  }

  return (
    <PharmacienSidebar>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Catégories</h1>
          <p className="text-gray-600">Organisez et gérez les catégories de médicaments</p>
        </div>

        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAdd}
            disabled={mutationLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Nouvelle Catégorie
          </button>
        </div>

        <div className="bg-white border border-gray-300 rounded">
          <div className="p-4 border-b border-gray-300">
            <h2 className="text-lg font-semibold text-gray-900">Liste des Catégories</h2>
            <p className="text-gray-600">
              {loading ? "Chargement..." : `${categories.length} catégorie(s) trouvée(s)`}
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p>Chargement...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Nom</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Médicaments</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 font-medium text-gray-900">#{category.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{category.nom}</td>
                      <td className="px-4 py-3 text-gray-600">{category.description}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                          {category.medicaments?.length || 0} médicaments
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            disabled={mutationLoading}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id!, category.nom)}
                            disabled={mutationLoading}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {isDialogOpen && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-full max-w-md border border-gray-300 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                {editingCategory ? "Modifier la Catégorie" : "Nouvelle Catégorie"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la catégorie *</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Ex: Antalgiques"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description de la catégorie..."
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={mutationLoading}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={mutationLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {editingCategory ? "Modifier" : "Créer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isDeleteDialogOpen && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-full max-w-md border border-gray-300 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-red-600">Confirmer la suppression</h2>
              <p className="mb-6">
                Êtes-vous sûr de vouloir supprimer la catégorie <strong>"{categoryToDelete?.nom}"</strong> ?
                <br />
                <span className="text-red-600 font-medium">Cette action est irréversible.</span>
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={mutationLoading}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={mutationLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {mutationLoading ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PharmacienSidebar>
  )
}
