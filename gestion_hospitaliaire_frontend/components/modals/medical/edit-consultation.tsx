import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DossierMedical } from "@/types/medical"
import { Consultation } from "@/types/consultstionsTraitement"
import { Activity, FileText, Stethoscope, X, Edit } from "lucide-react"

interface EditConsultationProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Consultation) => Promise<void>
  constante: Consultation | null
  dossier?: DossierMedical
}

export const EditConsultationModalconsultations = ({
  isOpen,
  onClose,
  onSubmit,
  constante,
  dossier
}: EditConsultationProps) => {
  // États pour les champs obligatoires
  const [temperature, setTemperature] = useState<string>("")
  const [poids, setPoids] = useState<string>("")
  
  // États pour les champs optionnels
  const [tensionArterielle, setTensionArterielle] = useState<string>("")
  const [pressionArterielle, setPressionArterielle] = useState<string>("")
  const [symptomes, setSymptomes] = useState<string>("")
  const [diagnostic, setDiagnostic] = useState<string>("")
  const [date, setDate] = useState<string>("")
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setTemperature("")
    setPoids("")
    setTensionArterielle("")
    setPressionArterielle("")
    setSymptomes("")
    setDiagnostic("")
    setDate("")
    setErrors({})
    setIsSubmitting(false)
  }

  // Initialiser les valeurs lorsque la consultation change
  useEffect(() => {
    if (constante && isOpen) {
      setTemperature(constante.temperature.toString())
      setPoids(constante.poids.toString())
      setTensionArterielle(constante.tensionArterielle || "")
      setPressionArterielle(constante.pressionArterielle || "")
      setSymptomes(constante.symptomes || "")
      setDiagnostic(constante.diagnostic || "")
      
      // Formatage de la date pour l'input date HTML
      if (constante.date) {
        try {
          const dateObj = new Date(constante.date)
          if (!isNaN(dateObj.getTime())) {
            const formattedDate = dateObj.toISOString().split('T')[0]
            setDate(formattedDate)
          } else {
            setDate("")
          }
        } catch (error) {
          console.error("Erreur de formatage de la date:", error)
          setDate("")
        }
      } else {
        setDate("")
      }
      
      setErrors({})
    }
  }, [constante, isOpen])

  // Réinitialiser le formulaire lors de la fermeture
  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    // Validation de la température
    if (!temperature || temperature.trim() === "") {
      newErrors.temperature = "La température est obligatoire"
    } else {
      const tempValue = parseFloat(temperature)
      if (isNaN(tempValue) || tempValue <= 0) {
        newErrors.temperature = "La température doit être un nombre positif"
      } else if (tempValue < 30 || tempValue > 45) {
        newErrors.temperature = "La température doit être entre 30°C et 45°C"
      }
    }
    
    // Validation du poids
    if (!poids || poids.trim() === "") {
      newErrors.poids = "Le poids est obligatoire"
    } else {
      const poidsValue = parseFloat(poids)
      if (isNaN(poidsValue) || poidsValue <= 0) {
        newErrors.poids = "Le poids doit être un nombre positif"
      } else if (poidsValue > 1000) {
        newErrors.poids = "Le poids ne peut pas dépasser 1000kg"
      }
    }
    
    // Validation de la date
    if (!date || date.trim() === "") {
      newErrors.date = "La date est obligatoire"
    } else {
      try {
        const dateObj = new Date(date)
        if (isNaN(dateObj.getTime())) {
          newErrors.date = "La date n'est pas valide"
        }
      } catch {
        newErrors.date = "La date n'est pas valide"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!constante || !validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Construction de l'objet consultation mis à jour
      const updatedConstante: Consultation = {
        ...constante,
        date: date,
        temperature: parseFloat(temperature),
        poids: parseFloat(poids),
        tensionArterielle: tensionArterielle.trim() || null,
        pressionArterielle: pressionArterielle.trim() || null,
        symptomes: symptomes.trim() || null,
        diagnostic: diagnostic.trim() || null,
      }
      
      // Appel de la fonction onSubmit (qui est async maintenant)
      await onSubmit(updatedConstante)
      
      // La fermeture sera gérée par le parent via onClose
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      setErrors({
        general: "Une erreur est survenue lors de la mise à jour. Veuillez réessayer."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm()
      onClose()
    }
  }

  // Fonction pour stopper la propagation des clics sur le contenu modal
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  if (!isOpen || !constante) return null

  const patient = dossier?.personne || constante.dossierMedical?.personne
  const nomComplet = patient ? `${patient.prenom} ${patient.nom}` : "Patient inconnu"
  const dossierInfo = dossier || constante.dossierMedical

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Edit className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Modifier la Consultation</h2>
              <p className="text-orange-100 text-sm">Mise à jour des informations médicales</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleClose}
            className="text-white hover:bg-white/20"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Affichage des erreurs générales */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Informations patient */}
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-400">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Informations Patient</h3>
            </div>
            <p className="font-medium text-gray-900">{nomComplet}</p>
            <p className="text-sm text-gray-600">
              Dossier #{dossierInfo?.id || "N/A"} • 
              Consultation #{constante.id.toString().padStart(4, '0')}
            </p>
          </div>

          {/* Date de consultation */}
          <div>
            <Label htmlFor="date" className="text-sm font-semibold text-gray-700">
              Date de consultation *
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`mt-1 ${errors.date ? 'border-red-500 focus:ring-red-500' : ''}`}
              required
              disabled={isSubmitting}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Signes vitaux */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Signes Vitaux</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Température */}
              <div>
                <Label htmlFor="temperature" className="text-sm font-semibold text-gray-700">
                  Température (°C) *
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  min="30"
                  max="45"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="37.0"
                  className={`mt-1 ${errors.temperature ? 'border-red-500 focus:ring-red-500' : ''}`}
                  required
                  disabled={isSubmitting}
                />
                {errors.temperature && <p className="text-red-500 text-xs mt-1">{errors.temperature}</p>}
              </div>
              
              {/* Poids */}
              <div>
                <Label htmlFor="poids" className="text-sm font-semibold text-gray-700">
                  Poids (kg) *
                </Label>
                <Input
                  id="poids"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="1000"
                  value={poids}
                  onChange={(e) => setPoids(e.target.value)}
                  placeholder="70.0"
                  className={`mt-1 ${errors.poids ? 'border-red-500 focus:ring-red-500' : ''}`}
                  required
                  disabled={isSubmitting}
                />
                {errors.poids && <p className="text-red-500 text-xs mt-1">{errors.poids}</p>}
              </div>
              
              {/* Tension artérielle */}
              <div>
                <Label htmlFor="tension" className="text-sm font-semibold text-gray-700">
                  Tension artérielle
                </Label>
                <Input
                  id="tension"
                  value={tensionArterielle}
                  onChange={(e) => setTensionArterielle(e.target.value)}
                  placeholder="120/80 mmHg"
                  className="mt-1"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">Format: 120/80 mmHg</p>
              </div>
              
              {/* Pression artérielle */}
              <div>
                <Label htmlFor="pression" className="text-sm font-semibold text-gray-700">
                  Pression artérielle
                </Label>
                <Input
                  id="pression"
                  value={pressionArterielle}
                  onChange={(e) => setPressionArterielle(e.target.value)}
                  placeholder="80 mmHg"
                  className="mt-1"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">En mmHg</p>
              </div>
            </div>
          </div>

          {/* Informations médicales */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Informations Médicales</h3>
            </div>
            
            <div className="space-y-4">
              {/* Symptômes */}
              <div>
                <Label htmlFor="symptomes" className="text-sm font-semibold text-gray-700">
                  Symptômes
                </Label>
                <Textarea
                  id="symptomes"
                  value={symptomes}
                  onChange={(e) => setSymptomes(e.target.value)}
                  placeholder="Décrivez les symptômes observés..."
                  className="mt-1 min-h-[80px]"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Diagnostic */}
              <div>
                <Label htmlFor="diagnostic" className="text-sm font-semibold text-gray-700">
                  Diagnostic
                </Label>
                <Textarea
                  id="diagnostic"
                  value={diagnostic}
                  onChange={(e) => setDiagnostic(e.target.value)}
                  placeholder="Diagnostic médical..."
                  className="mt-1 min-h-[80px]"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!temperature || !poids || !date || isSubmitting}
            className="bg-orange-600 hover:bg-orange-700 text-white min-w-[160px]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enregistrement...
              </div>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}