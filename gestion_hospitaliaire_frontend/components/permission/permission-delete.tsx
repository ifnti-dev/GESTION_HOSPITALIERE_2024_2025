"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Permission } from "@/types/utilisateur"
import { useDeletePermission } from "@/hooks/utilisateur/usePermission"

interface PermissionDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  permission: Permission | null
  onPermissionDeleted: () => void
}

export function PermissionDeleteDialog({
  open,
  onOpenChange,
  permission,
  onPermissionDeleted,
}: PermissionDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { remove } = useDeletePermission()

  const handleDelete = async () => {
    if (!permission?.id) return

    setIsDeleting(true)
    try {
      await remove(permission.id)
      onPermissionDeleted()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!permission) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la permission</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer la permission <strong>"{permission.nom}"</strong> ?
            <br />
            <br />
            Cette action est irréversible et pourrait affecter les rôles qui utilisent cette permission.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
            {isDeleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
