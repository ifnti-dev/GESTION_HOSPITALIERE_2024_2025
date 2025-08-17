"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { BookOpen, Plus, Search, Edit, Trash2, Loader2, AlertCircle, Eye } from "lucide-react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { useReferences, useReferenceSearch, useReferenceMutations } from "@/hooks/pharmacie/useReferences"
import type { Reference } from "@/types/pharmacie"
import { toast } from "sonner"

export default function ReferencesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReference, setEditingReference] = useState<Reference | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [referenceToDelete, setReferenceToDelete] = useState<Reference | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null)

  const { references, loading, error, refetch } = useReferences()
  const { search, references: searchResults, loading: searchLoading } = useReferenceSearch()
  const { createReference, updateReference, deleteReference, loading: mutationLoading } = useReferenceMutations()

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchTerm.trim()) {
        search({ nom: searchTerm.trim() })
      }
    }, 500)

    return () => {
      clearTimeout(timerId)
    }
  }, [searchTerm])

  const filteredReferences = searchTerm.trim() && searchResults ? searchResults : references

  const handleEdit = (reference: Reference) => {
    setEditingReference(reference)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingReference(null)
    setIsDialogOpen(true)
  }

  const handleDeleteConfirmation = (reference: Reference) => {
    setReferenceToDelete(reference)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!referenceToDelete?.id) return

    try {
      await deleteReference(referenceToDelete.id)
      setIsDeleteDialogOpen(false)
      setReferenceToDelete(null)
      refetch()
      toast.success("Référence supprimée avec succès!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression")
    }
  }

  const handleViewDetails = (reference: Reference) => {
    setSelectedReference(reference)
    setIsDetailDialogOpen(true)
  }

  return (
    <PharmacienSidebar>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-gray-600" />
              Gestion des Références
            </h1>
            <p className="text-gray-600 mt-1">Organisez les références pharmaceutiques</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
            disabled={mutationLoading}
          >
            {mutationLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Nouvelle Référence
              </>
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">Erreur: {error}</div>
        ) : (
          <>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher une référence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Liste des Références</h3>
                <p className="text-sm text-gray-600">{filteredReferences?.length || 0} référence(s) trouvée(s)</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Associations
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReferences?.map((reference, index) => (
                      <tr key={reference.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">{reference.nom}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600 max-w-xs truncate block">{reference.description}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {reference.medicamentReferences?.length || 0} associations
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(reference)}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Voir les détails"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(reference)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteConfirmation(reference)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Supprimer"
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
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-gray-600" />
                  {editingReference ? "Modifier la Référence" : "Nouvelle Référence"}
                </h3>
              </div>
              <ReferenceForm
                editingReference={editingReference}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={
                  editingReference
                    ? (id: number, data: Omit<Reference, "id">) => updateReference(id, data).then(() => refetch())
                    : (data: Omit<Reference, "id">) => createReference(data).then(() => refetch())
                }
                loading={mutationLoading}
              />
            </div>
          </div>
        )}

        {isDeleteDialogOpen && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Confirmer la suppression
                </h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-600">
                  Êtes-vous sûr de vouloir supprimer la référence <strong>"{referenceToDelete?.nom}"</strong> ?
                  <br />
                  <span className="text-red-600 font-medium">Cette action est irréversible.</span>
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
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
        )}

        {isDetailDialogOpen && selectedReference && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-gray-600" />
                  Détails de la référence
                </h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID</label>
                    <p className="text-lg font-semibold">#{selectedReference.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nom</label>
                    <p className="text-lg font-semibold">{selectedReference.nom}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedReference.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Associations</label>
                  <div className="bg-gray-50 p-4 rounded">
                    <span className="text-2xl font-bold text-gray-800">
                      {selectedReference.medicamentReferences?.length || 0}
                    </span>
                    <span className="text-gray-600 ml-2">associations avec des médicaments</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => setIsDetailDialogOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    setIsDetailDialogOpen(false)
                    if (selectedReference) handleEdit(selectedReference)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
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

interface ReferenceFormProps {
  editingReference: Reference | null
  onClose: () => void
  onSubmit: any
  loading: boolean
}

const ReferenceForm: React.FC<ReferenceFormProps> = ({ editingReference, onClose, onSubmit, loading }) => {
  const [nom, setNom] = useState(editingReference?.nom || "")
  const [description, setDescription] = useState(editingReference?.description || "")
  const isUpdate = !!editingReference

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = { nom, description }
    try {
      if (editingReference?.id) {
        await onSubmit(editingReference.id, data)
      } else {
        await onSubmit(data)
      }
      toast.success(isUpdate ? "Référence mise à jour avec succès!" : "Référence créée avec succès!")
      onClose()
    } catch (err: any) {
      toast.error(`Erreur: ${err?.message || "Unknown error"}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="px-6 py-4 space-y-4">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la référence *
          </label>
          <input
            id="nom"
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: REF-ANALG-001"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description de la référence..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>
      </div>
      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isUpdate ? "Mise à jour..." : "Création..."}
            </>
          ) : isUpdate ? (
            "Modifier"
          ) : (
            "Créer"
          )}
        </button>
      </div>
    </form>
  )
}
