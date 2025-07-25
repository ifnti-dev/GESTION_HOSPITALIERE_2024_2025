"use client"

import React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePermissions } from "@/hooks/utilisateur/usePermission"
import { PermissionSearchFilters } from "@/components/permission/permision-search-filters"
import { PermissionTable } from "@/components/permission/permission-table"
import { PermissionDialog } from "@/components/permission/permission-dialog"


export default function PermissionsPage() {
  const { permissions, loading, error, refetch } = usePermissions()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filteredPermissions, setFilteredPermissions] = useState(permissions)

  // Mettre à jour les permissions filtrées quand les permissions changent
  React.useEffect(() => {
    setFilteredPermissions(permissions)
  }, [permissions])

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredPermissions(permissions)
      return
    }

    const filtered = permissions.filter(
      (permission) =>
        permission.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredPermissions(filtered)
  }

  const handlePermissionAdded = () => {
    refetch()
    setIsDialogOpen(false)
  }

  const handlePermissionUpdated = () => {
    refetch()
  }

  const handlePermissionDeleted = () => {
    refetch()
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">Erreur lors du chargement des permissions: {error.message}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Permissions</h1>
          <p className="text-muted-foreground">
            Gérez les permissions du système et contrôlez l'accès aux fonctionnalités
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Permission
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
            <p className="text-xs text-muted-foreground">Permissions configurées dans le système</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avec Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {permissions.filter((p) => p.description && p.description.trim() !== "").length}
            </div>
            <p className="text-xs text-muted-foreground">Permissions documentées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résultats Filtrés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPermissions.length}</div>
            <p className="text-xs text-muted-foreground">Permissions affichées actuellement</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres de recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche et Filtres</CardTitle>
          <CardDescription>Recherchez des permissions par nom ou description</CardDescription>
        </CardHeader>
        <CardContent>
          <PermissionSearchFilters onSearch={handleSearch} />
        </CardContent>
      </Card>

      {/* Table des permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Permissions</CardTitle>
          <CardDescription>{filteredPermissions.length} permission(s) trouvée(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <PermissionTable
            permissions={filteredPermissions}
            loading={loading}
            onPermissionUpdated={handlePermissionUpdated}
            onPermissionDeleted={handlePermissionDeleted}
          />
        </CardContent>
      </Card>

      {/* Dialog d'ajout */}
      <PermissionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onPermissionAdded={handlePermissionAdded} />
    </div>
  )
}
