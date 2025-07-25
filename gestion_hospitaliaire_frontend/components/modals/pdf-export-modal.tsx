"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, User, Heart, TestTube, Stethoscope, CheckCircle, Loader2 } from "lucide-react"
import type { DossierGrossesse } from "@/types/medical"
import type { ConsultationPrenatale } from "@/types/consultstionsTraitement"
import { generatePatientPDF, generateSummaryPDF } from "@/lib/pdf-generator"
import { toast } from "sonner"

interface PDFExportModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  dossier: DossierGrossesse
  consultations: ConsultationPrenatale[]
}

export function PDFExportModal({ isOpen, onOpenChange, dossier, consultations }: PDFExportModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [exportOptions, setExportOptions] = useState({
    includePatientInfo: true,
    includePartnerInfo: true,
    includePregnancyInfo: true,
    includeMedicalInfo: true,
    includeAntecedents: true,
    includeSerologies: true,
    includeConsultations: true,
    includeConsultationDetails: true,
    includeRiskAssessment: true,
  })

  const handleExportComplete = async () => {
    try {
      setIsGenerating(true)

      await generatePatientPDF({
        dossier,
        consultations,
        includeConsultations: exportOptions.includeConsultations,
        includeAntecedents: exportOptions.includeAntecedents,
        includeSerologies: exportOptions.includeSerologies,
      })

      toast.success("PDF généré avec succès !")
      onOpenChange(false)
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
      toast.error("Erreur lors de la génération du PDF")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportSummary = async () => {
    try {
      setIsGenerating(true)

      await generateSummaryPDF(dossier)

      toast.success("Résumé PDF généré avec succès !")
      onOpenChange(false)
    } catch (error) {
      console.error("Erreur lors de la génération du résumé:", error)
      toast.error("Erreur lors de la génération du résumé")
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleOption = (option: keyof typeof exportOptions) => {
    setExportOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }))
  }

  const selectAll = () => {
    setExportOptions({
      includePatientInfo: true,
      includePartnerInfo: true,
      includePregnancyInfo: true,
      includeMedicalInfo: true,
      includeAntecedents: true,
      includeSerologies: true,
      includeConsultations: true,
      includeConsultationDetails: true,
      includeRiskAssessment: true,
    })
  }

  const selectNone = () => {
    setExportOptions({
      includePatientInfo: false,
      includePartnerInfo: false,
      includePregnancyInfo: false,
      includeMedicalInfo: false,
      includeAntecedents: false,
      includeSerologies: false,
      includeConsultations: false,
      includeConsultationDetails: false,
      includeRiskAssessment: false,
    })
  }

  const selectedCount = Object.values(exportOptions).filter(Boolean).length

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-6 w-6 text-blue-600" />
            Exporter le Dossier PDF
          </DialogTitle>
          <DialogDescription>
            Choisissez les sections à inclure dans l'export PDF du dossier de{" "}
            <strong>
              {dossier.personne?.prenom} {dossier.personne?.nom}
            </strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Summary */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Aperçu du Dossier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Patiente:</span>
                  <p>
                    {dossier.personne?.prenom} {dossier.personne?.nom}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Dossier:</span>
                  <p>DG-{dossier.id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Consultations:</span>
                  <p>
                    {consultations.length} consultation{consultations.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Parité:</span>
                  <p>
                    G{dossier.nombreGrossesses}P{dossier.nombreAccouchements}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Sections à Inclure ({selectedCount}/9)
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    Tout sélectionner
                  </Button>
                  <Button variant="outline" size="sm" onClick={selectNone}>
                    Tout désélectionner
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient Information */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations Patient
                  </h4>

                  <div className="space-y-2 ml-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="patientInfo"
                        checked={exportOptions.includePatientInfo}
                        onCheckedChange={() => toggleOption("includePatientInfo")}
                      />
                      <label htmlFor="patientInfo" className="text-sm">
                        Identité et contact
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="partnerInfo"
                        checked={exportOptions.includePartnerInfo}
                        onCheckedChange={() => toggleOption("includePartnerInfo")}
                      />
                      <label htmlFor="partnerInfo" className="text-sm">
                        Informations partenaire
                      </label>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <TestTube className="h-4 w-4" />
                    Informations Médicales
                  </h4>

                  <div className="space-y-2 ml-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="medicalInfo"
                        checked={exportOptions.includeMedicalInfo}
                        onCheckedChange={() => toggleOption("includeMedicalInfo")}
                      />
                      <label htmlFor="medicalInfo" className="text-sm">
                        Groupe sanguin et données médicales
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="serologies"
                        checked={exportOptions.includeSerologies}
                        onCheckedChange={() => toggleOption("includeSerologies")}
                      />
                      <label htmlFor="serologies" className="text-sm">
                        Sérologies
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="antecedents"
                        checked={exportOptions.includeAntecedents}
                        onCheckedChange={() => toggleOption("includeAntecedents")}
                      />
                      <label htmlFor="antecedents" className="text-sm">
                        Antécédents
                      </label>
                    </div>
                  </div>
                </div>

                {/* Pregnancy Information */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Grossesse
                  </h4>

                  <div className="space-y-2 ml-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pregnancyInfo"
                        checked={exportOptions.includePregnancyInfo}
                        onCheckedChange={() => toggleOption("includePregnancyInfo")}
                      />
                      <label htmlFor="pregnancyInfo" className="text-sm">
                        Informations de grossesse
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="riskAssessment"
                        checked={exportOptions.includeRiskAssessment}
                        onCheckedChange={() => toggleOption("includeRiskAssessment")}
                      />
                      <label htmlFor="riskAssessment" className="text-sm">
                        Évaluation des risques
                      </label>
                    </div>
                  </div>
                </div>

                {/* Consultations */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Consultations ({consultations.length})
                  </h4>

                  <div className="space-y-2 ml-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="consultations"
                        checked={exportOptions.includeConsultations}
                        onCheckedChange={() => toggleOption("includeConsultations")}
                      />
                      <label htmlFor="consultations" className="text-sm">
                        Tableau des consultations
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="consultationDetails"
                        checked={exportOptions.includeConsultationDetails}
                        onCheckedChange={() => toggleOption("includeConsultationDetails")}
                        disabled={!exportOptions.includeConsultations}
                      />
                      <label htmlFor="consultationDetails" className="text-sm">
                        Détails des consultations
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Preview */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Aperçu de l'Export
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{selectedCount} sections sélectionnées</span>
                  </div>
                  {consultations.length > 0 && exportOptions.includeConsultations && (
                    <Badge variant="outline">
                      {consultations.length} consultation{consultations.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
                <div className="text-gray-500">
                  Format: PDF • Taille estimée: {selectedCount > 5 ? "Grande" : "Moyenne"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Annuler
          </Button>

          <Button
            variant="outline"
            onClick={handleExportSummary}
            disabled={isGenerating}
            className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
            Résumé Rapide
          </Button>

          <Button
            onClick={handleExportComplete}
            disabled={isGenerating || selectedCount === 0}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Exporter PDF Complet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
