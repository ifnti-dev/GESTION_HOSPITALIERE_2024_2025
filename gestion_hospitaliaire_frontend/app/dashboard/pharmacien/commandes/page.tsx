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
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Package,
  Calendar,
  Euro,
  Minus,
  AlertTriangle,
  Clock,
  Package2,
} from "lucide-react"
import { useCommandes } from "@/hooks/pharmacie/useCommandes"
import { useLignesCommande } from "@/hooks/pharmacie/useLignesCommande"
import { usePersonne } from "@/hooks/utilisateur/usePersonne"
import type { Commande, LigneApprovisionnement } from "@/types/pharmacie"
import type { Personne } from "@/types/utilisateur"
import { formatDate, formatPrice } from "@/utils/formatters"
import { toast } from "sonner"
import { ligneCommandeService } from "@/services/pharmacie/ligne-commande.service"

interface LigneCommandeForm {
  ligneApprovisionnementId: number
  quantite: number
  prixUnitaire: number // Sera automatiquement rempli depuis le lot
}

interface CommandeForm {
  dateCommande: string
  montantTotal: string
  personneId?: number
  lignesCommande: LigneCommandeForm[]
}

export default function CommandesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null)
  const [availableLots, setAvailableLots] = useState<LigneApprovisionnement[]>([])
  const [commandeForm, setCommandeForm] = useState<CommandeForm>({
    dateCommande: new Date().toISOString().split("T")[0],
    montantTotal: "0",
    lignesCommande: [],
  })

  // Hooks
  const { commandes, loading, error, createCommande, updateCommande, deleteCommande, refetch } = useCommandes()
  const { lignes: selectedCommandeLignes } = useLignesCommande(selectedCommande?.id)
  const { personnes } = usePersonne()

  // Charger les lots disponibles au montage du composant
  useEffect(() => {
    const loadAvailableLots = async () => {
      try {
        const lots = await ligneCommandeService.getAllAvailableLots()
        setAvailableLots(lots)
      } catch (error) {
        console.error("Erreur lors du chargement des lots:", error)
      }
    }
    loadAvailableLots()
  }, [])

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

      if (!commandeForm.personneId) {
        toast.error("Veuillez sélectionner un patient")
        return
      }

      // Vérifier le stock disponible pour chaque ligne
      for (const ligne of commandeForm.lignesCommande) {
        const lot = availableLots.find((l) => l.id === ligne.ligneApprovisionnementId)
        if (!lot) {
          toast.error("Lot non trouvé")
          return
        }
        if (!lot.quantiteDisponible || lot.quantiteDisponible < ligne.quantite) {
          toast.error(
            `Stock insuffisant pour le lot ${lot.numeroLot}. Stock disponible: ${lot.quantiteDisponible || 0}`,
          )
          return
        }
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
          await ligneCommandeService.create({
            ...ligne,
            commandeId: newCommande.id,
          })
        }
      }

      toast.success("Commande créée avec succès")
      setIsCreateModalOpen(false)
      resetForm()
      refetch()
      // Recharger les lots disponibles
      const lots = await ligneCommandeService.getAllAvailableLots()
      setAvailableLots(lots)
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      toast.error("Erreur lors de la création de la commande")
    }
  }

  const handleEditCommande = async () => {
    if (!selectedCommande?.id) return

    try {
      if (commandeForm.lignesCommande.length === 0) {
        toast.error("Veuillez ajouter au moins une ligne de commande")
        return
      }

      if (!commandeForm.personneId) {
        toast.error("Veuillez sélectionner un patient")
        return
      }

      const commandeData: Partial<Commande> = {
        dateCommande: commandeForm.dateCommande,
        montantTotal: commandeForm.montantTotal,
        personneId: commandeForm.personneId,
      }

      await updateCommande(selectedCommande.id, commandeData)

      // Supprimer les anciennes lignes
      await ligneCommandeService.deleteByCommandeId(selectedCommande.id)

      // Créer les nouvelles lignes
      for (const ligne of commandeForm.lignesCommande) {
        await ligneCommandeService.create({
          ...ligne,
          commandeId: selectedCommande.id,
        })
      }

      toast.success("Commande modifiée avec succès")
      setIsEditModalOpen(false)
      resetForm()
      refetch()
      // Recharger les lots disponibles
      const lots = await ligneCommandeService.getAllAvailableLots()
      setAvailableLots(lots)
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
        // Recharger les lots disponibles
        const lots = await ligneCommandeService.getAllAvailableLots()
        setAvailableLots(lots)
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        toast.error("Erreur lors de la suppression de la commande")
      }
    }
  }

  const handleViewCommande = async (commande: Commande) => {
    setSelectedCommande(commande)
    setIsViewModalOpen(true)
  }

  const loadCommandeForEdit = async (commande: Commande) => {
    setSelectedCommande(commande)

    // Charger les lignes de la commande
    if (commande.id) {
      try {
        const lignes = await ligneCommandeService.getByCommandeId(commande.id)

        setCommandeForm({
          dateCommande: commande.dateCommande,
          montantTotal: commande.montantTotal,
          personneId: commande.personneId,
          lignesCommande: lignes.map((ligne) => ({
            ligneApprovisionnementId: ligne.ligneApprovisionnementId || 0,
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
      personneId: undefined,
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
          ligneApprovisionnementId: 0,
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
      lignesCommande: prev.lignesCommande.map((ligne, i) => {
        if (i === index) {
          const updatedLigne = { ...ligne, [field]: value }

          // Si on change le lot, mettre à jour automatiquement le prix
          if (field === "ligneApprovisionnementId") {
            const lot = availableLots.find((l) => l.id === value)
            if (lot) {
              updatedLigne.prixUnitaire = lot.prixUnitaireVente
            }
          }

          return updatedLigne
        }
        return ligne
      }),
    }))
  }

  const getLotInfo = (ligneApprovisionnementId: number): LigneApprovisionnement | undefined => {
    return availableLots.find((l) => l.id === ligneApprovisionnementId)
  }

  const getPatientInfo = (personneId: number): Personne | undefined => {
    return personnes.find((p) => p.id === personneId)
  }

  const isLotExpiringSoon = (dateExpiration: string): boolean => {
    const expDate = new Date(dateExpiration)
    const now = new Date()
    const diffTime = expDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const filteredCommandes = commandes.filter((commande) => {
    const matchesSearch =
      commande.id?.toString().includes(searchTerm) ||
      commande.montantTotal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPatientInfo(commande.personneId || 0)
        ?.nom?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getPatientInfo(commande.personneId || 0)
        ?.prenom?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const stats = {
    totalCommandes: commandes.length,
    montantTotal: commandes.reduce((sum, c) => sum + Number.parseFloat(c.montantTotal || "0"), 0),
    commandesMois: commandes.filter((c) => new Date(c.dateCommande).getMonth() === new Date().getMonth()).length,
    lotsDisponibles: availableLots.length,
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
              Gestion des Commandes (FIFO)
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez les commandes par lots d'approvisionnement (Premier Entré, Premier Sorti)
            </p>
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
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-teal-600" />
                  Créer une Nouvelle Commande
                </DialogTitle>
                <DialogDescription>
                  Sélectionnez les lots d'approvisionnement à vendre (logique FIFO - Premier Entré, Premier Sorti).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 gap-4">
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
                    <Label htmlFor="personneId">Patient *</Label>
                    <Select
                      value={commandeForm.personneId?.toString() || ""}
                      onValueChange={(value) =>
                        setCommandeForm((prev) => ({ ...prev, personneId: Number.parseInt(value) }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {personnes.map((personne) => (
                          <SelectItem key={personne.id} value={personne.id!.toString()}>
                            {personne.prenom} {personne.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="montantTotal">Montant Total (calculé automatiquement)</Label>
                    <Input id="montantTotal" value={`${commandeForm.montantTotal} €`} disabled className="bg-gray-50" />
                  </div>
                </div>

                {/* Lignes de commande */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Lignes de Commande (Lots FIFO)</Label>
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

                  {commandeForm.lignesCommande.map((ligne, index) => {
                    const lot = getLotInfo(ligne.ligneApprovisionnementId)
                    const stockDisponible = lot?.quantiteDisponible || 0
                    const stockInsuffisant = stockDisponible < ligne.quantite
                    const expiringSoon = lot ? isLotExpiringSoon(lot.dateExpiration) : false

                    return (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                        <div className="col-span-4">
                          <Label>Lot d'Approvisionnement *</Label>
                          <Select
                            value={ligne.ligneApprovisionnementId.toString()}
                            onValueChange={(value) =>
                              updateLigneCommande(index, "ligneApprovisionnementId", Number.parseInt(value))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un lot" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableLots
                                .filter((lot) => (lot.quantiteDisponible || 0) > 0) // Filtrer les lots avec stock
                                .map((lot) => (
                                  <SelectItem key={lot.id} value={lot.id!.toString()}>
                                    <div className="flex flex-col">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                          {lot.medicamentReference?.medicament?.nom} -{" "}
                                          {lot.medicamentReference?.reference?.nom}
                                        </span>
                                        {isLotExpiringSoon(lot.dateExpiration) && (
                                          <Badge variant="secondary" className="text-xs">
                                            <Clock className="h-3 w-3 mr-1" />
                                            Expire bientôt
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-500 flex items-center gap-4">
                                        <span>Lot: {lot.numeroLot}</span>
                                        <span>Stock: {lot.quantiteDisponible}</span>
                                        <span>Prix: {formatPrice(lot.prixUnitaireVente)}</span>
                                        <span>Exp: {formatDate(lot.dateExpiration)}</span>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          {lot && (
                            <div className="mt-1 flex gap-2">
                              <Badge
                                variant={
                                  stockDisponible > 10 ? "default" : stockDisponible > 0 ? "secondary" : "destructive"
                                }
                              >
                                Stock: {stockDisponible}
                              </Badge>
                              {expiringSoon && (
                                <Badge variant="secondary">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Expire bientôt
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-span-2">
                          <Label>Quantité *</Label>
                          <Input
                            type="number"
                            min="1"
                            max={stockDisponible}
                            value={ligne.quantite}
                            onChange={(e) =>
                              updateLigneCommande(index, "quantite", Number.parseInt(e.target.value) || 1)
                            }
                            className={stockInsuffisant ? "border-red-500" : ""}
                          />
                          {stockInsuffisant && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                              <AlertTriangle className="h-3 w-3" />
                              Stock insuffisant
                            </div>
                          )}
                        </div>
                        <div className="col-span-2">
                          <Label>Prix Unitaire (auto)</Label>
                          <Input type="number" value={ligne.prixUnitaire} disabled className="bg-gray-50" />
                          <div className="text-xs text-gray-500 mt-1">{formatPrice(ligne.prixUnitaire)}</div>
                        </div>
                        <div className="col-span-2">
                          <Label>Total Ligne</Label>
                          <div className="text-sm font-medium text-green-600 p-2 bg-green-50 rounded">
                            {formatPrice(ligne.quantite * ligne.prixUnitaire)}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Label>Lot Info</Label>
                          {lot && (
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>Lot: {lot.numeroLot}</div>
                              <div>Reçu: {formatDate(lot.dateReception)}</div>
                            </div>
                          )}
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeLigneCommande(index)}
                            className="w-full text-red-600 hover:bg-red-50"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}

                  {commandeForm.lignesCommande.length === 0 && (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      <Package2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune ligne de commande. Cliquez sur "Ajouter une ligne" pour commencer.</p>
                      <p className="text-sm mt-2">
                        Les lots seront vendus selon la logique FIFO (Premier Entré, Premier Sorti)
                      </p>
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
                  disabled={commandeForm.lignesCommande.length === 0 || !commandeForm.personneId}
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
              <CardTitle className="text-sm font-medium text-purple-700">Lots Disponibles</CardTitle>
              <Package2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.lotsDisponibles}</div>
              <p className="text-xs text-purple-600 mt-1">Lots en stock</p>
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
                  placeholder="Rechercher par ID, montant ou nom du patient..."
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
                    <TableHead className="font-semibold text-teal-700">Patient</TableHead>
                    <TableHead className="font-semibold text-teal-700">Montant Total</TableHead>
                    <TableHead className="font-semibold text-teal-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCommandes.map((commande) => {
                    const patient = getPatientInfo(commande.personneId || 0)
                    return (
                      <TableRow key={commande.id} className="hover:bg-teal-50/50 transition-colors">
                        <TableCell className="font-mono font-medium text-teal-700">
                          CMD-{commande.id?.toString().padStart(3, "0")}
                        </TableCell>
                        <TableCell>{formatDate(commande.dateCommande)}</TableCell>
                        <TableCell>
                          {patient ? (
                            <div>
                              <div className="font-medium">
                                {patient.prenom} {patient.nom}
                              </div>
                              <div className="text-sm text-gray-500">{patient.email}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Patient non trouvé</span>
                          )}
                        </TableCell>
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
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Dialog de visualisation */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
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
                    <Label className="text-sm font-medium text-gray-500">Patient</Label>
                    {(() => {
                      const patient = getPatientInfo(selectedCommande.personneId || 0)
                      return patient ? (
                        <div>
                          <p className="text-lg font-medium">
                            {patient.prenom} {patient.nom}
                          </p>
                          <p className="text-sm text-gray-600">{patient.email}</p>
                          <p className="text-sm text-gray-600">{patient.telephone}</p>
                        </div>
                      ) : (
                        <p className="text-lg text-gray-400">Patient non trouvé</p>
                      )
                    })()}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Montant Total</Label>
                    <p className="text-lg font-semibold text-green-600">{selectedCommande.montantTotal}€</p>
                  </div>
                </div>

                {/* Lignes de commande */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">Lignes de Commande (Lots Vendus)</Label>
                  {selectedCommandeLignes.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCommandeLignes.map((ligne, index) => {
                        const lot = getLotInfo(ligne.ligneApprovisionnementId || 0)
                        return (
                          <div key={ligne.id || index} className="p-4 border rounded-lg bg-gray-50">
                            <div className="grid grid-cols-5 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-500">Produit</Label>
                                <p className="font-medium">
                                  {lot ? (
                                    <div>
                                      <div>{lot.medicamentReference?.medicament?.nom}</div>
                                      <div className="text-sm text-gray-600">
                                        {lot.medicamentReference?.reference?.nom}
                                      </div>
                                    </div>
                                  ) : (
                                    `Lot ID: ${ligne.ligneApprovisionnementId}`
                                  )}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-500">Lot</Label>
                                <p className="font-medium">{lot?.numeroLot || "N/A"}</p>
                                <p className="text-xs text-gray-500">
                                  Reçu: {lot ? formatDate(lot.dateReception) : "N/A"}
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
                              <div>
                                <Label className="text-sm font-medium text-gray-500">Total Ligne</Label>
                                <p className="font-semibold text-green-600">
                                  {formatPrice(ligne.quantite * ligne.prixUnitaire)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
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
