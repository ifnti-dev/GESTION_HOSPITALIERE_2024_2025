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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CreateConsultation, Consultation } from "@/types/consultstionsTraitement"
import { addConsultation } from "@/services/consultationTraitement/consultationService"
import { useToast } from "@/components/ui/use-toast"

interface AddConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (consultation: Consultation) => void
  patients: Array<{ id: number; prenom: string; nom: string }>
  medecins: Array<{ id: number; specialite: string; personne?: { prenom: string; nom: string } }>
}

 export function AddConsultationModal({
  isOpen,
  onClose,
  onSuccess,
  patients,
  medecins,
}: AddConsultationModalProps) {
  const [newConsultation, setNewConsultation] = useState<CreateConsultation>({
    date: new Date().toISOString().split('T')[0],
    symptomes: '',
    diagnostic: '',
    employe: { id: 0 },
    personne: { id: 0 }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      if (!newConsultation.personne.id || !newConsultation.employe.id) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un patient et un employé",
          variant: "destructive",
        })
        return
      }

      const createdConsultation = await addConsultation(newConsultation)
      onSuccess(createdConsultation)
      
      // Réinitialiser le formulaire
      setNewConsultation({
        date: new Date().toISOString().split('T')[0],
        symptomes: '',
        diagnostic: '',
        employe: { id: 0 },
        personne: { id: 0 }
      })
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Créer une Nouvelle Consultation</DialogTitle>
          <DialogDescription>Enregistrez une nouvelle consultation médicale</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient</Label>
            <Select
              value={newConsultation.personne.id ? newConsultation.personne.id.toString() : ""}
              onValueChange={(value) =>
                setNewConsultation({ ...newConsultation, personne: { id: parseInt(value) } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {patient.prenom} {patient.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateConsultation">Date</Label>
            <Input 
              id="dateConsultation" 
              type="date" 
              value={newConsultation.date}
              onChange={(e) => 
                setNewConsultation({...newConsultation, date: e.target.value})
              }
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="symptomes">Symptômes</Label>
            <Textarea 
              id="symptomes" 
              placeholder="Décrivez les symptômes" 
              value={newConsultation.symptomes}
              onChange={(e) => 
                setNewConsultation({...newConsultation, symptomes: e.target.value})
              }
              required
            />
          </div>
          
          <div className="space-y-2 col-span-2">
            <Label htmlFor="diagnostic">Diagnostic</Label>
            <Textarea 
              id="diagnostic" 
              placeholder="Diagnostic médical" 
              value={newConsultation.diagnostic ?? ''}
              onChange={(e) => 
                setNewConsultation({...newConsultation, diagnostic: e.target.value})
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employe">Médecin</Label>
            <Select
              value={newConsultation.employe.id ? newConsultation.employe.id.toString() : ""}
              onValueChange={(value) =>
                setNewConsultation({ ...newConsultation, employe: { id: parseInt(value) } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un médecin" />
              </SelectTrigger>
              <SelectContent>
                {medecins.map((medecin) => (
                  <SelectItem key={medecin.id} value={medecin.id.toString()}>
                    {medecin.personne?.prenom} {medecin.personne?.nom} ({medecin.specialite})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            className="bg-gradient-to-r from-cyan-600 to-blue-600"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Création..." : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Créer Consultation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}