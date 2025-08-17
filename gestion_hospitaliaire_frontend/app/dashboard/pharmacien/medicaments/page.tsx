"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Search, Edit, Trash2, Eye, Loader2 } from "lucide-react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { useMedicaments, useMedicamentSearch, useMedicamentMutations } from "@/hooks/pharmacie/useMedicaments"
import { useCategories } from "@/hooks/pharmacie/useCategories"
import type { Medicament } from "@/types/pharmacie"
import { toast } from "sonner"

export default function MedicamentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMedicament, setEditingMedicament] = useState<Medicament | null>(null)
  const [selectedCategorieId, setSelectedCategorieId] = useState<string>("all")
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
  const [medicamentToDelete, setMedicamentToDelete] = useState<Medicament | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedMedicament, setSelectedMedicament] = useState<Medicament | null>(null)

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

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Rupture</span>
    }
    if (stock < 10) {
      return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">Stock Faible</span>
    }
    return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Disponible</span>
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

  const confirmDelete = async () => {
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

  const handleViewDetails = (medicament: Medicament) => {
    setSelectedMedicament(medicament)
    setIsDetailDialogOpen(true)
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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Médicaments</h1>
            <p className="text-gray-600">Gérez votre inventaire de médicaments</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
            disabled={mutationLoading}
          >
            <Plus className="h-4 w-4" />
            Nouveau Médicament
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500">Erreur: {error}</div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un médicament..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <select
                  value={selectedCategorieId}
                  onChange={(e) => setSelectedCategorieId(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id?.toString() || ""}>
                      {cat.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Liste des Médicaments</h3>
                <p className="text-sm text-gray-600">{filteredMedicaments.length} médicament(s) trouvé(s)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nom</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Catégorie</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stock</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedicaments.map((medicament, index) => (
                      <tr key={medicament.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{medicament.nom}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {medicament.categorie?.nom || "Non catégorisé"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-600 max-w-xs truncate">{medicament.description}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium">{medicament.stockTotal}</span>
                        </td>
                        <td className="px-4 py-3">{getStockStatus(medicament.stockTotal)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(medicament)}
                              className="p-1 text-green-600 hover:bg-green-100 rounded"
                              title="Voir les détails"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(medicament)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteConfirmation(medicament)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                              title="Supprimer"
                              disabled={mutationLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {isDialogOpen && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingMedicament ? "Modifier le Médicament" : "Nouveau Médicament"}
                </h2>
                <button onClick={() => setIsDialogOpen(false)} className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>
              <MedicamentForm
                medicament={editingMedicament}
                categories={categories || []}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={editingMedicament ? handleUpdate : handleCreate}
                loading={mutationLoading}
              />
            </div>
          </div>
        )}

        {isDeleteConfirmationOpen && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-red-600 mb-4">Confirmer la suppression</h2>
              <p className="text-gray-700 mb-6">
                Êtes-vous sûr de vouloir supprimer le médicament <strong>"{medicamentToDelete?.nom}"</strong> ?
                <br />
                <span className="text-red-600 font-medium">Cette action est irréversible.</span>
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsDeleteConfirmationOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  disabled={mutationLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={mutationLoading}
                >
                  {mutationLoading ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </div>
          </div>
        )}

        {isDetailDialogOpen && selectedMedicament && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Détails du médicament</h2>
                <button onClick={() => setIsDetailDialogOpen(false)} className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID</label>
                    <p className="text-lg font-semibold">#{selectedMedicament.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nom</label>
                    <p className="text-lg font-semibold">{selectedMedicament.nom}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Catégorie</label>
                  <p className="text-gray-700">{selectedMedicament.categorie?.nom || "Non catégorisé"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedMedicament.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Stock Total</label>
                    <p className="text-2xl font-bold text-gray-800">{selectedMedicament.stockTotal} unités</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Statut</label>
                    <div className="pt-2">{getStockStatus(selectedMedicament.stockTotal)}</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button
                  onClick={() => setIsDetailDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    setIsDetailDialogOpen(false)
                    if (selectedMedicament) handleEdit(selectedMedicament)
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        )}
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
      categorie: selectedCategorie,
    }

    if (medicament) {
      await onSubmit({ ...medicament, ...medicamentData })
    } else {
      await onSubmit(medicamentData)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du médicament *</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Paracétamol 1000mg"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
          <select
            value={categorieId}
            onChange={(e) => setCategorieId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id?.toString() || ""}>
                {cat.nom}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du médicament..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Total</label>
        <input
          type="number"
          value={stockTotal}
          onChange={(e) => setStockTotal(e.target.value)}
          placeholder="0"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          min="0"
        />
      </div>
      <div className="flex gap-2 justify-end pt-4">
        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Enregistrement..." : medicament ? "Modifier" : "Créer"}
        </button>
      </div>
    </div>
  )
}
