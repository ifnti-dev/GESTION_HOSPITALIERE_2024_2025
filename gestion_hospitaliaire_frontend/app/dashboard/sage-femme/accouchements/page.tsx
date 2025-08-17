"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect, useMemo } from "react"
import { accouchementService } from "@/services/Accouchement/accouchement.service"
import { dossierGrossesseService } from "@/services/medical/dossier-grossesse.service"
import type { Accouchement, CreateAccouchementPayload } from "@/types/accouchement"
import type { DossierGrossesse } from "@/types/medical"
import { toast } from "sonner"
import { ConfirmationModal } from "@/components/modals/confirmation-modal"
import { CreateAccouchementModal } from "@/components/modals/medical/create-accouchement-modal"
import { ViewAccouchementModal } from "@/components/modals/medical/view-accouchement-modal"
import { EditAccouchementModal } from "@/components/modals/medical/edit-accouchement-modal"
import {
  Baby,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Activity,
  Calendar,
  Heart,
  TrendingUp,
  X,
  AlertTriangle,
  Users,
  Clock,
  Stethoscope,
  Scale,
  MapPin,
  Timer,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function SageFemmeAccouchementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [accouchements, setAccouchements] = useState<Accouchement[]>([])
  const [dossiers, setDossiers] = useState<DossierGrossesse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // États pour les modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [viewingAccouchement, setViewingAccouchement] = useState<Accouchement | null>(null)
  const [editingAccouchement, setEditingAccouchement] = useState<Accouchement | null>(null)
  const [deletingAccouchementId, setDeletingAccouchementId] = useState<number | null>(null)

  // Chargement initial des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [accouchementsData, dossiersData] = await Promise.all([
          accouchementService.getAccouchements(),
          dossierGrossesseService.getAllDossiersGrossesse(),
        ])
        setAccouchements(accouchementsData)
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

  // Filtrage des accouchements
  const filteredAccouchements = useMemo(() => {
    return accouchements.filter((accouchement) => {
      const patienteName = `${accouchement.dossierGrossesse.personne?.prenom} ${accouchement.dossierGrossesse.personne?.nom}`.toLowerCase()
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        patienteName.includes(searchLower) ||
        accouchement.id?.toString().includes(searchLower) ||
        accouchement.lieu?.toLowerCase().includes(searchLower) ||
        accouchement.dossierGrossesse?.id?.toString().includes(searchLower)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "vivant" && accouchement.vivant) ||
        (statusFilter === "complications" &&
          (accouchement.hemorragieGrave || accouchement.reanime || accouchement.mortNe)) ||
        (statusFilter === "normal" && accouchement.vivant && !accouchement.hemorragieGrave && !accouchement.reanime)

      const matchesType =
        typeFilter === "all" || accouchement.typeAccouchement?.toLowerCase().includes(typeFilter.toLowerCase())

      return matchesSearch && matchesStatus && matchesType
    })
  }, [accouchements, searchTerm, statusFilter, typeFilter])

  // Statistiques calculées
  const stats = useMemo(() => {
    const totalAccouchements = accouchements.length
    const vivants = accouchements.filter((a) => a.vivant).length
    const complications = accouchements.filter((a) => a.hemorragieGrave || a.reanime || a.mortNe).length
    const cesariennes = accouchements.filter((a) => a.typeAccouchement?.toLowerCase().includes("césarienne")).length

    return [
      {
        title: "Accouchements Total",
        value: totalAccouchements.toString(),
        change: "Ce mois",
        icon: <Baby className="h-5 w-5" />,
        color: "text-rose-600",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
      },
      {
        title: "Nouveau-nés Vivants",
        value: vivants.toString(),
        change: `${totalAccouchements > 0 ? Math.round((vivants / totalAccouchements) * 100) : 0}%`,
        icon: <Heart className="h-5 w-5" />,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      {
        title: "Complications",
        value: complications.toString(),
        change: "Surveillance",
        icon: <AlertTriangle className="h-5 w-5" />,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
      {
        title: "Césariennes",
        value: cesariennes.toString(),
        change: `${totalAccouchements > 0 ? Math.round((cesariennes / totalAccouchements) * 100) : 0}%`,
        icon: <Stethoscope className="h-5 w-5" />,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
    ]
  }, [accouchements])

  const handleAddAccouchement = async (data: CreateAccouchementPayload) => {
    try {
      const newAccouchement = await accouchementService.createAccouchement(data)
      setAccouchements([...accouchements, newAccouchement])
      setIsAddModalOpen(false)
      toast.success("Accouchement enregistré avec succès")
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement")
      console.error(error)
    }
  }

  const handleUpdateAccouchement = async (id: number, data: Partial<CreateAccouchementPayload>) => {
    try {
      const updatedAccouchement = await accouchementService.updateAccouchement(id, data)
      setAccouchements(accouchements.map((a) => (a.id === id ? updatedAccouchement : a)))
      toast.success("Accouchement mis à jour avec succès")
      setEditingAccouchement(null)
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
      console.error(error)
    }
  }

  const handleDeleteAccouchement = async (id: number) => {
    try {
      await accouchementService.deleteAccouchement(id)
      setAccouchements(accouchements.filter((a) => a.id !== id))
      setDeletingAccouchementId(null)
      toast.success("Accouchement supprimé avec succès")
    } catch (error) {
      toast.error("Erreur lors de la suppression")
      console.error(error)
    }
  }

  const openViewDialog = (accouchement: Accouchement) => {
    setViewingAccouchement(accouchement)
  }

  const openEditDialog = (accouchement: Accouchement) => {
    setEditingAccouchement(accouchement)
  }

  const getStatusBadge = (accouchement: Accouchement) => {
    if (accouchement.mortNe) {
      return (
        <Badge variant="destructive" className="text-xs">
          <XCircle className="w-3 h-3 mr-1" />
          Mort-né
        </Badge>
      )
    }
    if (accouchement.vivant) {
      if (accouchement.hemorragieGrave || accouchement.reanime) {
        return (
          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Complications
          </Badge>
        )
      }
      return (
        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Vivant
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-xs">
        Non spécifié
      </Badge>
    )
  }

  const getApgarBadge = (apgar1: number | null, apgar5: number | null) => {
    if (!apgar1 && !apgar5) return null

    const score = apgar5 || apgar1 || 0
    let variant: "default" | "secondary" | "destructive" = "default"
    let color = "text-green-700"

    if (score < 4) {
      variant = "destructive"
      color = "text-red-700"
    } else if (score < 7) {
      variant = "secondary"
      color = "text-orange-700"
    }

    return (
      <Badge variant={variant} className={`text-xs ${color}`}>
        APGAR: {apgar1 || 0}/{apgar5 || 0}
      </Badge>
    )
  }

  if (loading) {
    return (
      <DashboardLayout >
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <Activity className="h-12 w-12 animate-spin text-rose-500 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des accouchements...</p>
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
              <Baby className="h-8 w-8 text-rose-600" />
              Accouchements
            </h1>
            <p className="text-gray-600 mt-1">Registre des naissances et suivi post-partum</p>
          </div>
          <Button
            className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-lg"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Accouchement
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
            <CardDescription>Filtrez et recherchez parmi {accouchements.length} accouchements</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Rechercher par nom, lieu, ID..."
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
                  <SelectItem value="vivant">Nouveau-nés vivants</SelectItem>
                  <SelectItem value="complications">Avec complications</SelectItem>
                  <SelectItem value="normal">Accouchements normaux</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'accouchement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="voie basse">Voie basse</SelectItem>
                  <SelectItem value="césarienne">Césarienne</SelectItem>
                  <SelectItem value="forceps">Forceps</SelectItem>
                  <SelectItem value="ventouse">Ventouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(statusFilter !== "all" || typeFilter !== "all" || searchTerm) && (
              <div className="mt-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("all")
                    setTypeFilter("all")
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

        {/* Accouchements Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-rose-600" />
              Registre des Accouchements ({filteredAccouchements.length})
            </CardTitle>
            <CardDescription>Historique complet des naissances et données néonatales</CardDescription>
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
                        Date & Heure
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-rose-700">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Type & Lieu
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-rose-700">
                      <div className="flex items-center gap-2">
                        <Baby className="h-4 w-4" />
                        Nouveau-né
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-rose-700">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Statut & Scores
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-rose-700 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccouchements.map((accouchement) => {
                    const apgarBadge = getApgarBadge(accouchement.apgar1min, accouchement.apgar5min)
                    return (
                      <TableRow key={accouchement.id} className="hover:bg-rose-50/50 transition-colors">
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">
                              {accouchement.dossierGrossesse.personne?.prenom} {accouchement.dossierGrossesse.personne?.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {accouchement.dossierGrossesse.personne?.dateNaissance
                                ? `${new Date().getFullYear() - new Date(accouchement.dossierGrossesse.personne.dateNaissance).getFullYear()} ans`
                                : "Âge non renseigné"}
                            </div>
                            <div className="text-xs text-blue-600 font-mono">
                              DG-{accouchement.dossierGrossesse?.id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{formatDate(accouchement.date)}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {accouchement.heure}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{accouchement.typeAccouchement}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {accouchement.lieu}
                            </div>
                            <div className="text-xs text-gray-600">{accouchement.presentation}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Scale className="h-3 w-3 text-purple-500" />
                              <span className="font-medium">{accouchement.poids}g</span>
                            </div>
                            {accouchement.taille && (
                              <div className="text-sm text-gray-600">Taille: {accouchement.taille}cm</div>
                            )}
                            {accouchement.sexe && (
                              <Badge variant="outline" className="text-xs">
                                {accouchement.sexe === "M" ? "Garçon" : "Fille"}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div>{getStatusBadge(accouchement)}</div>
                            {apgarBadge && <div>{apgarBadge}</div>}
                            {accouchement.reanime && (
                              <Badge variant="secondary" className="text-xs">
                                <Timer className="w-3 h-3 mr-1" />
                                Réanimé
                              </Badge>
                            )}
                            {accouchement.hemorragieGrave && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Hémorragie
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 hover:border-green-300 bg-transparent"
                              onClick={() => openViewDialog(accouchement)}
                              title="Voir l'accouchement"
                            >
                              <Eye className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                              onClick={() => openEditDialog(accouchement)}
                              title="Modifier l'accouchement"
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
                              onClick={() => setDeletingAccouchementId(accouchement.id)}
                              title="Supprimer l'accouchement"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filteredAccouchements.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-gray-500">
                          <Baby className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">Aucun accouchement trouvé</p>
                          <p className="text-sm">
                            {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                              ? "Essayez de modifier vos critères de recherche"
                              : "Commencez par enregistrer un nouvel accouchement"}
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
        <CreateAccouchementModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddAccouchement}
          dossiers={dossiers}
        />

        <ViewAccouchementModal accouchement={viewingAccouchement} onClose={() => setViewingAccouchement(null)} />

        <EditAccouchementModal
          accouchement={editingAccouchement}
          onClose={() => setEditingAccouchement(null)}
          onUpdate={handleUpdateAccouchement}
          dossiers={dossiers}
        />

        <ConfirmationModal
          isOpen={deletingAccouchementId !== null}
          onClose={() => setDeletingAccouchementId(null)}
          onOpenChange={(isOpen) => {
            if (!isOpen) setDeletingAccouchementId(null)
          }}
          onConfirm={() => {
            if (deletingAccouchementId) {
              handleDeleteAccouchement(deletingAccouchementId)
            }
          }}
          title="Confirmer la suppression"
          description="Êtes-vous sûr de vouloir supprimer cet accouchement ? Cette action est irréversible et supprimera toutes les informations associées."
        />
      </div>
    </DashboardLayout>
  )
}
