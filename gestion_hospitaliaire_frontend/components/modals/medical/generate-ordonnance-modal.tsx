"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FileText,
  Download,
  Pill,
  TestTube,
  Calendar,
  MapPin,
  Stethoscope,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import type { ConsultationPrenatale, PrescriptionPrenatale } from "@/types/consultstionsTraitement"
import { prescriptionPrenataleService } from "@/services/consultationTraitement/prescriptionPrenataleService"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { generateOrdonnancePDF } from "@/lib/ordonnance-generator"

interface GenerateOrdonnanceModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  consultation: ConsultationPrenatale
}

export function GenerateOrdonnanceModal({ isOpen, onOpenChange, consultation }: GenerateOrdonnanceModalProps) {
  const [prescriptions, setPrescriptions] = useState<PrescriptionPrenatale[]>([])
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Charger les prescriptions de la consultation
  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (consultation.id) {
        try {
          setIsLoading(true)
          const data = await prescriptionPrenataleService.getByConsultationId(consultation.id)
          setPrescriptions(data)
          // Sélectionner toutes les prescriptions par défaut
          setSelectedPrescriptions(data.map((p) => p.id))
        } catch (error) {
          console.error("Erreur lors du chargement des prescriptions:", error)
          toast.error("Erreur lors du chargement des prescriptions")
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (isOpen) {
      fetchPrescriptions()
    }
  }, [isOpen, consultation.id])

  const handlePrescriptionToggle = (prescriptionId: number) => {
    setSelectedPrescriptions((prev) =>
      prev.includes(prescriptionId) ? prev.filter((id) => id !== prescriptionId) : [...prev, prescriptionId],
    )
  }

  const handleSelectAll = () => {
    setSelectedPrescriptions(prescriptions.map((p) => p.id))
  }

  const handleSelectNone = () => {
    setSelectedPrescriptions([])
  }

  const handleGenerateOrdonnance = async () => {
    if (selectedPrescriptions.length === 0) {
      toast.error("Veuillez sélectionner au moins une prescription")
      return
    }

    try {
      setIsGenerating(true)

      const selectedPrescriptionsData = prescriptions.filter((p) => selectedPrescriptions.includes(p.id))

      await generateOrdonnancePDF({
        consultation,
        prescriptions: selectedPrescriptionsData,
      })

      toast.success("Ordonnance générée avec succès !")
      onOpenChange(false)
    } catch (error) {
      console.error("Erreur lors de la génération de l'ordonnance:", error)
      toast.error("Erreur lors de la génération de l'ordonnance")
    } finally {
      setIsGenerating(false)
    }
  }

  const medicaments = prescriptions.filter((p) => p.type === "MEDICAMENT")
  const examens = prescriptions.filter((p) => p.type === "EXAMEN")

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Générer une Ordonnance
          </DialogTitle>
          <DialogDescription>
            Sélectionnez les prescriptions à inclure dans l'ordonnance pour{" "}
            <strong>
              {consultation.dossierGrossesse?.personne?.prenom} {consultation.dossierGrossesse?.personne?.nom}
            </strong>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <div className="space-y-6 p-1">
            {/* Informations de la consultation */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                  Consultation du {formatDate(consultation.dateConsultation)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Patiente:</span>
                    <p>
                      {consultation.dossierGrossesse?.personne?.prenom} {consultation.dossierGrossesse?.personne?.nom}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Dossier:</span>
                    <p className="font-mono">DG-{consultation.dossierGrossesse?.id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Sage-femme:</span>
                    <p>
                      {consultation.employe?.personne?.prenom} {consultation.employe?.personne?.nom}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Prescriptions:</span>
                    <p>{prescriptions.length} prescription(s) disponible(s)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2">Chargement des prescriptions...</span>
              </div>
            ) : prescriptions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune prescription trouvée pour cette consultation</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Ajoutez des prescriptions avant de générer une ordonnance
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Actions de sélection */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Sélection des Prescriptions ({selectedPrescriptions.length}/{prescriptions.length})
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleSelectAll}>
                          Tout sélectionner
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleSelectNone}>
                          Tout désélectionner
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Médicaments */}
                {medicaments.length > 0 && (
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-blue-600" />
                        Médicaments ({medicaments.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {medicaments.map((prescription) => (
                          <div
                            key={prescription.id}
                            className={`p-4 border rounded-lg transition-colors ${
                              selectedPrescriptions.includes(prescription.id)
                                ? "border-blue-300 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={selectedPrescriptions.includes(prescription.id)}
                                onCheckedChange={() => handlePrescriptionToggle(prescription.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold">{prescription.designation}</h4>
                                  <Badge variant="default" className="text-xs">
                                    MÉDICAMENT
                                  </Badge>
                                </div>

                                {prescription.posologie && (
                                  <p className="text-sm text-gray-700 mb-1">
                                    <strong>Posologie:</strong> {prescription.posologie}
                                  </p>
                                )}

                                <div className="flex gap-4 text-xs text-gray-600">
                                  {prescription.quantiteParJour && (
                                    <span>{prescription.quantiteParJour} prise(s)/jour</span>
                                  )}
                                  {prescription.dureeJours && <span>{prescription.dureeJours} jour(s)</span>}
                                  {prescription.dateDebut && <span>Début: {formatDate(prescription.dateDebut)}</span>}
                                </div>

                                {prescription.instructions && (
                                  <p className="text-sm text-gray-600 mt-2 italic">{prescription.instructions}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Examens */}
                {examens.length > 0 && (
                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TestTube className="h-5 w-5 text-green-600" />
                        Examens ({examens.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {examens.map((prescription) => (
                          <div
                            key={prescription.id}
                            className={`p-4 border rounded-lg transition-colors ${
                              selectedPrescriptions.includes(prescription.id)
                                ? "border-green-300 bg-green-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={selectedPrescriptions.includes(prescription.id)}
                                onCheckedChange={() => handlePrescriptionToggle(prescription.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold">{prescription.designation}</h4>
                                  <Badge variant="secondary" className="text-xs">
                                    EXAMEN
                                  </Badge>
                                </div>

                                <div className="flex gap-4 text-sm text-gray-600 mb-2">
                                  {prescription.datePrevue && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>{formatDate(prescription.datePrevue)}</span>
                                    </div>
                                  )}
                                  {prescription.lieuRealisation && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{prescription.lieuRealisation}</span>
                                    </div>
                                  )}
                                </div>

                                {prescription.instructions && (
                                  <p className="text-sm text-gray-600 italic">{prescription.instructions}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Aperçu de l'ordonnance */}
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Aperçu de l'Ordonnance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{selectedPrescriptions.length} prescription(s) sélectionnée(s)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-blue-600" />
                          <span>
                            {medicaments.filter((m) => selectedPrescriptions.includes(m.id)).length} médicament(s)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TestTube className="h-4 w-4 text-green-600" />
                          <span>{examens.filter((e) => selectedPrescriptions.includes(e.id)).length} examen(s)</span>
                        </div>
                      </div>
                      <div className="text-gray-500">Format: PDF • Ordonnance officielle</div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Annuler
          </Button>

          <Button
            onClick={handleGenerateOrdonnance}
            disabled={isGenerating || selectedPrescriptions.length === 0}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Générer l'Ordonnance
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
