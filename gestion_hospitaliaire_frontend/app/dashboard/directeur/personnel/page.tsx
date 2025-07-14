"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Heart,
  Loader2,
  AlertCircle,
  Lock,
  User,
  AlertTriangle,
} from "lucide-react"
import { useState, useCallback, useMemo } from "react"
import { usePersonne } from "@/hooks/utilisateur/usePersonne"
import type { PersonneFormData } from "@/types/utilisateur"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Composant de formulaire mémorisé pour éviter les re-rendus
const PersonForm = ({
  person = null,
  onClose,
  onSubmit,
  loading,
}: {
  person?: any
  onClose: () => void
  onSubmit: (data: PersonneFormData) => Promise<void>
  loading: boolean
}) => {
  const [formData, setFormData] = useState<PersonneFormData>({
    nom: person?.nom || "",
    prenom: person?.prenom || "",
    email: person?.email || "",
    telephone: person?.telephone || "",
    adresse: person?.adresse || "",
    dateNaissance: person?.dateNaissance || "",
    situationMatrimoniale: person?.situationMatrimoniale || "",
    sexe: person?.sexe || "",
    password: "", // Toujours vide pour la sécurité
  })

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validation côté client
      if (!formData.nom.trim()) {
        alert("Le nom est requis")
        return
      }
      if (!formData.email.trim()) {
        alert("L'email est requis")
        return
      }
      if (!formData.adresse.trim()) {
        alert("L'adresse est requise")
        return
      }
      if (!formData.telephone.trim()) {
        alert("Le téléphone est requis")
        return
      }
      if (!person && !formData.password.trim()) {
        alert("Le mot de passe est requis pour un nouvel utilisateur")
        return
      }

      await onSubmit(formData)
    },
    [formData, onSubmit, person],
  )

  const handleInputChange = useCallback((field: keyof PersonneFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              value={formData.prenom}
              onChange={(e) => handleInputChange("prenom", e.target.value)}
              placeholder="Prénom"
              className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => handleInputChange("nom", e.target.value)}
              placeholder="Nom"
              className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="email@hopital.fr"
            className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone *</Label>
            <Input
              id="telephone"
              value={formData.telephone}
              onChange={(e) => handleInputChange("telephone", e.target.value)}
              placeholder="0123456789"
              className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateNaissance">Date de naissance</Label>
            <Input
              id="dateNaissance"
              type="date"
              value={formData.dateNaissance}
              onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
              className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse *</Label>
          <Input
            id="adresse"
            value={formData.adresse}
            onChange={(e) => handleInputChange("adresse", e.target.value)}
            placeholder="Adresse complète"
            className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sexe">Sexe</Label>
            <Select value={formData.sexe} onValueChange={(value) => handleInputChange("sexe", value)}>
              <SelectTrigger className="border-slate-200 focus:border-slate-500 focus:ring-slate-500">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculin</SelectItem>
                <SelectItem value="F">Féminin</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="situation">Situation matrimoniale</Label>
            <Select
              value={formData.situationMatrimoniale}
              onValueChange={(value) => handleInputChange("situationMatrimoniale", value)}
            >
              <SelectTrigger className="border-slate-200 focus:border-slate-500 focus:ring-slate-500">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Célibataire">Célibataire</SelectItem>
                <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                <SelectItem value="Veuf/Veuve">Veuf/Veuve</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Champ mot de passe - requis pour nouveaux utilisateurs */}
        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Mot de passe {!person && "*"}
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder={person ? "Laisser vide pour ne pas changer" : "Mot de passe"}
            className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
            required={!person}
          />
          {person && <p className="text-sm text-slate-600">Laissez vide pour conserver le mot de passe actuel</p>}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} type="button" disabled={loading}>
          Annuler
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {person ? "Sauvegarder" : "Ajouter"}
        </Button>
      </DialogFooter>
    </form>
  )
}

// Composant pour afficher les détails d'une personne
const PersonDetailsModal = ({ person, isOpen, onClose }: { person: any; isOpen: boolean; onClose: () => void }) => {
  if (!person) return null

  const getSexeLabel = (sexe: string) => {
    switch (sexe) {
      case "M":
        return "Masculin"
      case "F":
        return "Féminin"
      default:
        return sexe || "Non spécifié"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Détails de la personne
          </DialogTitle>
          <DialogDescription>
            Informations complètes de {person.prenom} {person.nom}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informations personnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">ID</Label>
                <p className="text-sm text-gray-900 font-mono">{person.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Nom complet</Label>
                <p className="text-sm text-gray-900 font-semibold">
                  {person.prenom} {person.nom}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Email</Label>
                <p className="text-sm text-gray-900">{person.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Téléphone</Label>
                <p className="text-sm text-gray-900">{person.telephone}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">Adresse</Label>
              <p className="text-sm text-gray-900">{person.adresse}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Sexe</Label>
                <p className="text-sm text-gray-900">{getSexeLabel(person.sexe)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Date de naissance</Label>
                <p className="text-sm text-gray-900">
                  {person.dateNaissance ? new Date(person.dateNaissance).toLocaleDateString() : "Non spécifiée"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Situation matrimoniale</Label>
                <p className="text-sm text-gray-900">{person.situationMatrimoniale || "Non spécifiée"}</p>
              </div>
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Statut</h3>
            <div className="flex items-center gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Type</Label>
                <div className="mt-1">
                  {person.employe ? (
                    <Badge className="bg-green-50 text-green-700 border-green-200">Employé</Badge>
                  ) : (
                    <Badge className="bg-slate-50 text-slate-700 border-slate-200">Patient</Badge>
                  )}
                </div>
              </div>
              {person.situationMatrimoniale && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Situation</Label>
                  <div className="mt-1">
                    <Badge
                      className={
                        person.situationMatrimoniale === "Marié(e)"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : person.situationMatrimoniale === "Célibataire"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : person.situationMatrimoniale === "Divorcé(e)"
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                      }
                    >
                      {person.situationMatrimoniale}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dates importantes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informations système</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Date de création</Label>
                <p className="text-sm text-gray-900">
                  {person.dateCreation ? new Date(person.dateCreation).toLocaleDateString() : "Non disponible"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Dernière modification</Label>
                <p className="text-sm text-gray-900">
                  {person.dateModification ? new Date(person.dateModification).toLocaleDateString() : "Non disponible"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function PersonnelPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<any>(null)
  const [personToDelete, setPersonToDelete] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { personnes, stats, loading, error, createPersonne, editPersonne, removePersonne } = usePersonne()

  // Filtrer les personnes selon le terme de recherche
  const filteredPersonnes = useMemo(() => {
    if (!searchTerm) return personnes
    return personnes.filter(
      (person) =>
        person.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [personnes, searchTerm])

  const getSituationBadge = useCallback((situation: string) => {
    const colors = {
      "Marié(e)": "bg-green-50 text-green-700 border-green-200",
      Célibataire: "bg-blue-50 text-blue-700 border-blue-200",
      "Divorcé(e)": "bg-orange-50 text-orange-700 border-orange-200",
      "Veuf/Veuve": "bg-slate-50 text-slate-700 border-slate-200",
    }
    return (
      <Badge className={colors[situation as keyof typeof colors] || "bg-slate-50 text-slate-700 border-slate-200"}>
        {situation}
      </Badge>
    )
  }, [])

  const statsData = useMemo(
    () => [
      {
        title: "Total Personnes",
        value: stats?.totalPersonnes?.toString() || "0",
        icon: <Users className="h-5 w-5" />,
        gradient: "from-slate-500 to-gray-600",
      },
      {
        title: "Employés",
        value: stats?.totalEmployes?.toString() || "0",
        icon: <Users className="h-5 w-5" />,
        gradient: "from-slate-600 to-gray-700",
      },
      {
        title: "Patients",
        value: stats?.totalPatients?.toString() || "0",
        icon: <Heart className="h-5 w-5" />,
        gradient: "from-slate-400 to-gray-500",
      },
      {
        title: "Nouveaux ce mois",
        value: stats?.nouveauxCeMois?.toString() || "0",
        icon: <Calendar className="h-5 w-5" />,
        gradient: "from-slate-500 to-gray-600",
      },
    ],
    [stats],
  )

  const handleView = useCallback((person: any) => {
    setSelectedPerson(person)
    setIsViewDialogOpen(true)
  }, [])

  const handleEdit = useCallback((person: any) => {
    setSelectedPerson(person)
    setIsEditDialogOpen(true)
  }, [])

  const handleDeleteClick = useCallback((person: any) => {
    setPersonToDelete(person)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!personToDelete?.id) return
    try {
      await removePersonne(personToDelete.id)
      setIsDeleteDialogOpen(false)
      setPersonToDelete(null)
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }, [removePersonne, personToDelete])

  const handleAddSubmit = useCallback(
    async (data: PersonneFormData) => {
      try {
        await createPersonne(data)
        setIsAddDialogOpen(false)
      } catch (error) {
        console.error("Erreur lors de l'ajout:", error)
      }
    },
    [createPersonne],
  )

  const handleEditSubmit = useCallback(
    async (data: PersonneFormData) => {
      if (!selectedPerson?.id) return
      try {
        // Si le mot de passe est vide, on ne l'envoie pas
        const updateData = { ...data }
        if (!updateData.password?.trim()) {
          delete updateData.password
        }

        await editPersonne(selectedPerson.id, updateData)
        setIsEditDialogOpen(false)
        setSelectedPerson(null)
      } catch (error) {
        console.error("Erreur lors de la modification:", error)
      }
    },
    [editPersonne, selectedPerson],
  )

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  return (
    <DashboardLayout userRole="Directeur">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion du Personnel</h1>
            <p className="text-gray-600 mt-1">Gérez toutes les personnes dans le système</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Personne
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle personne</DialogTitle>
                <DialogDescription>Remplissez les informations de base de la personne.</DialogDescription>
              </DialogHeader>
              <PersonForm onClose={() => setIsAddDialogOpen(false)} onSubmit={handleAddSubmit} loading={loading} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`bg-gradient-to-r ${stat.gradient} p-2 rounded-lg text-white`}>{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher une personne..."
                    className="pl-10 border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-slate-200 hover:bg-slate-50 bg-transparent"
              >
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Personnel Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-slate-500 to-gray-600 p-2 rounded-lg text-white">
                <Users className="h-5 w-5" />
              </div>
              Liste du Personnel
            </CardTitle>
            <CardDescription>Toutes les personnes enregistrées dans le système</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                <span className="ml-2 text-slate-600">Chargement...</span>
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100">
                      <TableHead className="font-semibold text-slate-900">ID</TableHead>
                      <TableHead className="font-semibold text-slate-900">Personne</TableHead>
                      <TableHead className="font-semibold text-slate-900">Contact</TableHead>
                      <TableHead className="font-semibold text-slate-900">Adresse</TableHead>
                      <TableHead className="font-semibold text-slate-900">Situation</TableHead>
                      <TableHead className="font-semibold text-slate-900">Statut</TableHead>
                      <TableHead className="font-semibold text-slate-900 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPersonnes.map((person, index) => (
                      <TableRow
                        key={person.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        } hover:bg-slate-50/50 transition-colors duration-200`}
                      >
                        <TableCell className="font-medium text-gray-900">{person.id}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold text-gray-900">
                              {person.prenom} {person.nom}
                            </div>
                            {person.dateNaissance && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-3 w-3" />
                                {new Date(person.dateNaissance).toLocaleDateString()}
                              </div>
                            )}
                            {person.sexe && (
                              <div className="text-sm text-gray-500">
                                {person.sexe === "M" ? "Masculin" : person.sexe === "F" ? "Féminin" : person.sexe}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              {person.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              {person.telephone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span className="max-w-[200px] truncate">{person.adresse}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {person.situationMatrimoniale && getSituationBadge(person.situationMatrimoniale)}
                        </TableCell>
                        <TableCell>
                          {person.employe ? (
                            <Badge className="bg-green-50 text-green-700 border-green-200">Employé</Badge>
                          ) : (
                            <Badge className="bg-slate-50 text-slate-700 border-slate-200">Patient</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => handleView(person)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              onClick={() => handleEdit(person)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteClick(person)}
                            >
                              <Trash2 className="h-4 w-4" />
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

        {/* View Dialog */}
        <PersonDetailsModal
          person={selectedPerson}
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
        />

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier les informations</DialogTitle>
              <DialogDescription>
                Modifiez les informations de {selectedPerson?.prenom} {selectedPerson?.nom}.
              </DialogDescription>
            </DialogHeader>
            <PersonForm
              person={selectedPerson}
              onClose={() => setIsEditDialogOpen(false)}
              onSubmit={handleEditSubmit}
              loading={loading}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Confirmer la suppression
              </AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer la personne{" "}
                <span className="font-semibold">
                  {personToDelete?.prenom} {personToDelete?.nom}
                </span>{" "}
                ? Cette action est irréversible et supprimera toutes les données associées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  )
}
