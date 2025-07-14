"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  Search,
  Plus,
  Eye,
  Edit,
  FileText,
  AlertTriangle,
  TrendingUp,
  Baby,
  Activity,
  Clock,
  User,
  Stethoscope,
  Trash2
} from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { dossierGrossesseService } from "@/services/medical/dossier-grossesse.service"
import { getPersonnesPasGrossesse } from "@/services/utilisateur/personne.service"
import type { CreateDossierGrossessePayload, DossierGrossesse } from "@/types/medical"
import { Personne } from "@/types/utilisateur"
import { toast } from "sonner"
import { ConfirmationModal } from "@/components/modals/confirmation-modal"
import { CreateDossierGrossesseModal } from "@/components/modals/medical/create-dossier-grossesse-modal"
import { ViewDossierGrossesseModal } from "@/components/modals/medical/view-dossier-grossesse-modal"
import { formatDate, calculateGestationalAge, calculateTrimestre } from "@/lib/utils"

export default function SageFemmeGrossessesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [trimesterFilter, setTrimesterFilter] = useState("all")
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
  const [editingDossierId, setEditingDossierId] = useState<number | null>(null)

  // Stats calculation
  const stats = useMemo(() => {
    return [
      {
        title: "Grossesses Actives",
        value: dossiers.length.toString(),
        change: "+2 ce mois",
        icon: <Heart className="h-5 w-5" />,
        color: "text-rose-600",
        bgColor: "bg-rose-50",
      },
      {
        title: "1er Trimestre",
        value: dossiers.filter(d => calculateTrimestre(d.dateDerniereRegle) === 1).length.toString(),
        change: "Nouvelles",
        icon: <Activity className="h-5 w-5" />,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: "2ème Trimestre",
        value: dossiers.filter(d => calculateTrimestre(d.dateDerniereRegle) === 2).length.toString(),
        change: "En suivi",
        icon: <Stethoscope className="h-5 w-5" />,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: "3ème Trimestre",
        value: dossiers.filter(d => calculateTrimestre(d.dateDerniereRegle) === 3).length.toString(),
        change: "Proche terme",
        icon: <Baby className="h-5 w-5" />,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
    ]
  }, [dossiers])

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

  // Filter dossiers
  const filteredDossiers = useMemo(() => {
    return dossiers.filter(dossier => {
      const matchesSearch =
        dossier.personne?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dossier.personne?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dossier.id?.toString().includes(searchTerm)

      const matchesTrimester = 
        trimesterFilter === "all" || 
        calculateTrimestre(dossier.dateDerniereRegle).toString() === trimesterFilter

      return matchesSearch && matchesTrimester
    })
  }, [dossiers, searchTerm, trimesterFilter])

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
      setDossiers(prev => prev.filter(d => d.id !== dossierToDeleteId))
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
      if (!patientesSansDossier.some(p => p.id === dossierToEdit.personne.id)) {
        allPatientes.unshift(dossierToEdit.personne)
      }
      return allPatientes
    }
    return patientesSansDossier
  }, [dossierToEdit, patientesSansDossier])

  const getStatutBadge = (dossier: DossierGrossesse) => {
    // If you want to show a badge for complications, you can check for known risk factors
    if (dossier.presenceDiabeteGestationnel || dossier.presenceHypertensionGestationnelle) {
      return (
        <Badge variant="destructive" className="text-xs">
          Complications
        </Badge>
      )
    }

    const weeks = calculateGestationalAge(dossier.dateDerniereRegle).split(' ')[0];
    const weeksNum = parseInt(weeks);
    
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

  if (isLoading) {
    return (
      <DashboardLayout userRole="Sage-femme">
        <div className="flex h-full items-center justify-center">
          <Activity className="h-12 w-12 animate-spin text-rose-500" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout userRole="Sage-femme">
        <div className="text-red-500 text-center p-8">{error}</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="Sage-femme">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dossiers de Grossesse</h1>
            <p className="text-gray-600 mt-1">Suivi détaillé des grossesses en cours</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-rose-700 border-rose-200">
              <Heart className="w-3 h-3 mr-2" />
              {dossiers.length} Grossesses
            </Badge>
            <Button
              onClick={handleOpenCreateModal}
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Dossier
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-rose-600" />
              Recherche et Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher par nom, prénom ou ID dossier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={trimesterFilter} onValueChange={setTrimesterFilter}>
                <SelectTrigger className="w-full sm:w-48">
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
          </CardContent>
        </Card>

        {/* Grossesses Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-600" />
              Dossiers de Grossesse ({filteredDossiers.length})
            </CardTitle>
            <CardDescription>Suivi détaillé des grossesses avec informations complètes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100">
                    <TableHead className="font-semibold text-rose-700">Patiente</TableHead>
                    <TableHead className="font-semibold text-rose-700">Grossesse</TableHead>
                    <TableHead className="font-semibold text-rose-700">Terme</TableHead>
                    <TableHead className="font-semibold text-rose-700">Risques</TableHead>
                    <TableHead className="font-semibold text-rose-700 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDossiers.map((dossier) => (
                    <TableRow
                      key={dossier.id}
                      className="hover:bg-rose-50/50 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {dossier.personne?.prenom} {dossier.personne?.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {dossier.personne?.dateNaissance ? 
                              `${new Date().getFullYear() - new Date(dossier.personne.dateNaissance).getFullYear()} ans` : 'N/A'}
                          </div>
                          <div className="text-xs text-rose-500">
                            ID: DG-{dossier.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {calculateGestationalAge(dossier.dateDerniereRegle)}
                          </div>
                          <div className="text-sm text-gray-500">
                            DDR: {formatDate(dossier.dateDerniereRegle)}
                          </div>
                          <div className="mt-1">
                            {getTrimestreBadge(calculateTrimestre(dossier.dateDerniereRegle))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatDate(dossier.datePrevueAccouchement)}
                          </div>
                          <div className="text-xs text-rose-600">
                            {Math.ceil(
                              (new Date(dossier.datePrevueAccouchement).getTime() - new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            jours restants
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex gap-1 flex-wrap">
                            {dossier.presenceDiabeteGestationnel && (
                              <Badge variant="destructive" className="text-xs">
                                Diabète
                              </Badge>
                            )}
                            {dossier.presenceHypertensionGestationnelle && (
                              <Badge variant="destructive" className="text-xs">
                                Hypertension
                              </Badge>
                            )}
                            {!dossier.presenceDiabeteGestationnel && 
                              !dossier.presenceHypertensionGestationnelle && (
                              <Badge variant="outline" className="text-xs">
                                Aucun risque
                              </Badge>
                            )}
                          </div>
                          {getStatutBadge(dossier)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 hover:border-green-300"
                            onClick={() => handleViewDossier(dossier)}
                          >
                            <Eye className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                            onClick={() => handleOpenEditModal(dossier)}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
                            onClick={() => {
                              setDossierToDeleteId(dossier.id || null)
                              setIsDeleteConfirmOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-rose-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
        <ViewDossierGrossesseModal
          isOpen={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          dossier={dossierToView}
        />
        <ConfirmationModal
          isOpen={isDeleteConfirmOpen}
          onOpenChange={setIsDeleteConfirmOpen}
          onConfirm={handleConfirmDelete}
          title="Confirmation de suppression"
          description="Êtes-vous sûr de vouloir supprimer ce dossier de grossesse ? Cette action est irréversible."
        />
      </div>
    </DashboardLayout>
  )
}