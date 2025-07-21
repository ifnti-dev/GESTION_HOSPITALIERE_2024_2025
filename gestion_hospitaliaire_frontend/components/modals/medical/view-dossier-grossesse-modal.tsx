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
import { DossierGrossesse } from "@/types/medical"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Calendar, HeartPulse, Droplet, ShieldAlert, Syringe, Baby, FileText, AlertTriangle, CheckCircle } from "lucide-react"

interface ViewDossierGrossesseModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  dossier: DossierGrossesse | null
}

// Helper component for displaying info rows
const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | React.ReactNode }) => (
  <div className="flex items-start space-x-3">
    <div className="mt-1 text-gray-500">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-semibold text-gray-900">{value}</p>
    </div>
  </div>
)

// Helper for boolean values
const BooleanBadge = ({ value }: { value: boolean | undefined }) => {
    if (value === true) {
        return <Badge className="bg-red-100 text-red-800 border-red-200"><AlertTriangle className="h-3 w-3 mr-1" /> Oui</Badge>
    }
    if (value === false) {
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" /> Non</Badge>
    }
    return <Badge variant="outline">Non spécifié</Badge>
}

// Helper for text areas
const InfoBlock = ({ icon, label, text }: { icon: React.ReactNode; label: string; text: string | undefined | null }) => (
    <div className="space-y-1">
        <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">{icon}{label}</Label>
        <p className="text-sm text-gray-800 p-3 bg-gray-50 rounded-md border min-h-[60px]">
            {text || <span className="text-gray-400">Non spécifié</span>}
        </p>
    </div>
)

export function ViewDossierGrossesseModal({ isOpen, onOpenChange, dossier }: ViewDossierGrossesseModalProps) {
  if (!dossier) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Baby className="h-7 w-7 text-pink-500" />
            Dossier de Grossesse: {dossier.personne?.prenom} {dossier.personne?.nom}
          </DialogTitle>
          <DialogDescription>
            Détails du dossier DG-{dossier.id}. Ouvert le {new Date(dossier.dateOuverture).toLocaleDateString("fr-FR")}.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4 -mx-4">
          <div className="space-y-6 px-2">
            {/* Informations Patiente */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><User /> Informations Patiente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow icon={<User className="h-4 w-4" />} label="Nom complet" value={`${dossier.personne?.prenom || "N/A"} ${dossier.personne?.nom || ""}`} />
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date de Naissance" value={dossier.personne?.dateNaissance ? new Date(dossier.personne.dateNaissance).toLocaleDateString("fr-FR") : "N/A"} />
              </div>
            </section>

            <Separator />

            {/* Informations Générales Grossesse */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><FileText /> Informations sur la Grossesse</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date des dernières règles" value={dossier.dateDerniereRegle ? new Date(dossier.dateDerniereRegle).toLocaleDateString("fr-FR") : "N/A"} />
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date prévue d'accouchement" value={dossier.datePrevueAccouchement ? new Date(dossier.datePrevueAccouchement).toLocaleDateString("fr-FR") : "N/A"} />
                <InfoRow icon={<Baby className="h-4 w-4" />} label="Nombre de grossesses" value={dossier.nombreGrossesses?.toString() ?? 'N/A'} />
                <InfoRow icon={<Baby className="h-4 w-4" />} label="Nombre d'accouchements" value={dossier.nombreAccouchements?.toString() ?? 'N/A'} />
              </div>
            </section>
            
            <Separator />

            {/* Données Médicales */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><HeartPulse /> Données Médicales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoRow icon={<HeartPulse className="h-4 w-4" />} label="Tension" value={dossier.tension ? `${dossier.tension}` : 'N/A'} />
                <InfoRow icon={<Droplet className="h-4 w-4" />} label="Groupe Sanguin" value={<Badge className="bg-red-100 text-red-800">{dossier.groupeSanguin || 'N/A'}</Badge>} />
                <InfoRow icon={<Droplet className="h-4 w-4" />} label="Rhésus" value={<Badge variant="secondary">{dossier.rhesus || 'N/A'}</Badge>} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <InfoBlock icon={<ShieldAlert className="h-4 w-4" />} label="Antécédents" text={dossier.antecedents} />
                <InfoBlock icon={<ShieldAlert className="h-4 w-4 text-red-500" />} label="Allergies" text={dossier.allergies} />
              </div>
               <div className="mt-4">
                 <InfoBlock icon={<Syringe className="h-4 w-4" />} label="Traitements en cours" text={dossier.traitementsEnCours} />
               </div>
            </section>

            <Separator />

            {/* Sérologies */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><ShieldAlert /> Sérologies et Statuts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoRow icon={<ShieldAlert className="h-4 w-4" />} label="Rubéole" value={<Badge variant="outline">{dossier.statutImmunisationRubeole || 'N/A'}</Badge>} />
                <InfoRow icon={<ShieldAlert className="h-4 w-4" />} label="Toxoplasmose" value={<Badge variant="outline">{dossier.statutImmunisationToxo || 'N/A'}</Badge>} />
                <InfoRow icon={<ShieldAlert className="h-4 w-4" />} label="Hépatite B" value={<Badge variant="outline">{dossier.statutImmunisationHepatiteB || 'N/A'}</Badge>} />
                <InfoRow icon={<ShieldAlert className="h-4 w-4" />} label="VIH" value={<Badge variant="outline">{dossier.statutSerologieHiv || 'N/A'}</Badge>} />
                <InfoRow icon={<ShieldAlert className="h-4 w-4" />} label="Syphilis" value={<Badge variant="outline">{dossier.statutSerologieSyphilis || 'N/A'}</Badge>} />
              </div>
            </section>

            <Separator />

            {/* Risques */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><AlertTriangle /> Risques Spécifiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow icon={<AlertTriangle className="h-4 w-4" />} label="Diabète gestationnel" value={<BooleanBadge value={dossier.presenceDiabeteGestationnel} />} />
                <InfoRow icon={<AlertTriangle className="h-4 w-4" />} label="Hypertension gestationnelle" value={<BooleanBadge value={dossier.presenceHypertensionGestationnelle} />} />
              </div>
            </section>

            <Separator />

            {/* Observations */}
            <section>
                <InfoBlock icon={<FileText className="h-4 w-4" />} label="Observations Générales" text={dossier.observationsGenerales} />
            </section>

          </div>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}