"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ConsultationPrenatale } from "@/types/consultstionsTraitement"

interface ViewConsultationModalProps {
  consultation: ConsultationPrenatale | null
  onClose: () => void
}

export function ViewConsultationModal({
  consultation,
  onClose
}: ViewConsultationModalProps) {
  if (!consultation) return null
  
  return (
    <Dialog open={!!consultation} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Détails de la consultation
          </DialogTitle>
          <DialogDescription>
            Consultation du {new Date(consultation.dateConsultation).toLocaleDateString('fr-FR')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="col-span-2">
            <Label>Patiente</Label>
            <p className="font-medium">
              {consultation.patiente.prenom} {consultation.patiente.nom}
            </p>
          </div>
          
          <div>
            <Label>Date de consultation</Label>
            <p className="font-medium">{new Date(consultation.dateConsultation).toLocaleDateString('fr-FR')}</p>
          </div>
          
          <div>
            <Label>Semaines d'aménorrhée</Label>
            <p className="font-medium">{consultation.semaineAmenorrhee} SA</p>
          </div>
          
          <div>
            <Label>Poids</Label>
            <p className="font-medium">{consultation.poids} kg</p>
          </div>
          
          <div>
            <Label>Tension artérielle</Label>
            <p className="font-medium">{consultation.tensionArterielle}</p>
          </div>
          
          <div>
            <Label>Hauteur utérine</Label>
            <p className="font-medium">{consultation.hauteurUterine || "-"} cm</p>
          </div>
          
          <div>
            <Label>Bruits cardiaques fœtaux</Label>
            <p className="font-medium">{consultation.bruitsCardiaquesFoetaux || "Présents"}</p>
          </div>
          
          {consultation.prochainRdv && (
            <div>
              <Label>Prochain RDV</Label>
              <p className="font-medium">{new Date(consultation.prochainRdv).toLocaleDateString('fr-FR')}</p>
            </div>
          )}
          
          {consultation.alerte && (
            <div className="col-span-2">
              <Label>Alerte</Label>
              <p className="font-medium text-red-600">{consultation.alerte}</p>
            </div>
          )}
          
          <div className="col-span-2">
            <Label>Observations</Label>
            <p className="font-medium whitespace-pre-line">{consultation.observations}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}