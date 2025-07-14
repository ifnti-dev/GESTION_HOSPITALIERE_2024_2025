"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import {
  CreatePrescription,
  Prescription,
} from "@/types/consultstionsTraitement"
import { addPrescription } from "@/services/consultationTraitement/prescriptionService"
import { useToast } from "@/components/ui/use-toast"

interface Medicament {
  id: number
  nom: string
  description: string
  est_actif: boolean
  seuil_alerte: number
  unite: string
  categorie_id: number
  stock_total: number
}

interface AddPrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (prescription: Prescription) => void
  prescriptions: Prescription[]
  consultationId: number
}

export function AddPrescriptionModal({
  isOpen,
  onClose,
  onSuccess,
  consultationId,
}: AddPrescriptionModalProps) {
  const [newPrescription, setNewPrescription] = useState<CreatePrescription>({
    quantite: 0,
    posologie: "",
    duree: 7,
    consultation: { id: consultationId },
    medicament: { id: 0 },
  })

  const [listeMedicaments, setListeMedicaments] = useState<Medicament[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const showErrorToast = useCallback(
    (message: string) => {
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      })
    },
    [toast]
  )

  useEffect(() => {
    if (isOpen) {
      setNewPrescription({
        quantite: 0,
        posologie: "",
        duree: 7,
        consultation: { id: consultationId },
        medicament: { id: 0 },
      })
    }
  }, [isOpen, consultationId])

  useEffect(() => {
    const fetchMedicaments = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/medicaments")
        if (!res.ok) throw new Error("Erreur de chargement")
        const data = await res.json()
        setListeMedicaments(data)
      } catch (err) {
        console.error("Erreur chargement médicaments:", err)
        showErrorToast("Impossible de charger la liste des médicaments")
      }
    }

    if (isOpen) fetchMedicaments()
  }, [isOpen, showErrorToast])

  const handleSubmit = useCallback(async () => {
    if (!newPrescription.medicament.id) {
      showErrorToast("Veuillez sélectionner un médicament")
      return
    }

    setIsSubmitting(true)

    try {
      const createdPrescription = await addPrescription(newPrescription)

      onSuccess(createdPrescription)
      onClose()

      toast({
        title: "Succès",
        description: "Prescription créée avec succès",
      })
    } catch (err) {
      console.error("Erreur création prescription:", err)
      showErrorToast("Une erreur est survenue lors de la création")
    } finally {
      setIsSubmitting(false)
    }
  }, [newPrescription, onClose, onSuccess, showErrorToast, toast])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Nouvelle Prescription</DialogTitle>
          <DialogDescription>
            Créez une nouvelle prescription médicale
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="duree">Durée (jours)</Label>
            <Input
              id="duree"
              type="number"
              min="1"
              value={newPrescription.duree}
              onChange={(e) =>
                setNewPrescription({
                  ...newPrescription,
                  duree: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="posologie">Posologie</Label>
            <Textarea
              id="posologie"
              placeholder="posologie pour le patient"
              value={newPrescription.posologie}
              onChange={(e) =>
                setNewPrescription({
                  ...newPrescription,
                  posologie: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="quantite">Quantité</Label>
            <Input
              id="quantite"
              type="number"
              min="1"
              value={newPrescription.quantite}
              onChange={(e) =>
                setNewPrescription({
                  ...newPrescription,
                  quantite: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="medicament">Médicament *</Label>
            <Select
              value={newPrescription.medicament.id.toString()}
              onValueChange={(value) =>
                setNewPrescription({
                  ...newPrescription,
                  medicament: { id: parseInt(value) },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un médicament" />
              </SelectTrigger>
              <SelectContent>
                {listeMedicaments.map((med) => (
                  <SelectItem key={med.id} value={med.id.toString()}>
                    {med.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Création...
              </span>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Créer la prescription
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
