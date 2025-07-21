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
} from "lucide-react"
import { useState, useEffect } from "react"
import { Consultation } from "@/types/consultstionsTraitement"
import { getConsultations, deleteConsultation } from "@/services/consultationTraitement/consultationService"
import { useToast } from "@/components/ui/use-toast"
import { AddConsultationModal } from "@/components/modals/consultation/consultation-modal"
import { AddPrescriptionModal } from "@/components/modals/prescriptions/prescription-modal"

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

  const { toast } = useToast()

  
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const data = await getConsultations()
        setConsultations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
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
      setConsultations(consultations.filter(c => c.id !== consultationToDelete.id))
      setIsDeleteDialogOpen(false)
      
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

  const handleAddConsultationSuccess = (newConsultation: Consultation) => {
    setConsultations([...consultations, newConsultation])
    setIsAddDialogOpen(false)
    toast({
      title: "Succès",
      description: "La consultation a été créée avec succès",
      variant: "default",
    })
  }

  const filteredConsultations = consultations.filter((consultation) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      consultation.id.toString().includes(searchLower) ||
      (consultation.personne?.prenom?.toLowerCase().includes(searchLower) ?? false) ||
      (consultation.personne?.nom?.toLowerCase().includes(searchLower) ?? false) ||
      consultation.symptomes.toLowerCase().includes(searchLower) ||
      (consultation.diagnostic?.toLowerCase().includes(searchLower) ?? false)
    )
  })

  const hasPrescriptions = (consultation: Consultation) => {
    return consultation.prescriptions && consultation.prescriptions.length > 0
  }

  const patients = Array.from(
    new Map(
      consultations
        .filter(c => c.personne && c.personne.id !== undefined)
        .map(c => [c.personne!.id, c.personne!])
    ).values()
  )
  const medecins = Array.from(
    new Map(
      consultations
        .filter(c => c.employe && c.employe.id !== undefined)
        .map(c => [c.employe!.id, c.employe!])
    ).values()
  )

  if (isLoading) {
    return (
      <DashboardLayout userRole="Médecin">
        <div className="flex justify-center items-center h-64">
          <div>Chargement en cours...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout userRole="Médecin">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="Médecin">
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
                {consultations.filter(c => new Date(c.date).getMonth() === new Date().getMonth()).length} ce mois
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-blue-600">Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {consultations.filter(c => new Date(c.date).toDateString() === new Date().toDateString()).length}
              </div>
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
              <div className="text-2xl font-bold text-green-900">
                {consultations.filter(hasPrescriptions).length}
              </div>
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
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Médecin</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultations.map((consultation) => (
                    <TableRow key={consultation.id} className="hover:bg-blue-50">
                      <TableCell className="px-4 py-3">
                        {consultation.personne ? (
                          <div className="font-medium">
                            {consultation.personne.prenom} {consultation.personne.nom}
                          </div>
                        ) : (
                          <div className="text-gray-400">Non spécifié</div>
                        )}
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        {new Date(consultation.date).toLocaleDateString("fr-FR")}
                      </TableCell>
                      
                      <TableCell className="px-4 py-3 max-w-[250px]">
                        <div className="text-sm whitespace-pre-wrap">
                          {consultation.symptomes}
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3 max-w-[250px]">
                        <div className="text-sm whitespace-pre-wrap">
                          {consultation.diagnostic ?? 'Non spécifié'}
                        </div>
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
                            title="Voir le detail de la consultation"
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
                            variant="destructive"
                            title="supprimer la consultation"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => {
                              setConsultationToDelete(consultation)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>

                        <Button 
                          size="sm" 
                          variant="outline"
                          title="ajouter une prescription"
                          className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={() => {
                            setSelectedConsultationId(consultation.id)
                            setIsPrescriptionModalOpen(true)
                          }}
                        >
                          <Plus className="h-4 w-4" />
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-cyan-600" />
                Détails de la consultation
              </DialogTitle>
            </DialogHeader>
            {selectedConsultation && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ID Consultation</Label>
                    <p className="font-medium">CON-{selectedConsultation.id.toString().padStart(4, '0')}</p>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <p className="font-medium">
                      {new Date(selectedConsultation.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <Label>Patient</Label>
                    <p className="font-medium">
                      {selectedConsultation.personne ? 
                        `${selectedConsultation.personne.prenom} ${selectedConsultation.personne.nom}` : 
                        'Non spécifié'}
                    </p>
                  </div>
                  <div>
                    <Label>Médecin</Label>
                    <p className="font-medium">
                      {selectedConsultation.employe ? 
                        `${selectedConsultation.employe.personne?.prenom ?? ''} ${selectedConsultation.employe.personne?.nom ?? ''} (${selectedConsultation.employe.specialite})` : 
                        'Non spécifié'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label>Symptômes</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="whitespace-pre-wrap">{selectedConsultation.symptomes}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label>Diagnostic</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="whitespace-pre-wrap">{selectedConsultation.diagnostic ?? 'Non spécifié'}</p>
                    </div>
                  </div>
                  {selectedConsultation.prescriptions && selectedConsultation.prescriptions.length > 0 && (
                    <div className="col-span-2">
                      <Label>Prescriptions ({selectedConsultation.prescriptions.length})</Label>
                      <div className="space-y-2">
                        {selectedConsultation.prescriptions.map((prescription) => (
                          <Card key={prescription.id}>
                            <CardHeader className="p-3">
                              <CardTitle className="text-sm">Prescription #{prescription.id}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                              <div className="text-sm">
                                <p><span className="font-medium">Instructions:</span> {prescription.instructions}</p>
                                <p><span className="font-medium">Durée:</span> {prescription.duree} jours</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>Fermer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal d'ajout */}
        <AddConsultationModal
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSuccess={handleAddConsultationSuccess}
          patients={patients}
          medecins={medecins}
        />
      </div>


{selectedConsultationId !== null && (
  <AddPrescriptionModal
    isOpen={isPrescriptionModalOpen}
    onClose={() => setIsPrescriptionModalOpen(false)}
    onSuccess={(newPrescription) => {
      // mettre à jour les prescriptions de la consultation correspondante
      setConsultations((prev) =>
        prev.map((consultation) =>
          consultation.id === selectedConsultationId
            ? {
                ...consultation,
                prescriptions: [...(consultation.prescriptions || []), newPrescription],
              }
            : consultation
        )
      )
      setIsPrescriptionModalOpen(false)
    }}
    prescriptions={
      consultations.find(c => c.id === selectedConsultationId)?.prescriptions || []
    }
    consultationId={selectedConsultationId}
  />
)}

    </DashboardLayout>
  )
  
}