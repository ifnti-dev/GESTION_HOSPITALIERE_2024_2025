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
import type { Permission } from "@/types/utilisateur"
import { useAddPermission, useUpdatePermission } from "@/hooks/utilisateur/usePermission"

const permissionSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().optional(),
})

type PermissionFormValues = z.infer<typeof permissionSchema>

interface PermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  permission?: Permission | null
  onPermissionAdded?: () => void
  onPermissionUpdated?: () => void
}

export function PermissionDialog({
  open,
  onOpenChange,
  permission,
  onPermissionAdded,
  onPermissionUpdated,
}: PermissionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { add } = useAddPermission()
  const { update } = useUpdatePermission()

  const isEditing = !!permission

  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      nom: "",
      description: "",
    },
  })

  // Réinitialiser le formulaire quand la dialog s'ouvre/ferme ou quand la permission change
  useEffect(() => {
    if (open) {
      if (permission) {
        form.reset({
          nom: permission.nom || "",
          description: permission.description || "",
        })
      } else {
        form.reset({
          nom: "",
          description: "",
        })
      }
    }
  }, [open, permission, form])

  const onSubmit = async (values: PermissionFormValues) => {
    setIsSubmitting(true)
    try {
      if (isEditing && permission?.id) {
        await update({
          id: permission.id,
          nom: values.nom,
          description: values.description,
        })
        onPermissionUpdated?.()
      } else {
        await add({
          nom: values.nom,
          description: values.description,
        })
        onPermissionAdded?.()
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier la permission" : "Nouvelle permission"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations de la permission."
              : "Créez une nouvelle permission pour le système."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la permission *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: GERER_EMPLOYES, VOIR_RAPPORTS..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Nom unique de la permission (généralement en majuscules avec des underscores)
                  </FormDescription>
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
                      placeholder="Description de ce que permet cette permission..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Description optionnelle pour expliquer le rôle de cette permission</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (isEditing ? "Modification..." : "Création...") : isEditing ? "Modifier" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
