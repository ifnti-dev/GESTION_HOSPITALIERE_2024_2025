"use client"

import { useState } from "react"
import {
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
  Truck,
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
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gray-200 rounded">
                <Truck className="h-8 w-8 text-gray-600" />
              </div>
              Gestion des Approvisionnements
            </h1>
            <p className="text-gray-600 mt-2">Gérez les livraisons et leurs lignes d'approvisionnement</p>
          </div>
          <button
            onClick={handleAddApprovisionnement}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvel Approvisionnement
          </button>
        </div>

        <div className="bg-white p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher un approvisionnement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded"
              />
            </div>
            <select
              value={selectedFournisseur}
              onChange={(e) => setSelectedFournisseur(e.target.value)}
              className="w-48 px-3 py-2 bg-gray-50 rounded"
            >
              <option value="all">Tous les fournisseurs</option>
              {fournisseurs.map((fournisseur) => (
                <option key={fournisseur} value={fournisseur}>
                  {fournisseur}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Approvisionnements List */}
          <div className="bg-white">
            <div className="bg-gray-100 p-4">
              <h3 className="font-medium text-gray-800 flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-600" />
                Liste des Approvisionnements
              </h3>
              <p className="text-gray-600 text-sm">{filteredAppros.length} approvisionnement(s) trouvé(s)</p>
            </div>
            <div className="h-[600px] overflow-y-auto">
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
                        p-4 rounded cursor-pointer transition-all duration-200
                        ${selectedApprovisionnement?.id === appro.id ? "bg-blue-50" : "bg-gray-50 hover:bg-gray-100"}
                      `}
                      onClick={() => handleSelectApprovisionnement(appro)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <span className="font-medium text-gray-900">#{appro.id}</span>
                            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                              {appro.fournisseur}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(appro.dateAppro).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditApprovisionnement(appro)
                            }}
                            className="p-1 hover:bg-blue-100 rounded"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (appro.id) {
                                setDeleteApproId(appro.id)
                              }
                            }}
                            className="p-1 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                          {selectedApprovisionnement?.id === appro.id ? (
                            <ChevronDown className="h-4 w-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Lignes d'Approvisionnement */}
          <div className="bg-white">
            <div className="bg-gray-100 p-4">
              <h3 className="font-medium text-gray-800 flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-600" />
                Lignes d'Approvisionnement
              </h3>
              <p className="text-gray-600 text-sm">
                {selectedApprovisionnement
                  ? `Approvisionnement #${selectedApprovisionnement.id} - ${selectedApprovisionnement.fournisseur}`
                  : "Sélectionnez un approvisionnement"}
              </p>
            </div>
            <div className="h-[600px] overflow-y-auto">
              {selectedApprovisionnement ? (
                <>
                  {lignesLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
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
                          className="p-4 bg-gray-50 rounded hover:bg-gray-100 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                Lot: {ligne.numeroLot}
                              </span>
                              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                                Qté: {ligne.quantite}
                              </span>
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

                          <hr className="my-3" />

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
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[600px] text-gray-500">
                  <Truck className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">Sélectionnez un approvisionnement</p>
                  <p className="text-sm">Choisissez un approvisionnement dans la liste de gauche</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {isApproDialogOpen && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Truck className="h-5 w-5 text-gray-600" />
                  {editingAppro ? "Modifier l'Approvisionnement" : "Nouvel Approvisionnement"}
                </h2>
                <p className="text-gray-600 text-sm">
                  {editingAppro
                    ? "Modifiez les informations de l'approvisionnement."
                    : "Créez un nouvel approvisionnement avec ses lignes de produits."}
                </p>
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="p-6">
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => setActiveTab("info")}
                      className={`px-4 py-2 rounded ${activeTab === "info" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                      Informations
                    </button>
                    <button
                      onClick={() => setActiveTab("lignes")}
                      className={`px-4 py-2 rounded ${activeTab === "lignes" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                      Lignes ({formLignes.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("resume")}
                      className={`px-4 py-2 rounded ${activeTab === "resume" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                      Résumé
                    </button>
                  </div>

                  {activeTab === "info" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur *</label>
                        <input
                          type="text"
                          value={fournisseur}
                          onChange={(e) => setFournisseur(e.target.value)}
                          placeholder="Nom du fournisseur"
                          className="w-full px-3 py-2 bg-gray-50 rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date d'Approvisionnement</label>
                        <input
                          type="text"
                          value={new Date().toLocaleDateString("fr-FR")}
                          disabled
                          className="w-full px-3 py-2 bg-gray-100 text-gray-600 rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">La date est générée automatiquement</p>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setActiveTab("lignes")}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                          Suivant: Ajouter des lignes
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "lignes" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-800">Lignes d'Approvisionnement</h3>
                        <button
                          onClick={addFormLigne}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Ajouter Ligne
                        </button>
                      </div>

                      {formLignes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                          <Package className="h-12 w-12 mb-4 opacity-50" />
                          <p className="text-lg font-medium">Aucune ligne ajoutée</p>
                          <p className="text-sm mb-4">Cliquez sur "Ajouter Ligne" pour commencer</p>
                          <button
                            onClick={addFormLigne}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Première Ligne
                          </button>
                        </div>
                      ) : (
                        <div className="h-96 overflow-auto">
                          <table className="w-full">
                            <thead className="bg-gray-100 sticky top-0">
                              <tr>
                                <th className="p-2 text-left">Médicament</th>
                                <th className="p-2 text-left">Quantité</th>
                                <th className="p-2 text-left">Prix Achat</th>
                                <th className="p-2 text-left">Prix Vente</th>
                                <th className="p-2 text-left">Date Réception</th>
                                <th className="p-2 text-left">Date Expiration</th>
                                <th className="p-2 text-left">N° Lot</th>
                                <th className="p-2 text-left">Total</th>
                                <th className="p-2"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {formLignes.map((ligne, index) => (
                                <tr key={ligne.id} className="hover:bg-gray-50">
                                  <td className="p-2">
                                    <select
                                      value={ligne.medicamentReferenceId?.toString() || ""}
                                      onChange={(e) =>
                                        updateFormLigne(
                                          ligne.id,
                                          "medicamentReferenceId",
                                          Number.parseInt(e.target.value),
                                        )
                                      }
                                      className="w-full px-2 py-1 bg-gray-50 rounded"
                                    >
                                      <option value="">Sélectionner</option>
                                      {medicamentReferences.map((ref) => (
                                        <option key={ref.id} value={ref.id!.toString()}>
                                          {ref.medicament?.nom} - {ref.reference?.nom}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="p-2">
                                    <input
                                      type="number"
                                      min="1"
                                      value={ligne.quantite}
                                      onChange={(e) => {
                                        const value = Number.parseInt(e.target.value) || 1
                                        updateFormLigne(ligne.id, "quantite", Math.max(1, value))
                                      }}
                                      className="w-full px-2 py-1 bg-gray-50 rounded text-center"
                                    />
                                  </td>
                                  <td className="p-2">
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={ligne.prixUnitaireAchat}
                                      onChange={(e) => {
                                        const value = Number.parseFloat(e.target.value) || 0
                                        updateFormLigne(ligne.id, "prixUnitaireAchat", Math.max(0, value))
                                      }}
                                      className="w-full px-2 py-1 bg-gray-50 rounded"
                                    />
                                  </td>
                                  <td className="p-2">
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={ligne.prixUnitaireVente}
                                      onChange={(e) => {
                                        const value = Number.parseFloat(e.target.value) || 0
                                        updateFormLigne(ligne.id, "prixUnitaireVente", Math.max(0, value))
                                      }}
                                      className="w-full px-2 py-1 bg-gray-50 rounded"
                                    />
                                  </td>
                                  <td className="p-2">
                                    <input
                                      type="date"
                                      value={ligne.dateReception}
                                      onChange={(e) => updateFormLigne(ligne.id, "dateReception", e.target.value)}
                                      className="w-full px-2 py-1 bg-gray-50 rounded"
                                    />
                                  </td>
                                  <td className="p-2">
                                    <input
                                      type="date"
                                      value={ligne.dateExpiration}
                                      onChange={(e) => updateFormLigne(ligne.id, "dateExpiration", e.target.value)}
                                      className="w-full px-2 py-1 bg-gray-50 rounded"
                                    />
                                  </td>
                                  <td className="p-2">
                                    <input
                                      type="text"
                                      value={ligne.numeroLot}
                                      onChange={(e) => updateFormLigne(ligne.id, "numeroLot", e.target.value)}
                                      placeholder="Auto-généré"
                                      className="w-full px-2 py-1 bg-gray-50 rounded"
                                    />
                                  </td>
                                  <td className="p-2">
                                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                                      {(ligne.quantite * ligne.prixUnitaireVente).toFixed(2)} FCFA
                                    </span>
                                  </td>
                                  <td className="p-2">
                                    <button
                                      onClick={() => removeFormLigne(ligne.id)}
                                      className="p-1 hover:bg-red-100 rounded"
                                    >
                                      <X className="h-4 w-4 text-red-600" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "resume" && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-800">Résumé de l'Approvisionnement</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Informations Générales</h4>
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
                          <h4 className="font-medium text-gray-900 mb-3">Totaux</h4>
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
                          <h4 className="font-medium text-gray-900 mb-3">Détail des Lignes</h4>
                          <div className="h-48 overflow-auto bg-gray-50 rounded p-3">
                            <div className="space-y-2">
                              {formLignes.map((ligne, index) => (
                                <div
                                  key={ligne.id}
                                  className="flex justify-between items-center text-sm p-2 bg-white rounded"
                                >
                                  <span>Ligne {index + 1}</span>
                                  <span className="font-medium">
                                    {ligne.quantite} × {ligne.prixUnitaireVente.toFixed(2)} FCFA ={" "}
                                    {(ligne.quantite * ligne.prixUnitaireVente).toFixed(2)} FCFA
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t flex justify-end gap-4">
                <button
                  onClick={() => setIsApproDialogOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveApprovisionnement}
                  disabled={isSubmitting || formLignes.length === 0 || !fournisseur.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Sauvegarde...
                    </>
                  ) : (
                    <>{editingAppro ? "Modifier" : "Créer"} Approvisionnement</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteApproId !== null && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer cet approvisionnement ? Cette action est irréversible et supprimera
                également toutes les lignes d'approvisionnement associées.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteApproId(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteApprovisionnement}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PharmacienSidebar>
  )
}
