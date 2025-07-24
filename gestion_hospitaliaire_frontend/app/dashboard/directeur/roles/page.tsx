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
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Plus, Search, Filter, Eye, Edit, Trash2, Users, Lock, Loader2, AlertCircle } from "lucide-react"
import { useState, useCallback, useMemo } from "react"
import { useRole } from "@/hooks/utilisateur/useRole"
import { usePermissions } from "@/hooks/utilisateur/usePermission"
import type { Role, Permission } from "@/types/utilisateur"
import { toast } from "sonner"

// Composant de formulaire extrait pour éviter les re-renders
const RoleForm = ({
  formData,
  setFormData,
  permissions,
  loadingPermissions,
  errorPermissions,
}: {
  formData: { nom: string; description: string; permissions: number[] }
  setFormData: (data: { nom: string; description: string; permissions: number[] }) => void
  permissions: Permission[]
  loadingPermissions: boolean
  errorPermissions: any
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

  const handlePermissionChange = useCallback(
    (permissionId: number, checked: boolean) => {
      setFormData((prev) => ({
        ...prev,
        permissions: checked
          ? [...prev.permissions, permissionId]
          : prev.permissions.filter((id) => id !== permissionId),
      }))
    },
    [setFormData],
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom du rôle *</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={handleNomChange}
            placeholder="Ex: Médecin, Infirmier..."
            className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Description du rôle..."
            className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Permissions associées *</Label>
        {loadingPermissions ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
          </div>
        ) : errorPermissions ? (
          <div className="text-red-600 text-center p-4">Erreur lors du chargement des permissions</div>
        ) : (
          <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50">
            {permissions.map((permission) => {
              const isChecked = formData.permissions.includes(permission.id!);
              return (
                <div
                  key={permission.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border cursor-pointer
                    bg-white border-gray-200 hover:bg-gray-50"
                >
                  <Checkbox
                    id={`perm_${permission.id}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => handlePermissionChange(permission.id!, !!checked)}
                    className={`${isChecked ? 'border-blue-600 bg-blue-100' : ''}`}
                  />
                  <div className="grid gap-1.5 leading-none flex-1">
                    <label
                      htmlFor={`perm_${permission.id}`}
                      className={`text-sm font-medium leading-none cursor-pointer text-gray-900`}
                    >
                      {permission.nom}
                    </label>
                    <p className="text-xs text-gray-600">
                      {permission.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [roleToDelete, setRoleToDelete] = useState<{ id: number; nom: string } | null>(null)
  const [formData, setFormData] = useState({ nom: "", description: "", permissions: [] as number[] })

  // Hooks pour rôles et permissions
  const { roles, loading: loadingRoles, error: errorRoles, addRole, updateRole, deleteRole, refetch } = useRole()
  const { permissions, loading: loadingPermissions, error: errorPermissions } = usePermissions()

  // Filtrer les rôles selon le terme de recherche
  const filteredRoles = useMemo(
    () =>
      roles.filter(
        (role) =>
          role.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (role.permissions || []).some((perm) => perm.nom.toLowerCase().includes(searchTerm.toLowerCase())),
      ),
    [roles, searchTerm],
  )

  // Statistiques
  const stats = useMemo(() => {
    const totalRoles = roles.length
    const totalPermissions = permissions.length
    const totalEmployes = roles.reduce((acc, r) => {
      if (Array.isArray(r.employes)) {
        return acc + r.employes.length
      }
      return acc + (typeof r.employes === "number" ? r.employes : 0)
    }, 0)
    const roleImportant = roles.reduce(
      (max, role) => ((role.permissions?.length || 0) > (max.permissions?.length || 0) ? role : max),
      roles[0] || { nom: "Aucun", permissions: [] },
    )
    return { totalRoles, totalPermissions, totalEmployes, roleImportant }
  }, [roles, permissions])

  const handleAdd = useCallback(() => {
    setSelectedRole(null)
    setFormData({ nom: "", description: "", permissions: [] })
    setIsAddDialogOpen(true)
  }, [])

  const handleEdit = useCallback((role: Role) => {
    setSelectedRole(role)
    setFormData({
      nom: role.nom,
      description: role.description || "",
      permissions: (role.permissions || []).map((p) => p.id!).filter(Boolean),
    })
    setIsEditDialogOpen(true)
  }, [])

  const handleViewDetails = useCallback((role: Role) => {
    setSelectedRole(role)
    setIsDetailDialogOpen(true)
  }, [])

  const handleDelete = useCallback((id: number, nom: string) => {
    setRoleToDelete({ id, nom })
    setIsDeleteDialogOpen(true)
  }, [])

  const handleSubmit = useCallback(
    async (isEdit: boolean) => {
      if (!formData.nom.trim()) {
        toast.error("Le nom du rôle est requis")
        return
      }
      if (formData.permissions.length === 0) {
        toast.error("Veuillez sélectionner au moins une permission")
        return
      }

      try {
        const data = {
          nom: formData.nom,
          description: formData.description,
          permissions: formData.permissions,
        }

        if (isEdit && selectedRole) {
          await updateRole(selectedRole.id!, data)
          toast.success("Rôle modifié avec succès")
          setIsEditDialogOpen(false)
        } else {
          await addRole(data)
          toast.success("Rôle créé avec succès")
          setIsAddDialogOpen(false)
        }

        setFormData({ nom: "", description: "", permissions: [] })
        refetch()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Une erreur est survenue")
      }
    },
    [formData, selectedRole, addRole, updateRole, refetch],
  )

  const confirmDelete = useCallback(async () => {
    if (!roleToDelete) return

    try {
      await deleteRole(roleToDelete.id)
      toast.success("Rôle supprimé avec succès")
      refetch()
      setIsDeleteDialogOpen(false)
      setRoleToDelete(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression")
    }
  }, [roleToDelete, deleteRole, refetch])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  if (errorRoles) {
    return (
      <DashboardLayout userRole="Directeur">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{typeof errorRoles === "string" ? errorRoles : errorRoles.message}</p>
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
                <Shield className="h-8 w-8 text-white" />
              </div>
              Gestion des Rôles
            </h1>
            <p className="text-gray-600 mt-2">Gérez les rôles et leurs permissions</p>
          </div>
          <Button
            onClick={handleAdd}
            disabled={loadingRoles}
            className="bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 shadow-lg"
          >
            {loadingRoles ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Nouveau Rôle
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Total Rôles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.totalRoles}</div>
              <p className="text-xs text-slate-600 mt-1">Rôles actifs</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-slate-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Permissions Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalPermissions}</div>
              <p className="text-xs text-gray-600 mt-1">Permissions disponibles</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Employés Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.totalEmployes}</div>
              <p className="text-xs text-slate-600 mt-1">Employés assignés</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-slate-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Plus Important</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900">{stats.roleImportant.nom}</div>
              <p className="text-xs text-gray-600 mt-1">{stats.roleImportant.permissions?.length || 0} permissions</p>
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
                  placeholder="Rechercher un rôle..."
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

        {/* Roles Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Shield className="h-5 w-5 text-slate-600" />
              Liste des Rôles
            </CardTitle>
            <CardDescription className="text-slate-600">
              {loadingRoles ? "Chargement..." : `${filteredRoles.length} rôle(s) trouvé(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loadingRoles ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                      <TableHead className="font-semibold text-gray-700 py-4">ID</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Rôle</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Permissions</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Employés</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700 py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role, index) => (
                      <TableRow
                        key={role.id}
                        className={`
                          hover:bg-slate-50/50 transition-all duration-200 border-b border-gray-100
                          ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                        `}
                      >
                        <TableCell className="font-medium text-gray-900 py-4">#{role.id}</TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                              {role.nom}
                            </div>
                            <div className="text-xs text-gray-500">
                              Créé le {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : ""}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm text-slate-700">
                            {role.permissions?.length ?? 0} permission{(role.permissions?.length ?? 0) > 1 ? 's' : ''}
                          </span>
                        </TableCell>

                        {/* <TableCell className="py-4">
                          <div className="flex flex-wrap gap-1">
                            {(role.permissions ?? []).slice(0, 2).map((perm, idx) => (
                              <Badge
                                key={perm.id ?? idx}
                                variant="outline"
                                className="bg-slate-50 text-slate-700 border-slate-200"
                              >
                                {perm.nom}
                              </Badge>
                            ))}
                            {(role.permissions ?? []).length > 2 && (
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                +{(role.permissions ?? []).length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell> */}
                        
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="font-medium text-gray-900">{role.employes || 0}</span>
                            <span className="text-sm text-gray-500">employés</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDetails(role)}
                              className="h-8 w-8 p-0 hover:bg-green-100 rounded hover:text-green-700 transition-all duration-200"
                              title="Voir les détails"
                            >
                              <Eye className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(role)}
                              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                              title="Modifier le rôle"
                            >
                              <Edit className="h-4 w-4 text-blue-600"/>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(role.id!, role.nom)}
                              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                              title="Supprimer le rôle"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
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
                <Shield className="h-5 w-5 text-slate-600" />
                Nouveau Rôle
              </DialogTitle>
              <DialogDescription>Créez un nouveau rôle avec ses permissions associées.</DialogDescription>
            </DialogHeader>
            <RoleForm
              formData={formData}
              setFormData={setFormData}
              permissions={permissions}
              loadingPermissions={loadingPermissions}
              errorPermissions={errorPermissions}
            />
            <DialogFooter className="text-black">
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
                <Shield className="h-5 w-5 text-slate-600" />
                Modifier le Rôle
              </DialogTitle>
              <DialogDescription>
                Modifiez les informations et permissions du rôle {selectedRole?.nom}.
              </DialogDescription>
            </DialogHeader>
            <RoleForm
              formData={formData}
              setFormData={setFormData}
              permissions={permissions}
              loadingPermissions={loadingPermissions}
              errorPermissions={errorPermissions}
            />
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
                <Shield className="h-5 w-5" />
                Détails du rôle
              </DialogTitle>
            </DialogHeader>
            {selectedRole && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">ID</Label>
                    <p className="text-lg font-semibold">#{selectedRole.id}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Nom</Label>
                    <p className="text-lg font-semibold">{selectedRole.nom}</p>
                  </div>
                </div>

                {selectedRole.description && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRole.description}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Permissions associées</Label>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Lock className="h-5 w-5 text-slate-600" />
                      <span className="text-2xl font-bold text-slate-800">{selectedRole.permissions?.length || 0}</span>
                      <span className="text-slate-600">permissions</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(selectedRole.permissions || []).map((perm) => (
                        <Badge key={perm.id} variant="outline" className="bg-white text-slate-700 border-slate-200">
                          {perm.nom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Employés assignés</Label>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="text-2xl font-bold text-blue-800">{selectedRole.employesCount || 0}</span>
                      <span className="text-blue-600">employés</span>
                    </div>
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
                  if (selectedRole) handleEdit(selectedRole)
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
                Êtes-vous sûr de vouloir supprimer le rôle <strong>"{roleToDelete?.nom}"</strong> ?
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
