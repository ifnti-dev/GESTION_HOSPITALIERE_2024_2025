"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect, useMemo } from "react"
import { consultationPrenataleService } from "@/services/consultationTraitement/consultationPrenataleService"
import { dossierGrossesseService } from "@/services/medical/dossier-grossesse.service"
import type { ConsultationPrenatale, CreateConsultationPrenatalePayload } from "@/types/consultstionsTraitement"
import { toast } from "sonner"
import {
  Stethoscope,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Activity,
  Calendar,
  HeartPulse,
  Ruler,
  Baby,
  TrendingUp,
  X,
  AlertTriangle,
  TestTube,
  Users,
  Clock,
  Heart,
  Syringe,
  Scale,
} from "lucide-react"
import { formatDate, calculateGestationalAge, calculateTrimestre } from "@/lib/utils"
import type { DossierGrossesse } from "@/types/medical"
import { AddConsultationModal } from "@/components/add-consultationPrenatal-modal"
import { ViewConsultationModal } from "@/components/view-consultationPrenatal-modal"
import { EditConsultationModal } from "@/components/edit-consultationPrenatal-modal"
import { ConfirmationModal } from "@/components/modals/confirmation-modal"
import { useAuth } from "@/contexts/AuthContext"

export default function SageFemmeConsultationsPrenatalesPage() {
  const { user } = useAuth()
  const currentUserId = user?.profile.employe?.id
  console.log("Current User :", user?.profile.employe)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [trimesterFilter, setTrimesterFilter] = useState("all")
  const [consultations, setConsultations] = useState<ConsultationPrenatale[]>([])
  const [dossiers, setDossiers] = useState<DossierGrossesse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // États pour les modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [viewingConsultation, setViewingConsultation] = useState<ConsultationPrenatale | null>(null)
  const [editingConsultation, setEditingConsultation] = useState<ConsultationPrenatale | null>(null)
  const [deletingConsultationId, setDeletingConsultationId] = useState<number | null>(null)

  // État pour la nouvelle consultation
  const [newConsultation, setNewConsultation] = useState<CreateConsultationPrenatalePayload>({
    dateConsultation: new Date().toISOString().split("T")[0],
    poidsMere: 0,
    hauteurUterine: null,
    bruitsCoeurFoetal: null,
    oedemes: null,
    mouvementsFoetus: null,
    presenceDiabeteGestationnel: null,
    presenceHypertensionGestationnelle: null,
    resultatsAnalyses: null,
    examensComplementaires: null,
    traitementsEnCours: null,
    observationsGenerales: null,
    decisionMedicale: null,
    dateProchaineConsultation: null,
    derniereDoseVAT: null,
    dateDerniereDoseVAT: null,
    dossierGrossesse: { id: 0 },
    employe: { id: currentUserId ?? 0 },
  })

  // Chargement initial des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [consultationsData, dossiersData] = await Promise.all([
          consultationPrenataleService.getConsultationsPrenatales(),
          dossierGrossesseService.getAllDossiersGrossesse(),
        ])
        setConsultations(consultationsData)
        setDossiers(dossiersData)
      } catch (error) {
        setError("Erreur lors du chargement des données")
        toast.error("Erreur lors du chargement des données")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filtrage des consultations
  const filteredConsultations = useMemo(() => {
    return consultations.filter((consultation) => {
      const patienteName =
        `${consultation.dossierGrossesse?.personne?.prenom} ${consultation.dossierGrossesse?.personne?.nom}`.toLowerCase()
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        patienteName.includes(searchLower) ||
        consultation.id?.toString().includes(searchLower) ||
        consultation.dossierGrossesse?.id?.toString().includes(searchLower)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "complications" &&
          (consultation.presenceDiabeteGestationnel ||
            consultation.presenceHypertensionGestationnelle ||
            consultation.oedemes)) ||
        (statusFilter === "normal" &&
          !consultation.presenceDiabeteGestationnel &&
          !consultation.presenceHypertensionGestationnelle &&
          !consultation.oedemes)

      const dossier = consultation.dossierGrossesse
      const matchesTrimester =
        trimesterFilter === "all" ||
        (dossier?.dateDerniereRegle && calculateTrimestre(dossier.dateDerniereRegle).toString() === trimesterFilter)

      return matchesSearch && matchesStatus && matchesTrimester
    })
  }, [consultations, searchTerm, statusFilter, trimesterFilter])

  // Statistiques calculées
  const stats = useMemo(() => {
    const totalConsultations = consultations.length
    const withComplications = consultations.filter(
      (c) => c.presenceDiabeteGestationnel || c.presenceHypertensionGestationnelle || c.oedemes,
    ).length
    const upcomingAppointments = consultations.filter((c) => {
      if (!c.dateProchaineConsultation) return false
      const nextDate = new Date(c.dateProchaineConsultation)
      const today = new Date()
      const diffTime = nextDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays >= 0 && diffDays <= 7
    }).length
    const withVAT = consultations.filter((c) => c.derniereDoseVAT && c.derniereDoseVAT > 0).length

    return [
      {
        title: "Consultations ce mois",
        value: totalConsultations.toString(),
        change: `${dossiers.length} dossiers actifs`,
        icon: <Stethoscope className="h-5 w-5" />,
        color: "text-rose-600",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
      },
      {
        title: "Complications détectées",
        value: withComplications.toString(),
        change: "Surveillance renforcée",
        icon: <AlertTriangle className="h-5 w-5" />,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
      {
        title: "RDV cette semaine",
        value: upcomingAppointments.toString(),
        change: "À venir",
        icon: <Calendar className="h-5 w-5" />,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      {
        title: "Vaccinations VAT",
        value: withVAT.toString(),
        change: "À jour",
        icon: <Syringe className="h-5 w-5" />,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
    ]
  }, [consultations, dossiers])

  const handleAddConsultation = async () => {
    try {
      if (newConsultation.dossierGrossesse.id === 0) {
        toast.warning("Veuillez sélectionner un dossier de grossesse")
        return
      }

      const addedConsultation = await consultationPrenataleService.createConsultationPrenatale(newConsultation)
      setConsultations([...consultations, addedConsultation])

      // Réinitialisation du formulaire
      setNewConsultation({
        dateConsultation: new Date().toISOString().split("T")[0],
        poidsMere: 0,
        hauteurUterine: null,
        bruitsCoeurFoetal: null,
        oedemes: null,
        mouvementsFoetus: null,
        presenceDiabeteGestationnel: null,
        presenceHypertensionGestationnelle: null,
        resultatsAnalyses: null,
        examensComplementaires: null,
        traitementsEnCours: null,
        observationsGenerales: null,
        decisionMedicale: null,
        dateProchaineConsultation: null,
        derniereDoseVAT: null,
        dateDerniereDoseVAT: null,
        dossierGrossesse: { id: 0 },
        employe: { id: currentUserId ?? 0 },
      })

      setIsAddModalOpen(false)
      toast.success("Consultation ajoutée avec succès")
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la consultation")
      console.error(error)
    }
  }

  const handleUpdateConsultation = async (updatedData: CreateConsultationPrenatalePayload, id: number) => {
    try {
      const updatedConsultation = await consultationPrenataleService.updateConsultationPrenatale(id, updatedData)
      setConsultations(consultations.map((c) => (c.id === id ? updatedConsultation : c)))
      toast.success("Consultation mise à jour avec succès")
      setEditingConsultation(null)
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
      console.error(error)
    }
  }

  const handleDeleteConsultation = async (id: number) => {
    try {
      await consultationPrenataleService.deleteConsultationPrenatale(id)
      setConsultations(consultations.filter((c) => c.id !== id))
      setDeletingConsultationId(null)
      toast.success("Consultation supprimée avec succès")
    } catch (error) {
      toast.error("Erreur lors de la suppression")
      console.error(error)
    }
  }

  const openViewDialog = async (id: number) => {
    try {
      const consultation = await consultationPrenataleService.getConsultationPrenataleById(id)
      setViewingConsultation(consultation)
    } catch (error) {
      toast.error("Erreur lors du chargement des détails")
      console.error(error)
    }
  }

  const openEditDialog = async (id: number) => {
    try {
      const consultation = await consultationPrenataleService.getConsultationPrenataleById(id)
      setEditingConsultation(consultation)
    } catch (error) {
      toast.error("Erreur lors du chargement des données")
      console.error(error)
    }
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <Activity className="h-12 w-12 animate-spin text-rose-500 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des consultations prénatales...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
            Réessayer
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Stethoscope className="h-8 w-8 text-rose-600" />
              Consultations Prénatales
            </h1>
            <p className="text-gray-600 mt-1">Suivi des consultations de grossesse selon le carnet de santé</p>
          </div>
          <Button
            className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-lg"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Consultation
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${stat.borderColor} border-l-4`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-3 rounded-lg ${stat.bgColor} shadow-sm`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <p className="text-xs text-gray-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-rose-600" />
              Recherche et Filtres
            </CardTitle>
            <CardDescription>Filtrez et recherchez parmi {consultations.length} consultations</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Rechercher par nom, ID consultation ou dossier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="normal">Consultations normales</SelectItem>
                  <SelectItem value="complications">Avec complications</SelectItem>
                </SelectContent>
              </Select>
              <Select value={trimesterFilter} onValueChange={setTrimesterFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par trimestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les trimestres</SelectItem>
                  <SelectItem value="1">1er Trimestre</SelectItem>
                  <SelectItem value="2">2ème Trimestre</SelectItem>
                  <SelectItem value="3">3ème Trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(statusFilter !== "all" || trimesterFilter !== "all" || searchTerm) && (
              <div className="mt-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("all")
                    setTrimesterFilter("all")
                    setSearchTerm("")
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Consultations Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-600" />
              Consultations Prénatales ({filteredConsultations.length})
            </CardTitle>
            <CardDescription>Historique des consultations de suivi de grossesse</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100">
                    <TableHead className="font-semibold text-rose-700">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Patiente & Dossier
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-rose-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date & Suivi
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-rose-700">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Données Cliniques
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-rose-700">
                      <div className="flex items-center gap-2">
                        <TestTube className="h-4 w-4" />
                        Complications & VAT
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-rose-700 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultations.map((consultation) => {
                    const dossier = consultation.dossierGrossesse
                    const complications = getComplicationsBadges(consultation)
                    return (
                      <TableRow key={consultation.id} className="hover:bg-rose-50/50 transition-colors">
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">
                              {dossier?.personne?.prenom} {dossier?.personne?.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {dossier?.personne?.dateNaissance
                                ? `${calculateAge(dossier.personne.dateNaissance)} ans`
                                : "Âge non renseigné"}
                            </div>
                            <div className="text-xs text-blue-600 font-mono">DG-{dossier?.id}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div>
                              <div className="font-medium text-gray-900">
                                {formatDate(consultation.dateConsultation)}
                              </div>
                              {dossier?.dateDerniereRegle && (
                                <div className="text-sm text-gray-500">
                                  {calculateGestationalAge(dossier.dateDerniereRegle)}
                                </div>
                              )}
                            </div>
                            {consultation.dateProchaineConsultation && (
                              <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                                <Clock className="h-3 w-3 inline mr-1" />
                                Prochain: {formatDate(consultation.dateProchaineConsultation)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-1">
                              <Scale className="h-3 w-3 text-purple-500" />
                              Poids: <strong>{consultation.poidsMere} kg</strong>
                            </div>
                            {consultation.hauteurUterine && (
                              <div className="flex items-center gap-1">
                                <Ruler className="h-3 w-3 text-blue-500" />
                                HU: <strong>{consultation.hauteurUterine} cm</strong>
                              </div>
                            )}
                            {consultation.bruitsCoeurFoetal && (
                              <div className="flex items-center gap-1">
                                <Baby className="h-3 w-3 text-pink-500" />
                                BCF: <strong>{consultation.bruitsCoeurFoetal}</strong>
                              </div>
                            )}
                            {consultation.mouvementsFoetus && (
                              <div className="text-xs text-gray-600">Mvts: {consultation.mouvementsFoetus}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {complications.length > 0 ? (
                                complications
                              ) : (
                                <Badge variant="outline" className="text-xs text-green-600">
                                  Normal
                                </Badge>
                              )}
                            </div>
                            {consultation.derniereDoseVAT && (
                              <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                <Syringe className="h-3 w-3 inline mr-1" />
                                VAT Dose {consultation.derniereDoseVAT}
                                {consultation.dateDerniereDoseVAT && (
                                  <span className="ml-1">({formatDate(consultation.dateDerniereDoseVAT)})</span>
                                )}
                              </div>
                            )}
                            {consultation.observationsGenerales && (
                              <p className="text-xs text-gray-600 line-clamp-2 max-w-xs">
                                {consultation.observationsGenerales}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 hover:border-green-300 bg-transparent"
                              onClick={() => consultation.id && openViewDialog(consultation.id)}
                              title="Voir la consultation"
                            >
                              <Eye className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                              onClick={() => consultation.id && openEditDialog(consultation.id)}
                              title="Modifier la consultation"
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
                              onClick={() => consultation.id && setDeletingConsultationId(consultation.id)}
                              title="Supprimer la consultation"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filteredConsultations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="text-gray-500">
                          <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">Aucune consultation trouvée</p>
                          <p className="text-sm">
                            {searchTerm || statusFilter !== "all" || trimesterFilter !== "all"
                              ? "Essayez de modifier vos critères de recherche"
                              : "Commencez par créer une nouvelle consultation"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Modales */}
        <AddConsultationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          dossiers={dossiers}
          newConsultation={newConsultation}
          setNewConsultation={setNewConsultation}
          handleAddConsultation={handleAddConsultation}
          currentUserId={currentUserId ?? 0}
        />

        <ViewConsultationModal consultation={viewingConsultation} onClose={() => setViewingConsultation(null)} />

        <EditConsultationModal
          consultation={editingConsultation}
          onClose={() => setEditingConsultation(null)}
          onUpdate={handleUpdateConsultation}
          dossiers={dossiers}
        />

        <ConfirmationModal
          isOpen={deletingConsultationId !== null}
          onClose={() => setDeletingConsultationId(null)}
          onOpenChange={(isOpen) => {
            if (!isOpen) setDeletingConsultationId(null)
          }}
          onConfirm={() => {
            if (deletingConsultationId) {
              handleDeleteConsultation(deletingConsultationId)
            }
          }}
          title="Confirmer la suppression"
          description="Êtes-vous sûr de vouloir supprimer cette consultation prénatale ? Cette action est irréversible et supprimera toutes les informations associées."
        />
      </div>
    </DashboardLayout>
  )
}
