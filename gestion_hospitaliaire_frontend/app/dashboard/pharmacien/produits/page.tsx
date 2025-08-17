"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
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
import { Package2, Plus, Search, Edit, Trash2, Loader2, Eye } from "lucide-react"

export default function ProduitsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduit, setEditingProduit] = useState<MedicamentReference | null>(null)
  const [selectedMedicamentId, setSelectedMedicamentId] = useState<string>("all")
  const [selectedReferenceId, setSelectedReferenceId] = useState<string>("all")
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
  const [produitToDelete, setProduitToDelete] = useState<MedicamentReference | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedProduit, setSelectedProduit] = useState<MedicamentReference | null>(null)

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
      const timer = setTimeout(() => {
        // Pour l'instant, on filtre côté client
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [searchTerm])

  const getQuantiteStatus = (quantite: number) => {
    if (quantite === 0) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">Épuisé</span>
    }
    if (quantite < 5) {
      return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">Stock Faible</span>
    }
    return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Disponible</span>
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

  const confirmDelete = async () => {
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

  const handleViewDetails = (produit: MedicamentReference) => {
    setSelectedProduit(produit)
    setIsDetailDialogOpen(true)
  }

  return (
    <PharmacienSidebar>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package2 className="h-6 w-6 text-gray-600" />
              Produits Finaux
            </h1>
            <p className="text-gray-600 mt-1">Gérez vos produits finaux (Médicament + Référence)</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
            disabled={mutationLoading}
          >
            <Plus className="h-4 w-4" />
            Nouveau Produit
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
            <div className="bg-white p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={selectedMedicamentId}
                  onChange={(e) => setSelectedMedicamentId(e.target.value)}
                  className="w-48 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les médicaments</option>
                  {medicaments?.map((med) => (
                    <option key={med.id} value={med.id?.toString() || ""}>
                      {med.nom}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedReferenceId}
                  onChange={(e) => setSelectedReferenceId(e.target.value)}
                  className="w-48 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Toutes les références</option>
                  {references?.map((ref) => (
                    <option key={ref.id} value={ref.id?.toString() || ""}>
                      {ref.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">Liste des Produits ({filteredProduits.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Médicament</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Référence</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantité</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProduits.map((produit, index) => (
                      <tr key={produit.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">{produit.medicament?.nom}</div>
                            <div className="text-sm text-gray-500">{produit.medicament?.categorie?.nom}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">{produit.reference?.nom}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {produit.reference?.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-gray-900">{produit.quantite}</span>
                        </td>
                        <td className="px-4 py-3">{getQuantiteStatus(produit.quantite)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleViewDetails(produit)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded"
                              title="Voir détails"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(produit)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteConfirmation(produit)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded"
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
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package2 className="h-5 w-5 text-gray-600" />
                  <h2 className="text-xl font-semibold">
                    {editingProduit ? "Modifier le Produit" : "Nouveau Produit Final"}
                  </h2>
                </div>
                <ProduitForm
                  produit={editingProduit}
                  medicaments={medicaments || []}
                  references={references || []}
                  onClose={() => setIsDialogOpen(false)}
                  onSubmit={editingProduit ? handleUpdate : handleCreate}
                  loading={mutationLoading}
                />
              </div>
            </div>
          </div>
        )}

        {isDeleteConfirmationOpen && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4 text-red-600">
                  <Trash2 className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Confirmer la suppression</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Êtes-vous sûr de vouloir supprimer ce produit final ?
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
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
                    disabled={mutationLoading}
                  >
                    {mutationLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Suppression...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isDetailDialogOpen && selectedProduit && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Package2 className="h-5 w-5 text-gray-600" />
                  <h2 className="text-xl font-semibold">Détails du produit final</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">ID</label>
                      <p className="text-lg font-semibold">#{selectedProduit.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Quantité</label>
                      <p className="text-lg font-semibold">{selectedProduit.quantite} unités</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Médicament</label>
                    <div className="bg-gray-50 p-3 rounded mt-1">
                      <p className="font-semibold">{selectedProduit.medicament?.nom}</p>
                      <p className="text-sm text-gray-600">{selectedProduit.medicament?.categorie?.nom}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Référence</label>
                    <div className="bg-gray-50 p-3 rounded mt-1">
                      <p className="font-semibold">{selectedProduit.reference?.nom}</p>
                      <p className="text-sm text-gray-600">{selectedProduit.reference?.description}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Statut</label>
                    <div className="mt-1">{getQuantiteStatus(selectedProduit.quantite)}</div>
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
                      if (selectedProduit) handleEdit(selectedProduit)
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="medicament">Médicament *</Label>
          <select
            value={medicamentId}
            onChange={(e) => setMedicamentId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner un médicament</option>
            {medicaments.map((med) => (
              <option key={med.id} value={med.id?.toString() || ""}>
                {med.nom} - {med.categorie?.nom}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="reference">Référence *</Label>
          <select
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner une référence</option>
            {references.map((ref) => (
              <option key={ref.id} value={ref.id?.toString() || ""}>
                {ref.nom}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="quantite">Quantité</Label>
        <input
          id="quantite"
          type="number"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
          placeholder="0"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : produit ? (
            "Modifier"
          ) : (
            "Créer"
          )}
        </button>
      </div>
    </div>
  )
}
