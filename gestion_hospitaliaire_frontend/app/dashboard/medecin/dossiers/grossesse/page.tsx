"use client"

import { DashboardLayout } from "../../../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Search, Eye, Edit, Trash2, FilePlus, Activity, AlertTriangle, Baby, Heart, Filter } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { dossierGrossesseService } from "@/services/medical/dossier-grossesse.service"
import { getPersonnesPasGrossesse } from "@/services/utilisateur/personne.service"
import type { CreateDossierGrossessePayload, DossierGrossesse } from "@/types/medical"
import { Personne } from "@/types/utilisateur"
import { toast } from "sonner"
import { ConfirmationModal } from "@/components/modals/confirmation-modal"
import { CreateDossierGrossesseModal } from "../../../../../components/modals/medical/create-dossier-grossesse-modal"
import { ViewDossierGrossesseModal } from "../../../../../components/modals/medical/view-dossier-grossesse-modal"

export default function MedecinDossiersGrossessePage() {
  const [searchTerm, setSearchTerm] = useState("")
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

  const fetchDossiersGrossesse = async () => {
    try {
      const data = await dossierGrossesseService.getAllDossiersGrossesse()
      setDossiers(data)
    } catch (err) {
      toast.error("Erreur lors de la récupération des dossiers de grossesse.")
      console.error(err)
    }
  }

  const fetchPatientesSansDossier = async () => {
    try {
      const data = await getPersonnesPasGrossesse()
      setPatientesSansDossier(data)
    } catch (err) {
      toast.error("Erreur lors de la récupération des patientes.")
      console.error(err)
    }
  }

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

  const handleViewDossier = (dossier: DossierGrossesse) => {
    setDossierToView(dossier)
    setIsViewModalOpen(true)
  }

  const handleOpenAddModal = () => {
    setDossierToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = async (dossier: DossierGrossesse) => {
    if (!dossier.id) return
    setEditingDossierId(dossier.id)
    try {
      const fullDossierData = await dossierGrossesseService.getDossierGrossesseById(dossier.id)
      setDossierToEdit(fullDossierData)
      setIsModalOpen(true)
    } catch (error) {
      toast.error("Impossible de charger les données du dossier pour la modification.")
    } finally {
      setEditingDossierId(null)
    }
  }

  const handleModalSubmit = async (formData: CreateDossierGrossessePayload, id?: number) => {
    try {
      if (id) {
        await dossierGrossesseService.updateDossierGrossesse(id, formData)
        toast.success("Dossier de grossesse mis à jour avec succès !")
      } else {
        await dossierGrossesseService.createDossierGrossesse(formData)
        toast.success("Dossier de grossesse créé avec succès !")
        fetchPatientesSansDossier()
      }
      setIsModalOpen(false)
      fetchDossiersGrossesse()
    } catch (error) {
      toast.error(`Erreur lors de la ${id ? "mise à jour" : "création"} du dossier.`)
    }
  }

  const requestDeleteDossier = (dossierId: number | undefined) => {
    if (dossierId === undefined) return
    setDossierToDeleteId(dossierId)
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (dossierToDeleteId === null) return
    try {
      await dossierGrossesseService.deleteDossierGrossesse(dossierToDeleteId)
      setDossiers((prev) => prev.filter((d) => d.id !== dossierToDeleteId))
      toast.success("Dossier de grossesse supprimé avec succès !")
      fetchPatientesSansDossier()
    } catch (error) {
      toast.error("Erreur lors de la suppression du dossier.")
    } finally {
      setDossierToDeleteId(null)
    }
  }

  const patientesForModal = useMemo(() => {
    // En mode édition, nous devons afficher la patiente actuelle dans la liste,
    // en plus des patientes qui n'ont pas encore de dossier.
    if (dossierToEdit && dossierToEdit.personne) {
      const allPatientes = [...patientesSansDossier]
      // Ajoute la patiente en cours de modification à la liste si elle n'y est pas déjà
      if (!patientesSansDossier.some(p => p.id === dossierToEdit.personne.id)) {
        allPatientes.unshift(dossierToEdit.personne)
      }
      return allPatientes
    }
    // En mode création, n'afficher que les patientes sans dossier.
    return patientesSansDossier
  }, [dossierToEdit, patientesSansDossier])

  const filteredDossiers = dossiers.filter(
    (dossier) =>
      dossier.personne?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.personne?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.id?.toString().includes(searchTerm)
  )

  if (isLoading) {
    return (
      <DashboardLayout userRole="Médecin">
        <div className="flex h-full items-center justify-center">
          <Activity className="h-12 w-12 animate-spin text-indigo-500" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout userRole="Médecin">
        <div className="text-red-500 text-center">{error}</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="Médecin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              Dossiers de Grossesse
            </h1>
            <p className="text-gray-600 mt-2">Suivi obstétrical des patientes</p>
          </div>
          <div>
            <Button
              onClick={handleOpenAddModal}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg"
            >
              <FilePlus className="h-4 w-4 mr-2" />
              Nouveau Dossier Grossesse
            </Button>
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
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-indigo-600" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, prénom ou numéro de dossier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dossiers de Grossesse ({filteredDossiers.length})
            </CardTitle>
            <CardDescription className="text-teal-100">
              Liste des dossiers de suivi de grossesse
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Dossier</TableHead>
                    <TableHead className="font-semibold text-gray-700">Patiente</TableHead>
                    <TableHead className="font-semibold text-gray-700">Âge Gestationnel</TableHead>
                    <TableHead className="font-semibold text-gray-700">Date Prévue d'Accouchement</TableHead>
                    <TableHead className="font-semibold text-gray-700">Risques</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDossiers.map((dossier, index) => (
                    <TableRow key={dossier.id} className="hover:bg-blue-50 transition-colors">
                      <TableCell>
                        <div className="font-semibold text-gray-900">DG-{dossier.id}</div>
                        <div className="text-sm text-gray-500">
                          Ouvert le {new Date(dossier.dateOuverture).toLocaleDateString("fr-FR")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {dossier.personne?.prenom} {dossier.personne?.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          {dossier.personne?.dateNaissance ? `${new Date().getFullYear() - new Date(dossier.personne.dateNaissance).getFullYear()} ans` : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                          {/* Logic to calculate gestational age would go here */}
                          N/A
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-800">
                          {new Date(dossier.datePrevueAccouchement).toLocaleDateString("fr-FR")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {dossier.presenceDiabeteGestationnel && (
                            <Badge variant="destructive">Diabète</Badge>
                          )}
                          {dossier.presenceHypertensionGestationnelle && (
                            <Badge variant="destructive">Hypertension</Badge>
                          )}
                          {!dossier.presenceDiabeteGestationnel && !dossier.presenceHypertensionGestationnelle && (
                            <Badge variant="outline">Aucun</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleViewDossier(dossier)}>
                            <Eye className="h-3 w-3 mr-1" /> Consulter
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleOpenEditModal(dossier)} disabled={editingDossierId === dossier.id}>
                            {editingDossierId === dossier.id ? <Activity className="h-3 w-3 animate-spin" /> : <Edit className="h-3 w-3" />}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => requestDeleteDossier(dossier.id)}>
                            <Trash2 className="h-3 w-3" />
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
      </div>
    </DashboardLayout>
  )
}