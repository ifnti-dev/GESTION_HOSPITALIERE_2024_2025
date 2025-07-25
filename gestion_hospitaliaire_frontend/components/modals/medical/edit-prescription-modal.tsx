"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { CalendarIcon, Pill, TestTube, Save, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { PrescriptionPrenatale, CreatePrescriptionPrenatalePayload } from "@/types/consultstionsTraitement"
import { prescriptionPrenataleService } from "@/services/consultationTraitement/prescriptionPrenataleService"
import { toast } from "sonner"

interface EditPrescriptionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  prescription: PrescriptionPrenatale | null
  onPrescriptionUpdated: () => void
}

export function EditPrescriptionModal({
  isOpen,
  onOpenChange,
  prescription,
  onPrescriptionUpdated,
}: EditPrescriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreatePrescriptionPrenatalePayload>({
    type: "MEDICAMENT",
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
    consultationPrenatale: { id: 0 },
  })

  const [dateDebut, setDateDebut] = useState<Date>()
  const [dateFin, setDateFin] = useState<Date>()
  const [datePrevue, setDatePrevue] = useState<Date>()

  // Initialiser le formulaire avec les données de la prescription
  useEffect(() => {
    if (prescription) {
      setFormData({
        type: prescription.type,
        designation: prescription.designation,
        instructions: prescription.instructions || "",
        commentaire: prescription.commentaire || "",
        dateDebut: prescription.dateDebut,
        dateFin: prescription.dateFin,
        posologie: prescription.posologie || "",
        quantiteParJour: prescription.quantiteParJour,
        dureeJours: prescription.dureeJours,
        datePrevue: prescription.datePrevue,
        lieuRealisation: prescription.lieuRealisation || "",
        consultationPrenatale: { id: prescription.consultationPrenatale.id },
      })

      // Initialiser les dates
      if (prescription.dateDebut) {
        setDateDebut(new Date(prescription.dateDebut))
      }
      if (prescription.dateFin) {
        setDateFin(new Date(prescription.dateFin))
      }
      if (prescription.datePrevue) {
        setDatePrevue(new Date(prescription.datePrevue))
      }
    }
  }, [prescription])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prescription) return

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

      const payload: Partial<CreatePrescriptionPrenatalePayload> = {
        ...formData,
        dateDebut: dateDebut ? format(dateDebut, "yyyy-MM-dd") : null,
        dateFin: dateFin ? format(dateFin, "yyyy-MM-dd") : null,
        datePrevue: datePrevue ? format(datePrevue, "yyyy-MM-dd") : null,
      }

      await prescriptionPrenataleService.update(prescription.id, payload)

      toast.success("Prescription mise à jour avec succès")
      onPrescriptionUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la prescription:", error)
      toast.error("Erreur lors de la mise à jour de la prescription")
    } finally {
      setIsLoading(false)
    }
  }

  if (!prescription) return null

  const isMedicament = formData.type === "MEDICAMENT"

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isMedicament ? (
              <Pill className="h-6 w-6 text-blue-600" />
            ) : (
              <TestTube className="h-6 w-6 text-green-600" />
            )}
            Modifier la Prescription
          </DialogTitle>
          <DialogDescription>Modifiez les informations de cette prescription - ID: {prescription.id}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type de prescription (lecture seule) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {isMedicament ? (
                  <Pill className="h-5 w-5 text-blue-600" />
                ) : (
                  <TestTube className="h-5 w-5 text-green-600" />
                )}
                Type de Prescription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={isMedicament ? "default" : "secondary"} className="text-sm">
                {isMedicament ? "MÉDICAMENT" : "EXAMEN"}
              </Badge>
              <p className="text-sm text-gray-500 mt-2">
                Le type de prescription ne peut pas être modifié après création
              </p>
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
                  placeholder={isMedicament ? "Nom du médicament" : "Type d'examen"}
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
          {isMedicament && (
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
          {!isMedicament && (
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
                  Mise à jour...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Mettre à jour
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
