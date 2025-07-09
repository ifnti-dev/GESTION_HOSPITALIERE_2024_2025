"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Lock, Plus, Search, Filter, Eye, Edit, Trash2, FileText, Loader2, AlertCircle } from "lucide-react"
import { useState, useCallback, useMemo } from "react"
import {
  usePermissions,
  useAddPermission,
  useUpdatePermission,
  useDeletePermission,
} from "@/hooks/utilisateur/usePermission"
import type { Permission } from "@/types/utilisateur"
import { toast } from "sonner"

// Composant de formulaire extrait pour éviter les re-renders
const PermissionForm = ({
  formData,
  setFormData,
}: {
  formData: { nom: string; description: string }
  setFormData: (data: { nom: string; description: string }) => void
}) => {
  const handleNomChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, nom: e.target.value }))
    },
    [setFormData],
  )

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, description: e.target.value }))
    },
    [setFormData],
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom de la permission *</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={handleNomChange}
            placeholder="Ex: Consulter patients, Gérer stock..."
            className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Description détaillée de la permission..."
            className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
            rows={4}
          />
        </div>
      </div>
    </div>
  )
}

export default function PermissionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [permissionToDelete, setPermissionToDelete] = useState<{ id: number; nom: string } | null>(null)
  const [formData, setFormData] = useState({ nom: "", description: "" })

  const { permissions, loading, error, refetch } = usePermissions()
  const { add } = useAddPermission()
  const { update } = useUpdatePermission()
  const { remove } = useDeletePermission()

  // Filtrer les permissions selon le terme de recherche
  const filteredPermissions = useMemo(
    () =>
      permissions.filter(
        (permission) =>
          permission.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (permission.description || "").toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [permissions, searchTerm],
  )

  // Statistiques
  const stats = useMemo(() => {
    const totalPermissions = permissions.length
    const withDescription = permissions.filter((p) => p.description && p.description.trim()).length
    const withoutDescription = totalPermissions - withDescription
    const avgDescriptionLength =
      withDescription > 0
        ? Math.round(permissions.reduce((acc, p) => acc + (p.description?.length || 0), 0) / withDescription)
        : 0
    return { totalPermissions, withDescription, withoutDescription, avgDescriptionLength }
  }, [permissions])

  const handleAdd = useCallback(() => {
    setSelectedPermission(null)
    setFormData({ nom: "", description: "" })
    setIsAddDialogOpen(true)
  }, [])

  const handleEdit = useCallback((permission: Permission) => {
    setSelectedPermission(permission)
    setFormData({
      nom: permission.nom,
      description: permission.description || "",
    })
    setIsEditDialogOpen(true)
  }, [])

  const handleViewDetails = useCallback((permission: Permission) => {
    setSelectedPermission(permission)
    setIsDetailDialogOpen(true)
  }, [])

  const handleDelete = useCallback((id: number, nom: string) => {
    setPermissionToDelete({ id, nom })
    setIsDeleteDialogOpen(true)
  }, [])

  const handleSubmit = useCallback(
    async (isEdit: boolean) => {
      if (!formData.nom.trim()) {
        toast.error("Le nom de la permission est requis")
        return
      }

      try {
        if (isEdit && selectedPermission) {
          await update({ ...selectedPermission, ...formData })
          toast.success("Permission modifiée avec succès")
          setIsEditDialogOpen(false)
        } else {
          await add(formData)
          toast.success("Permission créée avec succès")
          setIsAddDialogOpen(false)
        }

        setFormData({ nom: "", description: "" })
        refetch()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Une erreur est survenue")
      }
    },
    [formData, selectedPermission, add, update, refetch],
  )

  const confirmDelete = useCallback(async () => {
    if (!permissionToDelete) return

    try {
      await remove(permissionToDelete.id)
      toast.success("Permission supprimée avec succès")
      refetch()
      setIsDeleteDialogOpen(false)
      setPermissionToDelete(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression")
    }
  }, [permissionToDelete, remove, refetch])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  if (error) {
    return (
      <DashboardLayout userRole="Directeur">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{typeof error === "string" ? error : error.message}</p>
            <Button onClick={refetch} variant="outline">
              Réessayer
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="Directeur">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-slate-500 to-gray-600 rounded-xl shadow-lg">
                <Lock className="h-8 w-8 text-white" />
              </div>
              Gestion des Permissions
            </h1>
            <p className="text-gray-600 mt-2">Gérez les permissions et droits d'accès</p>
          </div>
          <Button
            onClick={handleAdd}
            disabled={loading}
            className="bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 shadow-lg"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Nouvelle Permission
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Total Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.totalPermissions}</div>
              <p className="text-xs text-slate-600 mt-1">Permissions actives</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-slate-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Avec Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.withDescription}</div>
              <p className="text-xs text-gray-600 mt-1">Permissions documentées</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Sans Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.withoutDescription}</div>
              <p className="text-xs text-slate-600 mt-1">À documenter</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-slate-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Moy. Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.avgDescriptionLength}</div>
              <p className="text-xs text-gray-600 mt-1">caractères</p>
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
                  placeholder="Rechercher une permission..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                />
              </div>
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Permissions Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Lock className="h-5 w-5 text-slate-600" />
              Liste des Permissions
            </CardTitle>
            <CardDescription className="text-slate-600">
              {loading ? "Chargement..." : `${filteredPermissions.length} permission(s) trouvée(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                      <TableHead className="font-semibold text-gray-700 py-4">ID</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Permission</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Description</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Statut</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700 py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermissions.map((permission, index) => (
                      <TableRow
                        key={permission.id}
                        className={`
                          hover:bg-slate-50/50 transition-all duration-200 border-b border-gray-100
                          ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                        `}
                      >
                        <TableCell className="font-medium text-gray-900 py-4">#{permission.id}</TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                              {permission.nom}
                            </div>
                            <div className="text-xs text-gray-500">
                              Créé le {permission.createdAt ? new Date(permission.createdAt).toLocaleDateString() : ""}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 max-w-xs">
                          {permission.description ? (
                            <p className="text-sm text-gray-600 truncate" title={permission.description}>
                              {permission.description}
                            </p>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Aucune description</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          {permission.description ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <FileText className="h-3 w-3 mr-1" />
                              Documentée
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              À documenter
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDetails(permission)}
                              className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-700 transition-all duration-200"
                              title="Voir les détails"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(permission)}
                              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                              title="Modifier la permission"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(permission.id!, permission.nom)}
                              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                              title="Supprimer la permission"
                            >
                              <Trash2 className="h-4 w-4" />
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

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-slate-600" />
                Nouvelle Permission
              </DialogTitle>
              <DialogDescription>Créez une nouvelle permission avec sa description.</DialogDescription>
            </DialogHeader>
            <PermissionForm formData={formData} setFormData={setFormData} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                className="bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800"
              >
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-slate-600" />
                Modifier la Permission
              </DialogTitle>
              <DialogDescription>
                Modifiez les informations de la permission {selectedPermission?.nom}.
              </DialogDescription>
            </DialogHeader>
            <PermissionForm formData={formData} setFormData={setFormData} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={() => handleSubmit(true)}
                className="bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800"
              >
                Sauvegarder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-slate-600">
                <Lock className="h-5 w-5" />
                Détails de la permission
              </DialogTitle>
            </DialogHeader>
            {selectedPermission && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">ID</Label>
                    <p className="text-lg font-semibold">#{selectedPermission.id}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Nom</Label>
                    <p className="text-lg font-semibold">{selectedPermission.nom}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Description</Label>
                  {selectedPermission.description ? (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedPermission.description}</p>
                  ) : (
                    <p className="text-gray-400 bg-gray-50 p-3 rounded-lg italic">Aucune description fournie</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Statut de documentation</Label>
                  <div className={`p-4 rounded-lg ${selectedPermission.description ? "bg-green-50" : "bg-orange-50"}`}>
                    <div className="flex items-center gap-2">
                      {selectedPermission.description ? (
                        <>
                          <FileText className="h-5 w-5 text-green-600" />
                          <span className="text-lg font-bold text-green-800">Documentée</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                          <span className="text-lg font-bold text-orange-800">À documenter</span>
                        </>
                      )}
                    </div>
                    <p
                      className={`text-sm mt-1 ${selectedPermission.description ? "text-green-600" : "text-orange-600"}`}
                    >
                      {selectedPermission.description
                        ? `Description de ${selectedPermission.description.length} caractères`
                        : "Ajoutez une description pour clarifier cette permission"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                Fermer
              </Button>
              <Button
                onClick={() => {
                  setIsDetailDialogOpen(false)
                  if (selectedPermission) handleEdit(selectedPermission)
                }}
                className="bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Confirmer la suppression
              </DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer la permission <strong>"{permissionToDelete?.nom}"</strong> ?
                <br />
                <span className="text-red-600 font-medium">Cette action est irréversible.</span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
