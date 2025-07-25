"use client";
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DossierMedical } from "@/types/medical"

interface PriseConstantesModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    temperature: number
    poids: number
    tensionArterielle?: string
    pressionArterielle?: string
  }) => void
  dossiers: DossierMedical[]
  selectedDossier: DossierMedical | null
  setSelectedDossier: (dossier: DossierMedical | null) => void
}

export const PriseConstantesModal = ({
  isOpen,
  onClose,
  onSubmit,
  dossiers,
  selectedDossier,
  setSelectedDossier
}: PriseConstantesModalProps) => {
  const [temperature, setTemperature] = useState<string>("")
  const [poids, setPoids] = useState<string>("")
  const [tensionArterielle, setTensionArterielle] = useState<string>("")
  const [pressionArterielle, setPressionArterielle] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setTemperature("")
      setPoids("")
      setTensionArterielle("")
      setPressionArterielle("")
      setSelectedDossier(null)
    }
  }, [isOpen, setSelectedDossier])

  const handleSubmit = () => {
    if (!selectedDossier) return
    
    setIsSubmitting(true)
    
    onSubmit({
      temperature: parseFloat(temperature),
      poids: parseFloat(poids),
      tensionArterielle: tensionArterielle || undefined,
      pressionArterielle: pressionArterielle || undefined
    })
    
    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Prise de Constantes</h2>
        
        <div className="space-y-4">
          {/* Sélection du patient */}
          <div>
            <Label htmlFor="patient">Patient</Label>
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
          </div>
          
          {/* Température */}
          <div>
            <Label htmlFor="temperature">Température (°C)</Label>
            <Input
              id="temperature"
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="37.0"
              required
            />
          </div>
          
          {/* Poids */}
          <div>
            <Label htmlFor="poids">Poids (kg)</Label>
            <Input
              id="poids"
              type="number"
              value={poids}
              onChange={(e) => setPoids(e.target.value)}
              placeholder="70"
              required
            />
          </div>
          
          {/* Tension artérielle */}
          <div>
            <Label htmlFor="tension">Tension artérielle (optionnel)</Label>
            <Input
              id="tension"
              value={tensionArterielle}
              onChange={(e) => setTensionArterielle(e.target.value)}
              placeholder="120/80"
            />
          </div>
          
          {/* Pression artérielle */}
          <div>
            <Label htmlFor="pression">Pression artérielle (optionnel)</Label>
            <Input
              id="pression"
              value={pressionArterielle}
              onChange={(e) => setPressionArterielle(e.target.value)}
              placeholder="80"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedDossier || !temperature || !poids || isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>
    </div>
  )
}