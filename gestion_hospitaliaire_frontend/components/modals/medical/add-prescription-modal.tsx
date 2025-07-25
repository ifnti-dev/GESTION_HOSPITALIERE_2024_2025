"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Pill, TestTube, Plus, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { CreatePrescriptionPrenatalePayload, TypePrescription } from "@/types/consultstionsTraitement"
import { prescriptionPrenataleService } from "@/services/consultationTraitement/prescriptionPrenataleService"
import { toast } from "sonner"

interface AddPrescriptionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  consultationId: number
  onPrescriptionAdded: () => void
}

export function AddPrescriptionModal({
  isOpen,
  onOpenChange,
  consultationId,
  onPrescriptionAdded,
}: AddPrescriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreatePrescriptionPrenatalePayload>({
    type: "MEDICAMENT" as TypePrescription,
    designation: "",
    instructions: "",
    commentaire: "",
    dateDebut: null,
    dateFin: null,
    // Champs médicaments
    posologie: "",
    quantiteParJour: null,
    dureeJours: null,
    // Champs examens
    datePrevue: null,
    lieuRealisation: "",
    consultationPrenatale: { id: consultationId },
  })

  const [dateDebut, setDateDebut] = useState<Date>()
  const [dateFin, setDateFin] = useState<Date>()
  const [datePrevue, setDatePrevue] = useState<Date>()

  const resetForm = () => {
    setFormData({
      type: "MEDICAMENT" as TypePrescription,
      designation: "",
      instructions: "",
      commentaire: "",
      dateDebut: null,
      dateFin: null,
      posologie: "",
      quantiteParJour: null,
      dureeJours: null,
      datePrevue: null,
      lieuRealisation: "",
      consultationPrenatale: { id: consultationId },
    })
    setDateDebut(undefined)
    setDateFin(undefined)
    setDatePrevue(undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.designation.trim()) {
      toast.error("La désignation est obligatoire")
      return
    }

    if (formData.type === "MEDICAMENT" && !formData.posologie?.trim()) {
      toast.error("La posologie est obligatoire pour un médicament")
      return
    }

    if (formData.type === "EXAMEN" && !datePrevue) {
      toast.error("La date prévue est obligatoire pour un examen")
      return
    }

    try {
      setIsLoading(true)

      const payload: CreatePrescriptionPrenatalePayload = {
        ...formData,
        dateDebut: dateDebut ? format(dateDebut, "yyyy-MM-dd") : null,
        dateFin: dateFin ? format(dateFin, "yyyy-MM-dd") : null,
        datePrevue: datePrevue ? format(datePrevue, "yyyy-MM-dd") : null,
      }

      await prescriptionPrenataleService.create(payload)

      toast.success("Prescription ajoutée avec succès")
      resetForm()
      onPrescriptionAdded()
      onOpenChange(false)
    } catch (error) {
      console.error("Erreur lors de l'ajout de la prescription:", error)
      toast.error("Erreur lors de l'ajout de la prescription")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTypeChange = (type: TypePrescription) => {
    setFormData((prev) => ({
      ...prev,
      type,
      // Reset type-specific fields
      posologie: "",
      quantiteParJour: null,
      dureeJours: null,
      datePrevue: null,
      lieuRealisation: "",
    }))
    setDatePrevue(undefined)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-6 w-6 text-blue-600" />
            Ajouter une Prescription
          </DialogTitle>
          <DialogDescription>Ajoutez un médicament ou un examen à prescrire pour cette consultation</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type de prescription */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TestTube className="h-5 w-5 text-purple-600" />
                Type de Prescription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={formData.type === "MEDICAMENT" ? "default" : "outline"}
                  className={cn(
                    "h-20 flex-col gap-2",
                    formData.type === "MEDICAMENT" && "bg-blue-600 hover:bg-blue-700",
                  )}
                  onClick={() => handleTypeChange("MEDICAMENT")}
                >
                  <Pill className="h-6 w-6" />
                  Médicament
                </Button>
                <Button
                  type="button"
                  variant={formData.type === "EXAMEN" ? "default" : "outline"}
                  className={cn("h-20 flex-col gap-2", formData.type === "EXAMEN" && "bg-green-600 hover:bg-green-700")}
                  onClick={() => handleTypeChange("EXAMEN")}
                >
                  <TestTube className="h-6 w-6" />
                  Examen
                </Button>
              </div>
              <div className="mt-4">
                <Badge variant={formData.type === "MEDICAMENT" ? "default" : "secondary"}>
                  {formData.type === "MEDICAMENT" ? "Médicament sélectionné" : "Examen sélectionné"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="designation">
                  Désignation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, designation: e.target.value }))}
                  placeholder={formData.type === "MEDICAMENT" ? "Nom du médicament" : "Type d'examen"}
                  required
                />
              </div>

              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Instructions spécifiques..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="commentaire">Commentaire</Label>
                <Textarea
                  id="commentaire"
                  value={formData.commentaire || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, commentaire: e.target.value }))}
                  placeholder="Commentaires additionnels..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Champs spécifiques aux médicaments */}
          {formData.type === "MEDICAMENT" && (
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Pill className="h-5 w-5 text-blue-600" />
                  Informations Médicament
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="posologie">
                    Posologie <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="posologie"
                    value={formData.posologie || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, posologie: e.target.value }))}
                    placeholder="Ex: 1 comprimé matin et soir"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantiteParJour">Quantité par jour</Label>
                    <Input
                      id="quantiteParJour"
                      type="number"
                      min="1"
                      value={formData.quantiteParJour || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          quantiteParJour: e.target.value ? Number.parseInt(e.target.value) : null,
                        }))
                      }
                      placeholder="Nombre de prises"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dureeJours">Durée (jours)</Label>
                    <Input
                      id="dureeJours"
                      type="number"
                      min="1"
                      value={formData.dureeJours || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dureeJours: e.target.value ? Number.parseInt(e.target.value) : null,
                        }))
                      }
                      placeholder="Durée du traitement"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date de début</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateDebut && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateDebut ? format(dateDebut, "PPP", { locale: fr }) : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateDebut} onSelect={setDateDebut} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Date de fin</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateFin && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFin ? format(dateFin, "PPP", { locale: fr }) : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateFin} onSelect={setDateFin} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Champs spécifiques aux examens */}
          {formData.type === "EXAMEN" && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-green-600" />
                  Informations Examen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>
                    Date prévue <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !datePrevue && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {datePrevue ? format(datePrevue, "PPP", { locale: fr }) : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={datePrevue} onSelect={setDatePrevue} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="lieuRealisation">Lieu de réalisation</Label>
                  <Input
                    id="lieuRealisation"
                    value={formData.lieuRealisation || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lieuRealisation: e.target.value }))}
                    placeholder="Laboratoire, service, etc."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter la prescription
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
