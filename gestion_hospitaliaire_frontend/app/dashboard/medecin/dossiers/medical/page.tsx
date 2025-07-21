"use client"

import {DashboardLayout} from "../../../../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Search, Filter, Eye, Edit, Trash2, FilePlus, Activity, AlertCircle, Clock } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { CreateDossierPatientModal } from "@/components/modals/medical/create-dossier-patient-modal"
import { ViewDossierPatientModal } from "@/components/modals/medical/view-dossier-patient-modal"
import { ConfirmationModal } from "@/components/modals/confirmation-modal"
import { dossierMedicalService } from "@/services/medical/dossier-medical.service"
import { getPersonnesPasMedical } from "@/services/utilisateur/personne.service"


import type { CreateDossierMedicalPayload, DossierMedical } from "@/types/medical" // Assurez-vous que ce chemin est correct

import { Personne } from "@/types/utilisateur"
import { toast } from "sonner"

export default function MedecinDossiersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dossiers, setDossiers] = useState<DossierMedical[]>([])
  const [patientsSansDossier, setPatientsSansDossier] = useState<Personne[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [dossierToView, setDossierToView] = useState<DossierMedical | null>(null)
  const [dossierToEdit, setDossierToEdit] = useState<DossierMedical | null>(null)
  const [editingDossierId, setEditingDossierId] = useState<number | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [dossierToDeleteId, setDossierToDeleteId] = useState<number | null>(null)

  const fetchDossiers = async () => {
    try {
      const data = await dossierMedicalService.getAllDossiers()
      setDossiers(data)
    } catch (err) {
      toast.error("Erreur lors de la récupération des dossiers.")
      console.error(err)
    }
  }
  const fetchPatientsSansDossier = async () => {
    try {
      const data = await getPersonnesPasMedical()
      setPatientsSansDossier(data)
    } catch (err) {
      toast.error("Erreur lors de la récupération des patients.")
      console.error(err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Using Promise.all to fetch in parallel
        const [dossiersData, patientsData] = await Promise.all([
          dossierMedicalService.getAllDossiers(),
          getPersonnesPasMedical(),
        ]) 
        setDossiers(dossiersData)
        setPatientsSansDossier(patientsData)
      } catch (err) {
        setError("Erreur lors de la récupération des données.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleViewDossier = (dossier: DossierMedical) => {
    setDossierToView(dossier)
    setIsViewModalOpen(true)
  }

  const handleOpenAddModal = () => {
    setDossierToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = async (dossier: DossierMedical) => {
    if (!dossier.id) return
    setEditingDossierId(dossier.id)
    try {
      // Utiliser le service pour récupérer les données complètes et à jour
      const fullDossierData = await dossierMedicalService.getDossierById(dossier.id)
      console.log(fullDossierData);
      
      setDossierToEdit(fullDossierData)
      setIsModalOpen(true)
    } catch (error) {
      toast.error("Impossible de charger les données du dossier pour la modification.")
      console.error("Error fetching dossier for edit:", error)
    } finally {
      setEditingDossierId(null)
    }
  }

  const handleModalSubmit = async (formData: CreateDossierMedicalPayload, id?: number) => {
    try {
      if (id) {
        await dossierMedicalService.updateDossier(id, formData)
        toast.success("Dossier médical mis à jour avec succès !")
      } else {
        await dossierMedicalService.createDossier(formData)
        toast.success("Dossier médical créé avec succès !")
        // Refetch patients only on creation as a new one is now used
        fetchPatientsSansDossier()
      }
      setIsModalOpen(false)
      fetchDossiers() // Always refetch dossiers list
    } catch (error) {
      const action = id ? "de la mise à jour" : "de la création"
      toast.error(`Erreur lors ${action} du dossier.`)
      console.error(error)
    }
  }

  const requestDeleteDossier = (dossierId: number | undefined) => {
    if (dossierId === undefined) {
      toast.error("ID du dossier non valide pour la suppression.");
      return;
    }
    setDossierToDeleteId(dossierId)
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (dossierToDeleteId === null) return
    
    try {
      await dossierMedicalService.deleteDossier(dossierToDeleteId);
      // Met à jour la liste des dossiers localement pour une mise à jour instantanée de l'UI
      setDossiers((prevDossiers) => prevDossiers.filter((d) => d.id !== dossierToDeleteId));
      toast.success("Dossier médical supprimé avec succès !");
      // Rafraîchit la liste des patients pour que celui dont le dossier a été supprimé soit à nouveau disponible
      fetchPatientsSansDossier();
    } catch (error) {
      toast.error("Erreur lors de la suppression du dossier.");
      console.error(error);
    } finally {
      setDossierToDeleteId(null)
    }
  };

  const patientsForModal = useMemo(() => {
    // En mode édition, nous devons afficher le patient actuel dans la liste,
    // en plus des patients qui n'ont pas encore de dossier.
    if (dossierToEdit && dossierToEdit.personne) {
      const allPatients = [...patientsSansDossier]
      // Ajoute le patient en cours de modification à la liste s'il n'y est pas déjà
      if (!patientsSansDossier.some(p => p.id === dossierToEdit.personne.id)) {
        allPatients.unshift(dossierToEdit.personne)
      }
      return allPatients
    }
    // En mode création, n'afficher que les patients sans dossier.
    return patientsSansDossier
  }, [dossierToEdit, patientsSansDossier])

  const filteredDossiers = dossiers.filter((dossier) => {
    const searchTermLower = searchTerm.toLowerCase()
    const matchesSearch =
      dossier.id?.toString().includes(searchTermLower) ||
      dossier.personne?.nom?.toLowerCase().includes(searchTermLower) ||
      dossier.personne?.prenom?.toLowerCase().includes(searchTermLower)

    const matchesStatus = statusFilter === "all" //|| dossier.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "actif":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Actif</Badge>
      case "archivé":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Archivé</Badge>
      case "suspendu":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Suspendu</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout >
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Activity className="h-12 w-12 animate-spin text-indigo-500" />
            <span className="text-lg text-gray-600">Chargement des données...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return <DashboardLayout ><div className="text-red-500 text-center">{error}</div></DashboardLayout>
  }

  return (
    <DashboardLayout >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              Dossiers Médicaux
            </h1>
            <p className="text-gray-600 mt-2">Gérez les dossiers médicaux de vos patients</p>
          </div>
          <div>
            <Button
              onClick={handleOpenAddModal}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg"
            >
              <FilePlus className="h-4 w-4 mr-2" />
              Nouveau Dossier
            </Button>
            <CreateDossierPatientModal
              isOpen={isModalOpen}
              onOpenChange={setIsModalOpen}
              onSubmit={handleModalSubmit}
              patients={patientsForModal}
              initialData={dossierToEdit}
            />
            <ViewDossierPatientModal
              isOpen={isViewModalOpen}
              onOpenChange={setIsViewModalOpen}
              dossier={dossierToView}
            />
            <ConfirmationModal
              isOpen={isDeleteConfirmOpen}
              onOpenChange={setIsDeleteConfirmOpen}
              onClose={() => setIsDeleteConfirmOpen(false)}
              onConfirm={handleConfirmDelete}
              title="Confirmation de suppression"
              description="Êtes-vous sûr de vouloir supprimer ce dossier ? Cette action est irréversible."
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-indigo-600">Total Dossiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-900">156</div>
              <p className="text-xs text-indigo-600 flex items-center mt-1">
                <FileText className="h-3 w-3 mr-1" />
                +8 ce mois
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Dossiers Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">142</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <Activity className="h-3 w-3 mr-1" />
                91% du total
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-600">Dossiers Urgents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">5</div>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                Attention requise
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Mis à Jour Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">12</div>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                Activité récente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-indigo-600" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par numéro de dossier, nom du patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="actif">Actifs</SelectItem>
                  <SelectItem value="archivé">Archivés</SelectItem>
                  <SelectItem value="suspendu">Suspendus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Dossiers Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dossiers Médicaux ({filteredDossiers.length})
            </CardTitle>
            <CardDescription className="text-teal-100">
              Consultez et gérez les dossiers médicaux de vos patients
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Dossier</TableHead>
                    <TableHead className="font-semibold text-gray-700">Patient</TableHead>
                    <TableHead className="font-semibold text-gray-700">Informations Médicales</TableHead>
                    <TableHead className="font-semibold text-gray-700">Activité</TableHead>
                    <TableHead className="font-semibold text-gray-700">Statut</TableHead>
                    <TableHead className="font-semibold text-gray-700">Dernière MAJ</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDossiers.map((dossier, index) => (
                    <TableRow
                      key={dossier.id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {/* {dossier.urgence && <AlertCircle className="h-4 w-4 text-red-500" />} */}
                            DM-{dossier.id}
                          </div>
                          <div className="text-sm text-gray-600">
                            Créé le {new Date(dossier.createdAt!).toLocaleDateString("fr-FR")}
                          </div>
                          {/* <div className="text-xs text-gray-500">Par {dossier.medecin}</div> */}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">
                            {dossier.personne?.prenom || "Patient"} {dossier.personne?.nom || "Inconnu"}
                          </div>
                          <div className="text-sm text-gray-600">
                            Né(e) le {dossier.personne?.dateNaissance ? new Date(dossier.personne.dateNaissance).toLocaleDateString("fr-FR") : "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">ID Patient: {dossier.personne?.id || "N/A"}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Antécédents:</span>
                            {dossier.antecedents.length > 0 ? (
                              <div className="flex max-w-xs flex-wrap gap-1 mt-1">
                                {dossier.antecedents.split(",").slice(0, 2).map((antecedent, idx) => (
                                  <Badge key={idx} className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                                    {antecedent}
                                  </Badge>
                                ))}
                                {dossier.antecedents.split(",").length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{dossier.antecedents.split(",").length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500 ml-1">Aucun</span>
                            )}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Allergies:</span>
                            {dossier.allergies.length > 0 ? (
                              <div className="flex max-w-xs flex-wrap gap-1 mt-1">
                                {dossier.allergies.split(",").slice(0, 2).map((allergie, idx) => (
                                  <Badge key={idx} variant="destructive" className="text-xs">
                                    {allergie}
                                  </Badge>
                                ))}
                                {dossier.allergies.split(",").length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{dossier.allergies.split(",").length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500 ml-1">Aucune</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">Tension: <span className="font-medium">{dossier.tension}</span></div>
                          <div className="text-sm">Groupe Sanguin: <Badge variant="secondary">{dossier.groupeSanguin}</Badge></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {/* Placeholder for status */}
                          {getStatusBadge("actif")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {new Date(dossier.updatedAt!).toLocaleDateString("fr-FR")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleViewDossier(dossier)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Consulter
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleOpenEditModal(dossier)}
                            disabled={editingDossierId === dossier.id}
                          >
                            {editingDossierId === dossier.id ? (
                              <Activity className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Edit className="h-3 w-3 mr-1" />
                            )}
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => requestDeleteDossier(dossier.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Supprimer
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
