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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import type { Employe } from "@/types/utilisateur"
import { useEmploye } from "@/hooks/utilisateur/useEmploye"
import { usePersonne } from "@/hooks/utilisateur/usePersonne"
import { useRole } from "@/hooks/utilisateur/useRole"

const employeSchema = z.object({
  horaire: z.string().min(1, "L'horaire est requis"),
  dateAffectation: z.string().min(1, "La date d'affectation est requise"),
  specialite: z.string().min(1, "La spécialité est requise"),
  numOrdre: z.string().min(1, "Le numéro d'ordre est requis"),
  personneId: z.number().min(1, "Une personne doit être sélectionnée"),
  roleIds: z.array(z.number()).min(1, "Au moins un rôle doit être sélectionné"),
})

type EmployeFormValues = z.infer<typeof employeSchema>

interface EmployeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employe?: Employe | null
  onEmployeAdded?: () => void
  onEmployeUpdated?: () => void
}

export function EmployeDialog({ open, onOpenChange, employe, onEmployeAdded, onEmployeUpdated }: EmployeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createEmploye, editEmploye } = useEmploye()
  const { personnes, loading: personnesLoading } = usePersonne()
  const { roles, loading: rolesLoading } = useRole()

  const isEditing = !!employe

  const form = useForm<EmployeFormValues>({
    resolver: zodResolver(employeSchema),
    defaultValues: {
      horaire: "",
      dateAffectation: "",
      specialite: "",
      numOrdre: "",
      personneId: 0,
      roleIds: [],
    },
  })

  // Réinitialiser le formulaire quand la dialog s'ouvre/ferme ou quand l'employé change
  useEffect(() => {
    if (open) {
      if (employe) {
        const personneId = typeof employe.personne === "object" ? employe.personne.id : employe.personne
        form.reset({
          horaire: employe.horaire || "",
          dateAffectation: employe.dateAffectation || "",
          specialite: employe.specialite || "",
          numOrdre: employe.numOrdre || "",
          personneId: personneId || 0,
          roleIds: employe.roles?.map((r) => r.id!).filter((id) => id !== undefined) || [],
        })
      } else {
        form.reset({
          horaire: "",
          dateAffectation: "",
          specialite: "",
          numOrdre: "",
          personneId: 0,
          roleIds: [],
        })
      }
    }
  }, [open, employe, form])

  const onSubmit = async (values: EmployeFormValues) => {
    setIsSubmitting(true)
    try {
      const employeData = {
        horaire: values.horaire,
        dateAffectation: values.dateAffectation,
        specialite: values.specialite,
        numOrdre: values.numOrdre,
        personneId: values.personneId,
        roleIds: values.roleIds,
      }

      if (isEditing && employe?.id) {
        await editEmploye(employe.id, employeData)
        onEmployeUpdated?.()
      } else {
        await createEmploye(employeData)
        onEmployeAdded?.()
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
          <DialogTitle>{isEditing ? "Modifier l'employé" : "Nouvel employé"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations de l'employé."
              : "Créez un nouvel employé en remplissant les informations ci-dessous."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="personneId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personne *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une personne" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {personnesLoading ? (
                        <div className="p-2">
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ) : personnes.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">Aucune personne disponible</div>
                      ) : (
                        personnes.map((personne) => (
                          <SelectItem key={personne.id} value={personne.id!.toString()}>
                            {personne.nom} {personne.prenom} - {personne.email}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>Sélectionnez la personne à associer à cet employé</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="specialite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spécialité *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Médecin généraliste" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numOrdre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro d'ordre *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: ORD001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="horaire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horaire *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 8h-17h" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateAffectation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'affectation *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="roleIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Rôles *</FormLabel>
                    <FormDescription>Sélectionnez les rôles à assigner à cet employé</FormDescription>
                  </div>

                  {rolesLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      ))}
                    </div>
                  ) : roles.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Aucun rôle disponible. Créez d'abord des rôles.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 max-h-40 overflow-y-auto border rounded-md p-4">
                      {roles.map((role) => (
                        <FormField
                          key={role.id}
                          control={form.control}
                          name="roleIds"
                          render={({ field }) => {
                            return (
                              <FormItem key={role.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(role.id!)}
                                    onCheckedChange={(checked) => {
                                      const currentValue = field.value || []
                                      if (checked) {
                                        field.onChange([...currentValue, role.id!])
                                      } else {
                                        field.onChange(currentValue.filter((value) => value !== role.id!))
                                      }
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">{role.nom}</FormLabel>
                                  {role.description && (
                                    <FormDescription className="text-xs">{role.description}</FormDescription>
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
              <Button type="submit" disabled={isSubmitting || rolesLoading || personnesLoading}>
                {isSubmitting ? (isEditing ? "Modification..." : "Création...") : isEditing ? "Modifier" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
