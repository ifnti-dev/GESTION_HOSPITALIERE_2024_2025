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
  Briefcase,
  Loader2,
  AlertCircle,
  UserCheck,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { useState, useCallback, useMemo } from "react"
import { useEmploye } from "@/hooks/utilisateur/useEmploye"
import { usePersonne } from "@/hooks/utilisateur/usePersonne"
import { useRole } from "@/hooks/utilisateur/useRole"
import type { EmployeFormData } from "@/types/utilisateur"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Composant de formulaire pour les employés
const EmployeForm = ({
  employe = null,
  onClose,
  onSubmit,
  loading,
}: {
  employe?: any
  onClose: () => void
  onSubmit: (data: EmployeFormData) => Promise<void>
  loading: boolean
}) => {
  const { personnes } = usePersonne()
  const { roles } = useRole()

  const [formData, setFormData] = useState<EmployeFormData>({
    horaire: employe?.horaire || "",
    dateAffectation: employe?.dateAffectation ? new Date(employe.dateAffectation).toISOString().split("T")[0] : "",
    specialite: employe?.specialite || "",
    numOrdre: employe?.numOrdre || "",
    statut: employe?.statut || "Actif",
    personneId: employe?.personne?.id || 0,
    roleIds: employe?.roles?.map((r: any) => r.id) || [],
  })

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validation côté client
      if (!formData.horaire.trim()) {
        alert("L'horaire est requis")
        return
      }
      if (!formData.specialite.trim()) {
        alert("La spécialité est requise")
        return
      }
      if (!formData.numOrdre.trim()) {
        alert("Le numéro d'ordre est requis")
        return
      }
      if (!formData.personneId) {
        alert("Une personne doit être sélectionnée")
        return
      }

      await onSubmit(formData)
    },
    [formData, onSubmit],
  )

  const handleInputChange = useCallback((field: keyof EmployeFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // Filtrer les personnes qui ne sont pas déjà employées
  const availablePersonnes = useMemo(() => {
    return personnes.filter((p) => !p.employe || p.id === employe?.personne?.id)
  }, [personnes, employe])

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="personne">Personne *</Label>
          <Select
            value={formData.personneId.toString()}
            onValueChange={(value) => handleInputChange("personneId", Number.parseInt(value))}
          >
            <SelectTrigger className="border-slate-200 focus:border-slate-500 focus:ring-slate-500">
              <SelectValue placeholder="Sélectionner une personne..." />
            </SelectTrigger>
            <SelectContent>
              {availablePersonnes.map((personne) => (
                <SelectItem key={personne.id} value={personne.id!.toString()}>
                  {personne.prenom} {personne.nom} - {personne.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="specialite">Spécialité *</Label>
            <Input
              id="specialite"
              value={formData.specialite}
              onChange={(e) => handleInputChange("specialite", e.target.value)}
              placeholder="Ex: Médecin généraliste"
              className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numOrdre">Numéro d'ordre *</Label>
            <Input
              id="numOrdre"
              value={formData.numOrdre}
              onChange={(e) => handleInputChange("numOrdre", e.target.value)}
              placeholder="Ex: ORD001"
              className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="horaire">Horaire *</Label>
            <Input
              id="horaire"
              value={formData.horaire}
              onChange={(e) => handleInputChange("horaire", e.target.value)}
              placeholder="Ex: 8h-17h"
              className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateAffectation">Date d'affectation *</Label>
            <Input
              id="dateAffectation"
              type="date"
              value={formData.dateAffectation}
              onChange={(e) => handleInputChange("dateAffectation", e.target.value)}
              className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="statut">Statut</Label>
          <Select value={formData.statut} onValueChange={(value) => handleInputChange("statut", value)}>
            <SelectTrigger className="border-slate-200 focus:border-slate-500 focus:ring-slate-500">
              <SelectValue placeholder="Sélectionner un statut..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Actif">Actif</SelectItem>
              <SelectItem value="Congé">En congé</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
              <SelectItem value="Suspendu">Suspendu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Rôles</Label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-slate-200 rounded-md p-2">
            {roles.map((role) => (
              <label key={role.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.roleIds.includes(role.id!)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleInputChange("roleIds", [...formData.roleIds, role.id!])
                    } else {
                      handleInputChange(
                        "roleIds",
                        formData.roleIds.filter((id) => id !== role.id),
                      )
                    }
                  }}
                  className="rounded border-slate-300"
                />
                <span className="text-sm">{role.nom}</span>
              </label>
            ))}
          </div>
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
          {employe ? "Sauvegarder" : "Ajouter"}
        </Button>
      </DialogFooter>
    </form>
  )
}

// Composant pour afficher les détails d'un employé
const EmployeDetailsModal = ({ employe, isOpen, onClose }: { employe: any; isOpen: boolean; onClose: () => void }) => {
  if (!employe) return null

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

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Actif":
        return "bg-green-50 text-green-700 border-green-200"
      case "Congé":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Absent":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "Suspendu":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Détails de l'employé
          </DialogTitle>
          <DialogDescription>
            Informations complètes de {employe.personne?.prenom} {employe.personne?.nom}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informations personnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">ID Employé</Label>
                <p className="text-sm text-gray-900 font-mono">{employe.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Nom complet</Label>
                <p className="text-sm text-gray-900 font-semibold">
                  {employe.personne?.prenom} {employe.personne?.nom}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Email</Label>
                <p className="text-sm text-gray-900">{employe.personne?.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Téléphone</Label>
                <p className="text-sm text-gray-900">{employe.personne?.telephone}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">Adresse</Label>
              <p className="text-sm text-gray-900">{employe.personne?.adresse}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Sexe</Label>
                <p className="text-sm text-gray-900">{getSexeLabel(employe.personne?.sexe)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Date de naissance</Label>
                <p className="text-sm text-gray-900">
                  {employe.personne?.dateNaissance
                    ? new Date(employe.personne.dateNaissance).toLocaleDateString()
                    : "Non spécifiée"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Situation matrimoniale</Label>
                <p className="text-sm text-gray-900">{employe.personne?.situationMatrimoniale || "Non spécifiée"}</p>
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informations professionnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Spécialité</Label>
                <p className="text-sm text-gray-900 font-medium">{employe.specialite}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Numéro d'ordre</Label>
                <p className="text-sm text-gray-900 font-mono">{employe.numOrdre}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Horaire</Label>
                <p className="text-sm text-gray-900">{employe.horaire}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Date d'affectation</Label>
                <p className="text-sm text-gray-900">{new Date(employe.dateAffectation).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">Statut</Label>
              <div className="mt-1">
                <Badge className={getStatutColor(employe.statut || "Actif")}>{employe.statut || "Actif"}</Badge>
              </div>
            </div>
          </div>

          {/* Rôles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Rôles et permissions</h3>
            <div>
              <Label className="text-sm font-medium text-gray-600">Rôles assignés</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {employe.roles && employe.roles.length > 0 ? (
                  employe.roles.map((role: any) => (
                    <Badge key={role.id} className="bg-blue-50 text-blue-700 border-blue-200">
                      {role.nom}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Aucun rôle assigné</p>
                )}
              </div>
            </div>
          </div>

          {/* Dates importantes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informations système</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Date de création</Label>
                <p className="text-sm text-gray-900">
                  {employe.dateCreation ? new Date(employe.dateCreation).toLocaleDateString() : "Non disponible"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Dernière modification</Label>
                <p className="text-sm text-gray-900">
                  {employe.dateModification
                    ? new Date(employe.dateModification).toLocaleDateString()
                    : "Non disponible"}
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

export default function EmployesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEmploye, setSelectedEmploye] = useState<any>(null)
  const [employeToDelete, setEmployeToDelete] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { employes, stats, loading, error, createEmploye, editEmploye, removeEmploye } = useEmploye()

  // Filtrer les employés selon le terme de recherche
  const filteredEmployes = useMemo(() => {
    if (!searchTerm) return employes
    return employes.filter(
      (employe) =>
        employe.personne.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employe.personne.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employe.specialite.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employe.numOrdre.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [employes, searchTerm])

  const getStatutBadge = useCallback((statut: string) => {
    const colors = {
      Actif: "bg-green-50 text-green-700 border-green-200",
      Congé: "bg-yellow-50 text-yellow-700 border-yellow-200",
      Absent: "bg-orange-50 text-orange-700 border-orange-200",
      Suspendu: "bg-red-50 text-red-700 border-red-200",
    }
    return (
      <Badge className={colors[statut as keyof typeof colors] || "bg-slate-50 text-slate-700 border-slate-200"}>
        {statut}
      </Badge>
    )
  }, [])

  const statsData = useMemo(
    () => [
      {
        title: "Total Employés",
        value: stats?.totalEmployes?.toString() || "0",
        icon: <Users className="h-5 w-5" />,
        gradient: "from-slate-500 to-gray-600",
      },
      {
        title: "Employés Actifs",
        value: stats?.employes_actifs?.toString() || "0",
        icon: <UserCheck className="h-5 w-5" />,
        gradient: "from-green-500 to-green-600",
      },
      {
        title: "En Congé",
        value: stats?.employes_conge?.toString() || "0",
        icon: <Clock className="h-5 w-5" />,
        gradient: "from-yellow-500 to-yellow-600",
      },
      {
        title: "Nouveaux ce mois",
        value: stats?.nouveauxCeMois?.toString() || "0",
        icon: <Calendar className="h-5 w-5" />,
        gradient: "from-slate-400 to-gray-500",
      },
    ],
    [stats],
  )

  const handleView = useCallback((employe: any) => {
    setSelectedEmploye(employe)
    setIsViewDialogOpen(true)
  }, [])

  const handleEdit = useCallback((employe: any) => {
    setSelectedEmploye(employe)
    setIsEditDialogOpen(true)
  }, [])

  const handleDeleteClick = useCallback((employe: any) => {
    setEmployeToDelete(employe)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!employeToDelete?.id) return
    try {
      await removeEmploye(employeToDelete.id)
      setIsDeleteDialogOpen(false)
      setEmployeToDelete(null)
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }, [removeEmploye, employeToDelete])

  const handleAddSubmit = useCallback(
    async (data: EmployeFormData) => {
      try {
        await createEmploye(data)
        setIsAddDialogOpen(false)
      } catch (error) {
        console.error("Erreur lors de l'ajout:", error)
      }
    },
    [createEmploye],
  )

  const handleEditSubmit = useCallback(
    async (data: EmployeFormData) => {
      if (!selectedEmploye?.id) return
      try {
        await editEmploye(selectedEmploye.id, data)
        setIsEditDialogOpen(false)
        setSelectedEmploye(null)
      } catch (error) {
        console.error("Erreur lors de la modification:", error)
      }
    },
    [editEmploye, selectedEmploye],
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
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Employés</h1>
            <p className="text-gray-600 mt-1">Gérez tous les employés de l'hôpital</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel Employé
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel employé</DialogTitle>
                <DialogDescription>Remplissez les informations de l'employé.</DialogDescription>
              </DialogHeader>
              <EmployeForm onClose={() => setIsAddDialogOpen(false)} onSubmit={handleAddSubmit} loading={loading} />
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
                    placeholder="Rechercher un employé..."
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

        {/* Employes Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-slate-500 to-gray-600 p-2 rounded-lg text-white">
                <Briefcase className="h-5 w-5" />
              </div>
              Liste des Employés
            </CardTitle>
            <CardDescription>Tous les employés enregistrés dans le système</CardDescription>
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
                      <TableHead className="font-semibold text-slate-900">Employé</TableHead>
                      <TableHead className="font-semibold text-slate-900">Contact</TableHead>
                      <TableHead className="font-semibold text-slate-900">Poste</TableHead>
                      <TableHead className="font-semibold text-slate-900">Horaire</TableHead>
                      <TableHead className="font-semibold text-slate-900">Statut</TableHead>
                      <TableHead className="font-semibold text-slate-900 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployes.map((employe, index) => (
                      <TableRow
                        key={employe.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        } hover:bg-slate-50/50 transition-colors duration-200`}
                      >
                        <TableCell className="font-medium text-gray-900">{employe.id}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold text-gray-900">
                              {employe.personne.prenom} {employe.personne.nom}
                            </div>
                            <div className="text-sm text-gray-600">N° Ordre: {employe.numOrdre}</div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="h-3 w-3" />
                              Depuis: {new Date(employe.dateAffectation).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              {employe.personne.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              {employe.personne.telephone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{employe.specialite}</div>
                            <div className="text-sm text-gray-600">
                              Rôles: {employe.roles?.map((r) => r.nom).join(", ") || "Aucun"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-3 w-3" />
                            {employe.horaire}
                          </div>
                        </TableCell>
                        <TableCell>{getStatutBadge(employe.statut || "Actif")}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => handleView(employe)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              onClick={() => handleEdit(employe)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteClick(employe)}
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
        <EmployeDetailsModal
          employe={selectedEmploye}
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
        />

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier l'employé</DialogTitle>
              <DialogDescription>
                Modifiez les informations de {selectedEmploye?.personne?.prenom} {selectedEmploye?.personne?.nom}.
              </DialogDescription>
            </DialogHeader>
            <EmployeForm
              employe={selectedEmploye}
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
                Êtes-vous sûr de vouloir supprimer l'employé{" "}
                <span className="font-semibold">
                  {employeToDelete?.personne?.prenom} {employeToDelete?.personne?.nom}
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
