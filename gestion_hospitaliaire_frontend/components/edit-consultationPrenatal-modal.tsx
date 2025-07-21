"use client"

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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ConsultationPrenatale } from "@/types/consultstionsTraitement"

interface EditConsultationModalProps {
  consultation: ConsultationPrenatale | null
  onClose: () => void
  setEditingConsultation: (consultation: ConsultationPrenatale | null) => void
  handleUpdateConsultation: () => Promise<void>
}

export function EditConsultationModal({
  consultation,
  onClose,
  setEditingConsultation,
  handleUpdateConsultation
}: EditConsultationModalProps) {
  if (!consultation) return null
  
  return (
    <Dialog open={!!consultation} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Modifier la consultation
          </DialogTitle>
          <DialogDescription>
            Mettre à jour les détails de la consultation
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="col-span-2">
            <Label>Patiente</Label>
            <p className="font-medium">
              {consultation.patiente.prenom} {consultation.patiente.nom}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-date">Date de consultation *</Label>
            <Input 
              id="edit-date"
              type="date"
              value={consultation.dateConsultation.split('T')[0]}
              onChange={(e) => setEditingConsultation({
                ...consultation, 
                dateConsultation: e.target.value
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-semaines">Semaines d'aménorrhée *</Label>
            <Input 
              id="edit-semaines"
              type="number"
              placeholder="SA"
              value={consultation.semaineAmenorrhee}
              onChange={(e) => setEditingConsultation({
                ...consultation, 
                semaineAmenorrhee: parseInt(e.target.value) || 0
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-poids">Poids (kg) *</Label>
            <Input 
              id="edit-poids"
              type="number"
              step="0.1"
              placeholder="kg"
              value={consultation.poids}
              onChange={(e) => setEditingConsultation({
                ...consultation, 
                poids: parseFloat(e.target.value) || 0
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-tension">Tension artérielle *</Label>
            <Input 
              id="edit-tension"
              placeholder="ex: 120/80"
              value={consultation.tensionArterielle}
              onChange={(e) => setEditingConsultation({
                ...consultation, 
                tensionArterielle: e.target.value
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-hauteur">Hauteur utérine (cm)</Label>
            <Input 
              id="edit-hauteur"
              type="number"
              placeholder="cm"
              value={consultation.hauteurUterine || ""}
              onChange={(e) => setEditingConsultation({
                ...consultation, 
                hauteurUterine: e.target.value ? parseInt(e.target.value) : null
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-bruits">Bruits cardiaques fœtaux</Label>
            <Input 
              id="edit-bruits"
              placeholder="ex: Positifs, 140 bpm"
              value={consultation.bruitsCardiaquesFoetaux || ""}
              onChange={(e) => setEditingConsultation({
                ...consultation, 
                bruitsCardiaquesFoetaux: e.target.value
              })}
            />
          </div>
          
          <div className="col-span-2 space-y-2">
            <Label htmlFor="edit-observations">Observations</Label>
            <Textarea 
              id="edit-observations"
              placeholder="Notes et observations..."
              value={consultation.observations || ""}
              onChange={(e) => setEditingConsultation({
                ...consultation, 
                observations: e.target.value
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-rdv">Prochain RDV</Label>
            <Input 
              id="edit-rdv"
              type="date"
              value={consultation.prochainRdv?.split('T')[0] || ""}
              onChange={(e) => setEditingConsultation({
                ...consultation, 
                prochainRdv: e.target.value
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-alerte">Alerte</Label>
            <Input 
              id="edit-alerte"
              placeholder="ex: Hypertension suspectée"
              value={consultation.alerte || ""}
              onChange={(e) => setEditingConsultation({
                ...consultation, 
                alerte: e.target.value
              })}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={handleUpdateConsultation}
          >
            Mettre à jour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}