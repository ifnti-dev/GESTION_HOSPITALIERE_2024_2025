"use client"

import { useState, useEffect } from "react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { ShoppingCart, Plus, Search, Eye, Edit, Trash2, X, Printer } from "lucide-react"
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
  id: string
  ligneApprovisionnementId: number
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
  const [activeTab, setActiveTab] = useState("info")
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
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">En cours</span>
      case "VALIDEE":
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Validée</span>
      case "ANNULEE":
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Annulée</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">En cours</span>
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h1>
            <p className="text-gray-600">Gérez les commandes par lots d'approvisionnement</p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setIsCreateModalOpen(true)
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle Commande
          </button>
        </div>

        <div className="bg-white p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par numéro, montant ou patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded"
              />
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Liste des Commandes ({filteredCommandes.length})
            </h2>
            {filteredCommandes.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande trouvée</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Aucune commande ne correspond à votre recherche."
                    : "Commencez par créer une nouvelle commande."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">N° Commande</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Patient</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Statut</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Montant</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCommandes.map((commande, index) => (
                      <tr key={commande.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 font-medium">CMD-{commande.id?.toString().padStart(3, "0")}</td>
                        <td className="px-4 py-3">{formatDate(commande.dateCommande)}</td>
                        <td className="px-4 py-3">
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
                        <td className="px-4 py-3">{getStatutBadge(commande.statut)}</td>
                        <td className="px-4 py-3 font-medium">
                          {formatPrice(Number.parseFloat(commande.montantTotal || "0"))}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewCommande(commande)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                              title="Voir"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {commande.statut !== "ANNULEE" && (
                              <>
                                <button
                                  onClick={() => loadCommandeForEdit(commande)}
                                  className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                                  title="Modifier"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handlePrintCommande(commande)}
                                  disabled={isPrinting}
                                  className="p-2 text-green-600 hover:bg-green-100 rounded"
                                  title="Imprimer"
                                >
                                  <Printer className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedCommande(commande)
                                    setIsCancelModalOpen(true)
                                  }}
                                  className="p-2 text-orange-600 hover:bg-orange-100 rounded"
                                  title="Annuler"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                setCommandeToDelete(commande)
                                setIsDeleteModalOpen(true)
                              }}
                              className="p-2 text-red-600 hover:bg-red-100 rounded"
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

        {/* Modal de visualisation */}
        {isViewModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  Détails de la Commande CMD-{selectedCommande?.id?.toString().padStart(3, "0")}
                </h2>
                <button onClick={() => setIsViewModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Modal content here */}
            </div>
          </div>
        )}

        {/* Modal de confirmation d'annulation */}
        {isCancelModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirmer l'annulation</h2>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir annuler cette commande ? Les produits seront remis en stock automatiquement.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  disabled={isCancelling}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Non, garder
                </button>
                <button
                  onClick={handleCancelCommande}
                  disabled={isCancelling}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded"
                >
                  {isCancelling ? "Annulation..." : "Oui, annuler"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer définitivement cette commande ? Cette action est irréversible.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteCommande}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  {isDeleting ? "Suppression..." : "Supprimer définitivement"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PharmacienSidebar>
  )
}
