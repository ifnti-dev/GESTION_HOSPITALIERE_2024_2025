"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect } from "react"
import { consultationPrenataleService } from "../../../../services/consultationTraitement/consultationPrenataleService"
import { ConsultationPrenatale } from "../../../../types/consultstionsTraitement"
import { toast } from "sonner"
import { getPersonnesPasGrossesse } from "@/services/utilisateur/personne.service"
import { Personne } from "@/types/utilisateur"
import { ConfirmationModal } from "@/components/modals/confirmation-modal"
import { AddConsultationModal } from "../../../../components/add-consultationPrenatal-modal"
import { ViewConsultationModal } from "../../../../components/view-consultationPrenatal-modal"
import { EditConsultationModal } from "../../../../components/edit-consultationPrenatal-modal"
import {
  Stethoscope,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Activity,
  Calendar,
  HeartPulse,
  Ruler,
  Baby,
  TrendingUp,
  Filter,
  X
} from "lucide-react"

// Définition du type pour les nouvelles consultations
type ConsultationFormData = {
  patiente:{
    id: number;
  } ;
  dateConsultation: string;
  semaineAmenorrhee: number;
  poids: number;
  tensionArterielle: string;
  hauteurUterine?: number | null;
  bruitsCardiaquesFoetaux?: string | null;
  observations?: string | null;
  prochainRdv?: string | null;
  alerte?: string | null;
};

export default function SageFemmeConsultationsPrenatalesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [consultations, setConsultations] = useState<ConsultationPrenatale[]>([])
  const [patientes, setPatientes] = useState<Personne[]>([])
  const [loading, setLoading] = useState(true)
  
  // États pour les modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [viewingConsultation, setViewingConsultation] = useState<ConsultationPrenatale | null>(null)
  const [editingConsultation, setEditingConsultation] = useState<ConsultationPrenatale | null>(null)
  const [deletingConsultationId, setDeletingConsultationId] = useState<number | null>(null)
  
  // État pour la nouvelle consultation
  const [newConsultation, setNewConsultation] = useState<ConsultationFormData>({
    patiente: { 
      id: 0
     }, 
    dateConsultation: new Date().toISOString().split('T')[0],
    semaineAmenorrhee: 0,
    poids: 0,
    tensionArterielle: "",
    hauteurUterine: null,
    bruitsCardiaquesFoetaux: null,
    observations: null,
    prochainRdv: null,
    alerte: null
  })

  // Chargement initial des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const consultationsData = await consultationPrenataleService.getConsultationsPrenatales()
        const patientesData = await getPersonnesPasGrossesse()
        
        setConsultations(consultationsData)
        setPatientes(patientesData)
        console.log("Patientes chargées :", patientesData)

      } catch (error) {
        toast.error("Erreur lors du chargement des données")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredConsultations = consultations.filter(c => {
    const patienteName = `${c.patiente.prenom} ${c.patiente.nom}`.toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    
    const matchesSearch = 
      patienteName.includes(searchLower) ||
      c.id.toString().includes(searchLower)
    
    const matchesFilter = filter === 'all' || (filter === 'alerts' && c.alerte)

    return matchesSearch && matchesFilter
  })

  const stats = [
    {
      title: "Consultations (Mois)",
      value: consultations.length.toString(),
      change: "",
      icon: <Stethoscope className="h-5 w-5" />,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      title: "Patientes avec Alertes",
      value: consultations.filter(c => c.alerte).length.toString(),
      change: "À surveiller",
      icon: <HeartPulse className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Prochains RDV (7j)",
      value: consultations.filter(c => c.prochainRdv).length.toString(),
      change: "Planifiés",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Consultations Totales",
      value: "128",
      change: "Historique complet",
      icon: <Activity className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const handleAddConsultation = async () => {
    try {
      if (newConsultation.patiente.id === 0) {
        toast.warning("Veuillez sélectionner une patiente")
        return
      }
      
      const addedConsultation = await consultationPrenataleService.createConsultationPrenatale(newConsultation)
      setConsultations([...consultations, addedConsultation])
      
      // Réinitialisation du formulaire
      setNewConsultation({
        patiente: { id: 0 },
        dateConsultation: new Date().toISOString().split('T')[0],
        semaineAmenorrhee: 0,
        poids: 0,
        tensionArterielle: "",
        hauteurUterine: null,
        bruitsCardiaquesFoetaux: null,
        observations: null,
        prochainRdv: null,
        alerte: null
      })
      
      setIsAddModalOpen(false)
      toast.success("Consultation ajoutée avec succès")
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la consultation")
      console.error(error)
    }
  }

  const handleUpdateConsultation = async () => {
    if (!editingConsultation) return
    
    try {
      // Préparation du payload de mise à jour
      const updatePayload: ConsultationFormData = {
        patiente: {
          id: editingConsultation.patiente.id ?? 0
        },
        dateConsultation: editingConsultation.dateConsultation,
        semaineAmenorrhee: editingConsultation.semaineAmenorrhee,
        poids: editingConsultation.poids,
        tensionArterielle: editingConsultation.tensionArterielle,
        hauteurUterine: editingConsultation.hauteurUterine,
        bruitsCardiaquesFoetaux: editingConsultation.bruitsCardiaquesFoetaux,
        observations: editingConsultation.observations,
        prochainRdv: editingConsultation.prochainRdv,
        alerte: editingConsultation.alerte
      }
      
      const updatedConsultation = await consultationPrenataleService.updateConsultationPrenatale(
        editingConsultation.id, 
        updatePayload
      )
      
      setConsultations(consultations.map(c => 
        c.id === editingConsultation.id ? updatedConsultation : c
      ))
      toast.success("Consultation mise à jour avec succès")
      setEditingConsultation(null)
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
      console.error(error)
    }
  }

  const handleDeleteConsultation = async (id: number) => {
    try {
      await consultationPrenataleService.deleteConsultationPrenatale(id)
      setConsultations(consultations.filter(c => c.id !== id))
      setDeletingConsultationId(null)
      toast.success("Consultation supprimée avec succès")
    } catch (error) {
      toast.error("Erreur lors de la suppression")
      console.error(error)
    }
  }

  const openViewDialog = async (id: number) => {
    try {
      const consultation = await consultationPrenataleService.getConsultationPrenataleById(id)
      setViewingConsultation(consultation)
    } catch (error) {
      toast.error("Erreur lors du chargement des détails")
      console.error(error)
    }
  }

  const openEditDialog = async (id: number) => {
    try {
      const consultation = await consultationPrenataleService.getConsultationPrenataleById(id)
      setEditingConsultation(consultation)
    } catch (error) {
      toast.error("Erreur lors du chargement des données")
      console.error(error)
    }
  }

  const calculateAge = (birthdate?: string) => {
    if (!birthdate) return "N/A"
    const today = new Date()
    const birthDate = new Date(birthdate)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age
  }

  return (
    // <DashboardLayout userRole="Sage-femme">
        <DashboardLayout >

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consultations Prénatales</h1>
            <p className="text-gray-600 mt-1">Suivi des consultations de grossesse</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Consultation
          </Button>
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
              <Filter className="h-5 w-5 text-rose-600" />
              Recherche et Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher par nom de patiente ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={filter === 'alerts' ? 'destructive' : 'outline'} 
                  onClick={() => setFilter(filter === 'alerts' ? 'all' : 'alerts')}
                >
                  <HeartPulse className="h-4 w-4 mr-2" />
                  Voir les alertes ({consultations.filter(c => c.alerte).length})
                </Button>
                {(filter !== 'all' || searchTerm) && (
                  <Button variant="ghost" onClick={() => {
                    setFilter('all')
                    setSearchTerm('')
                  }}>
                    <X className="h-4 w-4 mr-1" />
                    Réinitialiser
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consultations Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-rose-600" />
              Liste des Consultations ({filteredConsultations.length})
            </CardTitle>
            <CardDescription>Dernières consultations prénatales enregistrées</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Chargement des consultations...</div>
            ) : filteredConsultations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune consultation trouvée
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100">
                      <TableHead className="font-semibold text-rose-700">Patiente</TableHead>
                      <TableHead className="font-semibold text-rose-700">Date</TableHead>
                      <TableHead className="font-semibold text-rose-700">Données Clés</TableHead>
                      <TableHead className="font-semibold text-rose-700">Observations</TableHead>
                      <TableHead className="font-semibold text-rose-700 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConsultations.map((consultation) => (
                      <TableRow
                        key={consultation.id}
                        className="hover:bg-rose-50/50 transition-colors"
                      >
                        <TableCell>
                          <div className="font-medium text-gray-900">
                            {consultation.patiente.prenom} {consultation.patiente.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {calculateAge(consultation.patiente.dateNaissance)} ans
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{new Date(consultation.dateConsultation).toLocaleDateString('fr-FR')}</div>
                          <Badge variant="outline" className="mt-1">{consultation.semaineAmenorrhee} SA</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-1"><HeartPulse className="h-3 w-3 text-red-500" /> TA: <strong>{consultation.tensionArterielle}</strong></div>
                            <div className="flex items-center gap-1"><Ruler className="h-3 w-3 text-blue-500" /> HU: <strong>{consultation.hauteurUterine || "-"} cm</strong></div>
                            <div className="flex items-center gap-1"><Baby className="h-3 w-3 text-pink-500" /> BCF: <strong>{consultation.bruitsCardiaquesFoetaux || "Présents"}</strong></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{consultation.observations}</p>
                          {consultation.alerte && (
                            <Badge variant="destructive" className="mt-1 text-xs">
                              {consultation.alerte}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 hover:border-green-300"
                              onClick={() => consultation.id && openViewDialog(consultation.id)}
                            >
                              <Eye className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                              onClick={() => consultation.id && openEditDialog(consultation.id)}
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300"
                              onClick={() => consultation.id && setDeletingConsultationId(consultation.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modales */}
      <AddConsultationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        patientes={patientes}
        newConsultation={newConsultation}
        setNewConsultation={setNewConsultation}
        handleAddConsultation={handleAddConsultation}
      />

      <ViewConsultationModal
        consultation={viewingConsultation}
        onClose={() => setViewingConsultation(null)}
      />

      <EditConsultationModal
        consultation={editingConsultation}
        onClose={() => setEditingConsultation(null)}
        setEditingConsultation={setEditingConsultation}
        handleUpdateConsultation={handleUpdateConsultation}
      />

      <ConfirmationModal
        isOpen={deletingConsultationId !== null}
        onClose={() => setDeletingConsultationId(null)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeletingConsultationId(null)
        }}
        onConfirm={() => {
          if (deletingConsultationId) {
            handleDeleteConsultation(deletingConsultationId)
          }
        }}
        title="Confirmer la suppression"
        description="Êtes-vous sûr de vouloir supprimer cette consultation prénatale ? Cette action est irréversible."
      />
    </DashboardLayout>
  )
}