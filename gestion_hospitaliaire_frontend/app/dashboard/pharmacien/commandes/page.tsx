"use client"

import { useState, useEffect } from "react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Minus,
  AlertTriangle,
  Package2,
  FileText,
  Calculator,
  ChevronRight,
  Printer,
  X,
  ChevronLeft,
} from "lucide-react"
import { useCommandes } from "@/hooks/pharmacie/useCommandes"
import { useLignesCommande, useLotsDisponibles } from "@/hooks/pharmacie/useLignesCommande"
import { usePersonne } from "@/hooks/utilisateur/usePersonne"
import { useNotifications } from "@/hooks/pharmacie/useNotifications"
import type { Commande, LigneApprovisionnement, LigneCommande, StatutCommande } from "@/types/pharmacie"
import type { Personne } from "@/types/utilisateur"
import { formatDate, formatPrice } from "@/utils/formatters"
import { toast } from "sonner"
import { commandeService } from "@/services/pharmacie/commande.service"

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
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null)
  const [commandeToDelete, setCommandeToDelete] = useState<Commande | null>(null)
  const [commandeForm, setCommandeForm] = useState<CommandeForm>({
    dateCommande: new Date().toISOString().split("T")[0],
    montantTotal: "0",
    personneId: undefined,
    lignesCommande: [],
  })
  const [activeTab, setActiveTab] = useState("info") // "info", "lignes", "resume"
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Hooks
  const { commandes, loading, error, createCommande, updateCommande, deleteCommande, refetch } = useCommandes()
  const { lignes: selectedCommandeLignes, refetch: refetchSelectedCommandeLignes } = useLignesCommande(
    selectedCommande?.id,
  )
  const { lots: availableLots, refetch: refetchLots } = useLotsDisponibles()
  const { personnes, fetchAllPersonnes } = usePersonne()
  const { actions: notificationActions } = useNotifications()

  // Calculer le montant total automatiquement (les prix sont déjà en FCFA)
  useEffect(() => {
    const total = commandeForm.lignesCommande.reduce((sum, ligne) => {
      return sum + ligne.quantite * ligne.prixUnitaire
    }, 0)
    console.log("Calcul du montant total en FCFA:", total)
    setCommandeForm((prev) => ({
      ...prev,
      montantTotal: total.toString(), // Pas de conversion, déjà en FCFA
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

  const getStatutBadge = (statut: StatutCommande | undefined) => {
    switch (statut) {
      case "EN_COURS":
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">En cours</span>
      case "VALIDEE":
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Validée</span>
      case "ANNULEE":
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">Annulée</span>
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">En cours</span>
    }
  }

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

      console.log("Tentative de création de commande avec les données:", commandeData)
      const newCommande = await createCommande(commandeData)
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

        // 🔔 Créer une notification pour la nouvelle commande
        const montantFinal = Number.parseFloat(commandeForm.montantTotal || "0")
        const patientNom = `${selectedPersonne.prenom} ${selectedPersonne.nom}`
        await notificationActions.notifyCommandeCreated(newCommande.id, montantFinal, patientNom)

        toast.success("Commande créée avec succès et notification envoyée")
      }

      setIsCreateModalOpen(false)
      resetForm()
      refetch()
      refetchLots()
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
        montantTotal: commandeForm.montantTotal,
        personne: { id: selectedPersonne.id } as Personne,
      }

      console.log("Tentative de mise à jour de commande avec les données:", commandeData)
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
          selectedCommande.id,
          lineData.medicamentReferenceId,
          lineData.quantite,
        )
      }

      // Après la mise à jour des lignes, demander au backend de recalculer le montant total
      console.log("Recalcul du montant total pour la commande ID:", selectedCommande.id)
      await commandeService.recalculerMontantTotal(selectedCommande.id)

      // Si le modal de visualisation est ouvert pour cette commande, rafraîchir ses lignes
      if (isViewModalOpen && selectedCommande.id === selectedCommande.id) {
        refetchSelectedCommandeLignes()
      }

      toast.success("Commande modifiée avec succès")
      setIsEditModalOpen(false)
      resetForm()
      refetch()
      refetchLots()
      fetchAllPersonnes()
    } catch (error) {
      console.error("Erreur lors de la modification:", error)
      toast.error("Erreur lors de la modification de la commande")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCommande = async () => {
    if (!commandeToDelete?.id) return

    setIsDeleting(true)
    try {
      console.log("Tentative de suppression de la commande:", commandeToDelete.id)
      await deleteCommande(commandeToDelete.id)
      toast.success("Commande supprimée avec succès")
      setIsDeleteModalOpen(false)
      setCommandeToDelete(null)
      refetch()
      refetchLots()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toast.error("Erreur lors de la suppression de la commande")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelCommande = async () => {
    if (!selectedCommande?.id) return

    setIsCancelling(true)
    try {
      console.log("Tentative d'annulation de la commande:", selectedCommande.id)
      const commandeAnnulee = await commandeService.cancel(selectedCommande.id)

      // 🔔 Créer une notification pour la commande annulée
      const patientNom = getPatientInfo(selectedCommande.personne?.id || 0)
      if (patientNom) {
        await notificationActions.notifyCommandeAnnulee(selectedCommande.id, `${patientNom.prenom} ${patientNom.nom}`)
      }

      toast.success("Commande annulée avec succès. Les produits ont été remis en stock et notification envoyée.")
      setIsCancelModalOpen(false)
      setSelectedCommande(null)
      refetch()
      refetchLots()
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error)
      toast.error("Erreur lors de l'annulation de la commande")
    } finally {
      setIsCancelling(false)
    }
  }

  const handlePrintCommande = async (commande: Commande) => {
    if (!commande.id) return

    setIsPrinting(true)
    try {
      // Récupérer les lignes de la commande avec les détails complets
      const { ligneCommandeService } = await import("@/services/pharmacie/ligne-commande.service")
      const lignes = await ligneCommandeService.getByCommandeId(commande.id)

      // Récupérer les informations du patient
      const patient = getPatientInfo(commande.personne?.id || 0)

      // Créer le contenu HTML pour l'impression
      const printContent = generatePrintContent(commande, lignes, patient)

      // Créer une nouvelle fenêtre pour l'impression
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(printContent)
        printWindow.document.close()

        // Attendre que le contenu soit chargé puis imprimer
        printWindow.onload = () => {
          printWindow.print()
          printWindow.close()
        }

        toast.success("Document d'impression généré")
      } else {
        toast.error("Impossible d'ouvrir la fenêtre d'impression")
      }
    } catch (error) {
      console.error("Erreur lors de l'impression:", error)
      toast.error("Erreur lors de la génération du document d'impression")
    } finally {
      setIsPrinting(false)
    }
  }

  const generatePrintContent = (commande: Commande, lignes: LigneCommande[], patient: Personne | undefined) => {
    const currentDate = new Date().toLocaleDateString("fr-FR")
    const currentTime = new Date().toLocaleTimeString("fr-FR")

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Commande CMD-${commande.id?.toString().padStart(3, "0")}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #0d9488;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .hospital-name {
              font-size: 24px;
              font-weight: bold;
              color: #0d9488;
              margin-bottom: 5px;
            }
            .document-title {
              font-size: 18px;
              color: #666;
            }
            .info-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .info-block {
              flex: 1;
              margin-right: 20px;
            }
            .info-block:last-child {
              margin-right: 0;
            }
            .info-title {
              font-weight: bold;
              color: #0d9488;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            .info-item {
              margin-bottom: 5px;
            }
            .label {
              font-weight: bold;
              display: inline-block;
              width: 120px;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .table th,
            .table td {
              border: 1px solid #d1d5db;
              padding: 12px;
              text-align: left;
            }
            .table th {
              background-color: #f3f4f6;
              font-weight: bold;
              color: #374151;
            }
            .table tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .total-section {
              text-align: right;
              margin-top: 20px;
            }
            .total-amount {
              font-size: 18px;
              font-weight: bold;
              color: #0d9488;
              border-top: 2px solid #0d9488;
              padding-top: 10px;
              display: inline-block;
              min-width: 200px;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            @media print {
              body {
                margin: 0;
                padding: 15px;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="hospital-name">HÔPITAL GÉNÉRAL</div>
            <div class="document-title">FACTURE DE PHARMACIE</div>
          </div>

          <div class="info-section">
            <div class="info-block">
              <div class="info-title">INFORMATIONS COMMANDE</div>
              <div class="info-item">
                <span class="label">N° Commande:</span>
                CMD-${commande.id?.toString().padStart(3, "0")}
              </div>
              <div class="info-item">
                <span class="label">Date:</span>
                ${formatDate(commande.dateCommande)}
              </div>
              <div class="info-item">
                <span class="label">Heure:</span>
                ${currentTime}
              </div>
            </div>

            <div class="info-block">
              <div class="info-title">INFORMATIONS PATIENT</div>
              <div class="info-item">
                <span class="label">Nom:</span>
                ${patient ? `${patient.prenom} ${patient.nom}` : "Patient non trouvé"}
              </div>
              ${
                patient?.telephone
                  ? `
              <div class="info-item">
                <span class="label">Téléphone:</span>
                ${patient.telephone}
              </div>
              `
                  : ""
              }
              ${
                patient?.email
                  ? `
              <div class="info-item">
                <span class="label">Email:</span>
                ${patient.email}
              </div>
              `
                  : ""
              }
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Lot</th>
                <th>Quantité</th>
                <th>Prix Unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${lignes
                .map((ligne) => {
                  // Utiliser les données enrichies de la ligne si disponibles
                  const lot = ligne.ligneApprovisionnement || getLotInfo(ligne.ligneApprovisionnementId || 0)
                  const produitNom = lot?.medicamentReference?.medicament?.nom || "Produit inconnu"
                  const referenceNom = lot?.medicamentReference?.reference?.nom || "Référence inconnue"
                  const numeroLot = lot?.numeroLot || "N/A"

                  return `
                  <tr>
                    <td>
                      ${produitNom}
                      <br>
                      <small style="color: #666;">
                        ${referenceNom}
                      </small>
                    </td>
                    <td>${numeroLot}</td>
                    <td>${ligne.quantite}</td>
                    <td>${formatPrice(ligne.prixUnitaire)}</td>
                    <td>${formatPrice(ligne.quantite * ligne.prixUnitaire)}</td>
                  </tr>
                `
                })
                .join("")}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-amount">
              TOTAL: ${formatPrice(Number.parseFloat(commande.montantTotal || "0"))}
            </div>
          </div>

          <div class="footer">
            <p>Document généré le ${currentDate} à ${currentTime}</p>
            <p>Hôpital Général - Service Pharmacie</p>
          </div>
        </body>
      </html>
    `
  }

  const handleViewCommande = async (commande: Commande) => {
    setSelectedCommande(commande)
    setIsViewModalOpen(true)
    // Rafraîchir les lignes pour le modal de visualisation pour s'assurer des dernières données
    refetchSelectedCommandeLignes()
  }

  const loadCommandeForEdit = async (commande: Commande) => {
    setSelectedCommande(commande)
    setActiveTab("info")

    // Charger les lignes de la commande
    if (commande.id) {
      try {
        const { ligneCommandeService } = await import("@/services/pharmacie/ligne-commande.service")
        const lignes = await ligneCommandeService.getByCommandeId(commande.id)
        console.log("Lignes chargées pour l'édition:", lignes)

        setCommandeForm({
          dateCommande: commande.dateCommande,
          montantTotal: commande.montantTotal,
          personneId: commande.personne?.id,
          lignesCommande: lignes.map((ligne) => ({
            id: generateTempId(),
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
    setActiveTab("info")
  }

  const addLigneCommande = () => {
    setCommandeForm((prev) => ({
      ...prev,
      lignesCommande: [
        ...prev.lignesCommande,
        {
          id: generateTempId(),
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
              console.log(`Lot sélectionné: ${lot.numeroLot}, Prix FCFA: ${lot.prixUnitaireVente}`)
            } else {
              updatedLigne.prixUnitaire = 0
              console.warn(`Lot avec l'ID ${value} non trouvé.`)
            }
          }
          console.log(
            `Mise à jour de la ligne ${id}: champ=${field}, valeur=${value}, nouvel état de la ligne:`,
            updatedLigne,
          )
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
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
          <button onClick={refetch} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Réessayer
          </button>
        </div>
      </PharmacienSidebar>
    )
  }

  return (
    <PharmacienSidebar>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              Gestion des Commandes (FIFO)
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez les commandes par lots d'approvisionnement (Premier Entré, Premier Sorti)
            </p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setIsCreateModalOpen(true)
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle Commande
          </button>
        </div>

        {/* Filtres */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro, montant ou patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtres
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Liste des Commandes ({filteredCommandes.length})
            </h2>
            <p className="text-sm text-gray-600">Gérez vos commandes de médicaments par lots d'approvisionnement</p>
          </div>
          <div className="p-4">
            {filteredCommandes.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande trouvée</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Aucune commande ne correspond à votre recherche."
                    : "Commencez par créer une nouvelle commande."}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => {
                      resetForm()
                      setIsCreateModalOpen(true)
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Créer une commande
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">N° Commande</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Statut</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Montant</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCommandes.map((commande) => (
                      <tr key={commande.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">CMD-{commande.id?.toString().padStart(3, "0")}</td>
                        <td className="py-3 px-4">{formatDate(commande.dateCommande)}</td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">
                              {getPatientInfo(commande.personne?.id || 0)?.prenom}{" "}
                              {getPatientInfo(commande.personne?.id || 0)?.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {getPatientInfo(commande.personne?.id || 0)?.telephone}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{getStatutBadge(commande.statut)}</td>
                        <td className="py-3 px-4 font-medium">
                          {formatPrice(Number.parseFloat(commande.montantTotal || "0"))}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewCommande(commande)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              title="Voir"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {commande.statut !== "ANNULEE" && (
                              <>
                                <button
                                  onClick={() => loadCommandeForEdit(commande)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                  title="Modifier"
                                >
                                  {/* <Edit className="h-4 w-4" /> */}
                                </button>
                                <button
                                  onClick={() => handlePrintCommande(commande)}
                                  disabled={isPrinting}
                                  className="p-1 text-green-600 hover:bg-green-100 rounded"
                                  title="Imprimer"
                                >
                                  <Printer className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            {commande.statut !== "ANNULEE" && (
                              <button
                                onClick={() => {
                                  setSelectedCommande(commande)
                                  setIsCancelModalOpen(true)
                                }}
                                className="p-1 text-orange-600 hover:bg-orange-100 rounded"
                                title="Annuler"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setCommandeToDelete(commande)
                                setIsDeleteModalOpen(true)
                              }}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Créer une Nouvelle Commande
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Sélectionnez les lots d'approvisionnement à vendre (logique FIFO - Premier Entré, Premier Sorti).
                </p>
              </div>

              <div className="flex-1 overflow-hidden">
                {/* Simple tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab("info")}
                      className={`px-4 py-2 text-sm font-medium border-b-2 ${
                        activeTab === "info"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <FileText className="h-4 w-4 inline mr-2" />
                      Informations
                    </button>
                    <button
                      onClick={() => setActiveTab("lignes")}
                      disabled={!commandeForm.personneId || !commandeForm.dateCommande}
                      className={`px-4 py-2 text-sm font-medium border-b-2 ${
                        activeTab === "lignes"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      } ${!commandeForm.personneId || !commandeForm.dateCommande ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <ShoppingCart className="h-4 w-4 inline mr-2" />
                      Lignes ({commandeForm.lignesCommande.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("resume")}
                      disabled={
                        !commandeForm.personneId ||
                        !commandeForm.dateCommande ||
                        commandeForm.lignesCommande.length === 0 ||
                        commandeForm.lignesCommande.some((ligne) => ligne.ligneApprovisionnementId === 0)
                      }
                      className={`px-4 py-2 text-sm font-medium border-b-2 ${
                        activeTab === "resume"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      } ${
                        !commandeForm.personneId ||
                        !commandeForm.dateCommande ||
                        commandeForm.lignesCommande.length === 0 ||
                        commandeForm.lignesCommande.some((ligne) => ligne.ligneApprovisionnementId === 0)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <Calculator className="h-4 w-4 inline mr-2" />
                      Résumé
                    </button>
                  </div>
                </div>

                <div className="p-6 max-h-96 overflow-y-auto">
                  {activeTab === "info" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de Commande</label>
                        <input
                          type="date"
                          value={commandeForm.dateCommande}
                          onChange={(e) => setCommandeForm((prev) => ({ ...prev, dateCommande: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                        <select
                          value={commandeForm.personneId?.toString() || ""}
                          onChange={(e) => {
                            setCommandeForm((prev) => ({ ...prev, personneId: Number.parseInt(e.target.value) }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Sélectionner un patient</option>
                          {personnes
                            .filter((p) => p.id != null && typeof p.id === "number")
                            .map((personne) => (
                              <option key={personne.id} value={personne.id!.toString()}>
                                {personne.prenom} {personne.nom}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Montant Total (calculé automatiquement)
                        </label>
                        <input
                          type="text"
                          value={`${formatPrice(Number.parseFloat(commandeForm.montantTotal || "0"))}`}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Le montant est calculé à partir des lignes de commande.
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            if (!commandeForm.personneId) {
                              toast.error("Veuillez sélectionner un patient avant de continuer")
                              return
                            }
                            if (!commandeForm.dateCommande) {
                              toast.error("Veuillez sélectionner une date de commande")
                              return
                            }
                            setActiveTab("lignes")
                          }}
                          disabled={!commandeForm.personneId || !commandeForm.dateCommande}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                        <h3 className="text-lg font-medium text-gray-900">Lignes de Commande</h3>
                        <button
                          onClick={addLigneCommande}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 text-sm"
                        >
                          <Plus className="h-4 w-4" />
                          Ajouter Ligne
                        </button>
                      </div>

                      {commandeForm.lignesCommande.length === 0 ? (
                        <div className="text-center py-8">
                          <Package2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-900">Aucune ligne ajoutée</p>
                          <p className="text-sm text-gray-500 mb-4">Cliquez sur "Ajouter Ligne" pour commencer</p>
                          <button
                            onClick={addLigneCommande}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 mx-auto"
                          >
                            <Plus className="h-4 w-4" />
                            Première Ligne
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {commandeForm.lignesCommande.map((ligne) => {
                            const lot = getLotInfo(ligne.ligneApprovisionnementId)
                            const stockDisponible = lot?.quantiteDisponible || 0
                            const stockInsuffisant = stockDisponible < ligne.quantite

                            return (
                              <div key={ligne.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Médicament (Lot)
                                    </label>
                                    <select
                                      value={ligne.ligneApprovisionnementId.toString()}
                                      onChange={(e) =>
                                        updateLigneCommande(
                                          ligne.id,
                                          "ligneApprovisionnementId",
                                          Number.parseInt(e.target.value),
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      <option value="0">Sélectionner un lot</option>
                                      {availableLots
                                        .filter((lot) => (lot.quantiteDisponible || 0) > 0)
                                        .map((lot) => (
                                          <option key={lot.id} value={lot.id!.toString()}>
                                            {lot.medicamentReference?.medicament?.nom || "Médicament inconnu"} -{" "}
                                            {lot.medicamentReference?.reference?.nom || "Référence inconnue"} (Lot:{" "}
                                            {lot.numeroLot}, Stock: {lot.quantiteDisponible})
                                          </option>
                                        ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                                    <input
                                      type="number"
                                      min="1"
                                      max={stockDisponible}
                                      value={ligne.quantite}
                                      onChange={(e) =>
                                        updateLigneCommande(ligne.id, "quantite", Number.parseInt(e.target.value) || 1)
                                      }
                                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${stockInsuffisant ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {stockInsuffisant && (
                                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        Stock insuffisant
                                      </p>
                                    )}
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Prix Unitaire
                                    </label>
                                    <input
                                      type="number"
                                      value={ligne.prixUnitaire}
                                      disabled
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{formatPrice(ligne.prixUnitaire)}</p>
                                  </div>
                                  <div className="flex items-end">
                                    <div className="flex-1">
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                                      <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md text-green-700 font-medium">
                                        {formatPrice(ligne.quantite * ligne.prixUnitaire)}
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => removeLigneCommande(ligne.id)}
                                      className="ml-2 p-2 text-red-600 hover:bg-red-100 rounded"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                          <div className="flex justify-between pt-4">
                            <button
                              onClick={() => setActiveTab("info")}
                              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Retour: Informations
                            </button>
                            <button
                              onClick={() => {
                                if (commandeForm.lignesCommande.length === 0) {
                                  toast.error("Veuillez ajouter au moins une ligne de commande avant de continuer")
                                  return
                                }
                                // Vérifier que toutes les lignes ont un lot sélectionné
                                const lignesIncompletes = commandeForm.lignesCommande.filter(
                                  (ligne) => ligne.ligneApprovisionnementId === 0,
                                )
                                if (lignesIncompletes.length > 0) {
                                  toast.error("Veuillez sélectionner un lot pour toutes les lignes de commande")
                                  return
                                }
                                setActiveTab("resume")
                              }}
                              disabled={
                                commandeForm.lignesCommande.length === 0 ||
                                commandeForm.lignesCommande.some((ligne) => ligne.ligneApprovisionnementId === 0)
                              }
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              Suivant: Résumé
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "resume" && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900">Résumé de la Commande</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Informations Générales</h4>
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
                          <h4 className="font-medium text-gray-900 mb-3">Totaux</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quantité totale:</span>
                              <span className="font-medium">
                                {commandeForm.lignesCommande.reduce((sum, ligne) => sum + ligne.quantite, 0)} unités
                              </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                              <span className="text-gray-800">Montant Total:</span>
                              <span className="text-gray-900">
                                {formatPrice(Number.parseFloat(commandeForm.montantTotal || "0"))}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-start pt-4">
                        <button
                          onClick={() => setActiveTab("lignes")}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Retour: Lignes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateCommande}
                  disabled={isSubmitting || commandeForm.lignesCommande.length === 0 || !commandeForm.personneId}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Création...
                    </>
                  ) : (
                    "Créer la Commande"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {isViewModalOpen && selectedCommande && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Détails de la Commande CMD-{selectedCommande?.id?.toString().padStart(3, "0")}
                </h2>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Informations Générales</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span>{formatDate(selectedCommande.dateCommande)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Patient:</span>
                          <span>
                            {getPatientInfo(selectedCommande.personne?.id || 0)?.prenom}{" "}
                            {getPatientInfo(selectedCommande.personne?.id || 0)?.nom}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Statut:</span>
                          <span>{getStatutBadge(selectedCommande.statut)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Montant</h3>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatPrice(Number.parseFloat(selectedCommande.montantTotal || "0"))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Lignes de Commande</h3>
                    {selectedCommandeLignes && selectedCommandeLignes.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 px-3">Produit</th>
                              <th className="text-left py-2 px-3">Lot</th>
                              <th className="text-left py-2 px-3">Quantité</th>
                              <th className="text-left py-2 px-3">Prix Unitaire</th>
                              <th className="text-left py-2 px-3">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedCommandeLignes.map((ligne) => {
                              const lot =
                                ligne.ligneApprovisionnement || getLotInfo(ligne.ligneApprovisionnementId || 0)
                              return (
                                <tr key={ligne.id} className="border-b border-gray-100">
                                  <td className="py-2 px-3">
                                    <div>
                                      <div className="font-medium">
                                        {lot?.medicamentReference?.medicament?.nom || "Produit inconnu"}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {lot?.medicamentReference?.reference?.nom || "Référence inconnue"}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2 px-3">{lot?.numeroLot || "N/A"}</td>
                                  <td className="py-2 px-3">{ligne.quantite}</td>
                                  <td className="py-2 px-3">{formatPrice(ligne.prixUnitaire)}</td>
                                  <td className="py-2 px-3 font-medium">
                                    {formatPrice(ligne.quantite * ligne.prixUnitaire)}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">Aucune ligne de commande trouvée</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Modal */}
        {isCancelModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <X className="h-5 w-5 text-orange-600" />
                  Confirmer l'annulation
                </h2>
                <p className="text-gray-600 mb-6">
                  Êtes-vous sûr de vouloir annuler cette commande ? Les produits seront remis en stock automatiquement.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsCancelModalOpen(false)}
                    disabled={isCancelling}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Non, garder
                  </button>
                  <button
                    onClick={handleCancelCommande}
                    disabled={isCancelling}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    {isCancelling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                        Annulation...
                      </>
                    ) : (
                      "Oui, annuler"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  Confirmer la suppression
                </h2>
                <p className="text-gray-600 mb-6">
                  Êtes-vous sûr de vouloir supprimer définitivement cette commande ? Cette action est irréversible.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDeleteCommande}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                        Suppression...
                      </>
                    ) : (
                      "Supprimer définitivement"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PharmacienSidebar>
  )
}
