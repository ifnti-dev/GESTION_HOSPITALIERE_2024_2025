"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { BookOpen, Plus, Search, Edit, Trash2, Package, Filter, Eye, Link, Loader2 } from "lucide-react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { useReferences, useReferenceSearch, useReferenceMutations } from "@/hooks/useReferences"
import type { Reference } from "@/types/pharmacie"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ReferencesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReference, setEditingReference] = useState<Reference | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [referenceToDelete, setReferenceToDelete] = useState<Reference | null>(null)

  const { references, loading, error, refetch } = useReferences()
  const { search, references: searchResults, loading: searchLoading } = useReferenceSearch()
  const { createReference, updateReference, deleteReference, loading: mutationLoading } = useReferenceMutations()

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchTerm.trim()) {
        search({ nom: searchTerm.trim() })
      }
    }, 500)

    return () => {
      clearTimeout(timerId)
    }
  }, [searchTerm]) // Supprimer 'search' des dépendances

  const handleCreate = async (data: Omit<Reference, "id">) => {
    try {
      await createReference(data)
      setIsDialogOpen(false)
      refetch()
      toast.success("Référence créée avec succès!")
    } catch (err: any) {
      toast.error(`Erreur lors de la création de la référence: ${err?.message || "Unknown error"}`)
    }
  }

  const handleUpdate = async (id: number, data: Omit<Reference, "id">) => {
    try {
      await updateReference(id, data)
      setIsDialogOpen(false)
      refetch()
      toast.success("Référence mise à jour avec succès!")
    } catch (err: any) {
      toast.error(`Erreur lors de la mise à jour de la référence: ${err?.message || "Unknown error"}`)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteReference(id)
      setIsDeleteDialogOpen(false)
      refetch()
      toast.success("Référence supprimée avec succès!")
    } catch (err: any) {
      toast.error(`Erreur lors de la suppression de la référence: ${err?.message || "Unknown error"}`)
    }
  }

  // Utiliser les résultats de recherche seulement si on a un terme de recherche
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

  const totalReferences = references?.length || 0
  const totalMedicamentReferences =
    references?.reduce((sum, ref) => sum + (ref.medicamentReferences?.length || 0), 0) || 0

  return (
    <PharmacienSidebar>
      {/* Reste du JSX identique */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              Gestion des Références
            </h1>
            <p className="text-gray-600 mt-2">Organisez les références pharmaceutiques</p>
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
                Nouvelle Référence
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">Erreur: {error}</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-teal-700">Total Références</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-teal-900">{totalReferences}</div>
                  <p className="text-xs text-teal-600 mt-1">Références actives</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-teal-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Associations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{totalMedicamentReferences}</div>
                  <p className="text-xs text-blue-600 mt-1">Médicament-Référence</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Moyenne</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">
                    {totalReferences > 0 ? Math.round(totalMedicamentReferences / totalReferences) : 0}
                  </div>
                  <p className="text-xs text-green-600 mt-1">Associations par référence</p>
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
                      placeholder="Rechercher une référence..."
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

            {/* References Table */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
                <CardTitle className="flex items-center gap-2 text-teal-800">
                  <Package className="h-5 w-5 text-teal-600" />
                  Liste des Références
                </CardTitle>
                <CardDescription className="text-teal-600">
                  {filteredReferences?.length || 0} référence(s) trouvée(s)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                        <TableHead className="font-semibold text-gray-700 py-4">Nom</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">Description</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">Associations</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700 py-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReferences?.map((reference, index) => (
                        <TableRow
                          key={reference.id}
                          className={`
                        hover:bg-teal-50/50 transition-all duration-200 border-b border-gray-100
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                      `}
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <Link className="h-4 w-4 text-teal-600" />
                              <span className="font-medium font-mono text-gray-900">{reference.nom}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-gray-600 py-4">
                            {reference.description}
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 font-medium">
                              {reference.medicamentReferences?.length || 0} associations
                            </Badge>
                          </TableCell>
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
                                onClick={() => handleEdit(reference)}
                                className="h-8 px-3 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Modifier
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteConfirmation(reference)}
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
              </CardContent>
            </Card>
          </>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal-600" />
                {editingReference ? "Modifier la Référence" : "Nouvelle Référence"}
              </DialogTitle>
              <DialogDescription>
                {editingReference
                  ? "Modifiez les informations de la référence."
                  : "Ajoutez une nouvelle référence pharmaceutique."}
              </DialogDescription>
            </DialogHeader>
            <ReferenceForm
              editingReference={editingReference}
              onClose={() => setIsDialogOpen(false)}
              onSubmit={editingReference ? handleUpdate : handleCreate}
              loading={mutationLoading}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Supprimer la Référence</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer la référence "{referenceToDelete?.nom}" ? Cette action est
                irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (referenceToDelete?.id) {
                    handleDelete(referenceToDelete.id)
                  }
                }}
                disabled={mutationLoading}
              >
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

interface ReferenceFormProps {
  editingReference: Reference | null
  onClose: () => void
  onSubmit: (
    id: number,
    data: Omit<Reference, "id">,
  ) => Promise<void> | ((data: Omit<Reference, "id">) => Promise<void>)
  loading: boolean
}

const ReferenceForm: React.FC<ReferenceFormProps> = ({ editingReference, onClose, onSubmit, loading }) => {
  const [nom, setNom] = useState(editingReference?.nom || "")
  const [description, setDescription] = useState(editingReference?.description || "")
  const isUpdate = !!editingReference

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = { nom, description }
    if (editingReference?.id) {
      await onSubmit(editingReference.id, data)
    } else {
      await onSubmit(data)
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="nom">Nom de la référence</Label>
          <Input
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: REF-ANALG-001"
            className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description de la référence..."
            className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
            rows={3}
            required
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isUpdate ? "Mise à jour..." : "Création..."}
            </>
          ) : isUpdate ? (
            "Modifier"
          ) : (
            "Créer"
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}