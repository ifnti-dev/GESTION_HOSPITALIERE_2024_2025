"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Stethoscope,
  Calendar,
  Scale,
  Heart,
  TestTube,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  Pill,
  Download,
  Loader2,
} from "lucide-react"
import type { ConsultationPrenatale, PrescriptionPrenatale } from "@/types/consultstionsTraitement"
import { prescriptionPrenataleService } from "@/services/consultationTraitement/prescriptionPrenataleService"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { AddPrescriptionModal } from "@/components/modals/medical/add-prescription-modal"
import { ViewPrescriptionModal } from "@/components/modals/medical/view-prescription-modal"
import { EditPrescriptionModal } from "@/components/modals/medical/edit-prescription-modal"
import { GenerateOrdonnanceModal } from "@/components/modals/medical/generate-ordonnance-modal"
import { ConfirmationModal } from "@/components/modals/confirmation-modal"

interface ViewConsultationModalProps {
  consultation: ConsultationPrenatale | null
  onClose: () => void
}

export function ViewConsultationModal({ consultation, onClose }: ViewConsultationModalProps) {
  const [prescriptions, setPrescriptions] = useState<PrescriptionPrenatale[]>([])
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false)

  // États pour les modales de prescription
  const [isAddPrescriptionOpen, setIsAddPrescriptionOpen] = useState(false)
  const [viewingPrescription, setViewingPrescription] = useState<PrescriptionPrenatale | null>(null)
  const [editingPrescription, setEditingPrescription] = useState<PrescriptionPrenatale | null>(null)
  const [deletingPrescriptionId, setDeletingPrescriptionId] = useState<number | null>(null)
  const [isOrdonnanceModalOpen, setIsOrdonnanceModalOpen] = useState(false)

  // Charger les prescriptions quand la consultation change
  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (consultation?.id) {
        try {
          setLoadingPrescriptions(true)
          const data = await prescriptionPrenataleService.getByConsultationId(consultation.id)
          setPrescriptions(data)
        } catch (error) {
          console.error("Erreur lors du chargement des prescriptions:", error)
          toast.error("Erreur lors du chargement des prescriptions")
        } finally {
          setLoadingPrescriptions(false)
        }
      }
    }

    if (consultation) {
      fetchPrescriptions()
    }
  }, [consultation])

  const handlePrescriptionAdded = async () => {
    if (consultation?.id) {
      try {
        const data = await prescriptionPrenataleService.getByConsultationId(consultation.id)
        setPrescriptions(data)
      } catch (error) {
        console.error("Erreur lors du rechargement des prescriptions:", error)
      }
    }
  }

  const handleDeletePrescription = async (id: number) => {
    try {
      await prescriptionPrenataleService.delete(id)
      setPrescriptions(prescriptions.filter((p) => p.id !== id))
      setDeletingPrescriptionId(null)
      toast.success("Prescription supprimée avec succès")
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toast.error("Erreur lors de la suppression de la prescription")
    }
  }

  if (!consultation) return null

  const getComplicationsBadges = () => {
    const badges = []
    if (consultation.presenceDiabeteGestationnel) {
      badges.push(
        <Badge key="diabete" variant="destructive" className="text-xs">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Diabète gestationnel
        </Badge>,
      )
    }
    if (consultation.presenceHypertensionGestationnelle) {
      badges.push(
        <Badge key="hta" variant="destructive" className="text-xs">
          <Heart className="w-3 h-3 mr-1" />
          Hypertension gestationnelle
        </Badge>,
      )
    }
    if (consultation.oedemes) {
      badges.push(
        <Badge key="oedemes" variant="secondary" className="text-xs">
          <Activity className="w-3 h-3 mr-1" />
          Œdèmes
        </Badge>,
      )
    }
    return badges
  }

  const complications = getComplicationsBadges()

  return (
    <>
      <Dialog open={!!consultation} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-blue-600" />
              Consultation Prénatale - {formatDate(consultation.dateConsultation)}
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Patient: {consultation.dossierGrossesse?.personne?.prenom} {consultation.dossierGrossesse?.personne?.nom}
            </p>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-120px)]">
            <div className="space-y-6 p-1">
              {/* Résumé */}
              <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                    Résumé de la Consultation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{consultation.poidsMere} kg</div>
                      <div className="text-sm text-gray-600">Poids maternel</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {consultation.hauteurUterine || "N/A"} cm
                      </div>
                      <div className="text-sm text-gray-600">Hauteur utérine</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-pink-600">{consultation.bruitsCoeurFoetal || "N/A"}</div>
                      <div className="text-sm text-gray-600">BCF</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {complications.length === 0 ? "Normal" : `${complications.length} alerte(s)`}
                      </div>
                      <div className="text-sm text-gray-600">État général</div>
                    </div>
                  </div>
                  {complications.length > 0 && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                      <div className="flex items-center gap-2 text-orange-800 mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Complications détectées</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">{complications}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informations générales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      Informations Générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date de consultation</label>
                      <p className="font-semibold">{formatDate(consultation.dateConsultation)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Dossier de grossesse</label>
                      <p className="font-semibold">DG-{consultation.dossierGrossesse?.id}</p>
                    </div>
                    {consultation.dateProchaineConsultation && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Prochaine consultation</label>
                        <p className="font-semibold">{formatDate(consultation.dateProchaineConsultation)}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-500">Sage-femme</label>
                      <p className="font-semibold">
                        {consultation.employe?.personne?.prenom} {consultation.employe?.personne?.nom}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Mesures physiques */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-purple-500" />
                      Mesures Physiques
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Poids de la mère</label>
                      <p className="font-semibold">{consultation.poidsMere} kg</p>
                    </div>
                    {consultation.tensionArterielle && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tension artérielle</label>
                        <p className="font-semibold">{consultation.tensionArterielle}</p>
                      </div>
                    )}
                    {consultation.hauteurUterine && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Hauteur utérine</label>
                        <p className="font-semibold">{consultation.hauteurUterine} cm</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Examen fœtal */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                      Examen Fœtal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {consultation.bruitsCoeurFoetal && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Bruits du cœur fœtal</label>
                        <p className="font-semibold">{consultation.bruitsCoeurFoetal}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mouvements fœtaux</label>
                      <div className="flex items-center gap-2">
                        {consultation.mouvementsFoetus ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span className={consultation.mouvementsFoetus ? "text-green-700" : "text-gray-500"}>
                          {consultation.mouvementsFoetus ? "Perçus" : "Non perçus"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Complications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TestTube className="h-5 w-5 text-red-500" />
                      Complications et Pathologies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Œdèmes</label>
                      <div className="flex items-center gap-2">
                        {consultation.oedemes ? (
                          <CheckCircle className="h-4 w-4 text-orange-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span className={consultation.oedemes ? "text-orange-700" : "text-gray-500"}>
                          {consultation.oedemes ? "Présents" : "Absents"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Diabète gestationnel</label>
                      <div className="flex items-center gap-2">
                        {consultation.presenceDiabeteGestationnel ? (
                          <CheckCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span className={consultation.presenceDiabeteGestationnel ? "text-red-700" : "text-gray-500"}>
                          {consultation.presenceDiabeteGestationnel ? "Présent" : "Absent"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Hypertension gestationnelle</label>
                      <div className="flex items-center gap-2">
                        {consultation.presenceHypertensionGestationnelle ? (
                          <CheckCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span
                          className={consultation.presenceHypertensionGestationnelle ? "text-red-700" : "text-gray-500"}
                        >
                          {consultation.presenceHypertensionGestationnelle ? "Présente" : "Absente"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Section Prescriptions */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-green-600" />
                      Prescriptions ({prescriptions.length})
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setIsAddPrescriptionOpen(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                      {prescriptions.length > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsOrdonnanceModalOpen(true)}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Ordonnance
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingPrescriptions ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                      <span className="ml-2">Chargement des prescriptions...</span>
                    </div>
                  ) : prescriptions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune prescription pour cette consultation</p>
                      <p className="text-sm mt-2">Cliquez sur "Ajouter" pour créer une prescription</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {prescriptions.map((prescription) => (
                        <div
                          key={prescription.id}
                          className={`p-4 border rounded-lg ${
                            prescription.type === "MEDICAMENT"
                              ? "border-blue-200 bg-blue-50"
                              : "border-green-200 bg-green-50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {prescription.type === "MEDICAMENT" ? (
                                  <Pill className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <TestTube className="h-4 w-4 text-green-600" />
                                )}
                                <h4 className="font-semibold">{prescription.designation}</h4>
                                <Badge
                                  variant={prescription.type === "MEDICAMENT" ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {prescription.type}
                                </Badge>
                              </div>

                              {prescription.type === "MEDICAMENT" && prescription.posologie && (
                                <p className="text-sm text-gray-700 mb-1">
                                  <strong>Posologie:</strong> {prescription.posologie}
                                </p>
                              )}

                              {prescription.type === "EXAMEN" && prescription.datePrevue && (
                                <p className="text-sm text-gray-700 mb-1">
                                  <strong>Date prévue:</strong> {formatDate(prescription.datePrevue)}
                                </p>
                              )}

                              {prescription.instructions && (
                                <p className="text-sm text-gray-600 italic">{prescription.instructions}</p>
                              )}
                            </div>

                            <div className="flex gap-1 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 bg-transparent"
                                onClick={() => setViewingPrescription(prescription)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 bg-transparent"
                                onClick={() => setEditingPrescription(prescription)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 bg-transparent"
                                onClick={() => setDeletingPrescriptionId(prescription.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Observations */}
              {consultation.observationsGenerales && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-500" />
                      Observations Générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm p-4 bg-gray-50 rounded-md border">{consultation.observationsGenerales}</div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Modales de prescription */}
      {consultation && (
        <>
          <AddPrescriptionModal
            isOpen={isAddPrescriptionOpen}
            onOpenChange={setIsAddPrescriptionOpen}
            consultationId={consultation.id!}
            onPrescriptionAdded={handlePrescriptionAdded}
          />

          <ViewPrescriptionModal
            isOpen={!!viewingPrescription}
            onOpenChange={(open) => !open && setViewingPrescription(null)}
            prescription={viewingPrescription}
          />

          <EditPrescriptionModal
            isOpen={!!editingPrescription}
            onOpenChange={(open) => !open && setEditingPrescription(null)}
            prescription={editingPrescription}
            onPrescriptionUpdated={handlePrescriptionAdded}
          />

          <GenerateOrdonnanceModal
            isOpen={isOrdonnanceModalOpen}
            onOpenChange={setIsOrdonnanceModalOpen}
            consultation={consultation}
          />

          <ConfirmationModal
            isOpen={deletingPrescriptionId !== null}
            onClose={() => setDeletingPrescriptionId(null)}
            onOpenChange={(isOpen) => {
              if (!isOpen) setDeletingPrescriptionId(null)
            }}
            onConfirm={() => {
              if (deletingPrescriptionId) {
                handleDeletePrescription(deletingPrescriptionId)
              }
            }}
            title="Confirmer la suppression"
            description="Êtes-vous sûr de vouloir supprimer cette prescription ? Cette action est irréversible."
          />
        </>
      )}
    </>
  )
}
