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
  Activity,
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  Thermometer,
  HeartPulse,
  AlertCircle,
  Trash,
  User,
} from "lucide-react"
import { useState, useEffect } from "react"
import { CreateSuivieEtat, SuivieEtat } from "@/types/consultstionsTraitement"

import { useToast } from "@/components/ui/use-toast"
import { deleteSuivieEtat, getSuivieEtats } from "@/services/consultationTraitement/suivieEtat"
//import AddSuiviEtatModal from "@/components/AddSuiviEtatModal"

export default function SuiviEtatPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [suiviEtats, setSuiviEtats] = useState<SuivieEtat[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [suiviEtatToDelete, setSuiviEtatToDelete] = useState<SuivieEtat | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSuiviEtat, setSelectedSuiviEtat] = useState<SuivieEtat | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const fetchSuiviEtats = async () => {
      try {
        const data = await getSuivieEtats()
        setSuiviEtats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
        toast({
          title: "Erreur",
          description: "Impossible de charger le suivi d'état",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuiviEtats()
  }, [toast])

  const handleDeleteSuiviEtat = async () => {
    if (!suiviEtatToDelete) return

    try {
      await deleteSuivieEtat(suiviEtatToDelete.id)
      setSuiviEtats(suiviEtats.filter(s => s.id !== suiviEtatToDelete.id))
      setIsDeleteDialogOpen(false)
      
      toast({
        title: "Succès",
        description: "Le suivi d'état a été supprimé avec succès.",
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

  const handleAddSuiviEtatSuccess = (newSuiviEtat: SuivieEtat) => {
    setSuiviEtats([...suiviEtats, newSuiviEtat])
    setIsAddDialogOpen(false)
    toast({
      title: "Succès",
      description: "Le suivi d'état a été enregistré avec succès",
      variant: "default",
    })
  }

  const filteredSuiviEtats = suiviEtats.filter((suivi) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      suivi.id.toString().includes(searchLower) ||
      (suivi.personne?.nom?.toLowerCase().includes(searchLower) ?? false) ||
      // suivi.observations.toLowerCase().includes(searchLower) ||
      suivi.temperature.toString().includes(searchLower) ||
      suivi.tension.toLowerCase().includes(searchLower)
    )
  })

  const patients = Array.from(
    new Map(
      suiviEtats
        .filter(s => s.personne && s.personne.id !== undefined)
        .map(s => [s.personne!.id, s.personne!])
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
              <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl shadow-lg">
                <Activity className="h-8 w-8 text-white" />
              </div>
              Suivi d'État des Patients
            </h1>
            <p className="text-gray-600 mt-2">Suivi des paramètres vitaux et observations des patients</p>
          </div>
          
          <Button 
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Suivi
          </Button>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-green-600">Total Suivis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{suiviEtats.length}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <Activity className="h-3 w-3 mr-1" />
                {suiviEtats.filter(s => new Date(s.date).getMonth() === new Date().getMonth()).length} ce mois
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-blue-600">Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {suiviEtats.filter(s => new Date(s.date).toDateString() === new Date().toDateString()).length}
              </div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                Suivis du jour
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-orange-600">Température Moyenne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {suiviEtats.length > 0 
                  ? (suiviEtats.reduce((sum, s) => sum + s.temperature, 0) / suiviEtats.length).toFixed(1)
                  : "0.0"
                }C
              </div>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <Thermometer className="h-3 w-3 mr-1" />
                Dernière semaine
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-lg">
            <CardHeader className="border-b p-4">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Filter className="h-5 w-5 text-green-600" />
                Filtres et Recherche
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <Input
                      placeholder="Rechercher par patient, température ou tension..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 py-2 px-4 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des suivis */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-green-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Suivi d'État ({filteredSuiviEtats.length})
            </CardTitle>
            <CardDescription className="text-teal-100">
              Historique complet des paramètres vitaux et observations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Patient</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Température (°C)</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Tension</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuiviEtats.map((suivi) => (
                    <TableRow key={suivi.id} className="hover:bg-green-50">
                      <TableCell className="px-4 py-3">
                        {suivi.personne ? (
                          <div className="font-medium">
                            {suivi.personne.nom}
                          </div>
                        ) : (
                          <div className="text-gray-400">Non spécifié</div>
                        )}
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        {new Date(suivi.date).toLocaleDateString("fr-FR")}
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        <div className={`font-medium ${
                          suivi.temperature > 37.5 ? 'text-red-600' : 
                          suivi.temperature < 36 ? 'text-blue-600' : 
                          'text-green-600'
                        }`}>
                          {suivi.temperature}°C
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        <div className="font-medium">
                          {suivi.tension}
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() => {
                              setSelectedSuiviEtat(suivi)
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
                              setSuiviEtatToDelete(suivi)
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
                Êtes-vous sûr de vouloir supprimer le suivi d'état #{suiviEtatToDelete?.id} ?
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
                onClick={handleDeleteSuiviEtat}
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
                <Activity className="h-5 w-5 text-green-600" />
                Détails du suivi d'état
              </DialogTitle>
            </DialogHeader>
            {selectedSuiviEtat && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ID Suivi</Label>
                    <p className="font-medium">SUIVI-{selectedSuiviEtat.id.toString().padStart(4, '0')}</p>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <p className="font-medium">
                      {new Date(selectedSuiviEtat.date).toLocaleDateString("fr-FR", {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <Label>Patient</Label>
                    <p className="font-medium">
                      {selectedSuiviEtat.personne ? 
                        selectedSuiviEtat.personne.nom : 
                        'Non spécifié'}
                    </p>
                  </div>
                  <div>
                    <Label>Température</Label>
                    <p className={`font-medium ${
                      selectedSuiviEtat.temperature > 37.5 ? 'text-red-600' : 
                      selectedSuiviEtat.temperature < 36 ? 'text-blue-600' : 
                      'text-green-600'
                    }`}>
                      {selectedSuiviEtat.temperature}°C
                    </p>
                  </div>
                  <div>
                    <Label>Tension artérielle</Label>
                    <p className="font-medium">{selectedSuiviEtat.tension}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Observations</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {/* <p className="whitespace-pre-wrap">{selectedSuiviEtat.observations}</p> */}
                    </div>
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
        {/* <AddSuiviEtatModal
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSuccess={handleAddSuiviEtatSuccess}
          patients={patients}
        /> */}
      </div>
    </DashboardLayout>
  )
}