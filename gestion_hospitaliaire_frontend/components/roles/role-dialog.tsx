"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import type { Role } from "@/types/utilisateur"
import { useRole } from "@/hooks/utilisateur/useRole"
import { usePermissions } from "@/hooks/utilisateur/usePermission"

const roleSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
  permissions: z.array(z.number()).min(1, "Au moins une permission doit être sélectionnée"),
})

type RoleFormValues = z.infer<typeof roleSchema>

interface RoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: Role | null
  onRoleAdded?: () => void
  onRoleUpdated?: () => void
}

export function RoleDialog({ open, onOpenChange, role, onRoleAdded, onRoleUpdated }: RoleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addRole, updateRole } = useRole()
  const { permissions, loading: permissionsLoading } = usePermissions()

  const isEditing = !!role

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      nom: "",
      description: "",
      permissions: [],
    },
  })

  // Réinitialiser le formulaire quand la dialog s'ouvre/ferme ou quand le rôle change
  useEffect(() => {
    if (open) {
      if (role) {
        form.reset({
          nom: role.nom || "",
          description: role.description || "",
          permissions: role.permissions?.map((p) => p.id!).filter((id) => id !== undefined) || [],
        })
      } else {
        form.reset({
          nom: "",
          description: "",
          permissions: [],
        })
      }
    }
  }, [open, role, form])

  const onSubmit = async (values: RoleFormValues) => {
    setIsSubmitting(true)
    try {
      if (isEditing && role?.id) {
        await updateRole(role.id, {
          nom: values.nom,
          description: values.description,
          permissions: values.permissions,
        })
        onRoleUpdated?.()
      } else {
        await addRole({
          nom: values.nom,
          description: values.description,
          permissions: values.permissions,
        })
        onRoleAdded?.()
      }
      form.reset()
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier le rôle" : "Nouveau rôle"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations du rôle et ses permissions."
              : "Créez un nouveau rôle et assignez-lui des permissions."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du rôle *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Administrateur, Médecin, Infirmier..." {...field} />
                  </FormControl>
                  <FormDescription>Nom unique du rôle dans le système</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description du rôle et de ses responsabilités..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Description optionnelle du rôle</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissions"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Permissions *</FormLabel>
                    <FormDescription>Sélectionnez les permissions à associer à ce rôle</FormDescription>
                  </div>

                  {permissionsLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      ))}
                    </div>
                  ) : permissions.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Aucune permission disponible. Créez d'abord des permissions.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto border rounded-md p-4">
                      {permissions.map((permission) => (
                        <FormField
                          key={permission.id}
                          control={form.control}
                          name="permissions"
                          render={({ field }) => {
                            return (
                              <FormItem key={permission.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(permission.id!)}
                                    onCheckedChange={(checked) => {
                                      const currentValue = field.value || []
                                      if (checked) {
                                        field.onChange([...currentValue, permission.id!])
                                      } else {
                                        field.onChange(currentValue.filter((value) => value !== permission.id!))
                                      }
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">{permission.nom}</FormLabel>
                                  {permission.description && (
                                    <FormDescription className="text-xs">{permission.description}</FormDescription>
                                  )}
                                </div>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting || permissionsLoading}>
                {isSubmitting ? (isEditing ? "Modification..." : "Création...") : isEditing ? "Modifier" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
