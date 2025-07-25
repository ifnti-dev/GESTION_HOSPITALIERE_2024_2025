"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Heart,
  Search,
  Plus,
  Eye,
  Edit,
  AlertTriangle,
  TrendingUp,
  Baby,
  Activity,
  User,
  Stethoscope,
  Trash2,
  Calendar,
  FileText,
  Users,
  TestTube,
} from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { dossierGrossesseService } from "@/services/medical/dossier-grossesse.service"
import { getPersonnesPasGrossesse } from "@/services/utilisateur/personne.service"
import type { CreateDossierGrossessePayload, DossierGrossesse } from "@/types/medical"
import type { Personne } from "@/types/utilisateur"
import { toast } from "sonner"
import { ConfirmationModal } from "@/components/modals/confirmation-modal"
import { CreateDossierGrossesseModal } from "@/components/modals/medical/create-dossier-grossesse-modal"
import { ViewDossierGrossesseModal } from "@/components/modals/medical/view-dossier-grossesse-modal"
import { formatDate, calculateGestationalAge, calculateTrimestre } from "@/lib/utils"

export default function SageFemmeGrossessesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [trimesterFilter, setTrimesterFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dossiers, setDossiers] = useState<DossierGrossesse[]>([])
  const [patientesSansDossier, setPatientesSansDossier] = useState<Personne[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [dossierToView, setDossierToView] = useState<DossierGrossesse | null>(null)
  const [dossierToEdit, setDossierToEdit] = useState<DossierGrossesse | null>(null)
  const [dossierToDeleteId, setDossierToDeleteId] = useState<number | null>(null)

  // Enhanced stats calculation
  const stats = useMemo(() => {
    const totalDossiers = dossiers.length
    const trimester1 = dossiers.filter((d) => calculateTrimestre(d.dateDerniereRegle) === 1).length
    const trimester2 = dossiers.filter((d) => calculateTrimestre(d.dateDerniereRegle) === 2).length
    const trimester3 = dossiers.filter((d) => calculateTrimestre(d.dateDerniereRegle) === 3).length
    
    return [
      {
        title: "Grossesses Actives",
        value: totalDossiers.toString(),
        change: `${patientesSansDossier.length} patientes disponibles`,
        icon: <Heart className="h-5 w-5" />,
        color: "text-rose-600",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
      },
      {
        title: "1er Trimestre",
        value: trimester1.toString(),
        change: "Nouvelles grossesses",
        icon: <Activity className="h-5 w-5" />,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      {
        title: "2ème Trimestre",
        value: trimester2.toString(),
        change: "Suivi régulier",
        icon: <Stethoscope className="h-5 w-5" />,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      {
        title: "3ème Trimestre",
        value: trimester3.toString(),
        change: "Proche du terme",
        icon: <Baby className="h-5 w-5" />,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      },
    ]
  }, [dossiers, patientesSansDossier])

  // Helper function to check for risk factors
  const hasRiskFactors = (dossier: DossierGrossesse) => {
    return (
      dossier.antecedentsMedicaux?.toLowerCase().includes("diabète") ||
      dossier.antecedentsMedicaux?.toLowerCase().includes("hypertension") ||
      dossier.antecedentsObstetricaux?.toLowerCase().includes("césarienne") ||
      dossier.antecedentsChirurgicaux?.length > 0 ||
      dossier.statutSerologieHiv === "Positif" ||
      dossier.statutSerologieSyphilis === "Positif" ||
      dossier.nombreGrossesses > 5 ||
      new Date().getFullYear() - new Date(dossier.personne?.dateNaissance || "").getFullYear() > 35
    )
  }

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [dossiersData, patientesData] = await Promise.all([
          dossierGrossesseService.getAllDossiersGrossesse(),
          getPersonnesPasGrossesse(),
        ])
        setDossiers(dossiersData)
        setPatientesSansDossier(patientesData)
      } catch (err) {
        setError("Erreur lors de la récupération des données.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Enhanced filter dossiers
  const filteredDossiers = useMemo(() => {
    return dossiers.filter((dossier) => {
      const matchesSearch =
        dossier.personne?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dossier.personne?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dossier.nomPartenaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dossier.prenomsPartenaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dossier.id?.toString().includes(searchTerm)

      const matchesTrimester =
        trimesterFilter === "all" || calculateTrimestre(dossier.dateDerniereRegle).toString() === trimesterFilter

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "risk" && hasRiskFactors(dossier)) ||
        (statusFilter === "normal" && !hasRiskFactors(dossier))

      return matchesSearch && matchesTrimester && matchesStatus
    })
  }, [dossiers, searchTerm, trimesterFilter, statusFilter])

  // Handle view dossier
  const handleViewDossier = (dossier: DossierGrossesse) => {
    setDossierToView(dossier)
    setIsViewModalOpen(true)
  }

  // Handle open edit modal
  const handleOpenEditModal = (dossier: DossierGrossesse) => {
    setDossierToEdit(dossier)
    setIsModalOpen(true)
  }

  // Handle open create modal
  const handleOpenCreateModal = () => {
    setDossierToEdit(null)
    setIsModalOpen(true)
  }

  // Handle dossier submission
  const handleModalSubmit = async (formData: CreateDossierGrossessePayload, id?: number) => {
    try {
      if (id) {
        await dossierGrossesseService.updateDossierGrossesse(id, formData)
        toast.success("Dossier mis à jour avec succès !")
      } else {
        await dossierGrossesseService.createDossierGrossesse(formData)
        toast.success("Dossier créé avec succès !")
        // Refresh patientes without dossier
        const data = await getPersonnesPasGrossesse()
        setPatientesSansDossier(data)
      }
      setIsModalOpen(false)
      // Refresh dossiers
      const data = await dossierGrossesseService.getAllDossiersGrossesse()
      setDossiers(data)
    } catch (error) {
      toast.error(`Erreur lors de ${id ? "la mise à jour" : "la création"} du dossier`)
    }
  }

  // Handle delete dossier
  const handleConfirmDelete = async () => {
    if (dossierToDeleteId === null) return
    try {
      await dossierGrossesseService.deleteDossierGrossesse(dossierToDeleteId)
      setDossiers((prev) => prev.filter((d) => d.id !== dossierToDeleteId))
      toast.success("Dossier supprimé avec succès !")
      // Refresh patientes without dossier
      const data = await getPersonnesPasGrossesse()
      setPatientesSansDossier(data)
    } catch (error) {
      toast.error("Erreur lors de la suppression du dossier")
    } finally {
      setDossierToDeleteId(null)
      setIsDeleteConfirmOpen(false)
    }
  }

  // Get patientes for modal
  const patientesForModal = useMemo(() => {
    if (dossierToEdit && dossierToEdit.personne) {
      const allPatientes = [...patientesSansDossier]
      if (!patientesSansDossier.some((p) => p.id === dossierToEdit.personne.id)) {
        allPatientes.unshift(dossierToEdit.personne)
      }
      return allPatientes
    }
    return patientesSansDossier
  }, [dossierToEdit, patientesSansDossier])

  // Get status badge based on risk factors and gestational age
  const getStatutBadge = (dossier: DossierGrossesse) => {
    const hasRisks = hasRiskFactors(dossier)
    const weeks = calculateGestationalAge(dossier.dateDerniereRegle).split(" ")[0]
    const weeksNum = Number.parseInt(weeks)

    if (hasRisks) {
      return (
        <Badge variant="destructive" className="text-xs">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Surveillance
        </Badge>
      )
    }

    if (weeksNum < 14) {
      return (
        <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50 text-xs">
          Début
        </Badge>
      )
    }
    if (weeksNum < 28) {
      return (
        <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 text-xs">
          Normal
        </Badge>
      )
    }
    if (weeksNum < 37) {
      return (
        <Badge variant="outline" className="text-orange-700 border-orange-200 bg-orange-50 text-xs">
          Surveillance
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50 text-xs">
        À terme
      </Badge>
    )
  }

  const getTrimestreBadge = (trimestre: number) => {
    const colors = {
      1: "text-blue-700 border-blue-200 bg-blue-50",
      2: "text-green-700 border-green-200 bg-green-50",
      3: "text-purple-700 border-purple-200 bg-purple-50",
    }
    return (
      <Badge variant="outline" className={`text-xs ${colors[trimestre as keyof typeof colors]}`}>
        T{trimestre}
      </Badge>
    )
  }

  // Get risk factors display
  const getRiskFactorsDisplay = (dossier: DossierGrossesse) => {
    const risks = []

    if (dossier.antecedentsMedicaux?.toLowerCase().includes("diabète")) {
      risks.push("Diabète")
    }
    if (dossier.antecedentsMedicaux?.toLowerCase().includes("hypertension")) {
      risks.push("HTA")
    }
    if (dossier.statutSerologieHiv === "Positif") {
      risks.push("VIH+")
    }
    if (dossier.nombreGrossesses > 5) {
      risks.push("Grande multipare")
    }
    if (new Date().getFullYear() - new Date(dossier.personne?.dateNaissance || "").getFullYear() > 35) {
      risks.push("Âge maternel")
    }

    return risks
  }

  if (isLoading) {
    return (
      <DashboardLayout >
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <Activity className="h-12 w-12 animate-spin text-rose-500 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des dossiers de grossesse...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout >
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
    <DashboardLayout >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="h-8 w-8 text-rose-600" />
              Dossiers de Grossesse
            </h1>
            <p className="text-gray-600 mt-1">Suivi détaillé des grossesses selon le carnet de santé mère et enfant</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-rose-700 border-rose-200 bg-rose-50">
              <Heart className="w-3 h-3 mr-2" />
              {dossiers.length} Grossesses actives
            </Badge>
            <Button
              onClick={handleOpenCreateModal}
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Dossier
            </Button>
          </div>
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
            <CardDescription>Filtrez et recherchez parmi {dossiers.length} dossiers de grossesse</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Input
                  placeholder="Rechercher par nom, prénom, partenaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="normal">Grossesses normales</SelectItem>
                  <SelectItem value="risk">Grossesses à risque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Grossesses Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-rose-600" />
              Dossiers de Grossesse ({filteredDossiers.length})
            </CardTitle>
            <CardDescription>Suivi détaillé avec informations complètes du carnet de santé</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100">
                    <TableHead className="font-semibold text-rose-700">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Patiente & Partenaire
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-rose-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Grossesse
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-rose-700">
                      <div className="flex items-center gap-2">
                        <TestTube className="h-4 w-4" />
                        Informations Médicales
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-rose-700">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Risques & Statut
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-rose-700 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDossiers.map((dossier) => {
                    const riskFactors = getRiskFactorsDisplay(dossier)
                    return (
                      <TableRow key={dossier.id} className="hover:bg-rose-50/50 transition-colors">
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div>
                              <div className="font-medium text-gray-900">
                                {dossier.personne?.prenom} {dossier.personne?.nom}
                              </div>
                              <div className="text-sm text-gray-500">
                                {dossier.personne?.dateNaissance
                                  ? `${new Date().getFullYear() - new Date(dossier.personne.dateNaissance).getFullYear()} ans`
                                  : "Âge non renseigné"}
                              </div>
                            </div>
                            {(dossier.nomPartenaire || dossier.prenomsPartenaire) && (
                              <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                <Users className="h-3 w-3 inline mr-1" />
                                Partenaire: {dossier.prenomsPartenaire} {dossier.nomPartenaire}
                              </div>
                            )}
                            <div className="text-xs text-rose-500 font-mono">ID: DG-{dossier.id}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div>
                              <div className="font-medium text-gray-900">
                                {calculateGestationalAge(dossier.dateDerniereRegle)}
                              </div>
                              <div className="text-sm text-gray-500">DDR: {formatDate(dossier.dateDerniereRegle)}</div>
                              <div className="text-sm text-gray-500">
                                DPA: {formatDate(dossier.datePrevueAccouchement)}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {getTrimestreBadge(calculateTrimestre(dossier.dateDerniereRegle))}
                              <Badge variant="outline" className="text-xs">
                                G{dossier.nombreGrossesses}P{dossier.nombreAccouchements}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            {dossier.groupeSanguin && (
                              <div className="text-sm">
                                <span className="font-medium">Groupe:</span> {dossier.groupeSanguin}
                                {dossier.rhesus}
                              </div>
                            )}
                            <div className="flex flex-wrap gap-1">
                              {dossier.statutSerologieRubeole && (
                                <Badge variant="outline" className="text-xs">
                                  Rubéole: {dossier.statutSerologieRubeole}
                                </Badge>
                              )}
                              {dossier.statutSerologieHiv && (
                                <Badge
                                  variant={dossier.statutSerologieHiv === "Positif" ? "destructive" : "outline"}
                                  className="text-xs"
                                >
                                  VIH: {dossier.statutSerologieHiv}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {riskFactors.length > 0 ? (
                                riskFactors.map((risk, index) => (
                                  <Badge key={index} variant="destructive" className="text-xs">
                                    {risk}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="outline" className="text-xs text-green-600">
                                  Aucun risque identifié
                                </Badge>
                              )}
                            </div>
                            <div>{getStatutBadge(dossier)}</div>
                            <div className="text-xs text-gray-500">
                              {Math.ceil(
                                (new Date(dossier.datePrevueAccouchement).getTime() - new Date().getTime()) /
                                  (1000 * 60 * 60 * 24),
                              )}{" "}
                              jours restants
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 hover:border-green-300 bg-transparent"
                              onClick={() => handleViewDossier(dossier)}
                              title="Voir le dossier"
                            >
                              <Eye className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                              onClick={() => handleOpenEditModal(dossier)}
                              title="Modifier le dossier"
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-rose-200 hover:bg-rose-50 hover:border-rose-300 bg-transparent"
                              onClick={() => {
                                setDossierToDeleteId(dossier.id || null)
                                setIsDeleteConfirmOpen(true)
                              }}
                              title="Supprimer le dossier"
                            >
                              <Trash2 className="h-4 w-4 text-rose-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filteredDossiers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">Aucun dossier trouvé</p>
                          <p className="text-sm">
                            {searchTerm || trimesterFilter !== "all" || statusFilter !== "all"
                              ? "Essayez de modifier vos critères de recherche"
                              : "Commencez par créer un nouveau dossier de grossesse"}
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

        {/* Modals */}
        <CreateDossierGrossesseModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSubmit={handleModalSubmit}
          patientes={patientesForModal}
          initialData={dossierToEdit}
        />

        <ViewDossierGrossesseModal isOpen={isViewModalOpen} onOpenChange={setIsViewModalOpen} dossier={dossierToView} />

        <ConfirmationModal
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onOpenChange={setIsDeleteConfirmOpen}
          onConfirm={handleConfirmDelete}
          title="Confirmation de suppression"
          description="Êtes-vous sûr de vouloir supprimer ce dossier de grossesse ? Cette action est irréversible et supprimera toutes les informations associées."
        />
      </div>
    </DashboardLayout>
  )
}
