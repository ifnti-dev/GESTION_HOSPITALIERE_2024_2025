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
  Bed,
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
import { Hospitalisation } from "@/types/consultstionsTraitement"

import { useToast } from "@/components/ui/use-toast"
import { AddHospitalisationModal } from "@/components/modals/hospitalisation"
import { deleteHospitalisation, getHospitalisations } from "@/services/consultationTraitement/hospitalisationsService"

export default function HospitalisationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [hospitalisations, setHospitalisations] = useState<Hospitalisation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hospitalisationToDelete, setHospitalisationToDelete] = useState<Hospitalisation | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedHospitalisation, setSelectedHospitalisation] = useState<Hospitalisation | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const fetchHospitalisations = async () => {
      try {
        const data = await getHospitalisations()
        setHospitalisations(data)
            console.log("Données reçues:", data); 
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
        toast({
          title: "Erreur",
          description: "Impossible de charger les hospitalisations",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchHospitalisations()
  }, [toast])

  const handleDeleteHospitalisation = async () => {
    if (!hospitalisationToDelete) return

    try {
      await deleteHospitalisation(hospitalisationToDelete.id)
      setHospitalisations(hospitalisations.filter(h => h.id !== hospitalisationToDelete.id))
      setIsDeleteDialogOpen(false)
      
      toast({
        title: "Succès",
        description: "L'hospitalisation a été supprimée avec succès.",
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

  const handleAddHospitalisationSuccess = (newHospitalisation: Hospitalisation) => {
    setHospitalisations([...hospitalisations, newHospitalisation])
    setIsAddDialogOpen(false)
    toast({
      title: "Succès",
      description: "L'hospitalisation a été créée avec succès",
      variant: "default",
    })
  }

  const filteredHospitalisations = hospitalisations.filter((hospitalisation) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      hospitalisation.id.toString().includes(searchLower) ||
      (hospitalisation.patient?.prenom?.toLowerCase().includes(searchLower) ?? false) ||
      (hospitalisation.patient?.nom?.toLowerCase().includes(searchLower) ?? false) ||
      hospitalisation.lit.toString().includes(searchLower) ||
      (hospitalisation.service?.nom?.toLowerCase().includes(searchLower) ?? false)
    )
  })

  const patients = Array.from(
    new Map(
      hospitalisations
        .filter(h => h.patient && h.patient.id !== undefined)
        .map(h => [h.patient!.id, h.patient!])
    ).values()
  )

  const services = Array.from(
    new Map(
      hospitalisations
        .filter(h => h.service && h.service.id !== undefined)
        .map(h => [h.service!.id, h.service!])
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
                <Bed className="h-8 w-8 text-white" />
              </div>
              Hospitalisations
            </h1>
            <p className="text-gray-600 mt-2">Gérez les hospitalisations des patients</p>
          </div>
          
          <Button 
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Hospitalisation
          </Button>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-cyan-600">Total Hospitalisations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-900">{hospitalisations.length}</div>
              <p className="text-xs text-cyan-600 flex items-center mt-1">
                <Activity className="h-3 w-3 mr-1" />
                {hospitalisations.filter(h => new Date(h.date_entree).getMonth() === new Date().getMonth()).length} ce mois
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-blue-600">Actuellement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {hospitalisations.filter(h => !h.date_sortie || new Date(h.date_sortie) > new Date()).length}
              </div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                Patients hospitalisés
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-green-600">Lits occupés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {new Set(hospitalisations
                  .filter(h => !h.date_sortie || new Date(h.date_sortie) > new Date())
                  .map(h => h.lit)).size}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <Bed className="h-3 w-3 mr-1" />
                Lits utilisés
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
                      placeholder="Rechercher par ID, patient ou lit..."
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

        {/* Tableau des hospitalisations */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Hospitalisations ({filteredHospitalisations.length})
            </CardTitle>
            <CardDescription className="text-teal-100">
              Liste complète des hospitalisations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Patient</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Date entrée</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Date sortie</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Lit</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Service</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHospitalisations.map((hospitalisation) => (
                    <TableRow key={hospitalisation.id} className="hover:bg-blue-50">
                      <TableCell className="px-4 py-3">
                        {hospitalisation.patient ? (
                          <div className="font-medium">
                            {hospitalisation.patient.prenom} {hospitalisation.patient.nom}
                          </div>
                        ) : (
                          <div className="text-gray-400">Non spécifié</div>
                        )}
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        {new Date(hospitalisation.date_entree).toLocaleDateString("fr-FR")}
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        {hospitalisation.date_sortie ? 
                          new Date(hospitalisation.date_sortie).toLocaleDateString("fr-FR") : 
                          <span className="text-orange-500">En cours</span>}
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        {hospitalisation.lit}
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        {hospitalisation.service?.nom ?? 'Non spécifié'}
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            title="Voir le détail de l'hospitalisation"
                            variant="outline"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={() => {
                              setSelectedHospitalisation(hospitalisation)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button 
                            size="sm" 
                            variant="destructive"
                            title="supprimer l'hospitalisation"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => {
                              setHospitalisationToDelete(hospitalisation)
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
                Êtes-vous sûr de vouloir supprimer l'hospitalisation HOSP-{hospitalisationToDelete?.id.toString().padStart(4, '0')} ?
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
                onClick={handleDeleteHospitalisation}
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
                <Bed className="h-5 w-5 text-cyan-600" />
                Détails de l'hospitalisation
              </DialogTitle>
            </DialogHeader>
            {selectedHospitalisation && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ID Hospitalisation</Label>
                    <p className="font-medium">HOSP-{selectedHospitalisation.id.toString().padStart(4, '0')}</p>
                  </div>
                  <div>
                    <Label>Statut</Label>
                    <p className="font-medium">
                      {selectedHospitalisation.date_sortie ? 
                        <span className="text-green-600">Terminée</span> : 
                        <span className="text-orange-500">En cours</span>}
                    </p>
                  </div>
                  <div>
                    <Label>Patient</Label>
                    <p className="font-medium">
                      {selectedHospitalisation.patient ? 
                        `${selectedHospitalisation.patient.prenom} ${selectedHospitalisation.patient.nom}` : 
                        'Non spécifié'}
                    </p>
                  </div>
                  <div>
                    <Label>Service</Label>
                    <p className="font-medium">
                      {selectedHospitalisation.service?.nom ?? 'Non spécifié'}
                    </p>
                  </div>
                  <div>
                    <Label>Date d'entrée</Label>
                    <p className="font-medium">
                      {new Date(selectedHospitalisation.date_entree).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <Label>Date de sortie</Label>
                    <p className="font-medium">
                      {selectedHospitalisation.date_sortie ? 
                        new Date(selectedHospitalisation.date_sortie).toLocaleDateString("fr-FR") : 
                        'Non spécifiée'}
                    </p>
                  </div>
                  <div>
                    <Label>Lit</Label>
                    <p className="font-medium">
                      {selectedHospitalisation.lit}
                    </p>
                  </div>
                  <div>
                    <Label>Durée</Label>
                    <p className="font-medium">
                      {selectedHospitalisation.date_sortie ? 
                        `${Math.ceil((new Date(selectedHospitalisation.date_sortie).getTime() - 
                          new Date(selectedHospitalisation.date_entree).getTime()) / (1000 * 60 * 60 * 24))} jours` : 
                        `${Math.ceil((new Date().getTime() - 
                          new Date(selectedHospitalisation.date_entree).getTime()) / (1000 * 60 * 60 * 24))} jours (en cours)`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>Fermer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal d'ajout */}
        <AddHospitalisationModal
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSuccess={handleAddHospitalisationSuccess}
          patients={patients}
          services={services}
        />
      </div>
    </DashboardLayout>
  )
}