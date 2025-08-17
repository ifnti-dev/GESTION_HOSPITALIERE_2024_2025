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
import type { DossierGrossesse } from "@/types/medical"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  User,
  Calendar,
  HeartPulse,
  Droplet,
  ShieldAlert,
  Syringe,
  Baby,
  FileText,
  AlertTriangle,
  CheckCircle,
  Users,
  MapPin,
  Briefcase,
  TestTube,
  Heart,
  Activity,
  Clock,
  Phone,
} from "lucide-react"
import { formatDate, calculateGestationalAge, calculateTrimestre } from "@/lib/utils"

interface ViewDossierGrossesseModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  dossier: DossierGrossesse | null
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

// Helper for serologie status with appropriate colors
const SerologieBadge = ({ status }: { status: string | undefined }) => {
  if (!status) return <Badge variant="outline">Non spécifié</Badge>

  const getVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "positif":
        return "destructive"
      case "négatif":
        return "default"
      case "immunisé":
        return "default"
      case "non immunisé":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "positif":
        return <AlertTriangle className="h-3 w-3 mr-1" />
      case "négatif":
      case "immunisé":
        return <CheckCircle className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  return (
    <Badge variant={getVariant(status)} className="text-xs">
      {getIcon(status)}
      {status}
    </Badge>
  )
}

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

// Helper to get risk level
const getRiskLevel = (dossier: DossierGrossesse) => {
  const risks = []

  if (dossier.antecedentsMedicaux?.toLowerCase().includes("diabète")) risks.push("Diabète")
  if (dossier.antecedentsMedicaux?.toLowerCase().includes("hypertension")) risks.push("Hypertension")
  if (dossier.statutSerologieHiv === "Positif") risks.push("VIH+")
  if (dossier.statutSerologieSyphilis === "Positif") risks.push("Syphilis+")
  if (dossier.nombreGrossesses > 5) risks.push("Grande multipare")
  if (dossier.personne?.dateNaissance) {
    const age = new Date().getFullYear() - new Date(dossier.personne.dateNaissance).getFullYear()
    if (age > 35) risks.push("Âge maternel élevé")
  }

  return risks
}

export function ViewDossierGrossesseModal({ isOpen, onOpenChange, dossier }: ViewDossierGrossesseModalProps) {
  if (!dossier) return null

  const riskFactors = getRiskLevel(dossier)
  const gestationalAge = calculateGestationalAge(dossier.dateDerniereRegle)
  const trimester = calculateTrimestre(dossier.dateDerniereRegle)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Heart className="h-7 w-7 text-pink-500" />
            Dossier de Grossesse - {dossier.personne?.prenom} {dossier.personne?.nom}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-base">
            <span>Dossier DG-{dossier.id}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Ouvert le {formatDate(dossier.dateOuverture)}</span>
            <Separator orientation="vertical" className="h-4" />
            <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
              T{trimester} - {gestationalAge}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] p-4 -mx-4">
          <div className="space-y-6 px-2">
            {/* Résumé rapide */}
            <Card className="border-l-4 border-l-pink-500 bg-gradient-to-r from-pink-50 to-rose-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-pink-600" />
                  Résumé de la grossesse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{gestationalAge}</div>
                    <div className="text-sm text-gray-600">Âge gestationnel</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      G{dossier.nombreGrossesses}P{dossier.nombreAccouchements}
                    </div>
                    <div className="text-sm text-gray-600">Parité</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.ceil(
                        (new Date(dossier.datePrevueAccouchement).getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Jours restants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{riskFactors.length}</div>
                    <div className="text-sm text-gray-600">Facteurs de risque</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations Patiente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Gestante (Femme enceinte)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoRow
                    icon={<User className="h-4 w-4" />}
                    label="Nom complet"
                    value={`${dossier.personne?.prenom || "N/A"} ${dossier.personne?.nom || ""}`}
                  />
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Date de naissance"
                    value={
                      dossier.personne?.dateNaissance ? (
                        <div>
                          <div>{formatDate(dossier.personne.dateNaissance)}</div>
                          <div className="text-sm text-gray-500">
                            {new Date().getFullYear() - new Date(dossier.personne.dateNaissance).getFullYear()} ans
                          </div>
                        </div>
                      ) : (
                        "N/A"
                      )
                    }
                  />
                  <InfoRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Téléphone"
                    value={dossier.personne?.telephone || "Non renseigné"}
                  />
                  <InfoRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="Adresse"
                    value={dossier.personne?.adresse || "Non renseignée"}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informations Partenaire */}
            {(dossier.nomPartenaire ||
              dossier.prenomsPartenaire ||
              dossier.professionPartenaire ||
              dossier.adressePartenaire) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500" />
                    Partenaire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoRow
                      icon={<User className="h-4 w-4" />}
                      label="Nom complet"
                      value={
                        `${dossier.prenomsPartenaire || ""} ${dossier.nomPartenaire || ""}`.trim() || "Non renseigné"
                      }
                    />
                    <InfoRow
                      icon={<Briefcase className="h-4 w-4" />}
                      label="Profession"
                      value={dossier.professionPartenaire || "Non renseignée"}
                    />
                    <InfoRow
                      icon={<MapPin className="h-4 w-4" />}
                      label="Adresse"
                      value={dossier.adressePartenaire || "Non renseignée"}
                      className="md:col-span-2"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informations sur la Grossesse */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Grossesse actuelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Date des dernières règles (DDR)"
                    value={formatDate(dossier.dateDerniereRegle)}
                  />
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Date prévue d'accouchement (DPA)"
                    value={formatDate(dossier.datePrevueAccouchement)}
                  />
                  <InfoRow
                    icon={<Clock className="h-4 w-4" />}
                    label="Âge gestationnel"
                    value={
                      <div>
                        <div className="font-bold text-purple-600">{gestationalAge}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {trimester}er Trimestre
                        </Badge>
                      </div>
                    }
                  />
                  <InfoRow
                    icon={<Baby className="h-4 w-4" />}
                    label="Nombre de grossesses (G)"
                    value={dossier.nombreGrossesses?.toString() ?? "N/A"}
                  />
                  <InfoRow
                    icon={<Baby className="h-4 w-4" />}
                    label="Nombre d'accouchements (P)"
                    value={dossier.nombreAccouchements?.toString() ?? "N/A"}
                  />
                  <InfoRow
                    icon={<Heart className="h-4 w-4" />}
                    label="Parité"
                    value={
                      <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                        G{dossier.nombreGrossesses}P{dossier.nombreAccouchements}
                      </Badge>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Antécédents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-500" />
                  Antécédents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoBlock
                    icon={<HeartPulse className="h-4 w-4" />}
                    label="Antécédents médicaux"
                    text={dossier.antecedentsMedicaux}
                  />
                  <InfoBlock
                    icon={<Syringe className="h-4 w-4" />}
                    label="Antécédents chirurgicaux"
                    text={dossier.antecedentsChirurgicaux}
                  />
                  <InfoBlock
                    icon={<Heart className="h-4 w-4" />}
                    label="Antécédents gynécologiques"
                    text={dossier.antecedentsGynecologiques}
                  />
                  <InfoBlock
                    icon={<Baby className="h-4 w-4" />}
                    label="Antécédents obstétricaux"
                    text={dossier.antecedentsObstetricaux}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Données Médicales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-red-500" />
                  Informations médicales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoRow
                    icon={<Droplet className="h-4 w-4" />}
                    label="Groupe sanguin"
                    value={
                      dossier.groupeSanguin ? (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          {dossier.groupeSanguin}
                          {dossier.rhesus}
                        </Badge>
                      ) : (
                        "Non spécifié"
                      )
                    }
                  />
                  <InfoRow
                    icon={<Droplet className="h-4 w-4" />}
                    label="Rhésus"
                    value={
                      dossier.rhesus ? (
                        <Badge variant="secondary" className="text-gray-700">
                          {dossier.rhesus}
                        </Badge>
                      ) : (
                        "Non spécifié"
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sérologies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-yellow-500" />
                  Sérologies et statuts immunologiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoRow
                    icon={<TestTube className="h-4 w-4" />}
                    label="Rubéole"
                    value={<SerologieBadge status={dossier.statutSerologieRubeole} />}
                  />
                  <InfoRow
                    icon={<TestTube className="h-4 w-4" />}
                    label="Toxoplasmose"
                    value={<SerologieBadge status={dossier.statutSerologieToxo} />}
                  />
                  <InfoRow
                    icon={<TestTube className="h-4 w-4" />}
                    label="Hépatite B"
                    value={<SerologieBadge status={dossier.statutSerologieHepatiteB} />}
                  />
                  <InfoRow
                    icon={<TestTube className="h-4 w-4" />}
                    label="VIH"
                    value={<SerologieBadge status={dossier.statutSerologieHiv} />}
                  />
                  <InfoRow
                    icon={<TestTube className="h-4 w-4" />}
                    label="Syphilis"
                    value={<SerologieBadge status={dossier.statutSerologieSyphilis} />}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Facteurs de risque */}
            {riskFactors.length > 0 && (
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Facteurs de risque identifiés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {riskFactors.map((risk, index) => (
                      <Badge key={index} variant="destructive" className="text-sm">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {risk}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800">
                      <strong>Attention :</strong> Cette grossesse présente des facteurs de risque nécessitant une
                      surveillance particulière. Assurez-vous de programmer des consultations de suivi régulières.
                    </p>
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
                    <span className="font-medium text-gray-600">ID Dossier:</span>
                    <div className="font-mono text-gray-900">DG-{dossier.id}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Date d'ouverture:</span>
                    <div className="text-gray-900">{formatDate(dossier.dateOuverture)}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Dernière modification:</span>
                    <div className="text-gray-900">
                      {dossier.updatedAt ? formatDate(dossier.updatedAt) : "Non disponible"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          {/* <Button className="bg-pink-600 hover:bg-pink-700 text-white">
            <FileText className="h-4 w-4 mr-2" />
            Imprimer le carnet
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
