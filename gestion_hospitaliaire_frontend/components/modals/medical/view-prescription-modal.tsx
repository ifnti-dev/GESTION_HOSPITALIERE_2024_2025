"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pill, TestTube, Calendar, FileText, Clock, Hash, MapPin, Eye, AlertCircle } from "lucide-react"
import type { PrescriptionPrenatale } from "@/types/consultstionsTraitement"
import { formatDate } from "@/lib/utils"

interface ViewPrescriptionModalProps {
  prescription: PrescriptionPrenatale | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

// Helper component for displaying info rows
const InfoRow = ({
  icon,
  label,
  value,
  className = "",
}: {
  icon: React.ReactNode
  label: string
  value: string | React.ReactNode
  className?: string
}) => (
  <div className={`flex items-start space-x-3 ${className}`}>
    <div className="mt-1 text-gray-500 flex-shrink-0">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="text-base font-semibold text-gray-900 break-words">{value}</div>
    </div>
  </div>
)

// Helper for text areas
const InfoBlock = ({
  icon,
  label,
  text,
  className = "",
}: {
  icon: React.ReactNode
  label: string
  text: string | undefined | null
  className?: string
}) => (
  <div className={`space-y-2 ${className}`}>
    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
      {icon}
      {label}
    </Label>
    <div className="text-sm text-gray-800 p-3 bg-gray-50 rounded-md border min-h-[60px] whitespace-pre-wrap">
      {text || <span className="text-gray-400 italic">Non spécifié</span>}
    </div>
  </div>
)

export function ViewPrescriptionModal({ isOpen, onOpenChange, prescription }: ViewPrescriptionModalProps) {
  if (!prescription) return null

  const isMedicament = prescription.type === "MEDICAMENT"
  const isExamen = prescription.type === "EXAMEN"

  const handleClose = () => {
    onOpenChange(false)
  }

  const getPrescriptionTypeBadge = () => {
    if (prescription.type === "MEDICAMENT") {
      return (
        <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
          <Pill className="w-4 h-4 mr-2" />
          Médicament
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
          <TestTube className="w-4 h-4 mr-2" />
          Examen
        </Badge>
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Eye className="h-7 w-7 text-blue-500" />
            Détails de la Prescription
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-base">
            <span>{prescription.designation}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>ID: PR-{prescription.id}</span>
            <Separator orientation="vertical" className="h-4" />
            {getPrescriptionTypeBadge()}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] p-4 -mx-4">
          <div className="space-y-6 px-2">
            {/* Résumé rapide */}
            <Card
              className={`border-l-4 ${
                prescription.type === "MEDICAMENT"
                  ? "border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50"
                  : "border-l-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50"
              }`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {prescription.type === "MEDICAMENT" ? (
                    <Pill className="h-5 w-5 text-green-600" />
                  ) : (
                    <TestTube className="h-5 w-5 text-purple-600" />
                  )}
                  Résumé de la prescription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${
                        prescription.type === "MEDICAMENT" ? "text-green-600" : "text-purple-600"
                      }`}
                    >
                      {prescription.type === "MEDICAMENT" ? "Médicament" : "Examen"}
                    </div>
                    <div className="text-sm text-gray-600">Type</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{prescription.designation}</div>
                    <div className="text-sm text-gray-600">Désignation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {prescription.type === "MEDICAMENT"
                        ? prescription.dureeJours
                          ? `${prescription.dureeJours}j`
                          : "N/A"
                        : prescription.datePrevue
                          ? formatDate(prescription.datePrevue)
                          : "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {prescription.type === "MEDICAMENT" ? "Durée" : "Date prévue"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Informations générales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoRow
                    icon={<FileText className="h-4 w-4" />}
                    label="Désignation"
                    value={prescription.designation}
                  />
                  <InfoRow
                    icon={
                      prescription.type === "MEDICAMENT" ? (
                        <Pill className="h-4 w-4" />
                      ) : (
                        <TestTube className="h-4 w-4" />
                      )
                    }
                    label="Type de prescription"
                    value={getPrescriptionTypeBadge()}
                  />
                  <InfoRow
                    icon={<Hash className="h-4 w-4" />}
                    label="ID Prescription"
                    value={
                      <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                        PR-{prescription.id}
                      </Badge>
                    }
                  />
                  <InfoRow
                    icon={<FileText className="h-4 w-4" />}
                    label="Consultation"
                    value={
                      <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                        CP-{prescription.consultationPrenatale.id}
                      </Badge>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Détails spécifiques selon le type */}
            {prescription.type === "MEDICAMENT" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-green-500" />
                    Détails du médicament
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoRow
                      icon={<Pill className="h-4 w-4" />}
                      label="Posologie"
                      value={prescription.posologie || "Non spécifiée"}
                    />
                    <InfoRow
                      icon={<Hash className="h-4 w-4" />}
                      label="Quantité par jour"
                      value={
                        prescription.quantiteParJour ? (
                          <div>
                            <span className="text-2xl font-bold text-green-600">{prescription.quantiteParJour}</span>
                            <span className="text-gray-500 ml-1">fois/jour</span>
                          </div>
                        ) : (
                          "Non spécifiée"
                        )
                      }
                    />
                    <InfoRow
                      icon={<Clock className="h-4 w-4" />}
                      label="Durée du traitement"
                      value={
                        prescription.dureeJours ? (
                          <div>
                            <span className="text-2xl font-bold text-blue-600">{prescription.dureeJours}</span>
                            <span className="text-gray-500 ml-1">jours</span>
                          </div>
                        ) : (
                          "Non spécifiée"
                        )
                      }
                    />
                    {(prescription.dateDebut || prescription.dateFin) && (
                      <>
                        <InfoRow
                          icon={<Calendar className="h-4 w-4" />}
                          label="Date de début"
                          value={
                            prescription.dateDebut ? (
                              <div>
                                <div>{formatDate(prescription.dateDebut)}</div>
                                <Badge variant="outline" className="text-xs mt-1 text-green-600">
                                  Début du traitement
                                </Badge>
                              </div>
                            ) : (
                              "Non spécifiée"
                            )
                          }
                        />
                        <InfoRow
                          icon={<Calendar className="h-4 w-4" />}
                          label="Date de fin"
                          value={
                            prescription.dateFin ? (
                              <div>
                                <div>{formatDate(prescription.dateFin)}</div>
                                <Badge variant="outline" className="text-xs mt-1 text-red-600">
                                  Fin du traitement
                                </Badge>
                              </div>
                            ) : (
                              "Non spécifiée"
                            )
                          }
                        />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {prescription.type === "EXAMEN" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5 text-purple-500" />
                    Détails de l'examen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="Date prévue"
                      value={
                        prescription.datePrevue ? (
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              {formatDate(prescription.datePrevue)}
                            </div>
                            <Badge variant="outline" className="text-xs mt-1 text-purple-600">
                              Examen programmé
                            </Badge>
                          </div>
                        ) : (
                          "Non spécifiée"
                        )
                      }
                    />
                    <InfoRow
                      icon={<MapPin className="h-4 w-4" />}
                      label="Lieu de réalisation"
                      value={
                        prescription.lieuRealisation ? (
                          <div>
                            <div className="font-medium">{prescription.lieuRealisation}</div>
                            <Badge variant="outline" className="text-xs mt-1 text-blue-600">
                              Lieu confirmé
                            </Badge>
                          </div>
                        ) : (
                          "Non spécifié"
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions et commentaires */}
            {(prescription.instructions || prescription.commentaire) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-500" />
                    Instructions et commentaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {prescription.instructions && (
                      <InfoBlock
                        icon={<AlertCircle className="h-4 w-4" />}
                        label="Instructions d'utilisation"
                        text={prescription.instructions}
                      />
                    )}
                    {prescription.commentaire && (
                      <InfoBlock
                        icon={<FileText className="h-4 w-4" />}
                        label="Commentaires additionnels"
                        text={prescription.commentaire}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informations administratives */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-700">
                  <FileText className="h-5 w-5" />
                  Informations administratives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">ID Prescription:</span>
                    <div className="font-mono text-gray-900">PR-{prescription.id}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Consultation associée:</span>
                    <div className="text-gray-900">CP-{prescription.consultationPrenatale.id}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={handleClose}>
            Fermer
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <FileText className="h-4 w-4 mr-2" />
            Imprimer la prescription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
