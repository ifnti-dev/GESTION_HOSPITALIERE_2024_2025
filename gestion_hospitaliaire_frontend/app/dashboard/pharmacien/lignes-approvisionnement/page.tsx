"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package2, Plus, Search, Edit, Trash2, Calendar, AlertTriangle, Clock, CheckCircle } from "lucide-react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { useLignesApprovisionnement } from "@/hooks/pharmacie/useLignesApprovisionnement"
import { useApprovisionnements } from "@/hooks/pharmacie/useApprovisionnements"
import { useMedicamentReferences } from "@/hooks/pharmacie/useMedicamentReferences"
import type { LigneApprovisionnement } from "@/types/pharmacie"
import { toast } from "@/hooks/use-toast"

export default function LignesApprovisionnementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLigne, setEditingLigne] = useState<LigneApprovisionnement | null>(null)
  const [selectedApprovisionnement, setSelectedApprovisionnement] = useState("all")
  const [formData, setFormData] = useState({
    quantite: 0,
    prixUnitaireAchat: 0,
    prixUnitaireVente: 0,
    dateReception: "",
    dateExpiration: "",
    numeroLot: "",
    approvisionnementId: 0,
    medicamentReferenceId: 0,
  })

  const { lignes, loading, error, createLigne, updateLigne, deleteLigne, fetchLignes } = useLignesApprovisionnement()

  const { approvisionnements } = useApprovisionnements()
  const { medicamentReferences } = useMedicamentReferences()

  // Calculer les statistiques
  const stats = {
    total: lignes.length,
    recu: lignes.filter((l) => l.dateReception).length,
    enAttente: lignes.filter((l) => !l.dateReception).length,
    expirantSoon: lignes.filter((l) => {
      if (!l.dateExpiration) return false
      const expDate = new Date(l.dateExpiration)
      const today = new Date()
      const diffTime = expDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 30 && diffDays > 0
    }).length,
  }

  // Filtrer les lignes
  const filteredLignes = lignes.filter((ligne) => {
    const matchesSearch =
      ligne.numeroLot.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ligne.medicamentReference?.medicament?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ligne.medicamentReference?.reference?.nom.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesApprovisionnement =
      selectedApprovisionnement === "all" || ligne.approvisionnementId?.toString() === selectedApprovisionnement

    return matchesSearch && matchesApprovisionnement
  })

  const getStatutBadge = (ligne: LigneApprovisionnement) => {
    if (ligne.dateReception) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Reçu
        </Badge>
      )
    }
    return (
      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
        <Clock className="h-3 w-3 mr-1" />
        En attente
      </Badge>
    )
  }

  const getExpirationBadge = (dateExpiration: string) => {
    const expDate = new Date(dateExpiration)
    const today = new Date()
    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) {
      return <Badge variant="destructive">Expiré</Badge>
    } else if (diffDays <= 30) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Expire dans {diffDays}j</Badge>
    }
    return <Badge variant="outline">Valide</Badge>
  }

  const handleEdit = (ligne: LigneApprovisionnement) => {
    setEditingLigne(ligne)
    setFormData({
      quantite: ligne.quantite,
      prixUnitaireAchat: ligne.prixUnitaireAchat,
      prixUnitaireVente: ligne.prixUnitaireVente,
      dateReception: ligne.dateReception || "",
      dateExpiration: ligne.dateExpiration,
      numeroLot: ligne.numeroLot,
      approvisionnementId: ligne.approvisionnementId || 0,
      medicamentReferenceId: ligne.medicamentReferenceId || 0,
    })
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingLigne(null)
    setFormData({
      quantite: 0,
      prixUnitaireAchat: 0,
      prixUnitaireVente: 0,
      dateReception: "",
      dateExpiration: "",
      numeroLot: "",
      approvisionnementId: 0,
      medicamentReferenceId: 0,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const ligneData = {
        ...formData,
        // Convertir les prix en centimes
        prixUnitaireAchat: Math.round(formData.prixUnitaireAchat * 100),
        prixUnitaireVente: Math.round(formData.prixUnitaireVente * 100),
        dateReception: formData.dateReception || undefined,
      }

      if (editingLigne) {
        await updateLigne(editingLigne.id!, ligneData)
        toast({
          title: "Succès",
          description: "Ligne d'approvisionnement modifiée avec succès",
        })
      } else {
        await createLigne(ligneData)
        toast({
          title: "Succès",
          description: "Ligne d'approvisionnement créée avec succès",
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette ligne d'approvisionnement ?")) {
      try {
        await deleteLigne(id)
        toast({
          title: "Succès",
          description: "Ligne d'approvisionnement supprimée avec succès",
        })
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression",
          variant: "destructive",
        })
      }
    }
  }

  if (error) {
    return (
      <PharmacienSidebar>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Erreur: {error}</p>
            <Button onClick={fetchLignes} className="mt-4">
              Réessayer
            </Button>
          </div>
        </div>
      </PharmacienSidebar>
    )
  }

  return (
    <PharmacienSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <Package2 className="h-8 w-8 text-white" />
              </div>
              Lignes d'Approvisionnement
            </h1>
            <p className="text-gray-600 mt-2">Gérez les détails des livraisons</p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Ligne
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Lignes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
              <p className="text-xs text-blue-600 mt-1">Toutes lignes</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Reçues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.recu}</div>
              <p className="text-xs text-green-600 mt-1">Livraisons terminées</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.enAttente}</div>
              <p className="text-xs text-orange-600 mt-1">Non reçues</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Expiration proche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{stats.expirantSoon}</div>
              <p className="text-xs text-red-600 mt-1">{"< 30 jours"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par lot, médicament ou référence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Select value={selectedApprovisionnement} onValueChange={setSelectedApprovisionnement}>
                <SelectTrigger className="w-48 border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Approvisionnement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les approvisionnements</SelectItem>
                  {approvisionnements.map((appro) => (
                    <SelectItem key={appro.id} value={appro.id!.toString()}>
                      #{appro.id} - {appro.fournisseur}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Lignes Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Package2 className="h-5 w-5 text-blue-600" />
              Liste des Lignes d'Approvisionnement
            </CardTitle>
            <CardDescription className="text-blue-600">{filteredLignes.length} ligne(s) trouvée(s)</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                      <TableHead className="font-semibold text-gray-700 py-4">N° Lot</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Produit</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Quantité</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Prix Achat</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Prix Vente</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Expiration</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Statut</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700 py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLignes.map((ligne, index) => (
                      <TableRow
                        key={ligne.id}
                        className={`
                          hover:bg-blue-50/50 transition-all duration-200 border-b border-gray-100
                          ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                        `}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="font-medium font-mono text-gray-900">{ligne.numeroLot}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {ligne.medicamentReference?.medicament?.nom || "N/A"}
                            </span>
                            <span className="text-sm text-gray-500">
                              {ligne.medicamentReference?.reference?.nom || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-medium text-gray-900">{ligne.quantite}</span>
                        </TableCell>
                        <TableCell className="font-medium text-blue-700 py-4">
                          {(ligne.prixUnitaireAchat / 100).toFixed(2)}€
                        </TableCell>
                        <TableCell className="font-medium text-green-700 py-4">
                          {(ligne.prixUnitaireVente / 100).toFixed(2)}€
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-600">
                              {new Date(ligne.dateExpiration).toLocaleDateString("fr-FR")}
                            </span>
                            {getExpirationBadge(ligne.dateExpiration)}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">{getStatutBadge(ligne)}</TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(ligne)}
                              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(ligne.id!)}
                              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                            >
                              <Trash2 className="h-3 w-3" />
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

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package2 className="h-5 w-5 text-blue-600" />
                {editingLigne ? "Modifier la Ligne" : "Nouvelle Ligne d'Approvisionnement"}
              </DialogTitle>
              <DialogDescription>
                {editingLigne
                  ? "Modifiez les informations de la ligne d'approvisionnement."
                  : "Créez une nouvelle ligne d'approvisionnement."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="approvisionnementId">Approvisionnement</Label>
                  <Select
                    value={formData.approvisionnementId.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, approvisionnementId: Number.parseInt(value) }))
                    }
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Sélectionner un approvisionnement" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvisionnements.map((appro) => (
                        <SelectItem key={appro.id} value={appro.id!.toString()}>
                          #{appro.id} - {appro.fournisseur}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="medicamentReferenceId">Produit</Label>
                  <Select
                    value={formData.medicamentReferenceId.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, medicamentReferenceId: Number.parseInt(value) }))
                    }
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Sélectionner un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicamentReferences.map((ref) => (
                        <SelectItem key={ref.id} value={ref.id!.toString()}>
                          {ref.medicament?.nom} - {ref.reference?.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantite">Quantité</Label>
                  <Input
                    id="quantite"
                    type="number"
                    min="1"
                    value={formData.quantite}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, quantite: Number.parseInt(e.target.value) || 0 }))
                    }
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prixUnitaireAchat">Prix Achat (€)</Label>
                  <Input
                    id="prixUnitaireAchat"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.prixUnitaireAchat}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, prixUnitaireAchat: Number.parseFloat(e.target.value) || 0 }))
                    }
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prixUnitaireVente">Prix Vente (€)</Label>
                  <Input
                    id="prixUnitaireVente"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.prixUnitaireVente}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, prixUnitaireVente: Number.parseFloat(e.target.value) || 0 }))
                    }
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dateReception">Date de réception</Label>
                  <Input
                    id="dateReception"
                    type="date"
                    value={formData.dateReception}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dateReception: e.target.value }))}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateExpiration">Date d'expiration</Label>
                  <Input
                    id="dateExpiration"
                    type="date"
                    value={formData.dateExpiration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dateExpiration: e.target.value }))}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="numeroLot">Numéro de lot</Label>
                <Input
                  id="numeroLot"
                  value={formData.numeroLot}
                  onChange={(e) => setFormData((prev) => ({ ...prev, numeroLot: e.target.value }))}
                  placeholder="Laissez vide pour génération automatique"
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={
                  loading ||
                  !formData.quantite ||
                  !formData.dateExpiration ||
                  !formData.approvisionnementId ||
                  !formData.medicamentReferenceId
                }
              >
                {editingLigne ? "Modifier" : "Créer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PharmacienSidebar>
  )
}
