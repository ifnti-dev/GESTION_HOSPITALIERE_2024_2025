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
  FileText,
  Calculator,
  ChevronRight,
} from "lucide-react"
import { useCommandes } from "@/hooks/pharmacie/useCommandes"
import { useLignesCommande, useLotsDisponibles } from "@/hooks/pharmacie/useLignesCommande"
import { usePersonne } from "@/hooks/utilisateur/usePersonne"
import type { Commande, LigneApprovisionnement } from "@/types/pharmacie"
import type { Personne } from "@/types/utilisateur"
import { formatDate, formatPrice } from "@/utils/formatters"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { commandeService } from "@/services/pharmacie/commande.service" // Correct import for commandeService

interface LigneCommandeForm {
  id: string // Temporary ID for form management
  ligneApprovisionnementId: number
  quantite: number
  prixUnitaire: number
}

interface CommandeForm {
  dateCommande: string
  montantTotal: string
  personneId?: number // Gardons personneId pour la gestion du formulaire
  lignesCommande: LigneCommandeForm[]
}

export default function CommandesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null)
  const [commandeForm, setCommandeForm] = useState<CommandeForm>({
    dateCommande: new Date().toISOString().split("T")[0],
    montantTotal: "0",
    personneId: undefined,
    lignesCommande: [],
  })
  const [activeTab, setActiveTab] = useState("info") // "info", "lignes", "resume"
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hooks
  const { commandes, loading, error, createCommande, updateCommande, deleteCommande, refetch } = useCommandes()
  const { lignes: selectedCommandeLignes, refetch: refetchSelectedCommandeLignes } = useLignesCommande(
    selectedCommande?.id,
  )
  const { lots: availableLots, refetch: refetchLots } = useLotsDisponibles()
  const { personnes, fetchAllPersonnes } = usePersonne()

  // Calculer le montant total automatiquement
  useEffect(() => {
    const total = commandeForm.lignesCommande.reduce((sum, ligne) => {
      return sum + ligne.quantite * ligne.prixUnitaire
    }, 0)
    console.log("Calcul du montant total. Total brut (en centimes):", total) // Log de débogage
    setCommandeForm((prev) => ({
      ...prev,
      montantTotal: (total / 100).toFixed(2), // Conversion centimes vers euros
    }))
  }, [commandeForm.lignesCommande])

  // Log pour débogage des lots disponibles
  useEffect(() => {
    console.log("Lots disponibles pour la sélection:", availableLots)
    if (availableLots.length === 0) {
      console.warn("Aucun lot disponible pour la sélection. Vérifiez les approvisionnements et le stock.")
    }
  }, [availableLots])

  // Log pour débogage des personnes disponibles
  useEffect(() => {
    console.log("Personnes disponibles pour la sélection du patient:", personnes)
    if (personnes.length === 0) {
      console.warn("Aucune personne disponible pour la sélection du patient.")
    }
  }, [personnes])

  // Refetch personnes when create/edit modal opens
  useEffect(() => {
    if (isCreateModalOpen || isEditModalOpen) {
      fetchAllPersonnes()
      refetchLots() // Also refetch lots to ensure stock is up-to-date
    }
  }, [isCreateModalOpen, isEditModalOpen, fetchAllPersonnes, refetchLots])

  const generateTempId = () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const handleCreateCommande = async () => {
    setIsSubmitting(true)
    try {
      if (commandeForm.lignesCommande.length === 0) {
        toast.error("Veuillez ajouter au moins une ligne de commande")
        setActiveTab("lignes")
        return
      }

      if (!commandeForm.personneId) {
        toast.error("Veuillez sélectionner un patient")
        setActiveTab("info")
        return
      }

      // Vérifier le stock et obtenir medicamentReferenceId pour l'endpoint FIFO
      const linesToProcess: { medicamentReferenceId: number; quantite: number }[] = []
      for (const ligne of commandeForm.lignesCommande) {
        const lot = availableLots.find((l) => l.id === ligne.ligneApprovisionnementId)
        if (!lot) {
          toast.error("Lot non trouvé pour une ligne de commande. Veuillez sélectionner un lot valide.")
          setActiveTab("lignes")
          return
        }
        if (!lot.quantiteDisponible || lot.quantiteDisponible < ligne.quantite) {
          toast.error(
            `Stock insuffisant pour le lot ${lot.numeroLot}. Stock disponible: ${lot.quantiteDisponible || 0}`,
          )
          setActiveTab("lignes")
          return
        }
        if (!lot.medicamentReference?.id) {
          toast.error("Référence de médicament manquante pour le lot sélectionné.")
          setActiveTab("lignes")
          return
        }
        linesToProcess.push({
          medicamentReferenceId: lot.medicamentReference.id,
          quantite: ligne.quantite,
        })
      }

      // Trouver l'objet Personne complet pour l'envoyer au backend
      const selectedPersonne = personnes.find((p) => p.id === commandeForm.personneId)
      if (!selectedPersonne) {
        toast.error("Patient sélectionné introuvable. Veuillez réessayer.")
        setActiveTab("info")
        return
      }

      const commandeData: Omit<Commande, "id"> = {
        dateCommande: commandeForm.dateCommande,
        montantTotal: "0.0", // Send initial 0.0, backend will recalculate
        personne: { id: selectedPersonne.id } as Personne, // Envoyer un objet Personne minimal avec l'ID
      }

      console.log("Tentative de création de commande avec les données:", commandeData) // Log de débogage
      const newCommande = await createCommande(commandeData) // This returns the Commande object without lines
      console.log("Commande créée, réponse:", newCommande)

      // Créer les lignes de commande en utilisant l'endpoint FIFO
      if (newCommande.id) {
        const { ligneCommandeService } = await import("@/services/pharmacie/ligne-commande.service")
        for (const lineData of linesToProcess) {
          console.log("Création de ligneCommande FIFO:", { ...lineData, commandeId: newCommande.id })
          await ligneCommandeService.createLigneCommandeFIFO(
            newCommande.id,
            lineData.medicamentReferenceId,
            lineData.quantite,
          )
        }
        // Après la création des lignes, demander au backend de recalculer le montant total
        console.log("Recalcul du montant total pour la commande ID:", newCommande.id)
        await commandeService.recalculerMontantTotal(newCommande.id)
        toast.success("Montant total de la commande recalculé avec succès.")
      }

      toast.success("Commande créée avec succès")
      setIsCreateModalOpen(false)
      resetForm()
      refetch() // Rafraîchir la liste principale des commandes
      refetchLots() // Rafraîchir les lots disponibles
      fetchAllPersonnes()
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      toast.error("Erreur lors de la création de la commande")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCommande = async () => {
    if (!selectedCommande?.id) return

    setIsSubmitting(true)
    try {
      if (commandeForm.lignesCommande.length === 0) {
        toast.error("Veuillez ajouter au moins une ligne de commande")
        setActiveTab("lignes")
        return
      }

      if (!commandeForm.personneId) {
        toast.error("Veuillez sélectionner un patient")
        setActiveTab("info")
        return
      }

      // Vérifier le stock et obtenir medicamentReferenceId pour l'endpoint FIFO
      const linesToProcess: { medicamentReferenceId: number; quantite: number }[] = []
      for (const ligne of commandeForm.lignesCommande) {
        const lot = availableLots.find((l) => l.id === ligne.ligneApprovisionnementId)
        if (!lot) {
          toast.error("Lot non trouvé pour une ligne de commande. Veuillez sélectionner un lot valide.")
          setActiveTab("lignes")
          return
        }
        if (!lot.quantiteDisponible || lot.quantiteDisponible < ligne.quantite) {
          toast.error(
            `Stock insuffisant pour le lot ${lot.numeroLot}. Stock disponible: ${lot.quantiteDisponible || 0}`,
          )
          return
        }
        if (!lot.medicamentReference?.id) {
          toast.error("Référence de médicament manquante pour le lot sélectionné.")
          return
        }
        linesToProcess.push({
          medicamentReferenceId: lot.medicamentReference.id,
          quantite: ligne.quantite,
        })
      }

      // Trouver l'objet Personne complet pour l'envoyer au backend
      const selectedPersonne = personnes.find((p) => p.id === commandeForm.personneId)
      if (!selectedPersonne) {
        toast.error("Patient sélectionné introuvable. Veuillez réessayer.")
        setActiveTab("info")
        return
      }

      const commandeData: Partial<Commande> = {
        dateCommande: commandeForm.dateCommande,
        montantTotal: commandeForm.montantTotal, // Le backend le recalculera
        personne: { id: selectedPersonne.id } as Personne, // Envoyer un objet Personne minimal avec l'ID
      }

      console.log("Tentative de mise à jour de commande avec les données:", commandeData) // Log de débogage
      await updateCommande(selectedCommande.id, commandeData)
      console.log("Commande mise à jour.")

      // Supprimer les anciennes lignes et créer les nouvelles
      const { ligneCommandeService } = await import("@/services/pharmacie/ligne-commande.service")
      console.log("Suppression des anciennes lignesCommande pour la commande:", selectedCommande.id)
      await ligneCommandeService.deleteByCommandeId(selectedCommande.id)
      console.log("Anciennes lignesCommande supprimées. Création des nouvelles...")

      // Créer les nouvelles lignes en utilisant l'endpoint FIFO
      for (const lineData of linesToProcess) {
        console.log("Création de nouvelle ligneCommande FIFO:", lineData)
        await ligneCommandeService.createLigneCommandeFIFO(
          selectedCommande.id, // Utiliser l'ID de la commande actuellement sélectionnée
          lineData.medicamentReferenceId,
          lineData.quantite,
        )
      }

      // Après la mise à jour des lignes, demander au backend de recalculer le montant total
      console.log("Recalcul du montant total pour la commande ID:", selectedCommande.id)
      await commandeService.recalculerMontantTotal(selectedCommande.id)
      toast.success("Montant total de la commande recalculé avec succès.")

      // Si le modal de visualisation est ouvert pour cette commande, rafraîchir ses lignes
      if (isViewModalOpen && selectedCommande.id === selectedCommande.id) {
        refetchSelectedCommandeLignes()
      }

      toast.success("Commande modifiée avec succès")
      setIsEditModalOpen(false)
      resetForm()
      refetch() // Rafraîchir la liste principale des commandes
      refetchLots() // Rafraîchir les lots disponibles
      fetchAllPersonnes()
    } catch (error) {
      console.error("Erreur lors de la modification:", error)
      toast.error("Erreur lors de la modification de la commande")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCommande = async (commande: Commande) => {
    if (!commande.id) return

    if (confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      try {
        console.log("Tentative de suppression de la commande:", commande.id)
        await deleteCommande(commande.id)
        toast.success("Commande supprimée avec succès")
        refetch() // Rafraîchir la liste principale des commandes
        refetchLots() // Rafraîchir les lots disponibles
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        toast.error("Erreur lors de la suppression de la commande")
      }
    }
  }

  const handleViewCommande = async (commande: Commande) => {
    setSelectedCommande(commande)
    setIsViewModalOpen(true)
    // Rafraîchir les lignes pour le modal de visualisation pour s'assurer des dernières données
    refetchSelectedCommandeLignes()
  }

  const loadCommandeForEdit = async (commande: Commande) => {
    setSelectedCommande(commande)
    setActiveTab("info") // Réinitialiser à l'onglet info lors de l'ouverture pour modification

    // Charger les lignes de la commande
    if (commande.id) {
      try {
        const { ligneCommandeService } = await import("@/services/pharmacie/ligne-commande.service")
        const lignes = await ligneCommandeService.getByCommandeId(commande.id)
        console.log("Lignes chargées pour l'édition:", lignes)

        setCommandeForm({
          dateCommande: commande.dateCommande,
          montantTotal: commande.montantTotal,
          personneId: commande.personne?.id, // Utiliser personne.id pour le formulaire
          lignesCommande: lignes.map((ligne) => ({
            id: generateTempId(), // Assigner un ID temporaire pour la gestion du formulaire
            ligneApprovisionnementId: ligne.ligneApprovisionnementId || 0,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
          })),
        })
      } catch (error) {
        console.error("Erreur lors du chargement des lignes pour l'édition:", error)
        toast.error("Erreur lors du chargement des lignes de commande pour l'édition.")
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
    setActiveTab("info") // Réinitialiser l'onglet à info
  }

  const addLigneCommande = () => {
    setCommandeForm((prev) => ({
      ...prev,
      lignesCommande: [
        ...prev.lignesCommande,
        {
          id: generateTempId(), // Assigner un ID temporaire
          ligneApprovisionnementId: 0,
          quantite: 1,
          prixUnitaire: 0,
        },
      ],
    }))
  }

  const removeLigneCommande = (id: string) => {
    setCommandeForm((prev) => ({
      ...prev,
      lignesCommande: prev.lignesCommande.filter((ligne) => ligne.id !== id),
    }))
  }

  const updateLigneCommande = (id: string, field: keyof LigneCommandeForm, value: any) => {
    setCommandeForm((prev) => ({
      ...prev,
      lignesCommande: prev.lignesCommande.map((ligne) => {
        if (ligne.id === id) {
          const updatedLigne = { ...ligne, [field]: value }

          // Si le lot est changé, mettre à jour automatiquement le prix
          if (field === "ligneApprovisionnementId") {
            const lot = availableLots.find((l) => l.id === value)
            if (lot) {
              updatedLigne.prixUnitaire = lot.prixUnitaireVente
              console.log(`Lot sélectionné: ${lot.numeroLot}, Prix (en centimes): ${lot.prixUnitaireVente}`) // Log de débogage
            } else {
              updatedLigne.prixUnitaire = 0 // Réinitialiser le prix si le lot n'est pas trouvé
              console.warn(`Lot avec l'ID ${value} non trouvé.`) // Log de débogage
            }
          }
          console.log(
            `Mise à jour de la ligne ${id}: champ=${field}, valeur=${value}, nouvel état de la ligne:`,
            updatedLigne,
          ) // Log de débogage
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
      getPatientInfo(commande.personne?.id || 0)
        ?.nom?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getPatientInfo(commande.personne?.id || 0)
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
            <DialogContent className="sm:max-w-[1400px] max-h-[90vh] p-0">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-teal-600" />
                  Créer une Nouvelle Commande
                </DialogTitle>
                <DialogDescription>
                  Sélectionnez les lots d'approvisionnement à vendre (logique FIFO - Premier Entré, Premier Sorti).
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <div className="px-6">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="info" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Informations
                      </TabsTrigger>
                      <TabsTrigger value="lignes" className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Lignes ({commandeForm.lignesCommande.length})
                      </TabsTrigger>
                      <TabsTrigger value="resume" className="flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Résumé
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    {/* Onglet Informations */}
                    <TabsContent value="info" className="h-full m-0 p-6">
                      <Card className="border-teal-200 h-full">
                        <CardHeader>
                          <CardTitle className="text-lg text-teal-800">Informations Générales</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid gap-2">
                            <Label htmlFor="dateCommande">Date de Commande</Label>
                            <Input
                              type="date"
                              id="dateCommande"
                              value={commandeForm.dateCommande}
                              onChange={(e) => setCommandeForm((prev) => ({ ...prev, dateCommande: e.target.value }))}
                              className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="personneId">Patient *</Label>
                            <Select
                              value={commandeForm.personneId?.toString() || ""}
                              onValueChange={(value) => {
                                console.log("Patient sélectionné dans le formulaire:", value) // Log de débogage
                                setCommandeForm((prev) => ({ ...prev, personneId: Number.parseInt(value) }))
                              }}
                            >
                              <SelectTrigger className="border-teal-200 focus:border-teal-500 focus:ring-teal-500">
                                <SelectValue placeholder="Sélectionner un patient" />
                              </SelectTrigger>
                              <SelectContent>
                                {personnes
                                  .filter((p) => p.id != null && typeof p.id === "number")
                                  .map((personne) => (
                                    <SelectItem key={personne.id} value={personne.id!.toString()}>
                                      {personne.prenom} {personne.nom}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="montantTotal">Montant Total (calculé automatiquement)</Label>
                            <Input
                              id="montantTotal"
                              value={`${commandeForm.montantTotal} FCFA`}
                              disabled
                              className="bg-gray-50 text-gray-600"
                            />
                            <p className="text-xs text-gray-500">
                              Le montant est calculé à partir des lignes de commande.
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              onClick={() => setActiveTab("lignes")}
                              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                            >
                              Suivant: Ajouter des lignes
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Onglet Lignes de Commande */}
                    <TabsContent value="lignes" className="h-full m-0 p-6">
                      <Card className="border-cyan-200 h-full flex flex-col">
                        <CardHeader className="flex-shrink-0">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-cyan-800">Lignes de Commande</CardTitle>
                            <Button
                              type="button"
                              onClick={addLigneCommande}
                              size="sm"
                              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter Ligne
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden p-0">
                          {commandeForm.lignesCommande.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                              <Package2 className="h-12 w-12 mb-4 opacity-50" />
                              <p className="text-lg font-medium">Aucune ligne ajoutée</p>
                              <p className="text-sm mb-4">Cliquez sur "Ajouter Ligne" pour commencer</p>
                              <Button
                                onClick={addLigneCommande}
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Première Ligne
                              </Button>
                            </div>
                          ) : (
                            <div className="h-[400px] border rounded-lg m-4">
                              <ScrollArea className="h-full w-full">
                                <div className="min-w-[1200px]">
                                  <Table>
                                    <TableHeader className="sticky top-0 bg-white z-10 border-b">
                                      <TableRow>
                                        <TableHead className="w-[300px] font-semibold">Médicament (Lot)</TableHead>
                                        <TableHead className="w-[100px] font-semibold">Quantité</TableHead>
                                        <TableHead className="w-[120px] font-semibold">Prix Unitaire (FCFA)</TableHead>
                                        <TableHead className="w-[120px] font-semibold">Total</TableHead>
                                        <TableHead className="w-[60px]"></TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {commandeForm.lignesCommande.map((ligne) => {
                                        const lot = getLotInfo(ligne.ligneApprovisionnementId)
                                        const stockDisponible = lot?.quantiteDisponible || 0
                                        const stockInsuffisant = stockDisponible < ligne.quantite
                                        const expiringSoon = lot ? isLotExpiringSoon(lot.dateExpiration) : false

                                        return (
                                          <TableRow key={ligne.id} className="hover:bg-gray-50">
                                            <TableCell className="p-2">
                                              <Select
                                                value={ligne.ligneApprovisionnementId.toString()}
                                                onValueChange={(value) =>
                                                  updateLigneCommande(
                                                    ligne.id,
                                                    "ligneApprovisionnementId",
                                                    Number.parseInt(value),
                                                  )
                                                }
                                              >
                                                <SelectTrigger className="w-full h-9">
                                                  <SelectValue placeholder="Sélectionner un lot" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {availableLots.length === 0 ? (
                                                    <SelectItem value="no-lots" disabled>
                                                      Aucun lot disponible
                                                    </SelectItem>
                                                  ) : (
                                                    availableLots
                                                      .filter((lot) => (lot.quantiteDisponible || 0) > 0)
                                                      .map((lot) => (
                                                        <SelectItem key={lot.id} value={lot.id!.toString()}>
                                                          <div className="flex flex-col w-full">
                                                            <div className="flex items-center justify-between gap-2">
                                                              <span className="font-medium truncate flex-1">
                                                                {lot.medicamentReference?.medicament?.nom ||
                                                                  "Médicament inconnu"}{" "}
                                                                -{" "}
                                                                {lot.medicamentReference?.reference?.nom ||
                                                                  "Référence inconnue"}
                                                              </span>
                                                              {isLotExpiringSoon(lot.dateExpiration) && (
                                                                <Badge
                                                                  variant="secondary"
                                                                  className="text-xs flex-shrink-0"
                                                                >
                                                                  <Clock className="h-3 w-3 mr-1" />
                                                                  Expire bientôt
                                                                </Badge>
                                                              )}
                                                            </div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                                              <span>Lot: {lot.numeroLot}</span>
                                                              <span>Stock: {lot.quantiteDisponible}</span>
                                                            </div>
                                                          </div>
                                                        </SelectItem>
                                                      ))
                                                  )}
                                                </SelectContent>
                                              </Select>
                                              {lot && (
                                                <div className="mt-1 flex gap-2">
                                                  <Badge
                                                    variant={
                                                      stockDisponible > 10
                                                        ? "default"
                                                        : stockDisponible > 0
                                                          ? "secondary"
                                                          : "destructive"
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
                                            </TableCell>
                                            <TableCell className="p-2">
                                              <Input
                                                type="number"
                                                min="1"
                                                max={stockDisponible}
                                                value={ligne.quantite}
                                                onChange={(e) =>
                                                  updateLigneCommande(
                                                    ligne.id,
                                                    "quantite",
                                                    Number.parseInt(e.target.value) || 1,
                                                  )
                                                }
                                                className={stockInsuffisant ? "border-red-500" : ""}
                                              />
                                              {stockInsuffisant && (
                                                <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                                                  <AlertTriangle className="h-3 w-3" />
                                                  Stock insuffisant
                                                </div>
                                              )}
                                            </TableCell>
                                            <TableCell className="p-2">
                                              <Input
                                                type="number"
                                                value={(ligne.prixUnitaire / 100).toFixed(2)}
                                                disabled
                                                className="bg-gray-50 h-9"
                                              />
                                              <div className="text-xs text-gray-500 mt-1">
                                                {formatPrice(ligne.prixUnitaire)}
                                              </div>
                                            </TableCell>
                                            <TableCell className="p-2">
                                              <Badge
                                                variant="outline"
                                                className="bg-green-50 text-green-700 font-medium"
                                              >
                                                {formatPrice(ligne.quantite * ligne.prixUnitaire)}
                                              </Badge>
                                            </TableCell>
                                            <TableCell className="p-2">
                                              <Button
                                                type="button"
                                                onClick={() => removeLigneCommande(ligne.id)}
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                                              >
                                                <Minus className="h-4 w-4" />
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        )
                                      })}
                                    </TableBody>
                                  </Table>
                                </div>
                              </ScrollArea>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Onglet Résumé */}
                    <TabsContent value="resume" className="h-full m-0 p-6">
                      <Card className="border-purple-200 h-full">
                        <CardHeader>
                          <CardTitle className="text-lg text-purple-800">Résumé de la Commande</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-medium text-gray-900 mb-3">Informations Générales</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Date de Commande:</span>
                                  <span className="font-medium">{formatDate(commandeForm.dateCommande)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Patient:</span>
                                  <span className="font-medium">
                                    {getPatientInfo(commandeForm.personneId || 0)?.prenom}{" "}
                                    {getPatientInfo(commandeForm.personneId || 0)?.nom || "Non sélectionné"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Nombre de lignes:</span>
                                  <span className="font-medium">{commandeForm.lignesCommande.length}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 mb-3">Totaux</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Quantité totale:</span>
                                  <span className="font-medium">
                                    {commandeForm.lignesCommande.reduce((sum, ligne) => sum + ligne.quantite, 0)} unités
                                  </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                  <span className="text-purple-800">Montant Total:</span>
                                  <span className="text-purple-900">{commandeForm.montantTotal}FCFA</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {commandeForm.lignesCommande.length > 0 && (
                            <div>
                              <h3 className="font-medium text-gray-900 mb-3">Détail des Lignes</h3>
                              <ScrollArea className="h-48 border rounded-lg">
                                <div className="p-3 space-y-2">
                                  {commandeForm.lignesCommande.map((ligne, index) => {
                                    const lot = getLotInfo(ligne.ligneApprovisionnementId)
                                    return (
                                      <div
                                        key={ligne.id}
                                        className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded"
                                      >
                                        <span>
                                          {lot?.medicamentReference?.medicament?.nom || "Produit inconnu"} (Lot:{" "}
                                          {lot?.numeroLot || "N/A"})
                                        </span>
                                        <span className="font-medium">
                                          {ligne.quantite} × {formatPrice(ligne.prixUnitaire)} ={" "}
                                          {formatPrice(ligne.quantite * ligne.prixUnitaire)}
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </ScrollArea>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              <DialogFooter className="p-6 pt-0">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} disabled={isSubmitting}>
                  Annuler
                </Button>
                <Button
                  onClick={handleCreateCommande}
                  disabled={isSubmitting || commandeForm.lignesCommande.length === 0 || !commandeForm.personneId}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création...
                    </>
                  ) : (
                    "Créer la Commande"
                  )}
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
              <div className="text-2xl font-bold text-green-900">{stats.montantTotal.toFixed(2)}FCFA</div>
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
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher une commande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Liste des Commandes */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <ShoppingCart className="h-5 w-5 text-teal-600" />
              Liste des Commandes
            </CardTitle>
            <CardDescription className="text-teal-600">
              {loading ? "Chargement..." : `${filteredCommandes.length} commande(s) trouvée(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                      <TableHead className="font-semibold text-gray-700 py-4">ID</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Date</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Patient</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Montant Total</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700 py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCommandes.map((commande, index) => {
                      const patient = getPatientInfo(commande.personne?.id || 0)
                      return (
                        <TableRow
                          key={commande.id}
                          className={`
                            hover:bg-teal-50/50 transition-all duration-200 border-b border-gray-100
                            ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                          `}
                        >
                          <TableCell className="font-medium text-gray-900 py-4">
                            CMD-{commande.id?.toString().padStart(3, "0")}
                          </TableCell>
                          <TableCell className="py-4">{formatDate(commande.dateCommande)}</TableCell>
                          <TableCell className="py-4">
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
                          <TableCell className="font-semibold text-green-700">{commande.montantTotal}FCFA</TableCell>
                          <TableCell className="text-right py-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewCommande(commande)}
                                className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-700 transition-all duration-200"
                                title="Voir les détails"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => loadCommandeForEdit(commande)}
                                className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                                title="Modifier la commande"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteCommande(commande)}
                                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                                title="Supprimer la commande"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialogue de modification */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[1400px] max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-600" />
                Modifier la Commande
              </DialogTitle>
              <DialogDescription>Modifiez les informations de la commande et ses lignes.</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="px-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Informations
                    </TabsTrigger>
                    <TabsTrigger value="lignes" className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Lignes ({commandeForm.lignesCommande.length})
                    </TabsTrigger>
                    <TabsTrigger value="resume" className="flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Résumé
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                  {/* Onglet Informations */}
                  <TabsContent value="info" className="h-full m-0 p-6">
                    <Card className="border-teal-200 h-full">
                      <CardHeader>
                        <CardTitle className="text-lg text-teal-800">Informations Générales</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-2">
                          <Label htmlFor="editDateCommande">Date de Commande</Label>
                          <Input
                            type="date"
                            id="editDateCommande"
                            value={commandeForm.dateCommande}
                            onChange={(e) => setCommandeForm((prev) => ({ ...prev, dateCommande: e.target.value }))}
                            className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="editPersonneId">Patient *</Label>
                          <Select
                            value={commandeForm.personneId?.toString() || ""}
                            onValueChange={(value) => {
                              console.log("Patient sélectionné dans le formulaire (édition):", value) // Log de débogage
                              setCommandeForm((prev) => ({ ...prev, personneId: Number.parseInt(value) }))
                            }}
                          >
                            <SelectTrigger className="border-teal-200 focus:border-teal-500 focus:ring-teal-500">
                              <SelectValue placeholder="Sélectionner un patient" />
                            </SelectTrigger>
                            <SelectContent>
                              {personnes
                                .filter((p) => p.id != null && typeof p.id === "number")
                                .map((personne) => (
                                  <SelectItem key={personne.id} value={personne.id!.toString()}>
                                    {personne.prenom} {personne.nom}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="editMontantTotal">Montant Total (calculé automatiquement)</Label>
                          <Input
                            id="editMontantTotal"
                            value={`${commandeForm.montantTotal} FCFA`}
                            disabled
                            className="bg-gray-50 text-gray-600"
                          />
                          <p className="text-xs text-gray-500">
                            Le montant est calculé à partir des lignes de commande.
                          </p>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            onClick={() => setActiveTab("lignes")}
                            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                          >
                            Suivant: Modifier les lignes
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Onglet Lignes de Commande pour l'édition */}
                  <TabsContent value="lignes" className="h-full m-0 p-6">
                    <Card className="border-cyan-200 h-full flex flex-col">
                      <CardHeader className="flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-cyan-800">Lignes de Commande</CardTitle>
                          <Button
                            type="button"
                            onClick={addLigneCommande}
                            size="sm"
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter Ligne
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-hidden p-0">
                        {commandeForm.lignesCommande.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <Package2 className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">Aucune ligne ajoutée</p>
                            <p className="text-sm mb-4">Cliquez sur "Ajouter Ligne" pour commencer</p>
                            <Button
                              onClick={addLigneCommande}
                              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Première Ligne
                            </Button>
                          </div>
                        ) : (
                          <div className="h-[400px] border rounded-lg m-4">
                            <ScrollArea className="h-full w-full">
                              <div className="min-w-[1200px]">
                                <Table>
                                  <TableHeader className="sticky top-0 bg-white z-10 border-b">
                                    <TableRow>
                                      <TableHead className="w-[300px] font-semibold">Médicament (Lot)</TableHead>
                                      <TableHead className="w-[100px] font-semibold">Quantité</TableHead>
                                      <TableHead className="w-[120px] font-semibold">Prix Unitaire (FCFA)</TableHead>
                                      <TableHead className="w-[120px] font-semibold">Total</TableHead>
                                      <TableHead className="w-[60px]"></TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {commandeForm.lignesCommande.map((ligne) => {
                                      const lot = getLotInfo(ligne.ligneApprovisionnementId)
                                      const stockDisponible = lot?.quantiteDisponible || 0
                                      const stockInsuffisant = stockDisponible < ligne.quantite
                                      const expiringSoon = lot ? isLotExpiringSoon(lot.dateExpiration) : false

                                      return (
                                        <TableRow key={ligne.id} className="hover:bg-gray-50">
                                          <TableCell className="p-2">
                                            <Select
                                              value={ligne.ligneApprovisionnementId.toString()}
                                              onValueChange={(value) =>
                                                updateLigneCommande(
                                                  ligne.id,
                                                  "ligneApprovisionnementId",
                                                  Number.parseInt(value),
                                                )
                                              }
                                            >
                                              <SelectTrigger className="w-full h-9">
                                                <SelectValue placeholder="Sélectionner un lot" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {availableLots.length === 0 ? (
                                                  <SelectItem value="no-lots" disabled>
                                                    Aucun lot disponible
                                                  </SelectItem>
                                                ) : (
                                                  availableLots
                                                    .filter((lot) => (lot.quantiteDisponible || 0) > 0)
                                                    .map((lot) => (
                                                      <SelectItem key={lot.id} value={lot.id!.toString()}>
                                                        <div className="flex flex-col w-full">
                                                          <div className="flex items-center justify-between gap-2">
                                                            <span className="font-medium truncate flex-1">
                                                              {lot.medicamentReference?.medicament?.nom ||
                                                                "Médicament inconnu"}{" "}
                                                              -{" "}
                                                              {lot.medicamentReference?.reference?.nom ||
                                                                "Référence inconnue"}
                                                            </span>
                                                            {isLotExpiringSoon(lot.dateExpiration) && (
                                                              <Badge
                                                                variant="secondary"
                                                                className="text-xs flex-shrink-0"
                                                              >
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                Expire bientôt
                                                              </Badge>
                                                            )}
                                                          </div>
                                                          <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                                            <span>Lot: {lot.numeroLot}</span>
                                                            <span>Stock: {lot.quantiteDisponible}</span>
                                                          </div>
                                                        </div>
                                                      </SelectItem>
                                                    ))
                                                )}
                                              </SelectContent>
                                            </Select>
                                            {lot && (
                                              <div className="mt-1 flex gap-2">
                                                <Badge
                                                  variant={
                                                    stockDisponible > 10
                                                      ? "default"
                                                      : stockDisponible > 0
                                                        ? "secondary"
                                                        : "destructive"
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
                                          </TableCell>
                                          <TableCell className="p-2">
                                            <Input
                                              type="number"
                                              min="1"
                                              max={stockDisponible}
                                              value={ligne.quantite}
                                              onChange={(e) =>
                                                updateLigneCommande(
                                                  ligne.id,
                                                  "quantite",
                                                  Number.parseInt(e.target.value) || 1,
                                                )
                                              }
                                              className={stockInsuffisant ? "border-red-500" : ""}
                                            />
                                            {stockInsuffisant && (
                                              <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                                                <AlertTriangle className="h-3 w-3" />
                                                Stock insuffisant
                                              </div>
                                            )}
                                          </TableCell>
                                          <TableCell className="p-2">
                                            <Input
                                              type="number"
                                              value={(ligne.prixUnitaire / 100).toFixed(2)}
                                              disabled
                                              className="bg-gray-50 h-9"
                                            />
                                            <div className="text-xs text-gray-500 mt-1">
                                              {formatPrice(ligne.prixUnitaire)}
                                            </div>
                                          </TableCell>
                                          <TableCell className="p-2">
                                            <Badge variant="outline" className="bg-green-50 text-green-700 font-medium">
                                              {formatPrice(ligne.quantite * ligne.prixUnitaire)}
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="p-2">
                                            <Button
                                              type="button"
                                              onClick={() => removeLigneCommande(ligne.id)}
                                              size="sm"
                                              variant="ghost"
                                              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                                            >
                                              <Minus className="h-4 w-4" />
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      )
                                    })}
                                  </TableBody>
                                </Table>
                              </div>
                            </ScrollArea>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Onglet Résumé */}
                  <TabsContent value="resume" className="h-full m-0 p-6">
                    <Card className="border-purple-200 h-full">
                      <CardHeader>
                        <CardTitle className="text-lg text-purple-800">Résumé de la Commande</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-medium text-gray-900 mb-3">Informations Générales</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Date de Commande:</span>
                                <span className="font-medium">{formatDate(commandeForm.dateCommande)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Patient:</span>
                                <span className="font-medium">
                                  {getPatientInfo(commandeForm.personneId || 0)?.prenom}{" "}
                                  {getPatientInfo(commandeForm.personneId || 0)?.nom || "Non sélectionné"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Nombre de lignes:</span>
                                <span className="font-medium">{commandeForm.lignesCommande.length}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 mb-3">Totaux</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Quantité totale:</span>
                                <span className="font-medium">
                                  {commandeForm.lignesCommande.reduce((sum, ligne) => sum + ligne.quantite, 0)} unités
                                </span>
                              </div>
                              <div className="flex justify-between text-lg font-bold">
                                <span className="text-purple-800">Montant Total:</span>
                                <span className="text-purple-900">{commandeForm.montantTotal}FCFA</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {commandeForm.lignesCommande.length > 0 && (
                          <div>
                            <h3 className="font-medium text-gray-900 mb-3">Détail des Lignes</h3>
                            <ScrollArea className="h-48 border rounded-lg">
                              <div className="p-3 space-y-2">
                                {commandeForm.lignesCommande.map((ligne, index) => {
                                  const lot = getLotInfo(ligne.ligneApprovisionnementId)
                                  return (
                                    <div
                                      key={ligne.id}
                                      className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded"
                                    >
                                      <span>
                                        {lot?.medicamentReference?.medicament?.nom || "Produit inconnu"} (Lot:{" "}
                                        {lot?.numeroLot || "N/A"})
                                      </span>
                                      <span className="font-medium">
                                        {ligne.quantite} × {formatPrice(ligne.prixUnitaire)} ={" "}
                                        {formatPrice(ligne.quantite * ligne.prixUnitaire)}
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                            </ScrollArea>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            <DialogFooter className="p-6 pt-0">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button
                onClick={handleEditCommande}
                disabled={isSubmitting || commandeForm.lignesCommande.length === 0 || !commandeForm.personneId}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Modification...
                  </>
                ) : (
                  "Modifier la Commande"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialogue de visualisation */}
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
                      const patient = getPatientInfo(selectedCommande.personne?.id || 0)
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
                    <p className="text-lg font-semibold text-green-600">{selectedCommande.montantTotal}FCFA</p>
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
