"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Stethoscope,
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  FileText,
  AlertCircle,
  Trash,
  Activity,
  Edit,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Consultation, CreateConsultationPayload } from "@/types/consultstionsTraitement"
import { DossierMedical } from "@/types/medical"
import { getConsultations, deleteConsultation, updateConsultation, addConsultation } from "@/services/consultationTraitement/consultationService"
import { useToast } from "@/components/ui/use-toast"
import { AddConsultationModal } from "@/components/modals/consultation/consultation-modal"
import { AddPrescriptionModal } from "@/components/modals/prescriptions/prescription-modal"
import { EditConsultationModal } from "@/components/edit-consultationPrenatal-modal"
import { EditConsultationModalconsultations } from "@/components/modals/medical/edit-consultation"
import { useAuth } from "@/contexts/AuthContext"
 
interface Medecin {
  id: number;
  specialite: string;
  personne?: { prenom: string; nom: string };
}

export default function MedecinConsultationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [consultationToDelete, setConsultationToDelete] = useState<Consultation | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)
  const [selectedConsultationId, setSelectedConsultationId] = useState<number | null>(null)
  const [isEditConsultationModalOpen, setIsEditConsultationModalOpen] = useState(false)
  const [consultationToEdit, setConsultationToEdit] = useState<Consultation | null>(null)
  
  // Nouveaux états pour le modal corrigé
  const [selectedDossier, setSelectedDossier] = useState<DossierMedical | null>(null)
  const [dossiersMedicaux, setDossiersMedicaux] = useState<DossierMedical[]>([])
  const [medecins, setMedecins] = useState<Medecin[]>([])
  const { user } = useAuth()
  const currentUserId = user?.profile.employe?.id

  const { toast } = useToast()

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setError(null)
        const data = await getConsultations()
        setConsultations(data || [])
        
        // Extraire les dossiers médicaux uniques
        if (data && data.length > 0) {
          const uniqueDossiers = Array.from(
            new Map(
              data
                .filter(c => c.dossierMedical && c.dossierMedical.id !== undefined)
                .map(c => [c.dossierMedical!.id, c.dossierMedical!])
            ).values()
          )
          setDossiersMedicaux(uniqueDossiers)

          // Extraire les médecins uniques
         
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors du chargement"
        setError(errorMessage)
        toast({
          title: "Erreur",
          description: "Impossible de charger les consultations",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchConsultations()
  }, [toast])

  const handleDeleteConsultation = async () => {
    if (!consultationToDelete) return

    try {
      await deleteConsultation(consultationToDelete.id)
      setConsultations(prevConsultations => 
        prevConsultations.filter(c => c.id !== consultationToDelete.id)
      )
      setIsDeleteDialogOpen(false)
      setConsultationToDelete(null)
      
      toast({
        title: "Succès",
        description: "La consultation a été supprimée avec succès.",
        variant: "default",
      })
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      })
    }
  }

  // Nouvelle fonction pour gérer l'ajout de consultation avec le modal corrigé
  const handleAddConsultationSubmit = async (data: CreateConsultationPayload) => {
    try {
      const newConsultation = await addConsultation(data)
      if (newConsultation) {
        setConsultations(prevConsultations => [...prevConsultations, newConsultation])
        setIsAddDialogOpen(false)
        toast({
          title: "Succès",
          description: "La consultation a été créée avec succès",
          variant: "default",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la consultation",
        variant: "destructive",
      })
    }
  }

  const handleEditConsultationSuccess = async (updatedConsultation: Consultation) => {
    try {
      // Appel de l'API pour mettre à jour la consultation
      const result = await updateConsultation(updatedConsultation)
      
      // Mise à jour de l'état local
      setConsultations(prevConsultations => 
        prevConsultations.map(c => {
          if (c.id === updatedConsultation.id) {
            return result ?? updatedConsultation
          }
          return c
        })
      )
      
      setIsEditConsultationModalOpen(false)
      setConsultationToEdit(null)
      
      toast({
        title: "Succès",
        description: "La consultation a été modifiée avec succès",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification",
        variant: "destructive",
      })
    }
  }

  const filteredConsultations = consultations.filter((consultation) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      consultation.id.toString().includes(searchLower) ||
      (consultation.dossierMedical?.personne?.prenom?.toLowerCase().includes(searchLower) ?? false) ||
      (consultation.dossierMedical?.personne?.nom?.toLowerCase().includes(searchLower) ?? false) ||
      (consultation.symptomes?.toLowerCase().includes(searchLower) ?? false) ||
      (consultation.diagnostic?.toLowerCase().includes(searchLower) ?? false)
    )
  })

  const hasPrescriptions = (consultation: Consultation) => {
    return consultation.prescriptions && consultation.prescriptions.length > 0
  }

  // Calculs statistiques sécurisés
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentDateString = currentDate.toDateString()

  const consultationsThisMonth = consultations.filter(c => {
    try {
      return new Date(c.date).getMonth() === currentMonth
    } catch {
      return false
    }
  }).length

  const consultationsToday = consultations.filter(c => {
    try {
      return new Date(c.date).toDateString() === currentDateString
    } catch {
      return false
    }
  }).length

  const consultationsWithPrescriptions = consultations.filter(hasPrescriptions).length

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Chargement en cours...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <div className="text-red-500 text-lg font-medium">{error}</div>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Réessayer
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              Consultations
            </h1>
            <p className="text-gray-600 mt-2">Gérez vos consultations et générez des rapports</p>
          </div>
          
          <Button 
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Consultation
          </Button>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-cyan-600">Total Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-900">{consultations.length}</div>
              <p className="text-xs text-cyan-600 flex items-center mt-1">
                <Activity className="h-3 w-3 mr-1" />
                {consultationsThisMonth} ce mois
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-blue-600">Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{consultationsToday}</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                Planning du jour
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-green-600">Avec Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{consultationsWithPrescriptions}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <FileText className="h-3 w-3 mr-1" />
                Ordonnances générées
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-lg">
            <CardHeader className="border-b p-4">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Filter className="h-5 w-5 text-cyan-600" />
                Filtres et Recherche
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <Input
                      placeholder="Rechercher par ID, patient ou symptômes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 py-2 px-4 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-600 text-gray-800"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des consultations */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Consultations ({filteredConsultations.length})
            </CardTitle>
            <CardDescription className="text-teal-100">
              Liste complète des consultations médicales
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Patient</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Symptômes</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Diagnostic</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Température</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Poids</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Médecin</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultations.map((consultation) => (
                    <TableRow key={consultation.id} className="hover:bg-blue-50">
                      <TableCell className="px-4 py-3">
                        {consultation.dossierMedical?.personne ? (
                          <div className="font-medium">
                            {consultation.dossierMedical.personne.prenom} {consultation.dossierMedical.personne.nom}
                          </div>
                        ) : (
                          <div className="text-gray-400">Non spécifié</div>
                        )}
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        {(() => {
                          try {
                            return new Date(consultation.date).toLocaleDateString("fr-FR")
                          } catch {
                            return "Date invalide"
                          }
                        })()}
                      </TableCell>
                      
                      <TableCell className="px-4 py-3 max-w-[250px]">
                        <div className="text-sm whitespace-pre-wrap truncate">
                          {consultation.symptomes || 'Non spécifié'}
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3 max-w-[250px]">
                        <div className="text-sm whitespace-pre-wrap truncate">
                          {consultation.diagnostic || 'Non spécifié'}
                        </div>
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {consultation.temperature}°C
                        </span>
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <span className="text-sm font-medium">
                          {consultation.poids} kg
                        </span>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        {consultation.employe ? (
                          <div>
                            {consultation.employe.personne?.prenom} {consultation.employe.personne?.nom}
                            <div className="text-xs text-gray-500">{consultation.employe.specialite}</div>
                          </div>
                        ) : (
                          <div className="text-gray-400">Non spécifié</div>
                        )}
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            title="Voir le détail de la consultation"
                            variant="outline"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={() => {
                              setSelectedConsultation(consultation)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button 
                            size="sm" 
                            title="Modifier la consultation"
                            variant="outline"
                            className="text-orange-600 border-orange-600 hover:bg-orange-50 hover:text-orange-700"
                            onClick={() => {
                              setConsultationToEdit(consultation)
                              setIsEditConsultationModalOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button 
                            size="sm" 
                            variant="outline"
                            title="Ajouter une prescription"
                            className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() => {
                              setSelectedConsultationId(consultation.id)
                              setIsPrescriptionModalOpen(true)
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>

                          <Button 
                            size="sm" 
                            variant="destructive"
                            title="Supprimer la consultation"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => {
                              setConsultationToDelete(consultation)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredConsultations.length === 0 && (
              <div className="text-center py-12">
                <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchTerm ? "Aucune consultation trouvée pour cette recherche" : "Aucune consultation disponible"}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer la première consultation
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialogue de suppression */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Confirmer la suppression
              </DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer la consultation CON-{consultationToDelete?.id.toString().padStart(4, '0')} ?
                <br />
                <span className="font-medium">Cette action est irréversible.</span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteConsultation}
              >
                <Trash className="h-4 w-4 mr-2" />
                Confirmer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialogue de visualisation */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-cyan-600" />
                Détails de la consultation
              </DialogTitle>
            </DialogHeader>
            {selectedConsultation && (
              <div className="space-y-6">
                {/* Informations générales */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">ID Consultation</Label>
                    <p className="font-medium text-lg">CON-{selectedConsultation.id.toString().padStart(4, '0')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Date</Label>
                    <p className="font-medium text-lg">
                      {(() => {
                        try {
                          return new Date(selectedConsultation.date).toLocaleDateString("fr-FR")
                        } catch {
                          return "Date invalide"
                        }
                      })()}
                    </p>
                  </div>
                </div>

                {/* Informations patient */}
                <Card className="bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Informations Patient
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Nom complet</Label>
                      <p className="font-medium">
                        {selectedConsultation.dossierMedical?.personne ? 
                          `${selectedConsultation.dossierMedical.personne.prenom} ${selectedConsultation.dossierMedical.personne.nom}` : 
                          'Non spécifié'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">N° Dossier Médical</Label>
                      <p className="font-medium">DM-{selectedConsultation.dossierMedical?.id.toString().padStart(4, '0')}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Signes vitaux */}
                <Card className="bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      Signes Vitaux
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-700">Température</Label>
                        <p className="font-bold text-xl text-red-600">{selectedConsultation.temperature}°C</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-700">Poids</Label>
                        <p className="font-bold text-xl text-blue-600">{selectedConsultation.poids} kg</p>
                      </div>
                      {selectedConsultation.tensionArterielle && (
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Tension Artérielle</Label>
                          <p className="font-medium">{selectedConsultation.tensionArterielle}</p>
                        </div>
                      )}
                      {selectedConsultation.pressionArterielle && (
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Pression Artérielle</Label>
                          <p className="font-medium">{selectedConsultation.pressionArterielle}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Informations médicales */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Symptômes</Label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="whitespace-pre-wrap">{selectedConsultation.symptomes || 'Aucun symptôme renseigné'}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Diagnostic</Label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="whitespace-pre-wrap">{selectedConsultation.diagnostic || 'Aucun diagnostic établi'}</p>
                    </div>
                  </div>
                </div>

                {/* Médecin */}
                <Card className="bg-purple-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-purple-600" />
                      Médecin Traitant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium text-lg">
                        {selectedConsultation.employe ? 
                          `Dr. ${selectedConsultation.employe.personne?.prenom ?? ''} ${selectedConsultation.employe.personne?.nom ?? ''}` : 
                          'Non spécifié'}
                      </p>
                      {selectedConsultation.employe?.specialite && (
                        <p className="text-sm text-purple-600 font-medium">
                          Spécialité: {selectedConsultation.employe.specialite}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Prescriptions */}
                {selectedConsultation.prescriptions && selectedConsultation.prescriptions.length > 0 && (
                  <Card className="bg-orange-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-orange-600" />
                        Prescriptions ({selectedConsultation.prescriptions.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedConsultation.prescriptions.map((prescription) => (
                          <Card key={prescription.id} className="bg-white border-l-4 border-l-orange-400">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-900">Prescription #{prescription.id}</h4>
                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                  {prescription.duree} jours
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{prescription.instructions}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>Fermer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal d'ajout avec les nouvelles props */}
        <AddConsultationModal
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={handleAddConsultationSubmit}
          dossiers={dossiersMedicaux}
          employeid={currentUserId?? 1}
          selectedDossier={selectedDossier}
          setSelectedDossier={setSelectedDossier}
        />

        {/* Modal de prescription */}
        {selectedConsultationId !== null && (
          <AddPrescriptionModal
            isOpen={isPrescriptionModalOpen}
            onClose={() => {
              setIsPrescriptionModalOpen(false)
              setSelectedConsultationId(null)
            }}
            onSuccess={(newPrescription) => {
              // Mettre à jour les prescriptions de la consultation correspondante
              setConsultations((prevConsultations) =>
                prevConsultations.map((consultation) =>
                  consultation.id === selectedConsultationId
                    ? {
                        ...consultation,
                        prescriptions: [...(consultation.prescriptions || []), newPrescription],
                      }
                    : consultation
                )
              )
              setIsPrescriptionModalOpen(false)
              setSelectedConsultationId(null)
              
              toast({
                title: "Succès",
                description: "La prescription a été ajoutée avec succès",
                variant: "default",
              })
            }}
            prescriptions={
              consultations.find(c => c.id === selectedConsultationId)?.prescriptions || []
            }
            consultationId={selectedConsultationId}
          />
        )}

        {/* Modal d'édition de consultation */}
        <EditConsultationModalconsultations
          isOpen={isEditConsultationModalOpen}
          onClose={() => {
            setIsEditConsultationModalOpen(false)
            setConsultationToEdit(null)
          }}
          onSubmit={handleEditConsultationSuccess}
          constante={consultationToEdit}
          dossier={consultationToEdit?.dossierMedical}
        />
      </div>
    </DashboardLayout>
  )
}