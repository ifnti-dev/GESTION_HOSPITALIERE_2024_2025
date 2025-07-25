import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DossierMedical } from "@/types/medical"
import { Consultation } from "@/types/consultstionsTraitement"

interface EditConstanteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Consultation) => void
  constante: Consultation | null
  dossier?: DossierMedical
}

export const EditConstanteModal = ({
  isOpen,
  onClose,
  onSubmit,
  constante,
  dossier
}: EditConstanteModalProps) => {
  const [temperature, setTemperature] = useState<string>("")
  const [poids, setPoids] = useState<string>("")
  const [tensionArterielle, setTensionArterielle] = useState<string>("")
  const [pressionArterielle, setPressionArterielle] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialiser les valeurs lorsque la consultation change
  useEffect(() => {
    if (constante) {
      setTemperature(constante.temperature.toString())
      setPoids(constante.poids.toString())
      setTensionArterielle(constante.tensionArterielle || "")
      setPressionArterielle(constante.pressionArterielle || "")
    }
  }, [constante])

  const handleSubmit = () => {
    if (!constante) return
    
    setIsSubmitting(true)
    
    const updatedConstante: Consultation = {
      ...constante,
      temperature: parseFloat(temperature),
      poids: parseFloat(poids),
      tensionArterielle: tensionArterielle || null,
      pressionArterielle: pressionArterielle || null
    }
    
    onSubmit(updatedConstante)
    setIsSubmitting(false)
  }

  if (!isOpen || !constante) return null

  const patient = dossier?.personne
  const nomComplet = patient ? `${patient.prenom} ${patient.nom}` : "Patient inconnu"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Modifier les Constantes</h2>
        
        <div className="mb-4">
          <p className="font-medium text-gray-900">{nomComplet}</p>
          <p className="text-sm text-gray-500">
            Dossier #{dossier?.id || "N/A"} • 
            {new Date(constante.date).toLocaleDateString()} • 
            {new Date(constante.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        
        <div className="space-y-4">
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
            <Label htmlFor="tension">Tension artérielle</Label>
            <Input
              id="tension"
              value={tensionArterielle}
              onChange={(e) => setTensionArterielle(e.target.value)}
              placeholder="120/80"
            />
          </div>
          
          {/* Pression artérielle */}
          <div>
            <Label htmlFor="pression">Pression artérielle</Label>
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
            disabled={!temperature || !poids || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </div>
    </div>
  )
}