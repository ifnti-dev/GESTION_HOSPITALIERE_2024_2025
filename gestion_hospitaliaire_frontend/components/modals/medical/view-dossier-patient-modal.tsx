"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DossierMedical } from "@/types/medical"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User, HeartPulse, Droplet, Syringe, ShieldAlert, Calendar, Info } from "lucide-react"

interface ViewDossierPatientModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  dossier: DossierMedical | null
}

export function ViewDossierPatientModal({ isOpen, onOpenChange, dossier }: ViewDossierPatientModalProps) {
  if (!dossier) return null

  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | React.ReactNode }) => (
    <div className="flex items-start space-x-3">
      <div className="mt-1 text-gray-500">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6 text-indigo-600" />
            Dossier Médical de {dossier.personne?.prenom || "Patient"} {dossier.personne?.nom || "Inconnu"}
          </DialogTitle>
          <DialogDescription>
            Informations détaillées du dossier DM-{dossier.id}. Créé le {new Date(dossier.createdAt!).toLocaleDateString("fr-FR")}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {/* Informations Patient */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informations du Patient</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow icon={<User className="h-4 w-4" />} label="Nom complet" value={`${dossier.personne?.prenom || "N/A"} ${dossier.personne?.nom || ""}`} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date de Naissance" value={dossier.personne?.dateNaissance ? new Date(dossier.personne.dateNaissance).toLocaleDateString("fr-FR") : "N/A"} />
              <InfoRow icon={<Info className="h-4 w-4" />} label="Sexe" value={dossier.personne?.sexe || "N/A"} />
              <InfoRow icon={<Info className="h-4 w-4" />} label="Adresse" value={dossier.personne?.adresse || "N/A"} />
            </div>
          </div>

          <Separator />

          {/* Informations Médicales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Détails Médicaux</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoRow icon={<HeartPulse className="h-4 w-4" />} label="Tension Artérielle" value={<Badge variant="secondary">{dossier.tension} mmHg</Badge>} />
                <InfoRow icon={<Droplet className="h-4 w-4" />} label="Groupe Sanguin" value={<Badge className="bg-red-100 text-red-800">{dossier.groupeSanguin}</Badge>} />
            </div>
            <div className="space-y-3">
                <p className="text-sm text-gray-800 mt-1 p-3 bg-gray-50 rounded-md border"><Label className="text-sm font-medium text-gray-500 flex items-center gap-2"><ShieldAlert className="h-4 w-4" />Antécédents</Label>{dossier.antecedents || "Non spécifiés"}</p>
                 <p className="text-sm text-gray-800 mt-1 p-3 bg-red-50 rounded-md border border-red-100"><Label className="text-sm font-medium text-gray-500 flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-red-500" />Allergies</Label>{dossier.allergies || "Aucune connue"}</p>
                 <p className="text-sm text-gray-800 mt-1 p-3 bg-gray-50 rounded-md border"><Label className="text-sm font-medium text-gray-500 flex items-center gap-2"><Syringe className="h-4 w-4" />Traitements en cours</Label>{dossier.traitementsEnCours || "Aucun"}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}