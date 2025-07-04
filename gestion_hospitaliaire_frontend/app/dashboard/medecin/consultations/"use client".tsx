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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Stethoscope,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Calendar,
  Clock,
  Activity,
  AlertCircle,
  FileText,
  CheckCircle,
  Trash,
  BarChart,
  Pencil,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Consultation } from "@/types/consultstionsTraitement"
import { getConsultations, deleteConsultation } from "@/services/consultationTraitement/consultationService"
import { useToast } from "@/components/ui/use-toast"

export default function MedecinConsultationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [consultationToDelete, setConsultationToDelete] = useState<Consultation | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const data = await getConsultations()
        setConsultations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
      } finally {
        setIsLoading(false)
      }
    }

    fetchConsultations()
  }, [])

  const handleDeleteConsultation = async () => {
    if (!consultationToDelete) return

    console.log("Tentative de suppression de la consultation avec l'ID:", consultationToDelete.id);
    try {
      await deleteConsultation(consultationToDelete.id)
      setConsultations(consultations.filter(c => c.id !== consultationToDelete.id))
      setIsDeleteDialogOpen(false)
      setIsSuccessDialogOpen(true)
      
      toast({
        title: "Succès de la suppression",
        description: "La consultation a été supprimée avec succès.",
        variant: "default",
      })
      console.log("Suppression réussie. Consultations restantes:", consultations.filter(c => c.id !== consultationToDelete.id).length);
    } catch (err) {
      console.error("Erreur lors de la suppression de la consultation:", err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      })
    } finally {
      setConsultationToDelete(null)
    }
  }

  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      consultation.id.toString().includes(searchTerm.toLowerCase()) ||
      consultation.personne?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.personne?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.symptomes?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" 

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = () => {
    return <Badge className="bg-green-100 text-green-800 border-green-200">Terminée</Badge>
  }

  const getTypeConsultationBadge = () => {
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Standard</Badge>
  }

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
        {/* Header */}
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
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Consultation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Créer une Nouvelle Consultation</DialogTitle>
                <DialogDescription>Enregistrez une nouvelle consultation médicale</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultations.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.personne?.prenom} {c.personne?.nom} - ID: {c.personneId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateConsultation">Date</Label>
                  <Input id="dateConsultation" type="date" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="symptomes">Symptômes</Label>
                  <Textarea id="symptomes" placeholder="Décrivez les symptômes" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="diagnostic">Diagnostic</Label>
                  <Textarea id="diagnostic" placeholder="Diagnostic médical" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="prescriptions">Prescriptions</Label>
                  <Textarea id="prescriptions" placeholder="Médicaments prescrits" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">Créer Consultation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Total Consultations */}
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

          {/* Aujourd'hui */}
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

          {/* Avec Prescriptions */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-green-600">Avec Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {consultations.filter(c => c.prescriptions && c.prescriptions.length > 0).length}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <FileText className="h-3 w-3 mr-1" />
                Ordonnances générées
              </p>
            </CardContent>
          </Card>

          {/* Filtres et Recherche */}
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

        {/* Consultations Table */}
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
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">ID</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Patient</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Symptômes</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Diagnostic</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Prescriptions</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultations.map((consultation) => (
                    <TableRow key={consultation.id} className="hover:bg-blue-50">
                      <TableCell className="font-medium px-4 py-3 align-top">
                        <span className="text-gray-900">CON-{consultation.id.toString().padStart(4, '0')}</span>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3 align-top">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">
                            {consultation.personne?.prenom} {consultation.personne?.nom}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {consultation.personneId}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3 align-top">
                        <div className="text-sm text-gray-900 font-medium">
                          {new Date(consultation.date).toLocaleDateString("fr-FR")}
                        </div>
                        <div className="text-xs text-gray-500">
                          Créé le: {new Date(consultation.createdAt || "").toLocaleDateString("fr-FR")}
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3 align-top max-w-[250px]">
                        <div className="text-sm text-gray-900 whitespace-pre-wrap">
                          {consultation.symptomes}
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3 align-top max-w-[250px]">
                        <div className="text-sm text-gray-900 whitespace-pre-wrap">
                          {consultation.diagnostic}
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3 align-top">
                        {consultation.prescriptions?.length ? (
                          <div className="space-y-2">
                            {consultation.prescriptions.slice(0, 2).map((prescription, idx) => (
                              <div key={idx} className="text-sm text-gray-900">
                                <span className="font-medium">{prescription.medicament?.nom || 'Médicament'}</span>
                                <span className="text-xs text-gray-500 ml-1">(x{prescription.quantite})</span>
                              </div>
                            ))}
                            {consultation.prescriptions.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{consultation.prescriptions.length - 2} autres
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">Aucune</span>
                        )}
                      </TableCell>
                      
                      <TableCell className="px-4 py-3 align-top">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-white border-gray-400 bg-gray-600 hover:bg-gray-700">
                            <Eye className="h-4 w-4 mr-1" />
                         
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-white border-red-600 bg-red-600 hover:bg-red-700"
                            onClick={(e) => {
                              e.stopPropagation(); // Empêche la propagation de l'événement de clic si la ligne est cliquable
                              console.log("Bouton de suppression cliqué pour l'ID:", consultation.id);
                              setConsultationToDelete(consultation);
                              setIsDeleteDialogOpen(true);
                              console.log("isDeleteDialogOpen défini sur true. consultationToDelete:", consultation.id);
                            }}
                          >
                            {/* Ajout d'un gestionnaire de clic pour le bouton "Créer Consultation" */}
                            {/* TODO: Implémenter la logique de création de consultation */}
                            <Trash className="h-4 w-4 mr-1" />
                            
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
          console.log("isDeleteDialogOpen changed to:", open);
          setIsDeleteDialogOpen(open);}}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Confirmer la suppression
              </DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer la consultation de {consultationToDelete?.personne?.prenom || 'ce patient'} {consultationToDelete?.personne?.nom || ''} ?
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
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash className="h-4 w-4 mr-2" />
                Confirmer la suppression
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Suppression réussie
              </DialogTitle>
              <DialogDescription>
                La consultation a été supprimée avec succès.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsSuccessDialogOpen(false)}
              >
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}