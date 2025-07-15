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
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  Heart,
  Baby,
  Calendar,
  AlertTriangle,
  TrendingUp,
  FileText,
  Phone,
  MapPin,
  Trash2,
  Activity
} from "lucide-react"
import { useState, useEffect } from "react"
import { 
  getPersonneById, 
  addPersonne, 
  updatePersonne, 
  deletePersonne,
  getPersonnesPasGrossesse
} from "@/services/utilisateur/personne.service"
import { Personne } from "@/types/utilisateur"
import { toast } from "sonner"
import { ConfirmationModal } from "@/components/modals/confirmation-modal"

export default function SageFemmePatientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [patientes, setPatientes] = useState<Personne[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newPersonne, setNewPersonne] = useState<Omit<Personne, 'id'>>({ 
    nom: "",
    prenom: "",
    email: "",
    adresse: "",
    telephone: "",
    sexe: "F", // Toujours 'F' pour les patientes
    dateNaissance: "",
    situationMatrimoniale: undefined,
    password: ""
  })
  
  const [editingPersonne, setEditingPersonne] = useState<Personne | null>(null)
  const [viewingPersonne, setViewingPersonne] = useState<Personne | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [personneToDelete, setPersonneToDelete] = useState<Personne | null>(null)

  const fetchPatientes = async () => {
    try {
      setLoading(true)
      const data = await getPersonnesPasGrossesse()
      setPatientes(data)
    } catch (error) {
      toast.error("Erreur lors du chargement des patientes")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Chargement initial des patientes
  useEffect(() => {
    fetchPatientes()
  }, [])

  const stats = [
    {
      title: "Total Patientes",
      value: patientes.length.toString(),
      change: "",
      icon: <Users className="h-5 w-5" />,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      title: "Grossesses Actives",
      value: "N/A",
      change: "",
      icon: <Heart className="h-5 w-5" />,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Accouchements Prévus",
      value: "N/A",
      change: "",
      icon: <Baby className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Consultations Aujourd'hui",
      value: "N/A",
      change: "",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    }
  ]

  const filteredPatientes = patientes.filter((patiente) => {
    const matchesSearch =
      patiente.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patiente.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patiente.telephone.includes(searchTerm)

    return matchesSearch
  })

  const handleAddPersonne = async () => {
    try {
      // Vérifier que le sexe est bien 'F'
      const personneToAdd = { ...newPersonne, sexe: "F" as const }
      await addPersonne(personneToAdd)

      toast.success("Patiente ajoutée avec succès")
      fetchPatientes() // Re-fetch the list
      setIsAddModalOpen(false) // Close the modal
      
      // Réinitialiser le formulaire
      setNewPersonne({ 
        nom: "",
        prenom: "",
        email: "",
        adresse: "",
        telephone: "",
        sexe: "F",
        dateNaissance: "",
        situationMatrimoniale: undefined,
        password: ""
      })
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la patiente")
      console.error(error)
    }
  }

  const handleUpdatePersonne = async () => {
    if (!editingPersonne || !editingPersonne.id) return
    
    try {
      await updatePersonne(editingPersonne)
      fetchPatientes() // Re-fetch the list

      toast.success("Patiente mise à jour avec succès")
      setEditingPersonne(null)
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
      console.error(error)
    }
  }

  const requestDelete = (personne: Personne) => {
    setPersonneToDelete(personne)
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!personneToDelete || !personneToDelete.id) return

    try {
      await deletePersonne(personneToDelete.id)
      fetchPatientes() // Re-fetch the list
      toast.success("Patiente supprimée avec succès")
    } catch (error) {
      toast.error("Erreur lors de la suppression de la patiente")
      console.error(error)
    } finally {
      setIsDeleteConfirmOpen(false)
      setPersonneToDelete(null)
    }
  }

  // Calculer l'âge à partir de la date de naissance
  const calculateAge = (birthdate?: string) => {
    if (!birthdate) return 'N/A'
    const today = new Date()
    const birthDate = new Date(birthdate)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age
  }

  // Ouvrir le dialog de consultation
  const openViewDialog = async (id: number) => {
    try {
      const personne = await getPersonneById(id)
      setViewingPersonne(personne)
    } catch (error) {
      toast.error("Erreur lors du chargement des détails")
      console.error(error)
    }
  }

  // Ouvrir le dialog d'édition
  const openEditDialog = async (id: number) => {
    try {
      const personne = await getPersonneById(id)
      setEditingPersonne(personne)
    } catch (error) {
      toast.error("Erreur lors du chargement des données")
      console.error(error)
    }
  }

  return (
    <DashboardLayout userRole="Sage-femme">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Patientes</h1>
            <p className="text-gray-600 mt-1">Gestion des patientes en suivi obstétrical</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-rose-700 border-rose-200">
              <Heart className="w-3 h-3 mr-2" />
              {patientes.length} Patientes
            </Badge>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Patiente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-rose-600" />
                    Ajouter une Nouvelle Patiente
                  </DialogTitle>
                  <DialogDescription>Enregistrer une nouvelle patiente pour le suivi obstétrical</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom*</Label>
                    <Input 
                      id="nom" 
                      placeholder="Nom de famille" 
                      value={newPersonne.nom}
                      onChange={(e) => setNewPersonne({...newPersonne, nom: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom*</Label>
                    <Input 
                      id="prenom" 
                      placeholder="Prénom" 
                      value={newPersonne.prenom}
                      onChange={(e) => setNewPersonne({...newPersonne, prenom: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email*</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Email" 
                      value={newPersonne.email}
                      onChange={(e) => setNewPersonne({...newPersonne, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone*</Label>
                    <Input 
                      id="telephone" 
                      placeholder="06.12.34.56.78" 
                      value={newPersonne.telephone}
                      onChange={(e) => setNewPersonne({...newPersonne, telephone: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="adresse">Adresse*</Label>
                    <Input 
                      id="adresse" 
                      placeholder="Adresse complète" 
                      value={newPersonne.adresse}
                      onChange={(e) => setNewPersonne({...newPersonne, adresse: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="password">Mot de passe (optionnel)</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Laisser vide si non applicable"
                      value={newPersonne.password || ""}
                      onChange={(e) => setNewPersonne({ ...newPersonne, password: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateNaissance">Date de naissance</Label>
                    <Input 
                      id="dateNaissance" 
                      type="date" 
                      value={newPersonne.dateNaissance}
                      onChange={(e) => setNewPersonne({...newPersonne, dateNaissance: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="situationMatrimoniale">Situation Matrimoniale</Label>
                    <Select
                      value={newPersonne.situationMatrimoniale || ""}
                      onValueChange={(value) => setNewPersonne({...newPersonne, situationMatrimoniale: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Célibataire">Célibataire</SelectItem>
                        <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                        <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                        <SelectItem value="Veuf/Veuve">Veuf/Veuve</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Annuler</Button>
                  <Button 
                    className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
                    onClick={handleAddPersonne}
                  >
                    Enregistrer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
                {stat.change && (
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-rose-600" />
              Recherche et Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher par nom, prénom ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-rose-600" />
              Liste des Patientes ({filteredPatientes.length})
            </CardTitle>
            <CardDescription>Patientes en suivi obstétrical avec informations détaillées</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Chargement des patientes...</div>
            ) : (
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100">
                      <TableHead className="font-semibold text-rose-700">Patiente</TableHead>
                      <TableHead className="font-semibold text-rose-700">Contact</TableHead>
                      <TableHead className="font-semibold text-rose-700">Informations</TableHead>
                      <TableHead className="font-semibold text-rose-700 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatientes.map((patiente) => (
                      <TableRow
                        key={patiente.id}
                        className="hover:bg-rose-50/50 transition-colors bg-white"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {patiente.prenom} {patiente.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {calculateAge(patiente.dateNaissance)} ans
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-3 w-3 mr-1" />
                              {patiente.telephone}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              {patiente.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              {patiente.adresse}
                            </div>
                            {patiente.situationMatrimoniale && (
                              <Badge variant="outline" className="text-xs">
                                {patiente.situationMatrimoniale}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 hover:border-green-300"
                              onClick={() => patiente.id && openViewDialog(patiente.id)}
                            >
                              <Eye className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                              onClick={() => patiente.id && openEditDialog(patiente.id)}
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300"
                              onClick={() => requestDelete(patiente)}
                            >
                              <Trash2 className="h-4 w-4 text-rose-600" />
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

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Confirmation de suppression"
        description={`Êtes-vous sûr de vouloir supprimer la patiente ${personneToDelete?.prenom} ${personneToDelete?.nom} ? Cette action est irréversible.`}
      />

      {/* Dialog de consultation */}
      <Dialog open={!!viewingPersonne} onOpenChange={() => setViewingPersonne(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-rose-600" />
              Détails de la patiente
            </DialogTitle>
            <DialogDescription>
              Informations complètes de {viewingPersonne?.prenom} {viewingPersonne?.nom}
            </DialogDescription>
          </DialogHeader>
          
          {viewingPersonne && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <p className="font-medium">{viewingPersonne.nom}</p>
              </div>
              <div className="space-y-2">
                <Label>Prénom</Label>
                <p className="font-medium">{viewingPersonne.prenom}</p>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <p className="font-medium">{viewingPersonne.email}</p>
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <p className="font-medium">{viewingPersonne.telephone}</p>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Adresse</Label>
                <p className="font-medium">{viewingPersonne.adresse}</p>
              </div>
              <div className="space-y-2">
                <Label>Date de naissance</Label>
                <p className="font-medium">
                  {viewingPersonne.dateNaissance || 'Non spécifié'}
                  {viewingPersonne.dateNaissance && (
                    <span className="text-gray-500 ml-2">
                      ({calculateAge(viewingPersonne.dateNaissance)} ans)
                    </span>
                  )}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Situation Matrimoniale</Label>
                <p className="font-medium">{viewingPersonne.situationMatrimoniale || 'Non spécifié'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition */}
      <Dialog open={!!editingPersonne} onOpenChange={() => setEditingPersonne(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Modifier la patiente
            </DialogTitle>
            <DialogDescription>
              Mettre à jour les informations de {editingPersonne?.prenom} {editingPersonne?.nom}
            </DialogDescription>
          </DialogHeader>
          
          {editingPersonne && (
            <>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nom">Nom*</Label>
                  <Input 
                    id="edit-nom" 
                    placeholder="Nom de famille" 
                    value={editingPersonne.nom}
                    onChange={(e) => setEditingPersonne({...editingPersonne, nom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-prenom">Prénom*</Label>
                  <Input 
                    id="edit-prenom" 
                    placeholder="Prénom" 
                    value={editingPersonne.prenom}
                    onChange={(e) => setEditingPersonne({...editingPersonne, prenom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email*</Label>
                  <Input 
                    id="edit-email" 
                    type="email" 
                    placeholder="Email" 
                    value={editingPersonne.email}
                    onChange={(e) => setEditingPersonne({...editingPersonne, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-telephone">Téléphone*</Label>
                  <Input 
                    id="edit-telephone" 
                    placeholder="06.12.34.56.78" 
                    value={editingPersonne.telephone}
                    onChange={(e) => setEditingPersonne({...editingPersonne, telephone: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-adresse">Adresse*</Label>
                  <Input 
                    id="edit-adresse" 
                    placeholder="Adresse complète" 
                    value={editingPersonne.adresse}
                    onChange={(e) => setEditingPersonne({...editingPersonne, adresse: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-password">Mot de passe</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    placeholder="Laisser vide pour ne pas modifier"
                    value={editingPersonne.password || ""}
                    onChange={(e) => setEditingPersonne({ ...editingPersonne, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dateNaissance">Date de naissance</Label>
                  <Input 
                    id="edit-dateNaissance" 
                    type="date" 
                    value={editingPersonne.dateNaissance}
                    onChange={(e) => setEditingPersonne({...editingPersonne, dateNaissance: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-situationMatrimoniale">Situation Matrimoniale</Label>
                  <Select
                    value={editingPersonne.situationMatrimoniale || ""}
                    onValueChange={(value) => setEditingPersonne({...editingPersonne, situationMatrimoniale: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Célibataire">Célibataire</SelectItem>
                      <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                      <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                      <SelectItem value="Veuf/Veuve">Veuf/Veuve</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingPersonne(null)}>
                  Annuler
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={handleUpdatePersonne}
                >
                  Mettre à jour
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}