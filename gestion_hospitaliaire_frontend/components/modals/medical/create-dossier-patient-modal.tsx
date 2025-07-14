"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react" // Keep these imports
// import { getPersonnes } from "@/services/utilisateur/personne.service" // Removed: patients are now passed as a prop
import { cn } from "@/lib/utils" // Assurez-vous que ce chemin est correct et que cn est exporté
<<<<<<< HEAD:gestion_hospitaliaire_frontend/components/modals/medical/create-dossier-patient-modal.tsx
import type { Personne } from "@/types/utilisateur" // Assurez-vous que ce chemin est correct
import { toast } from "sonner"
import type { CreateDossierMedicalPayload, DossierMedical } from "@/types/medical" // Assurez-vous que ce chemin est correct
=======
import { Patient } from "@/types/pharmacie"

export interface DossierFormData {
  patientId: string
  antecedents: string
  allergies: string
  traitementsEnCours: string
  tension: number
  groupeSanguin: string
}
>>>>>>> 738f0b9f087657a01c1b98f31628b563e5c24d16:gestion_hospitaliaire_frontend/components/modals/create-dossier-patient-modal.tsx

interface CreateDossierPatientModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSubmit: (data: CreateDossierMedicalPayload, id?: number) => void
  patients: Personne[] // Liste des patients à afficher dans le select
  initialData?: DossierMedical | null // Pour la modification
}

export function CreateDossierPatientModal({
  isOpen,
  onOpenChange,
  onSubmit,
  patients,
  initialData,
}: CreateDossierPatientModalProps) {
  const isEditMode = !!initialData

  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(
    initialData?.personne?.id?.toString()
  )
  const [antecedents, setAntecedents] = useState(initialData?.antecedents || "")
  const [allergies, setAllergies] = useState(initialData?.allergies || "")
  const [traitementsEnCours, setTraitementsEnCours] = useState(initialData?.traitementsEnCours || "")
  const [tension, setTension] = useState<string>(initialData?.tension?.toString() || "")
  const [groupeSanguin, setGroupeSanguin] = useState<string | undefined>(initialData?.groupeSanguin)
  const [isPatientComboboxOpen, setIsPatientComboboxOpen] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof CreateDossierMedicalPayload | 'patient', string>>>({})


  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        setSelectedPatientId(initialData.personne?.id ? String(initialData.personne.id) : undefined)
        setAntecedents(initialData.antecedents || "")
        setAllergies(initialData.allergies || "")
        setTraitementsEnCours(initialData.traitementsEnCours || "")
        setTension(initialData.tension?.toString() || "")
        setGroupeSanguin(initialData.groupeSanguin)
      } else {
        setErrors({})
        resetForm()
      }
    } else if (!isOpen) {
      // Optional: Reset form when closing, handled by the logic above on open.
      // This ensures a clean state every time the modal is opened.
    }
  }, [isOpen, initialData, isEditMode])



  const resetForm = () => {
    setSelectedPatientId(undefined)
    setAntecedents("")
    setAllergies("")
    setTraitementsEnCours("")
    setTension("")
    setGroupeSanguin(undefined)
    setIsPatientComboboxOpen(false)
    setErrors({})
  }

  const handleSubmit = () => {
    const newErrors: Partial<Record<keyof CreateDossierMedicalPayload | 'patient', string>> = {}

    if (!selectedPatientId) newErrors.patient = "Veuillez sélectionner un patient."
    if (!antecedents.trim()) newErrors.antecedents = "Les antécédents sont obligatoires."
    if (!allergies.trim()) newErrors.allergies = "Le champ allergies est obligatoire."
    if (!traitementsEnCours.trim()) newErrors.traitementsEnCours = "Les traitements en cours sont obligatoires."
    if (!groupeSanguin) newErrors.groupeSanguin = "Le groupe sanguin est obligatoire."

    if (!tension.trim()) {
      newErrors.tension = "La tension est obligatoire."
    } else {
      const tensionNum = parseFloat(tension)
      if (isNaN(tensionNum)) {
        newErrors.tension = "La tension doit être une valeur numérique."
      } else if (tensionNum < 0 || tensionNum > 30) {
        newErrors.tension = "La tension doit être entre 0 et 30 (cmHg)."
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      toast.error("Veuillez corriger les erreurs dans le formulaire.")
      return
    }

    const tensionValue = parseFloat(tension)

    const payload: CreateDossierMedicalPayload = {
      personne:{
        id: Number(selectedPatientId)
      },
      antecedents,
      allergies,
      traitementsEnCours,
      tension: tensionValue,
<<<<<<< HEAD:gestion_hospitaliaire_frontend/components/modals/medical/create-dossier-patient-modal.tsx
      groupeSanguin: groupeSanguin as string,
    }

    onSubmit(payload, isEditMode ? initialData.id : undefined)
    onOpenChange(false) // Parent component will close the modal
=======
      groupeSanguin,
    })
       onOpenChange(false) // Ferme la modale après soumission
    resetForm() // Assure la réinitialisation pour la prochaine ouverture
   
>>>>>>> 738f0b9f087657a01c1b98f31628b563e5c24d16:gestion_hospitaliaire_frontend/components/modals/create-dossier-patient-modal.tsx
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Modifier le Dossier Patient" : "Créer un Nouveau Dossier Patient"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Mettez à jour les informations du dossier médical." : "Remplissez les informations ci-dessous pour créer un nouveau dossier médical."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="patient-combobox">Patient *</Label>
             <Popover open={isPatientComboboxOpen} onOpenChange={setIsPatientComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isPatientComboboxOpen}
                  className={cn(
                    "w-full justify-between",
                    errors.patient && "border-red-500 focus-visible:ring-red-500"
                  )}
                  id="patient-combobox"
                >
                  {selectedPatientId
<<<<<<< HEAD:gestion_hospitaliaire_frontend/components/modals/medical/create-dossier-patient-modal.tsx
                    ? patients.find((p) => p.id?.toString() === selectedPatientId)?.prenom +
                      " " +
                      patients.find((p) => p.id?.toString() === selectedPatientId)?.nom
=======
                    ? patients.find((patient) => String(patient.id) === String(selectedPatientId))?.prenom +
                      " " +
                      patients.find((patient) => String(patient.id) === String(selectedPatientId))?.nom
>>>>>>> 738f0b9f087657a01c1b98f31628b563e5c24d16:gestion_hospitaliaire_frontend/components/modals/create-dossier-patient-modal.tsx
                    : "Sélectionner un patient..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50">
                <Command>
                  <CommandInput placeholder="Rechercher un patient..." />
                  <CommandEmpty>Aucun patient trouvé.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {patients.map((patient) => (
                        <CommandItem
                          key={patient.id}
                          value={`${patient.prenom} ${patient.nom} ${patient.id} ${patient.dateNaissance}`}
                          onSelect={() => {
                            setSelectedPatientId(String(patient.id))
                            setIsPatientComboboxOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
<<<<<<< HEAD:gestion_hospitaliaire_frontend/components/modals/medical/create-dossier-patient-modal.tsx
                              String(selectedPatientId) === String(patient.id) ? "opacity-100" : "opacity-0"
=======
                              selectedPatientId === String(patient.id) ? "opacity-100" : "opacity-0"
>>>>>>> 738f0b9f087657a01c1b98f31628b563e5c24d16:gestion_hospitaliaire_frontend/components/modals/create-dossier-patient-modal.tsx
                            )}
                          />
                          {patient.prenom} {patient.nom} ({patient.dateNaissance})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.patient && <p className="text-sm font-medium text-red-500">{errors.patient}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="antecedents">Antécédents *</Label>
            <Textarea
              id="antecedents"
              placeholder="Décrire les antécédents médicaux..."
              value={antecedents}
              onChange={(e) => setAntecedents(e.target.value)}
              className={cn(errors.antecedents && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.antecedents && <p className="text-sm font-medium text-red-500">{errors.antecedents}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies *</Label>
            <Textarea
              id="allergies"
              placeholder="Lister les allergies connues..."
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className={cn(errors.allergies && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.allergies && <p className="text-sm font-medium text-red-500">{errors.allergies}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="traitementsEnCours">Traitements en Cours *</Label>
            <Textarea
              id="traitementsEnCours"
              placeholder="Indiquer les traitements actuels..."
              value={traitementsEnCours}
              onChange={(e) => setTraitementsEnCours(e.target.value)}
              className={cn(errors.traitementsEnCours && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.traitementsEnCours && <p className="text-sm font-medium text-red-500">{errors.traitementsEnCours}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tension">Tension (en cmHg) *</Label>
            <Input
              id="tension"
              type="number"
              placeholder="Ex: 12 (en cmHg)"
              value={tension}
              onChange={(e) => setTension(e.target.value)}
              className={cn(errors.tension && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.tension && <p className="text-sm font-medium text-red-500">{errors.tension}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupeSanguin">Groupe Sanguin *</Label>
            <Select value={groupeSanguin} onValueChange={setGroupeSanguin}>
              <SelectTrigger
                id="groupeSanguin"
                className={cn(errors.groupeSanguin && "border-red-500 focus-visible:ring-red-500")}
              >
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50">
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((gs) => (
                  <SelectItem key={gs} value={gs}>{gs}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.groupeSanguin && <p className="text-sm font-medium text-red-500">{errors.groupeSanguin}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            {isEditMode ? "Modifier le Dossier" : "Créer Dossier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
