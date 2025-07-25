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
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Truck,
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Calendar,
  ChevronRight,
  ChevronDown,
  X,
  AlertTriangle,
  ShoppingCart,
  Calculator,
  FileText,
} from "lucide-react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { useApprovisionnements } from "@/hooks/pharmacie/useApprovisionnements"
import { useLignesApprovisionnement } from "@/hooks/pharmacie/useLignesApprovisionnement"
import { useMedicamentReferences } from "@/hooks/pharmacie/useMedicamentReferences"
import type { Approvisionnement } from "@/types/pharmacie"

// Interface pour une ligne du formulaire
interface FormLigne {
  id: string // ID temporaire pour le formulaire
  ligneId?: number // ID réel de la ligne (pour modification)
  medicamentReferenceId: number | null
  quantite: number
  prixUnitaireAchat: number
  prixUnitaireVente: number
  dateReception: string
  dateExpiration: string
  numeroLot: string
}

export default function ApprovisionnementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFournisseur, setSelectedFournisseur] = useState("all")
  const [selectedApprovisionnement, setSelectedApprovisionnement] = useState<Approvisionnement | null>(null)
  const [isApproDialogOpen, setIsApproDialogOpen] = useState(false)
  const [editingAppro, setEditingAppro] = useState<Approvisionnement | null>(null)
  const [deleteApproId, setDeleteApproId] = useState<number | null>(null)

  // État pour le formulaire d'approvisionnement complet
  const [fournisseur, setFournisseur] = useState("")
  const [formLignes, setFormLignes] = useState<FormLigne[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("info") // "info" ou "lignes"

  // Hooks pour les données
  const {
    approvisionnements,
    loading: approLoading,
    error: approError,
    createApprovisionnement,
    updateApprovisionnement,
    deleteApprovisionnement,
  } = useApprovisionnements()

  const {
    lignes,
    loading: lignesLoading,
    error: lignesError,
    refetch: refetchLignes, // Ajouter la fonction refetch
  } = useLignesApprovisionnement(selectedApprovisionnement?.id)

  const { medicamentReferences } = useMedicamentReferences()

  // Filtrage des approvisionnements
  const filteredAppros = approvisionnements.filter((appro) => {
    const matchesSearch =
      appro.fournisseur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appro.id && appro.id.toString().includes(searchTerm))
    const matchesFournisseur = selectedFournisseur === "all" || appro.fournisseur === selectedFournisseur
    return matchesSearch && matchesFournisseur
  })

  // Liste unique des fournisseurs
  const fournisseurs = Array.from(new Set(approvisionnements.map((a) => a.fournisseur)))

  // Calculs pour les statistiques
  const totalMontant = lignes.reduce((sum, ligne) => sum + ligne.quantite * ligne.prixUnitaireVente, 0)

  // Générer un ID temporaire unique
  const generateTempId = () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Ajouter une nouvelle ligne au formulaire
  const addFormLigne = () => {
    const newLigne: FormLigne = {
      id: generateTempId(),
      medicamentReferenceId: null,
      quantite: 1,
      prixUnitaireAchat: 0,
      prixUnitaireVente: 0,
      dateReception: new Date().toISOString().split("T")[0],
      dateExpiration: "",
      numeroLot: "",
    }
    setFormLignes([...formLignes, newLigne])
  }

  // Supprimer une ligne du formulaire
  const removeFormLigne = (id: string) => {
    setFormLignes(formLignes.filter((ligne) => ligne.id !== id))
  }

  // Mettre à jour une ligne du formulaire avec validation
  const updateFormLigne = (id: string, field: keyof FormLigne, value: any) => {
    // Validation pour les champs numériques
    if (field === "quantite" || field === "prixUnitaireAchat" || field === "prixUnitaireVente") {
      const numValue = Number(value)

      // Empêcher les valeurs négatives
      if (numValue < 0) {
        return // Ne pas mettre à jour si la valeur est négative
      }

      // Pour la quantité, s'assurer qu'elle est au moins 1
      if (field === "quantite" && numValue === 0) {
        value = 1
      }

      // Pour les prix, permettre 0 mais pas de valeurs négatives
      if ((field === "prixUnitaireAchat" || field === "prixUnitaireVente") && numValue < 0) {
        return
      }
    }

    setFormLignes(formLignes.map((ligne) => (ligne.id === id ? { ...ligne, [field]: value } : ligne)))
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFournisseur("")
    setFormLignes([])
    setEditingAppro(null)
    setActiveTab("info")
  }

  // Charger les données d'un approvisionnement pour modification
  const loadApprovisionnementForEdit = async (appro: Approvisionnement) => {
    setEditingAppro(appro)
    setFournisseur(appro.fournisseur)

    // Charger les lignes existantes
    if (appro.id) {
      try {
        // Les lignes sont déjà chargées via le hook useLignesApprovisionnement
        // On les convertit au format du formulaire
        const existingLignes = lignes.map((ligne) => ({
          id: generateTempId(),
          ligneId: ligne.id, // ID réel de la ligne
          medicamentReferenceId: ligne.medicamentReference?.id || null,
          quantite: ligne.quantite,
          prixUnitaireAchat: ligne.prixUnitaireAchat, // No conversion
          prixUnitaireVente: ligne.prixUnitaireVente, // No conversion
          dateReception: ligne.dateReception,
          dateExpiration: ligne.dateExpiration,
          numeroLot: ligne.numeroLot,
        }))
        setFormLignes(existingLignes)
      } catch (error) {
        console.error("Erreur lors du chargement des lignes:", error)
      }
    }
  }

  // Ouvrir le dialog pour un nouvel approvisionnement
  const handleAddApprovisionnement = () => {
    resetForm()
    setIsApproDialogOpen(true)
  }

  // Ouvrir le dialog pour modifier un approvisionnement
  const handleEditApprovisionnement = async (appro: Approvisionnement) => {
    // D'abord sélectionner l'approvisionnement pour charger ses lignes
    setSelectedApprovisionnement(appro)

    // Attendre un peu que les lignes se chargent
    setTimeout(() => {
      loadApprovisionnementForEdit(appro)
      setIsApproDialogOpen(true)
    }, 100)
  }

  // Sauvegarder l'approvisionnement complet
  const handleSaveApprovisionnement = async () => {
    if (!fournisseur.trim()) {
      alert("Veuillez saisir un fournisseur")
      return
    }

    if (formLignes.length === 0) {
      alert("Veuillez ajouter au moins une ligne d'approvisionnement")
      return
    }

    // Validation des lignes
    for (const [index, ligne] of formLignes.entries()) {
      if (!ligne.medicamentReferenceId) {
        alert(`Ligne ${index + 1}: Veuillez sélectionner un médicament`)
        return
      }
      if (ligne.quantite <= 0) {
        alert(`Ligne ${index + 1}: La quantité doit être supérieure à 0`)
        return
      }
      if (ligne.prixUnitaireAchat < 0 || ligne.prixUnitaireVente < 0) {
        alert(`Ligne ${index + 1}: Les prix ne peuvent pas être négatifs`)
        return
      }
      if (ligne.prixUnitaireAchat === 0 && ligne.prixUnitaireVente === 0) {
        alert(`Ligne ${index + 1}: Au moins un prix doit être supérieur à 0`)
        return
      }
      if (!ligne.dateReception || !ligne.dateExpiration) {
        alert(`Ligne ${index + 1}: Veuillez renseigner toutes les dates`)
        return
      }
      // Vérifier que la date d'expiration est après la date de réception
      if (new Date(ligne.dateExpiration) <= new Date(ligne.dateReception)) {
        alert(`Ligne ${index + 1}: La date d'expiration doit être après la date de réception`)
        return
      }
    }

    setIsSubmitting(true)

    try {
      // Préparer les données pour l'API
      const approvisionnementData = {
        fournisseur: fournisseur.trim(),
        dateAppro: new Date().toISOString(),
        employeId: 1, // À remplacer par l'ID de l'employé connecté
        lignesApprovisionnement: formLignes.map((ligne) => ({
          quantite: ligne.quantite,
          prixUnitaireAchat: Math.round(ligne.prixUnitaireAchat), // No conversion, send as is
          prixUnitaireVente: Math.round(ligne.prixUnitaireVente), // No conversion, send as is
          dateReception: ligne.dateReception,
          dateExpiration: ligne.dateExpiration,
          numeroLot: ligne.numeroLot || undefined, // Auto-généré si vide
          medicamentReferenceId: ligne.medicamentReferenceId,
        })),
      }

      console.log("Données à envoyer:", approvisionnementData) // Pour debug

      if (editingAppro?.id) {
        await updateApprovisionnement(editingAppro.id, approvisionnementData)

        // Recharger les lignes si on modifie l'approvisionnement actuellement sélectionné
        if (selectedApprovisionnement?.id === editingAppro.id) {
          setTimeout(() => {
            refetchLignes()
          }, 500)
        }
      } else {
        const result = await createApprovisionnement(approvisionnementData)
        console.log("Approvisionnement créé:", result) // Pour debug
      }

      setIsApproDialogOpen(false)
      resetForm()

      // Afficher un message de succès
      alert("Approvisionnement sauvegardé avec succès!")
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      alert(`Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : "Erreur inconnue"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Confirmer la suppression
  const handleDeleteApprovisionnement = async () => {
    if (!deleteApproId) return

    try {
      await deleteApprovisionnement(deleteApproId)
      setDeleteApproId(null)

      // Si l'approvisionnement supprimé était sélectionné, le désélectionner
      if (selectedApprovisionnement?.id === deleteApproId) {
        setSelectedApprovisionnement(null)
      }

      alert("Approvisionnement supprimé avec succès!")
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert(`Erreur lors de la suppression: ${error instanceof Error ? error.message : "Erreur inconnue"}`)
    }
  }

  const handleSelectApprovisionnement = (appro: Approvisionnement) => {
    setSelectedApprovisionnement(appro)
  }

  // Calcul du total du formulaire
  const totalFormulaire = formLignes.reduce((sum, ligne) => sum + ligne.quantite * ligne.prixUnitaireVente, 0)

  if (approLoading) {
    return (
      <PharmacienSidebar>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des approvisionnements...</p>
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
              <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              Gestion des Approvisionnements
            </h1>
            <p className="text-gray-600 mt-2">Gérez les livraisons et leurs lignes d'approvisionnement</p>
          </div>
          <Button
            onClick={handleAddApprovisionnement}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Approvisionnement
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Total Approvisionnements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">{approvisionnements.length}</div>
              <p className="text-xs text-teal-600 mt-1">Ce mois</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Lignes Sélectionnées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{lignes.length}</div>
              <p className="text-xs text-green-600 mt-1">Produits</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Quantité Totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {lignes.reduce((sum, ligne) => sum + ligne.quantite, 0)}
              </div>
              <p className="text-xs text-blue-600 mt-1">Unités</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Valeur Totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{totalMontant.toFixed(2)} FCFA</div>
              <p className="text-xs text-purple-600 mt-1">Montant</p>
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
                  placeholder="Rechercher un approvisionnement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <Select value={selectedFournisseur} onValueChange={setSelectedFournisseur}>
                <SelectTrigger className="w-48 border-teal-200 focus:border-teal-500 focus:ring-teal-500">
                  <SelectValue placeholder="Fournisseur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les fournisseurs</SelectItem>
                  {fournisseurs.map((fournisseur) => (
                    <SelectItem key={fournisseur} value={fournisseur}>
                      {fournisseur}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Approvisionnements List */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
              <CardTitle className="flex items-center gap-2 text-teal-800">
                <Package className="h-5 w-5 text-teal-600" />
                Liste des Approvisionnements
              </CardTitle>
              <CardDescription className="text-teal-600">
                {filteredAppros.length} approvisionnement(s) trouvé(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-2 p-4">
                  {approError ? (
                    <div className="p-8 text-center text-red-600">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                      <p>Erreur: {approError}</p>
                    </div>
                  ) : filteredAppros.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Aucun approvisionnement trouvé</p>
                    </div>
                  ) : (
                    filteredAppros.map((appro) => (
                      <div
                        key={appro.id}
                        className={`
                          p-4 rounded-lg border cursor-pointer transition-all duration-200
                          ${
                            selectedApprovisionnement?.id === appro.id
                              ? "border-teal-500 bg-teal-50 shadow-md"
                              : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                          }
                        `}
                        onClick={() => handleSelectApprovisionnement(appro)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-teal-600" />
                              <span className="font-medium text-gray-900">#{appro.id}</span>
                              <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
                                {appro.fournisseur}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(appro.dateAppro).toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditApprovisionnement(appro)
                              }}
                              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (appro.id) {
                                  setDeleteApproId(appro.id)
                                }
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            {selectedApprovisionnement?.id === appro.id ? (
                              <ChevronDown className="h-4 w-4 text-teal-600" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right Panel - Lignes d'Approvisionnement */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-cyan-800">
                    <Package className="h-5 w-5 text-cyan-600" />
                    Lignes d'Approvisionnement
                  </CardTitle>
                  <CardDescription className="text-cyan-600">
                    {selectedApprovisionnement
                      ? `Approvisionnement #${selectedApprovisionnement.id} - ${selectedApprovisionnement.fournisseur}`
                      : "Sélectionnez un approvisionnement"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {selectedApprovisionnement ? (
                <ScrollArea className="h-[600px]">
                  {lignesLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600"></div>
                    </div>
                  ) : lignesError ? (
                    <div className="p-8 text-center text-red-600">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                      <p>Erreur: {lignesError}</p>
                    </div>
                  ) : lignes.length > 0 ? (
                    <div className="space-y-3 p-4">
                      {lignes.map((ligne) => (
                        <div
                          key={ligne.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-cyan-300 hover:bg-cyan-50/30 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-100 text-blue-800">Lot: {ligne.numeroLot}</Badge>
                              <Badge variant="outline" className="text-xs">
                                Qté: {ligne.quantite}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Prix Achat:</span>
                              <div className="font-medium text-green-700">
                                {ligne.prixUnitaireAchat.toFixed(2)} FCFA
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">Prix Vente:</span>
                              <div className="font-medium text-blue-700">{ligne.prixUnitaireVente.toFixed(2)} FCFA</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Réception:</span>
                              <div className="font-medium">
                                {new Date(ligne.dateReception).toLocaleDateString("fr-FR")}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">Expiration:</span>
                              <div className="font-medium">
                                {new Date(ligne.dateExpiration).toLocaleDateString("fr-FR")}
                              </div>
                            </div>
                          </div>

                          <Separator className="my-3" />

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total ligne:</span>
                            <span className="font-bold text-purple-700">
                              {(ligne.quantite * ligne.prixUnitaireVente).toFixed(2)} FCFA
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                      <Package className="h-8 w-8 mb-2 opacity-50" />
                      <p>Aucune ligne d'approvisionnement</p>
                    </div>
                  )}
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-[600px] text-gray-500">
                  <Truck className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">Sélectionnez un approvisionnement</p>
                  <p className="text-sm">Choisissez un approvisionnement dans la liste de gauche</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dialog pour Approvisionnement Complet - Version Améliorée */}
        <Dialog open={isApproDialogOpen} onOpenChange={setIsApproDialogOpen}>
          <DialogContent className="sm:max-w-[1400px] max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-teal-600" />
                {editingAppro ? "Modifier l'Approvisionnement" : "Nouvel Approvisionnement"}
              </DialogTitle>
              <DialogDescription>
                {editingAppro
                  ? "Modifiez les informations de l'approvisionnement."
                  : "Créez un nouvel approvisionnement avec ses lignes de produits."}
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
                      Lignes ({formLignes.length})
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
                          <Label htmlFor="fournisseur">Fournisseur *</Label>
                          <Input
                            id="fournisseur"
                            value={fournisseur}
                            onChange={(e) => setFournisseur(e.target.value)}
                            placeholder="Nom du fournisseur"
                            className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Date d'Approvisionnement</Label>
                          <Input
                            value={new Date().toLocaleDateString("fr-FR")}
                            disabled
                            className="bg-gray-50 text-gray-600"
                          />
                          <p className="text-xs text-gray-500">La date est générée automatiquement</p>
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

                  {/* Onglet Lignes - Version Tableau Scrollable */}
                  <TabsContent value="lignes" className="h-full m-0 p-6">
                    <Card className="border-cyan-200 h-full flex flex-col">
                      <CardHeader className="flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-cyan-800">Lignes d'Approvisionnement</CardTitle>
                          <Button
                            type="button"
                            onClick={addFormLigne}
                            size="sm"
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter Ligne
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-hidden p-0">
                        {formLignes.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <Package className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">Aucune ligne ajoutée</p>
                            <p className="text-sm mb-4">Cliquez sur "Ajouter Ligne" pour commencer</p>
                            <Button
                              onClick={addFormLigne}
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
                                      <TableHead className="w-[250px] font-semibold">Médicament</TableHead>
                                      <TableHead className="w-[100px] font-semibold">Quantité</TableHead>
                                      <TableHead className="w-[120px] font-semibold">Prix Achat (FCFA)</TableHead>
                                      <TableHead className="w-[120px] font-semibold">Prix Vente (FCFA)</TableHead>
                                      <TableHead className="w-[140px] font-semibold">Date Réception</TableHead>
                                      <TableHead className="w-[140px] font-semibold">Date Expiration</TableHead>
                                      <TableHead className="w-[140px] font-semibold">N° Lot</TableHead>
                                      <TableHead className="w-[120px] font-semibold">Total</TableHead>
                                      <TableHead className="w-[60px]"></TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {formLignes.map((ligne, index) => (
                                      <TableRow key={ligne.id} className="hover:bg-gray-50">
                                        <TableCell className="p-2">
                                          <Select
                                            value={ligne.medicamentReferenceId?.toString() || ""}
                                            onValueChange={(value) =>
                                              updateFormLigne(ligne.id, "medicamentReferenceId", Number.parseInt(value))
                                            }
                                          >
                                            <SelectTrigger className="w-full h-9">
                                              <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {medicamentReferences.map((ref) => (
                                                <SelectItem key={ref.id} value={ref.id!.toString()}>
                                                  <div className="flex flex-col">
                                                    <span className="font-medium">{ref.medicament?.nom}</span>
                                                    <span className="text-xs text-gray-500">{ref.reference?.nom}</span>
                                                  </div>
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </TableCell>
                                        <TableCell className="p-2">
                                          <Input
                                            type="number"
                                            min="1"
                                            max="9999"
                                            value={ligne.quantite}
                                            onChange={(e) => {
                                              const value = Number.parseInt(e.target.value) || 1
                                              updateFormLigne(ligne.id, "quantite", Math.max(1, value))
                                            }}
                                            onKeyDown={(e) => {
                                              // Empêcher la saisie du signe moins
                                              if (e.key === "-" || e.key === "e" || e.key === "E") {
                                                e.preventDefault()
                                              }
                                            }}
                                            className="w-full h-9 text-center"
                                          />
                                        </TableCell>
                                        <TableCell className="p-2">
                                          <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={ligne.prixUnitaireAchat}
                                            onChange={(e) => {
                                              const value = Number.parseFloat(e.target.value) || 0
                                              updateFormLigne(ligne.id, "prixUnitaireAchat", Math.max(0, value))
                                            }}
                                            onKeyDown={(e) => {
                                              // Empêcher la saisie du signe moins
                                              if (e.key === "-" || e.key === "e" || e.key === "E") {
                                                e.preventDefault()
                                              }
                                            }}
                                            className="w-full h-9"
                                          />
                                        </TableCell>
                                        <TableCell className="p-2">
                                          <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={ligne.prixUnitaireVente}
                                            onChange={(e) => {
                                              const value = Number.parseFloat(e.target.value) || 0
                                              updateFormLigne(ligne.id, "prixUnitaireVente", Math.max(0, value))
                                            }}
                                            onKeyDown={(e) => {
                                              // Empêcher la saisie du signe moins
                                              if (e.key === "-" || e.key === "e" || e.key === "E") {
                                                e.preventDefault()
                                              }
                                            }}
                                            className="w-full h-9"
                                          />
                                        </TableCell>
                                        <TableCell className="p-2">
                                          <Input
                                            type="date"
                                            value={ligne.dateReception}
                                            onChange={(e) => updateFormLigne(ligne.id, "dateReception", e.target.value)}
                                            className="w-full h-9"
                                          />
                                        </TableCell>
                                        <TableCell className="p-2">
                                          <Input
                                            type="date"
                                            value={ligne.dateExpiration}
                                            onChange={(e) =>
                                              updateFormLigne(ligne.id, "dateExpiration", e.target.value)
                                            }
                                            className="w-full h-9"
                                          />
                                        </TableCell>
                                        <TableCell className="p-2">
                                          <Input
                                            value={ligne.numeroLot}
                                            onChange={(e) => updateFormLigne(ligne.id, "numeroLot", e.target.value)}
                                            placeholder="Auto-généré"
                                            className="w-full h-9"
                                          />
                                        </TableCell>
                                        <TableCell className="p-2">
                                          <Badge variant="outline" className="bg-purple-50 text-purple-700 font-medium">
                                            {(ligne.quantite * ligne.prixUnitaireVente).toFixed(2)} FCFA
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="p-2">
                                          <Button
                                            type="button"
                                            onClick={() => removeFormLigne(ligne.id)}
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
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
                        <CardTitle className="text-lg text-purple-800">Résumé de l'Approvisionnement</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-medium text-gray-900 mb-3">Informations Générales</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Fournisseur:</span>
                                <span className="font-medium">{fournisseur || "Non renseigné"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-medium">{new Date().toLocaleDateString("fr-FR")}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Nombre de lignes:</span>
                                <span className="font-medium">{formLignes.length}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 mb-3">Totaux</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Quantité totale:</span>
                                <span className="font-medium">
                                  {formLignes.reduce((sum, ligne) => sum + ligne.quantite, 0)} unités
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Coût d'achat:</span>
                                <span className="font-medium text-green-700">
                                  {formLignes
                                    .reduce((sum, ligne) => sum + ligne.quantite * ligne.prixUnitaireAchat, 0)
                                    .toFixed(2)}{" "}
                                  FCFA
                                </span>
                              </div>
                              <div className="flex justify-between text-lg font-bold">
                                <span className="text-purple-800">Valeur de vente:</span>
                                <span className="text-purple-900">{totalFormulaire.toFixed(2)} FCFA</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {formLignes.length > 0 && (
                          <div>
                            <h3 className="font-medium text-gray-900 mb-3">Détail des Lignes</h3>
                            <ScrollArea className="h-48 border rounded-lg">
                              <div className="p-3 space-y-2">
                                {formLignes.map((ligne, index) => (
                                  <div
                                    key={ligne.id}
                                    className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded"
                                  >
                                    <span>Ligne {index + 1}</span>
                                    <span className="font-medium">
                                      {ligne.quantite} × {ligne.prixUnitaireVente.toFixed(2)} FCFA ={" "}
                                      {(ligne.quantite * ligne.prixUnitaireVente).toFixed(2)} FCFA
                                    </span>
                                  </div>
                                ))}
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsApproDialogOpen(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleSaveApprovisionnement}
                disabled={isSubmitting || formLignes.length === 0 || !fournisseur.trim()}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>{editingAppro ? "Modifier" : "Créer"} Approvisionnement</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmation de suppression */}
        <AlertDialog open={deleteApproId !== null} onOpenChange={() => setDeleteApproId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Confirmer la suppression
              </AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cet approvisionnement ? Cette action est irréversible et supprimera
                également toutes les lignes d'approvisionnement associées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteApprovisionnement}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PharmacienSidebar>
  )
}
