"use client"

import { useState, useEffect } from "react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ShoppingCart, Plus, Search, Filter, Eye, Edit, Trash2, Package, Calendar, Euro, Minus } from "lucide-react"
import { useCommandes } from "@/hooks/pharmacie/useCommandes"
import { useLignesCommande } from "@/hooks/pharmacie/useLignesCommande"
import { useMedicaments } from "@/hooks/pharmacie/useMedicaments"
import type { Commande, LigneCommande } from "@/types/pharmacie"
import { formatDate, formatPrice } from "@/utils/formatters"
import { toast } from "sonner"

interface LigneCommandeForm {
  medicamentId: number
  quantite: number
  prixUnitaire: number
}

interface CommandeForm {
  dateCommande: string
  montantTotal: string
  personneId?: number
  lignesCommande: LigneCommandeForm[]
}

export default function CommandesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null)
  const [commandeForm, setCommandeForm] = useState<CommandeForm>({
    dateCommande: new Date().toISOString().split("T")[0],
    montantTotal: "0",
    lignesCommande: [],
  })

  // Hooks
  const { commandes, loading, error, createCommande, updateCommande, deleteCommande, refetch } = useCommandes()
  const { lignes: selectedCommandeLignes, refetch: refetchLignes } = useLignesCommande(selectedCommande?.id)
  const { medicaments } = useMedicaments()

  // Calculer le montant total automatiquement
  useEffect(() => {
    const total = commandeForm.lignesCommande.reduce((sum, ligne) => {
      return sum + ligne.quantite * ligne.prixUnitaire
    }, 0)
    setCommandeForm((prev) => ({
      ...prev,
      montantTotal: (total / 100).toFixed(2), // Conversion centimes vers euros
    }))
  }, [commandeForm.lignesCommande])

  const handleCreateCommande = async () => {
    try {
      if (commandeForm.lignesCommande.length === 0) {
        toast.error("Veuillez ajouter au moins une ligne de commande")
        return
      }

      const commandeData: Omit<Commande, "id"> = {
        dateCommande: commandeForm.dateCommande,
        montantTotal: commandeForm.montantTotal,
        personneId: commandeForm.personneId,
      }

      const newCommande = await createCommande(commandeData)

      // Créer les lignes de commande
      if (newCommande.id) {
        for (const ligne of commandeForm.lignesCommande) {
          await fetch(`http://localhost:8080/api/lignes-commande`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...ligne,
              commandeId: newCommande.id,
            }),
          })
        }
      }

      toast.success("Commande créée avec succès")
      setIsCreateModalOpen(false)
      resetForm()
      refetch()
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      toast.error("Erreur lors de la création de la commande")
    }
  }

  const handleEditCommande = async () => {
    if (!selectedCommande?.id) return

    try {
      const commandeData: Partial<Commande> = {
        dateCommande: commandeForm.dateCommande,
        montantTotal: commandeForm.montantTotal,
        personneId: commandeForm.personneId,
      }

      await updateCommande(selectedCommande.id, commandeData)

      // Supprimer les anciennes lignes et créer les nouvelles
      await fetch(`http://localhost:8080/api/lignes-commande/by-commande/${selectedCommande.id}`)
        .then((res) => res.json())
        .then(async (lignes: LigneCommande[]) => {
          for (const ligne of lignes) {
            if (ligne.id) {
              await fetch(`http://localhost:8080/api/lignes-commande/${ligne.id}`, {
                method: "DELETE",
              })
            }
          }
        })

      // Créer les nouvelles lignes
      for (const ligne of commandeForm.lignesCommande) {
        await fetch(`http://localhost:8080/api/lignes-commande`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...ligne,
            commandeId: selectedCommande.id,
          }),
        })
      }

      toast.success("Commande modifiée avec succès")
      setIsEditModalOpen(false)
      resetForm()
      refetch()
    } catch (error) {
      console.error("Erreur lors de la modification:", error)
      toast.error("Erreur lors de la modification de la commande")
    }
  }

  const handleDeleteCommande = async (commande: Commande) => {
    if (!commande.id) return

    if (confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      try {
        await deleteCommande(commande.id)
        toast.success("Commande supprimée avec succès")
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        toast.error("Erreur lors de la suppression de la commande")
      }
    }
  }

  const handleViewCommande = async (commande: Commande) => {
    setSelectedCommande(commande)
    setIsViewModalOpen(true)
    // Les lignes seront chargées automatiquement par le hook
  }

  const loadCommandeForEdit = async (commande: Commande) => {
    setSelectedCommande(commande)

    // Charger les lignes de la commande
    if (commande.id) {
      try {
        const response = await fetch(`http://localhost:8080/api/lignes-commande/by-commande/${commande.id}`)
        const lignes: LigneCommande[] = await response.json()

        setCommandeForm({
          dateCommande: commande.dateCommande,
          montantTotal: commande.montantTotal,
          personneId: commande.personneId,
          lignesCommande: lignes.map((ligne) => ({
            medicamentId: ligne.medicamentId || 0,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
          })),
        })
      } catch (error) {
        console.error("Erreur lors du chargement des lignes:", error)
      }
    }

    setIsEditModalOpen(true)
  }

  const resetForm = () => {
    setCommandeForm({
      dateCommande: new Date().toISOString().split("T")[0],
      montantTotal: "0",
      lignesCommande: [],
    })
    setSelectedCommande(null)
  }

  const addLigneCommande = () => {
    setCommandeForm((prev) => ({
      ...prev,
      lignesCommande: [
        ...prev.lignesCommande,
        {
          medicamentId: 0,
          quantite: 1,
          prixUnitaire: 0,
        },
      ],
    }))
  }

  const removeLigneCommande = (index: number) => {
    setCommandeForm((prev) => ({
      ...prev,
      lignesCommande: prev.lignesCommande.filter((_, i) => i !== index),
    }))
  }

  const updateLigneCommande = (index: number, field: keyof LigneCommandeForm, value: number) => {
    setCommandeForm((prev) => ({
      ...prev,
      lignesCommande: prev.lignesCommande.map((ligne, i) => (i === index ? { ...ligne, [field]: value } : ligne)),
    }))
  }

  const filteredCommandes = commandes.filter((commande) => {
    const matchesSearch =
      commande.id?.toString().includes(searchTerm) ||
      commande.montantTotal.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const stats = {
    totalCommandes: commandes.length,
    montantTotal: commandes.reduce((sum, c) => sum + Number.parseFloat(c.montantTotal || "0"), 0),
    commandesMois: commandes.filter((c) => new Date(c.dateCommande).getMonth() === new Date().getMonth()).length,
    moyenneMontant:
      commandes.length > 0
        ? commandes.reduce((sum, c) => sum + Number.parseFloat(c.montantTotal || "0"), 0) / commandes.length
        : 0,
  }

  if (loading) {
    return (
      <PharmacienSidebar>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des commandes...</p>
          </div>
        </div>
      </PharmacienSidebar>
    )
  }

  if (error) {
    return (
      <PharmacienSidebar>
        <div className="text-center py-8">
          <p className="text-red-600">Erreur: {error}</p>
          <Button onClick={refetch} className="mt-4">
            Réessayer
          </Button>
        </div>
      </PharmacienSidebar>
    )
  }

  return (
    <PharmacienSidebar>
      <div className="space-y-8">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              Gestion des Commandes
            </h1>
            <p className="text-gray-600 mt-2">Gérez et suivez toutes vos commandes de médicaments</p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg"
                onClick={resetForm}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Commande
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-teal-600" />
                  Créer une Nouvelle Commande
                </DialogTitle>
                <DialogDescription>Remplissez les informations pour créer une nouvelle commande.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateCommande">Date de Commande</Label>
                    <Input
                      type="date"
                      id="dateCommande"
                      value={commandeForm.dateCommande}
                      onChange={(e) => setCommandeForm((prev) => ({ ...prev, dateCommande: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="montantTotal">Montant Total (calculé automatiquement)</Label>
                    <Input id="montantTotal" value={`${commandeForm.montantTotal} €`} disabled className="bg-gray-50" />
                  </div>
                </div>

                {/* Lignes de commande */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Lignes de Commande</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addLigneCommande}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter une ligne
                    </Button>
                  </div>

                  {commandeForm.lignesCommande.map((ligne, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                      <div className="col-span-5">
                        <Label>Médicament</Label>
                        <Select
                          value={ligne.medicamentId.toString()}
                          onValueChange={(value) => updateLigneCommande(index, "medicamentId", Number.parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un médicament" />
                          </SelectTrigger>
                          <SelectContent>
                            {medicaments.map((medicament) => (
                              <SelectItem key={medicament.id} value={medicament.id!.toString()}>
                                {medicament.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label>Quantité</Label>
                        <Input
                          type="number"
                          min="1"
                          value={ligne.quantite}
                          onChange={(e) => updateLigneCommande(index, "quantite", Number.parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label>Prix Unitaire (centimes)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={ligne.prixUnitaire}
                          onChange={(e) =>
                            updateLigneCommande(index, "prixUnitaire", Number.parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeLigneCommande(index)}
                          className="w-full"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {commandeForm.lignesCommande.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Aucune ligne de commande. Cliquez sur "Ajouter une ligne" pour commencer.
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Annuler
                </Button>
                <Button
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                  onClick={handleCreateCommande}
                  disabled={commandeForm.lignesCommande.length === 0}
                >
                  Créer la Commande
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Total Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">{stats.totalCommandes}</div>
              <p className="text-xs text-teal-600 mt-1">Toutes les commandes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Montant Total</CardTitle>
              <Euro className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.montantTotal.toFixed(2)}€</div>
              <p className="text-xs text-green-600 mt-1">Valeur totale</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Ce Mois</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.commandesMois}</div>
              <p className="text-xs text-blue-600 mt-1">Commandes du mois</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-teal-50 border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Moyenne</CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.moyenneMontant.toFixed(2)}€</div>
              <p className="text-xs text-purple-600 mt-1">Montant moyen</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et Recherche */}
        <Card className="shadow-lg border-teal-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="h-5 w-5 text-teal-600" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par ID ou montant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des Commandes */}
        <Card className="shadow-lg border-teal-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-teal-600" />
              Liste des Commandes
            </CardTitle>
            <CardDescription>{filteredCommandes.length} commande(s) trouvée(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-teal-50/50">
                    <TableHead className="font-semibold text-teal-700">ID</TableHead>
                    <TableHead className="font-semibold text-teal-700">Date</TableHead>
                    <TableHead className="font-semibold text-teal-700">Montant Total</TableHead>
                    <TableHead className="font-semibold text-teal-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCommandes.map((commande) => (
                    <TableRow key={commande.id} className="hover:bg-teal-50/50 transition-colors">
                      <TableCell className="font-mono font-medium text-teal-700">
                        CMD-{commande.id?.toString().padStart(3, "0")}
                      </TableCell>
                      <TableCell>{formatDate(commande.dateCommande)}</TableCell>
                      <TableCell className="font-semibold text-green-700">{commande.montantTotal}€</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 hover:bg-teal-50 bg-transparent"
                            onClick={() => handleViewCommande(commande)}
                          >
                            <Eye className="h-4 w-4 text-teal-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 hover:bg-blue-50 bg-transparent"
                            onClick={() => loadCommandeForEdit(commande)}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 hover:bg-red-50 bg-transparent"
                            onClick={() => handleDeleteCommande(commande)}
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
          </CardContent>
        </Card>

        {/* Dialog de modification */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-600" />
                Modifier la Commande
              </DialogTitle>
              <DialogDescription>Modifiez les informations de la commande.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editDateCommande">Date de Commande</Label>
                  <Input
                    type="date"
                    id="editDateCommande"
                    value={commandeForm.dateCommande}
                    onChange={(e) => setCommandeForm((prev) => ({ ...prev, dateCommande: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editMontantTotal">Montant Total (calculé automatiquement)</Label>
                  <Input
                    id="editMontantTotal"
                    value={`${commandeForm.montantTotal} €`}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Lignes de commande */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Lignes de Commande</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLigneCommande}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter une ligne
                  </Button>
                </div>

                {commandeForm.lignesCommande.map((ligne, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                    <div className="col-span-5">
                      <Label>Médicament</Label>
                      <Select
                        value={ligne.medicamentId.toString()}
                        onValueChange={(value) => updateLigneCommande(index, "medicamentId", Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un médicament" />
                        </SelectTrigger>
                        <SelectContent>
                          {medicaments.map((medicament) => (
                            <SelectItem key={medicament.id} value={medicament.id!.toString()}>
                              {medicament.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label>Quantité</Label>
                      <Input
                        type="number"
                        min="1"
                        value={ligne.quantite}
                        onChange={(e) => updateLigneCommande(index, "quantite", Number.parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label>Prix Unitaire (centimes)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={ligne.prixUnitaire}
                        onChange={(e) =>
                          updateLigneCommande(index, "prixUnitaire", Number.parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeLigneCommande(index)}
                        className="w-full"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {commandeForm.lignesCommande.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune ligne de commande. Cliquez sur "Ajouter une ligne" pour commencer.
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Annuler
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                onClick={handleEditCommande}
                disabled={commandeForm.lignesCommande.length === 0}
              >
                Modifier la Commande
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de visualisation */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-teal-600" />
                Détails de la Commande
              </DialogTitle>
              <DialogDescription>Informations détaillées de la commande sélectionnée.</DialogDescription>
            </DialogHeader>
            {selectedCommande && (
              <div className="space-y-6">
                {/* Informations générales */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">ID Commande</Label>
                    <p className="text-lg font-semibold">CMD-{selectedCommande.id?.toString().padStart(3, "0")}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Date de Commande</Label>
                    <p className="text-lg">{formatDate(selectedCommande.dateCommande)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Montant Total</Label>
                    <p className="text-lg font-semibold text-green-600">{selectedCommande.montantTotal}€</p>
                  </div>
                </div>

                {/* Lignes de commande */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">Lignes de Commande</Label>
                  {selectedCommandeLignes.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCommandeLignes.map((ligne, index) => (
                        <div key={ligne.id || index} className="p-4 border rounded-lg bg-gray-50">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Médicament</Label>
                              <p className="font-medium">
                                {medicaments.find((m) => m.id === ligne.medicamentId)?.nom ||
                                  `ID: ${ligne.medicamentId}`}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Quantité</Label>
                              <p className="font-medium">{ligne.quantite}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Prix Unitaire</Label>
                              <p className="font-medium">{formatPrice(ligne.prixUnitaire)}</p>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t">
                            <Label className="text-sm font-medium text-gray-500">Total Ligne</Label>
                            <p className="font-semibold text-green-600">
                              {formatPrice(ligne.quantite * ligne.prixUnitaire)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune ligne de commande trouvée</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PharmacienSidebar>
  )
}
