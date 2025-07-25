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
import { useState, useEffect } from "react"
import { addConsultation } from "@/services/consultationTraitement/consultationService"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { DossierMedical } from "@/types/medical"
import { CreateConsultationPayload } from "@/types/consultstionsTraitement"

// Types simplifiés basés sur le modal de prise de constantes

interface AddConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateConsultationPayload) => void
  dossiers: DossierMedical[]
  selectedDossier: DossierMedical | null
  setSelectedDossier: (dossier: DossierMedical | null) => void
  employeid: number
}

const FormField = ({
  id,
  label,
  children,
  required = false,
  error,
}: {
  id: string
  label: string
  children: React.ReactNode
  required?: boolean
  error?: string
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
    {error && <p className="text-sm font-medium text-red-500">{error}</p>}
  </div>
)

export function AddConsultationModal({
  isOpen,
  onClose,
  onSubmit,
  dossiers,
  selectedDossier,
  setSelectedDossier,
  employeid
}: AddConsultationModalProps) {
  const [date, setDate] = useState<string>("")
  const [symptomes, setSymptomes] = useState<string>("")
  const [diagnostic, setDiagnostic] = useState<string>("")
  const [temperature, setTemperature] = useState<string>("")
  const [poids, setPoids] = useState<string>("")
  const [tensionArterielle, setTensionArterielle] = useState<string>("")
  const [pressionArterielle, setPressionArterielle] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset du formulaire quand le modal se ferme
  useEffect(() => {
    if (!isOpen) {
      setDate(new Date().toISOString().split('T')[0])
      setSymptomes("")
      setDiagnostic("")
      setTemperature("")
      setPoids("")
      setTensionArterielle("")
      setPressionArterielle("")
      setSelectedDossier(null)
    }
  }, [isOpen, setSelectedDossier])

  const handleSubmit = () => {
    if (!selectedDossier  || !temperature || !poids) return
    
    setIsSubmitting(true)
    
    const consultationData: CreateConsultationPayload = {
      date,
      symptomes: symptomes || null,
      diagnostic: diagnostic || null,
      temperature: parseFloat(temperature),
      poids: parseFloat(poids),
      tensionArterielle: tensionArterielle || null,
      pressionArterielle: pressionArterielle || null,
      dossierMedical: { id: selectedDossier.id },
      employe: { id: employeid } // Remplacer par l'ID du médecin connecté
    }
    
    onSubmit(consultationData)
    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Plus className="h-6 w-6 text-green-500" />
            Créer une Nouvelle Consultation
          </DialogTitle>
          <DialogDescription>
            Enregistrez une nouvelle consultation médicale avec toutes les informations nécessaires.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Sélection du patient */}
          <FormField id="patient" label="Patient" required>
            <Select
              value={selectedDossier?.id.toString() || ""}
              onValueChange={(value) => {
                const dossier = dossiers.find(d => d.id.toString() === value)
                setSelectedDossier(dossier || null)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un patient" />
              </SelectTrigger>
              <SelectContent>
                {dossiers.map(dossier => {
                  const patient = dossier.personne
                  const nomComplet = patient ? `${patient.prenom} ${patient.nom}` : "Patient inconnu"
                  return (
                    <SelectItem key={dossier.id} value={dossier.id.toString()}>
                      {nomComplet} (Dossier #{dossier.id})
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </FormField>

          

          {/* Date de consultation */}
          <FormField id="dateConsultation" label="Date de consultation" required>
            <Input 
              id="dateConsultation" 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormField>

          {/* Température */}
          <FormField id="temperature" label="Température (°C)" required>
            <Input 
              id="temperature" 
              type="number" 
              step="0.1"
              min="30"
              max="45"
              placeholder="36.5"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              required
            />
          </FormField>

          {/* Poids */}
          <FormField id="poids" label="Poids (kg)" required>
            <Input 
              id="poids" 
              type="number" 
              step="0.1"
              min="0"
              placeholder="70"
              value={poids}
              onChange={(e) => setPoids(e.target.value)}
              required
            />
          </FormField>

          {/* Tension artérielle */}
          <FormField id="tensionArterielle" label="Tension Artérielle (optionnel)">
            <Input 
              id="tensionArterielle" 
              type="text" 
              placeholder="120/80"
              value={tensionArterielle}
              onChange={(e) => setTensionArterielle(e.target.value)}
            />
          </FormField>

          {/* Pression artérielle */}
          <FormField id="pressionArterielle" label="Pression Artérielle (optionnel)">
            <Input 
              id="pressionArterielle" 
              type="text" 
              placeholder="mmHg"
              value={pressionArterielle}
              onChange={(e) => setPressionArterielle(e.target.value)}
            />
          </FormField>

          <div className="md:col-span-1"></div> {/* Spacer pour l'alignement */}

          {/* Symptômes */}
          <div className="md:col-span-2">
            <FormField id="symptomes" label="Symptômes (optionnel)">
              <Textarea 
                id="symptomes" 
                placeholder="Décrivez les symptômes présentés par le patient..." 
                value={symptomes}
                onChange={(e) => setSymptomes(e.target.value)}
                rows={4}
              />
            </FormField>
          </div>
          
          {/* Diagnostic */}
          <div className="md:col-span-2">
            <FormField id="diagnostic" label="Diagnostic (optionnel)">
              <Textarea 
                id="diagnostic" 
                placeholder="Diagnostic médical et observations..." 
                value={diagnostic}
                onChange={(e) => setDiagnostic(e.target.value)}
                rows={4}
              />
            </FormField>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedDossier  || !temperature || !poids || isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enregistrement...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}