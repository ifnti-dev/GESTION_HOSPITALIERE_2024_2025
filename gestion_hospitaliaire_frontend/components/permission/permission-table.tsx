"use client"

import { useState } from "react"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PermissionDialog } from "./permission-dialog"
import { PermissionDetailsDialog } from "./permission-details-dialog"
import type { Permission } from "@/types/utilisateur"
import { PermissionDeleteDialog } from "./permission-delete"

interface PermissionTableProps {
  permissions: Permission[]
  loading: boolean
  onPermissionUpdated: () => void
  onPermissionDeleted: () => void
}

export function PermissionTable({
  permissions,
  loading,
  onPermissionUpdated,
  onPermissionDeleted,
}: PermissionTableProps) {
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission)
    setIsEditDialogOpen(true)
  }

  const handleViewDetails = (permission: Permission) => {
    setSelectedPermission(permission)
    setIsDetailsDialogOpen(true)
  }

  const handleDelete = (permission: Permission) => {
    setSelectedPermission(permission)
    setIsDeleteDialogOpen(true)
  }

  const handlePermissionUpdated = () => {
    onPermissionUpdated()
    setIsEditDialogOpen(false)
    setSelectedPermission(null)
  }

  const handlePermissionDeleted = () => {
    onPermissionDeleted()
    setIsDeleteDialogOpen(false)
    setSelectedPermission(null)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    )
  }

  if (permissions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucune permission trouvée</p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell className="font-medium">{permission.nom}</TableCell>
              <TableCell>
                {permission.description ? (
                  <span className="text-sm text-muted-foreground">
                    {permission.description.length > 50
                      ? `${permission.description.substring(0, 50)}...`
                      : permission.description}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground italic">Aucune description</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">Active</Badge>
              </TableCell>
              <TableCell>
                {permission.createdAt ? new Date(permission.createdAt).toLocaleDateString("fr-FR") : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Ouvrir le menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleViewDetails(permission)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir les détails
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(permission)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(permission)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialogs */}
      <PermissionDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        permission={selectedPermission}
        onPermissionUpdated={handlePermissionUpdated}
      />

      <PermissionDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        permission={selectedPermission}
      />

      <PermissionDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        permission={selectedPermission}
        onPermissionDeleted={handlePermissionDeleted}
      />
    </>
  )
}
