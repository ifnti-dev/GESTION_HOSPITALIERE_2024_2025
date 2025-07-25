"use client"

import type React from "react"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Baby,
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Scale,
  Ruler,
  Heart,
  Activity,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Timer,
  Syringe,
  Eye,
} from "lucide-react"
import type { Accouchement } from "@/types/accouchement"
import { formatDate } from "@/lib/utils"

interface ViewAccouchementModalProps {
  accouchement: Accouchement | null
  onClose: () => void
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

// Helper for boolean status with appropriate colors
const BooleanBadge = ({
  status,
  trueLabel = "Oui",
  falseLabel = "Non",
  trueVariant = "default",
  falseVariant = "outline",
}: {
  status: boolean | null | undefined
  trueLabel?: string
  falseLabel?: string
  trueVariant?: "default" | "destructive" | "secondary" | "outline"
  falseVariant?: "default" | "destructive" | "secondary" | "outline"
}) => {
  if (status === null || status === undefined) {
    return <Badge variant="outline">Non spécifié</Badge>
  }

  return (
    <Badge variant={status ? trueVariant : falseVariant} className="text-xs">
      {status ? (
        <>
          <CheckCircle className="h-3 w-3 mr-1" />
          {trueLabel}
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3 mr-1" />
          {falseLabel}
        </>
      )}
    </Badge>
  )
}

export function ViewAccouchementModal({ accouchement, onClose }: ViewAccouchementModalProps) {
  if (!accouchement) return null

  const calculateAge = (birthdate?: string) => {
    if (!birthdate) return "N/A"
    const today = new Date()
    const birthDate = new Date(birthdate)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const getStatusBadge = () => {
    if (accouchement.mortNe) {
      return (
        <Badge variant="destructive" className="text-sm">
          <XCircle className="h-4 w-4 mr-1" />
          Mort-né
        </Badge>
      )
    }
    if (accouchement.vivant) {
      if (accouchement.hemorragieGrave || accouchement.reanime) {
        return (
          <Badge variant="secondary" className="text-sm bg-orange-100 text-orange-800">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Complications
          </Badge>
        )
      }
      return (
        <Badge variant="default" className="text-sm bg-green-100 text-green-800">
          <CheckCircle className="h-4 w-4 mr-1" />
          Vivant
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-sm">
        Non spécifié
      </Badge>
    )
  }

  const getApgarScore = () => {
    if (!accouchement.apgar1min && !accouchement.apgar5min) return null

    const score1 = accouchement.apgar1min || 0
    const score5 = accouchement.apgar5min || 0
    const score10 = accouchement.apgar10min || 0

    let variant: "default" | "secondary" | "destructive" = "default"
    let color = "text-green-700 border-green-200 bg-green-50"

    const mainScore = score5 || score1
    if (mainScore < 4) {
      variant = "destructive"
      color = "text-red-700 border-red-200 bg-red-50"
    } else if (mainScore < 7) {
      variant = "secondary"
      color = "text-orange-700 border-orange-200 bg-orange-50"
    }

    return (
      <div className="space-y-2">
        <Badge variant="outline" className={`text-sm ${color}`}>
          APGAR: {score1}/{score5}
          {score10 ? `/${score10}` : ""}
        </Badge>
        <div className="text-xs text-gray-500">
          {mainScore >= 7 ? "Score normal" : mainScore >= 4 ? "Score modéré" : "Score faible"}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={!!accouchement} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Eye className="h-7 w-7 text-rose-500" />
            Accouchement - {accouchement.dossierGrossesse.personne?.prenom} {accouchement.dossierGrossesse.personne?.nom}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-base">
            <span>
              Accouchement du {formatDate(accouchement.date)} à {accouchement.heure}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span>ID: AC-{accouchement.id}</span>
            <Separator orientation="vertical" className="h-4" />
            {getStatusBadge()}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] p-4 -mx-4">
          <div className="space-y-6 px-2">
            {/* Résumé rapide */}
            <Card className="border-l-4 border-l-rose-500 bg-gradient-to-r from-rose-50 to-pink-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Baby className="h-5 w-5 text-rose-600" />
                  Résumé de l'accouchement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-600">{accouchement.poids}g</div>
                    <div className="text-sm text-gray-600">Poids du nouveau-né</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{accouchement.taille || "N/A"}cm</div>
                    <div className="text-sm text-gray-600">Taille</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{accouchement.typeAccouchement}</div>
                    <div className="text-sm text-gray-600">Type d'accouchement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {accouchement.sexe === "M" ? "Garçon" : accouchement.sexe === "F" ? "Fille" : "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">Sexe</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations Patiente et Dossier */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Patiente et Dossier de Grossesse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoRow
                    icon={<User className="h-4 w-4" />}
                    label="Nom complet"
                    value={`${accouchement.dossierGrossesse.personne?.prenom || "N/A"} ${accouchement.dossierGrossesse.personne?.nom || ""}`}
                  />
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Âge"
                    value={
                      accouchement.dossierGrossesse.personne?.dateNaissance ? (
                        <div>
                          <div>{calculateAge(accouchement.dossierGrossesse.personne.dateNaissance)} ans</div>
                          <div className="text-sm text-gray-500">
                            Née le {formatDate(accouchement.dossierGrossesse.personne.dateNaissance)}
                          </div>
                        </div>
                      ) : (
                        "N/A"
                      )
                    }
                  />
                  <InfoRow
                    icon={<FileText className="h-4 w-4" />}
                    label="Dossier de grossesse"
                    value={
                      <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                        DG-{accouchement.dossierGrossesse?.id}
                      </Badge>
                    }
                  />
                  <InfoRow
                    icon={<Stethoscope className="h-4 w-4" />}
                    label="Sage-femme"
                    value={`${accouchement.employe?.personne.prenom || ""} ${accouchement.employe?.personne.nom || "Non spécifié"}`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informations d'accouchement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  Détails de l'accouchement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Date d'accouchement"
                    value={formatDate(accouchement.date)}
                  />
                  <InfoRow
                    icon={<Clock className="h-4 w-4" />}
                    label="Heure d'accouchement"
                    value={accouchement.heure}
                  />
                  <InfoRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="Lieu d'accouchement"
                    value={accouchement.lieu}
                  />
                  <InfoRow
                    icon={<Stethoscope className="h-4 w-4" />}
                    label="Type d'accouchement"
                    value={
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {accouchement.typeAccouchement}
                      </Badge>
                    }
                  />
                  <InfoRow
                    icon={<Activity className="h-4 w-4" />}
                    label="Présentation"
                    value={accouchement.presentation || "Non spécifiée"}
                  />
                  <InfoRow
                    icon={<Heart className="h-4 w-4" />}
                    label="Type de délivrance"
                    value={accouchement.typeDelivrance || "Non spécifié"}
                  />
                </div>

                {(accouchement.etatPerinee || accouchement.etatVulve) && (
                  <>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {accouchement.etatPerinee && (
                        <InfoRow
                          icon={<Activity className="h-4 w-4" />}
                          label="État du périnée"
                          value={accouchement.etatPerinee}
                        />
                      )}
                      {accouchement.etatVulve && (
                        <InfoRow
                          icon={<Activity className="h-4 w-4" />}
                          label="État de la vulve"
                          value={accouchement.etatVulve}
                        />
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Complications et suites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Complications et suites de couches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <InfoRow
                      icon={<Activity className="h-4 w-4" />}
                      label="Révision utérine"
                      value={<BooleanBadge status={accouchement.revisionUterine} />}
                    />
                    <InfoRow
                      icon={<AlertTriangle className="h-4 w-4" />}
                      label="Hémorragie grave"
                      value={<BooleanBadge status={accouchement.hemorragieGrave} trueVariant="destructive" />}
                    />
                    <InfoRow
                      icon={<Heart className="h-4 w-4" />}
                      label="Allaitement dans les 30 min"
                      value={<BooleanBadge status={accouchement.allaitement30min} />}
                    />
                    <InfoRow
                      icon={<Heart className="h-4 w-4" />}
                      label="Allaitement après 30 min"
                      value={<BooleanBadge status={accouchement.allaitementApres30min} />}
                    />
                  </div>

                  {accouchement.suitesCouches && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Suites de couches</Label>
                      <div className="text-sm p-3 bg-gray-50 rounded-md border min-h-[100px] whitespace-pre-wrap">
                        {accouchement.suitesCouches}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Données du nouveau-né */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="h-5 w-5 text-purple-500" />
                  Données du nouveau-né
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InfoRow
                    icon={<Scale className="h-4 w-4" />}
                    label="Poids"
                    value={
                      <div>
                        <span className="text-2xl font-bold text-purple-600">{accouchement.poids}</span>
                        <span className="text-gray-500 ml-1">grammes</span>
                      </div>
                    }
                  />
                  <InfoRow
                    icon={<Ruler className="h-4 w-4" />}
                    label="Taille"
                    value={
                      accouchement.taille ? (
                        <div>
                          <span className="text-2xl font-bold text-blue-600">{accouchement.taille}</span>
                          <span className="text-gray-500 ml-1">cm</span>
                        </div>
                      ) : (
                        "Non mesurée"
                      )
                    }
                  />
                  <InfoRow
                    icon={<Activity className="h-4 w-4" />}
                    label="Périmètre crânien"
                    value={
                      accouchement.perimetreCranien ? (
                        <div>
                          <span className="text-2xl font-bold text-green-600">{accouchement.perimetreCranien}</span>
                          <span className="text-gray-500 ml-1">cm</span>
                        </div>
                      ) : (
                        "Non mesuré"
                      )
                    }
                  />
                  <InfoRow
                    icon={<Baby className="h-4 w-4" />}
                    label="Sexe"
                    value={
                      accouchement.sexe ? (
                        <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
                          {accouchement.sexe === "M" ? "Masculin" : "Féminin"}
                        </Badge>
                      ) : (
                        "Non spécifié"
                      )
                    }
                  />
                  <InfoRow
                    icon={<Activity className="h-4 w-4" />}
                    label="Score APGAR"
                    value={getApgarScore() || "Non évalué"}
                  />
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      État du nouveau-né
                    </h4>

                    <div className="space-y-3">
                      <InfoRow
                        icon={<Calendar className="h-4 w-4" />}
                        label="À terme"
                        value={<BooleanBadge status={accouchement.aTerme} />}
                      />
                      <InfoRow
                        icon={<Calendar className="h-4 w-4" />}
                        label="Prématuré"
                        value={<BooleanBadge status={accouchement.premature} trueVariant="secondary" />}
                      />
                      <InfoRow
                        icon={<Heart className="h-4 w-4" />}
                        label="Vivant"
                        value={<BooleanBadge status={accouchement.vivant} trueVariant="default" />}
                      />
                      <InfoRow
                        icon={<Activity className="h-4 w-4" />}
                        label="Criant aussitôt"
                        value={<BooleanBadge status={accouchement.criantAussitot} />}
                      />
                      <InfoRow
                        icon={<XCircle className="h-4 w-4" />}
                        label="Mort-né"
                        value={<BooleanBadge status={accouchement.mortNe} trueVariant="destructive" />}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      Réanimation
                    </h4>

                    <div className="space-y-3">
                      <InfoRow
                        icon={<Activity className="h-4 w-4" />}
                        label="Réanimé"
                        value={<BooleanBadge status={accouchement.reanime} trueVariant="secondary" />}
                      />

                      {accouchement.reanime && (
                        <>
                          {accouchement.dureeReanimation && (
                            <InfoRow
                              icon={<Timer className="h-4 w-4" />}
                              label="Durée de réanimation"
                              value={`${accouchement.dureeReanimation} minutes`}
                            />
                          )}
                          <InfoRow
                            icon={<XCircle className="h-4 w-4" />}
                            label="Réanimation en vain"
                            value={<BooleanBadge status={accouchement.reanimationEnVain} trueVariant="destructive" />}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vaccinations */}
            {(accouchement.dateBCG || accouchement.datePolio) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Syringe className="h-5 w-5 text-yellow-500" />
                    Vaccinations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {accouchement.dateBCG && (
                      <InfoRow
                        icon={<Syringe className="h-4 w-4" />}
                        label="Date BCG"
                        value={formatDate(accouchement.dateBCG)}
                      />
                    )}
                    {accouchement.datePolio && (
                      <InfoRow
                        icon={<Syringe className="h-4 w-4" />}
                        label="Date Polio"
                        value={formatDate(accouchement.datePolio)}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">ID Accouchement:</span>
                    <div className="font-mono text-gray-900">AC-{accouchement.id}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Sage-femme:</span>
                    <div className="text-gray-900">
                      {accouchement.employe?.personne.prenom} {accouchement.employe?.personne.nom || "Non spécifié"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Dossier de grossesse:</span>
                    <div className="text-gray-900 font-mono">DG-{accouchement.dossierGrossesse?.id}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          {/* <Button className="bg-rose-600 hover:bg-rose-700 text-white">
            <FileText className="h-4 w-4 mr-2" />
            Imprimer le certificat
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
