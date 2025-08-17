"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { dossierGrossesseService } from "@/services/medical/dossier-grossesse.service"
import { consultationPrenataleService } from "@/services/consultationTraitement/consultationPrenataleService"
import { accouchementService } from "@/services/Accouchement/accouchement.service"
import type { DossierGrossesse } from "@/types/medical"
import type { ConsultationPrenatale } from "@/types/consultstionsTraitement"
import type { Accouchement } from "@/types/accouchement"
import { toast } from "sonner"
import { PDFExportModal } from "@/components/modals/pdf-export-modal"
import {
  ArrowLeft,
  Download,
  User,
  Heart,
  Calendar,
  Activity,
  TestTube,
  FileText,
  AlertTriangle,
  Phone,
  MapPin,
  Users,
  Briefcase,
  Baby,
  Scale,
  Ruler,
  Stethoscope,
  HeartPulse,
  Clock,
  Eye,
  Edit,
  Plus,
  Pill,
} from "lucide-react"
import { formatDate, calculateGestationalAge, calculateTrimestre } from "@/lib/utils"

interface PatientDetailPageProps {
  params: {
    id: string
  }
}

export default function PatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.id as string

  const [dossier, setDossier] = useState<DossierGrossesse | null>(null)
  const [consultations, setConsultations] = useState<ConsultationPrenatale[]>([])
  const [accouchements, setAccouchements] = useState<Accouchement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [dossierData, consultationsData, accouchementsData] = await Promise.all([
          dossierGrossesseService.getDossierGrossesseById(Number.parseInt(patientId)),
          consultationPrenataleService.getConsultationsByDossier(Number.parseInt(patientId)),
          accouchementService.getByDossierGrossesse(Number.parseInt(patientId)),
        ])

        setDossier(dossierData)
        setConsultations(consultationsData)
        setAccouchements(accouchementsData)
      } catch (err) {
        setError("Erreur lors du chargement des données de la patiente")
        toast.error("Erreur lors du chargement des données")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (patientId) {
      fetchData()
    }
  }, [patientId])

  const handleExportPDF = () => {
    setIsPDFModalOpen(true)
  }

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

  const hasRiskFactors = (dossier: DossierGrossesse) => {
    return (
      dossier.antecedentsMedicaux?.toLowerCase().includes("diabète") ||
      dossier.antecedentsMedicaux?.toLowerCase().includes("hypertension") ||
      dossier.antecedentsObstetricaux?.toLowerCase().includes("césarienne") ||
      dossier.statutSerologieHiv === "Positif" ||
      dossier.statutSerologieSyphilis === "Positif" ||
      dossier.nombreGrossesses > 5 ||
      new Date().getFullYear() - new Date(dossier.personne?.dateNaissance || "").getFullYear() > 35
    )
  }

  const getComplicationsBadges = (consultation: ConsultationPrenatale) => {
    const badges = []
    if (consultation.presenceDiabeteGestationnel) {
      badges.push(
        <Badge key="diabete" variant="destructive" className="text-xs">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Diabète
        </Badge>,
      )
    }
    if (consultation.presenceHypertensionGestationnelle) {
      badges.push(
        <Badge key="hta" variant="destructive" className="text-xs">
          <HeartPulse className="w-3 h-3 mr-1" />
          HTA
        </Badge>,
      )
    }
    if (consultation.œdemes) {
      badges.push(
        <Badge key="oedemes" variant="secondary" className="text-xs">
          <Activity className="w-3 h-3 mr-1" />
          Œdèmes
        </Badge>,
      )
    }
    return badges
  }

  const getAccouchementBadges = (accouchement: Accouchement) => {
    const badges = []

    if (!accouchement.vivant) {
      badges.push(
        <Badge key="mort-ne" variant="destructive" className="text-xs">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Mort-né
        </Badge>,
      )
    }

    if (accouchement.reanime) {
      badges.push(
        <Badge key="reanime" variant="secondary" className="text-xs">
          <Activity className="w-3 h-3 mr-1" />
          Réanimé
        </Badge>,
      )
    }

    if (accouchement.hemorragieGrave) {
      badges.push(
        <Badge key="hemorragie" variant="destructive" className="text-xs">
          <HeartPulse className="w-3 h-3 mr-1" />
          Hémorragie
        </Badge>,
      )
    }

    return badges
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <Activity className="h-12 w-12 animate-spin text-rose-500 mx-auto mb-4" />
            <p className="text-gray-600">Chargement du dossier patient...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !dossier) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg font-medium">{error || "Dossier non trouvé"}</p>
          <Button onClick={() => router.back()} className="mt-4" variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const gestationalAge = calculateGestationalAge(dossier.dateDerniereRegle)
  const trimester = calculateTrimestre(dossier.dateDerniereRegle)
  const hasRisks = hasRiskFactors(dossier)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <User className="h-8 w-8 text-rose-600" />
                {dossier.personne?.prenom} {dossier.personne?.nom}
              </h1>
              <p className="text-gray-600 mt-1">Dossier de grossesse complet • DG-{dossier.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
              T{trimester} - {gestationalAge}
            </Badge>
            {hasRisks && (
              <Badge variant="destructive">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Surveillance
              </Badge>
            )}
            <Button
              onClick={handleExportPDF}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter PDF
            </Button>
          </div>
        </div>

        {/* Patient Summary Card */}
        <Card className="border-l-4 border-l-rose-500 bg-gradient-to-r from-rose-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-rose-600" />
              Résumé de la grossesse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-600">{gestationalAge}</div>
                <div className="text-sm text-gray-600">Âge gestationnel</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  G{dossier.nombreGrossesses}P{dossier.nombreAccouchements}
                </div>
                <div className="text-sm text-gray-600">Parité</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.ceil(
                    (new Date(dossier.datePrevueAccouchement).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                  )}
                </div>
                <div className="text-sm text-gray-600">Jours restants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{consultations.length}</div>
                <div className="text-sm text-gray-600">Consultations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{accouchements.length}</div>
                <div className="text-sm text-gray-600">Accouchements</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="dossier" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dossier">Dossier de Grossesse</TabsTrigger>
            <TabsTrigger value="consultations">Consultations ({consultations.length})</TabsTrigger>
            <TabsTrigger value="accouchements">Accouchements ({accouchements.length})</TabsTrigger>
            <TabsTrigger value="historique">Historique</TabsTrigger>
          </TabsList>

          {/* Dossier de Grossesse Tab */}
          <TabsContent value="dossier">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations Patiente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    Informations Patiente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nom complet</label>
                      <p className="font-semibold">
                        {dossier.personne?.prenom} {dossier.personne?.nom}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Âge</label>
                      <p className="font-semibold">
                        {dossier.personne?.dateNaissance
                          ? `${calculateAge(dossier.personne.dateNaissance)} ans`
                          : "Non renseigné"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Téléphone</label>
                      <p className="font-semibold flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {dossier.personne?.telephone || "Non renseigné"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date de naissance</label>
                      <p className="font-semibold">
                        {dossier.personne?.dateNaissance
                          ? formatDate(dossier.personne.dateNaissance)
                          : "Non renseignée"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Adresse</label>
                    <p className="font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {dossier.personne?.adresse || "Non renseignée"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Informations Partenaire */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500" />
                    Informations Partenaire
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nom complet</label>
                      <p className="font-semibold">
                        {dossier.prenomsPartenaire || dossier.nomPartenaire
                          ? `${dossier.prenomsPartenaire || ""} ${dossier.nomPartenaire || ""}`.trim()
                          : "Non renseigné"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Profession</label>
                      <p className="font-semibold flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        {dossier.professionPartenaire || "Non renseignée"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Adresse</label>
                    <p className="font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {dossier.adressePartenaire || "Non renseignée"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Informations Grossesse */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    Grossesse Actuelle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">DDR</label>
                      <p className="font-semibold">{formatDate(dossier.dateDerniereRegle)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">DPA</label>
                      <p className="font-semibold">{formatDate(dossier.datePrevueAccouchement)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Âge gestationnel</label>
                      <p className="font-semibold text-purple-600">{gestationalAge}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Trimestre</label>
                      <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
                        {trimester}er Trimestre
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations Médicales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5 text-red-500" />
                    Informations Médicales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Groupe sanguin</label>
                      <p className="font-semibold">
                        {dossier.groupeSanguin ? (
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            {dossier.groupeSanguin}
                            {dossier.rhesus}
                          </Badge>
                        ) : (
                          "Non spécifié"
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Parité</label>
                      <p className="font-semibold">
                        <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                          G{dossier.nombreGrossesses}P{dossier.nombreAccouchements}
                        </Badge>
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Sérologies</label>
                    <div className="grid grid-cols-2 gap-2">
                      {dossier.statutSerologieRubeole && (
                        <div className="flex justify-between">
                          <span className="text-sm">Rubéole:</span>
                          <Badge variant="outline" className="text-xs">
                            {dossier.statutSerologieRubeole}
                          </Badge>
                        </div>
                      )}
                      {dossier.statutSerologieHiv && (
                        <div className="flex justify-between">
                          <span className="text-sm">VIH:</span>
                          <Badge
                            variant={dossier.statutSerologieHiv === "Positif" ? "destructive" : "outline"}
                            className="text-xs"
                          >
                            {dossier.statutSerologieHiv}
                          </Badge>
                        </div>
                      )}
                      {dossier.statutSerologieToxo && (
                        <div className="flex justify-between">
                          <span className="text-sm">Toxoplasmose:</span>
                          <Badge variant="outline" className="text-xs">
                            {dossier.statutSerologieToxo}
                          </Badge>
                        </div>
                      )}
                      {dossier.statutSerologieSyphilis && (
                        <div className="flex justify-between">
                          <span className="text-sm">Syphilis:</span>
                          <Badge
                            variant={dossier.statutSerologieSyphilis === "Positif" ? "destructive" : "outline"}
                            className="text-xs"
                          >
                            {dossier.statutSerologieSyphilis}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Antécédents */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-500" />
                    Antécédents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">Antécédents médicaux</label>
                      <div className="text-sm p-3 bg-gray-50 rounded-md border min-h-[80px]">
                        {dossier.antecedentsMedicaux || <span className="text-gray-400 italic">Non spécifié</span>}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">Antécédents chirurgicaux</label>
                      <div className="text-sm p-3 bg-gray-50 rounded-md border min-h-[80px]">
                        {dossier.antecedentsChirurgicaux || <span className="text-gray-400 italic">Non spécifié</span>}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">Antécédents gynécologiques</label>
                      <div className="text-sm p-3 bg-gray-50 rounded-md border min-h-[80px]">
                        {dossier.antecedentsGynecologiques || (
                          <span className="text-gray-400 italic">Non spécifié</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">Antécédents obstétricaux</label>
                      <div className="text-sm p-3 bg-gray-50 rounded-md border min-h-[80px]">
                        {dossier.antecedentsObstetricaux || <span className="text-gray-400 italic">Non spécifié</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Consultations Tab */}
          <TabsContent value="consultations">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Consultations Prénatales</h3>
                {/* <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Consultation
                </Button> */}
              </div>

              {consultations.length > 0 ? (
                <div className="space-y-4">
                  {consultations.map((consultation) => {
                    const complications = getComplicationsBadges(consultation)
                    return (
                      <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold text-lg">
                                  Consultation du {formatDate(consultation.dateConsultation)}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  CP-{consultation.id}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Scale className="h-4 w-4 text-purple-500" />
                                  <span>Poids: {consultation.poidsMere} kg</span>
                                </div>
                                {consultation.hauteurUterine && (
                                  <div className="flex items-center gap-2">
                                    <Ruler className="h-4 w-4 text-blue-500" />
                                    <span>HU: {consultation.hauteurUterine} cm</span>
                                  </div>
                                )}
                                {consultation.bruitsCoeurFoetal && (
                                  <div className="flex items-center gap-2">
                                    <Baby className="h-4 w-4 text-pink-500" />
                                    <span>BCF: {consultation.bruitsCoeurFoetal}</span>
                                  </div>
                                )}
                                {consultation.dateProchaineConsultation && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-green-500" />
                                    <span>Prochain: {formatDate(consultation.dateProchaineConsultation)}</span>
                                  </div>
                                )}
                              </div>

                              {complications.length > 0 && <div className="flex gap-2 mt-2">{complications}</div>}

                              {consultation.observationsGenerales && (
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                  {consultation.observationsGenerales}
                                </p>
                              )}
                            </div>

                            {/* <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div> */}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Stethoscope className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium text-gray-500">Aucune consultation enregistrée</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Commencez par créer une première consultation prénatale
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Accouchements Tab */}
          <TabsContent value="accouchements">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Accouchements</h3>
                {/* <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Accouchement
                </Button> */}
              </div>

              {accouchements.length > 0 ? (
                <div className="space-y-4">
                  {accouchements.map((accouchement) => {
                    const badges = getAccouchementBadges(accouchement)
                    return (
                      <Card key={accouchement.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold text-lg">
                                  Accouchement du {formatDate(accouchement.date)} à {accouchement.heure}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  AC-{accouchement.id}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-blue-500" />
                                  <span>Lieu: {accouchement.lieu}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Activity className="h-4 w-4 text-purple-500" />
                                  <span>Type: {accouchement.typeAccouchement}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Baby className="h-4 w-4 text-pink-500" />
                                  <span>Poids: {accouchement.poids} g</span>
                                </div>
                                {accouchement.taille && (
                                  <div className="flex items-center gap-2">
                                    <Ruler className="h-4 w-4 text-green-500" />
                                    <span>Taille: {accouchement.taille} cm</span>
                                  </div>
                                )}
                              </div>

                              {accouchement.apgar1min && (
                                <div className="flex items-center gap-4 text-sm">
                                  <span>APGAR:</span>
                                  <Badge variant="outline" className="text-xs">
                                    1min: {accouchement.apgar1min}
                                  </Badge>
                                  {accouchement.apgar5min && (
                                    <Badge variant="outline" className="text-xs">
                                      5min: {accouchement.apgar5min}
                                    </Badge>
                                  )}
                                  {accouchement.apgar10min && (
                                    <Badge variant="outline" className="text-xs">
                                      10min: {accouchement.apgar10min}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              {badges.length > 0 && <div className="flex gap-2 mt-2">{badges}</div>}
                            </div>

                            {/* <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div> */}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Baby className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium text-gray-500">Aucun accouchement enregistré</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Les accouchements apparaîtront ici une fois enregistrés
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Prescriptions Médicales</h3>
                <Button
                  disabled
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 opacity-50 cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Prescription
                </Button>
              </div>

              <Card>
                <CardContent className="text-center py-12">
                  <Pill className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-500">Section Prescriptions</p>
                  <p className="text-sm text-gray-400 mt-2">Cette section sera développée prochainement</p>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>À venir :</strong> Gestion complète des prescriptions médicales avec suivi des
                      traitements, posologies et interactions médicamenteuses.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Historique Tab */}
          <TabsContent value="historique">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  Historique Complet du Dossier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Dossier de grossesse créé</p>
                      <p className="text-sm text-gray-500">{formatDate(dossier.dateOuverture)}</p>
                    </div>
                  </div>

                  {consultations.map((consultation) => (
                    <div
                      key={`consultation-${consultation.id}`}
                      className="flex items-center gap-4 p-3 bg-blue-50 rounded-md"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Consultation prénatale</p>
                        <p className="text-sm text-gray-500">{formatDate(consultation.dateConsultation)}</p>
                        {consultation.observationsGenerales && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                            {consultation.observationsGenerales}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {accouchements.map((accouchement) => (
                    <div
                      key={`accouchement-${accouchement.id}`}
                      className="flex items-center gap-4 p-3 bg-pink-50 rounded-md"
                    >
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Accouchement</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(accouchement.date)} à {accouchement.heure}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {accouchement.lieu} - {accouchement.typeAccouchement}
                        </p>
                      </div>
                    </div>
                  ))}

                  {consultations.length === 0 && accouchements.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">Aucun événement supplémentaire enregistré</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* PDF Export Modal */}
        <PDFExportModal
          isOpen={isPDFModalOpen}
          onOpenChange={setIsPDFModalOpen}
          dossier={dossier}
          consultations={consultations}
        />
      </div>
    </DashboardLayout>
  )
}
