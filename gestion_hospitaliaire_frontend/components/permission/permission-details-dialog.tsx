"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Permission } from "@/types/utilisateur"

interface PermissionDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  permission: Permission | null
}

export function PermissionDetailsDialog({ open, onOpenChange, permission }: PermissionDetailsDialogProps) {
  if (!permission) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails de la permission</DialogTitle>
          <DialogDescription>Informations complètes sur la permission sélectionnée</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Nom de la permission</h4>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {permission.nom}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
              <p className="text-sm">
                {permission.description || (
                  <span className="text-muted-foreground italic">Aucune description fournie</span>
                )}
              </p>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Statut</h4>
              <Badge variant="secondary">Active</Badge>
            </div>
          </div>

          {/* Métadonnées */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Métadonnées</h4>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID:</span>
                <p className="font-mono">{permission.id}</p>
              </div>

              <div>
                <span className="text-muted-foreground">Date de création:</span>
                <p>{permission.createdAt ? new Date(permission.createdAt).toLocaleString("fr-FR") : "N/A"}</p>
              </div>

              <div>
                <span className="text-muted-foreground">Dernière modification:</span>
                <p>{permission.updatedAt ? new Date(permission.updatedAt).toLocaleString("fr-FR") : "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
