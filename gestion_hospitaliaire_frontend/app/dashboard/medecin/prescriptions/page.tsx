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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Pill,
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
import { Prescription } from "@/types/consultstionsTraitement"
import { getPrescriptions, deletePrescription } from "@/services/consultationTraitement/prescriptionService"
import { useToast } from "@/components/ui/use-toast"
import { AddPrescriptionModal } from "@/components/modals/prescriptions/prescription-modal"

export default function MedecinPrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<Prescription | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await getPrescriptions()
        setPrescriptions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
        toast({
          title: "Erreur",
          description: "Impossible de charger les prescriptions",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrescriptions()
  }, [toast])

  const handleDeletePrescription = async () => {
    if (!prescriptionToDelete) return

    try {
      await deletePrescription(prescriptionToDelete.id)
      setPrescriptions(prescriptions.filter(p => p.id !== prescriptionToDelete.id))
      setIsDeleteDialogOpen(false)
      
      toast({
        title: "Succès",
        description: "La prescription a été supprimée avec succès.",
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

  const handleAddPrescriptionSuccess = (newPrescription: Prescription) => {
    setPrescriptions([...prescriptions, newPrescription])
    setIsAddDialogOpen(false)
    toast({
      title: "Succès",
      description: "La prescription a été créée avec succès",
      variant: "default",
    })
  }

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      prescription.id.toString().includes(searchLower) ||
      (prescription.patient?.prenom?.toLowerCase().includes(searchLower) ?? false) ||
      (prescription.patient?.nom?.toLowerCase().includes(searchLower) ?? false) ||
      (prescription.consultation?.personne?.prenom?.toLowerCase().includes(searchLower) ?? false) ||
      (prescription.consultation?.personne?.nom?.toLowerCase().includes(searchLower) ?? false)
    )
  })

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
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-purple-600">Total Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{prescriptions.length}</div>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <Activity className="h-3 w-3 mr-1" />
                {prescriptions.filter(p => new Date(p.date).getMonth() === new Date().getMonth()).length} ce mois
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-violet-50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-indigo-600">Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-900">
                {prescriptions.filter(p => new Date(p.date).toDateString() === new Date().toDateString()).length}
              </div>
              <p className="text-xs text-indigo-600 flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                Prescriptions du jour
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-lg">
            <CardHeader className="border-b p-4">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Filter className="h-5 w-5 text-purple-600" />
                Filtres et Recherche
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <Input
                      placeholder="Rechercher par ID, patient ou médecin..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 py-2 px-4 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-800"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des prescriptions */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Prescriptions ({filteredPrescriptions.length})
            </CardTitle>
            <CardDescription className="text-violet-100">
              Liste complète des prescriptions médicales
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">ID</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Durée</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Médicaments</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Posologie</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id} className="hover:bg-purple-50">
                   
                     
                        <TableCell className="px-4 py-3">
                      PRE-{prescription.id.toString().padStart(4, '0')}
                      </TableCell>

                       <TableCell className="px-4 py-3">
                        {prescription.duree} jours
                      </TableCell>
                    
                      <TableCell className="px-4 py-3">
                        {prescription.medicaments?.length ?? 0} médicament(s)
                      </TableCell>
                        <TableCell className="px-4 py-3">
                        {prescription.posologie} 
                      </TableCell>
                       <TableCell className="px-4 py-3">
                        date
                      </TableCell>
                      
                     
                      
                      <TableCell className="px-4 py-3">
                       <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700" 
                              onClick={() => {
                                setSelectedPrescription(prescription)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button 
                              size="sm" 
                              variant="destructive"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => {
                                setPrescriptionToDelete(prescription)
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
                Êtes-vous sûr de vouloir supprimer la prescription PRE-{prescriptionToDelete?.id.toString().padStart(4, '0')} ?
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
                onClick={handleDeletePrescription}
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
                <Pill className="h-5 w-5 text-purple-600" />
                Détails de la prescription
              </DialogTitle>
            </DialogHeader>
            {selectedPrescription && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                 
                  <div>
                    <Label>Date</Label>
                    <p className="font-medium">
                      {new Date(selectedPrescription.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <Label>Patient</Label>
                    <p className="font-medium">
                      {selectedPrescription.patient ? 
                        `${selectedPrescription.patient.prenom} ${selectedPrescription.patient.nom}` : 
                        selectedPrescription.consultation?.personne ?
                        `${selectedPrescription.consultation.personne.prenom} ${selectedPrescription.consultation.personne.nom}` :
                        'Non spécifié'}
                    </p>
                  </div>
                  <div>
                    <Label>Durée</Label>
                    <p className="font-medium">
                      {selectedPrescription.duree} jours
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label>Instructions</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="whitespace-pre-wrap">{selectedPrescription.instructions}</p>
                    </div>
                  </div>
                  {selectedPrescription.medicaments && selectedPrescription.medicaments.length > 0 && (
                    <div className="col-span-2">
                      <Label>Médicaments prescrits ({selectedPrescription.medicaments.length})</Label>
                      <div className="space-y-2">
                        {selectedPrescription.medicaments.map((medicament) => (
                          <Card key={medicament.medicament.id}>
                            <CardHeader className="p-3">
                              <CardTitle className="text-sm">{medicament.medicament.nom}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                              <div className="text-sm">
                                <p><span className="font-medium">Posologie:</span> {medicament.posologie}</p>
                                <p><span className="font-medium">Quantité:</span> {medicament.quantite}</p>
                                <p><span className="font-medium">Dosage:</span> {medicament.dosage}</p>
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
        <AddPrescriptionModal
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSuccess={handleAddPrescriptionSuccess}
          prescriptions={prescriptions}
          consultationId={0} 
        />
      </div>
    </DashboardLayout>
  )
}