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
  Printer,
  X,
} from "lucide-react"
import { useCommandes } from "@/hooks/pharmacie/useCommandes"
import { useLignesCommande, useLotsDisponibles } from "@/hooks/pharmacie/useLignesCommande"
import { usePersonne } from "@/hooks/utilisateur/usePersonne"
import { useNotifications } from "@/hooks/pharmacie/useNotifications"
import type { Commande, LigneApprovisionnement, LigneCommande, StatutCommande } from "@/types/pharmacie"
import type { Personne } from "@/types/utilisateur"
import { formatDate, formatPrice } from "@/utils/formatters"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
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
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            En cours
          </Badge>
        )
      case "VALIDEE":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Validée
          </Badge>
        )
      case "ANNULEE":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            Annulée
          </Badge>
        )
      default:
        return <Badge variant="secondary">En cours</Badge>
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
                                console.log("Patient sélectionné dans le formulaire:", value)
                                setCommandeForm((prev) => ({ ...prev, personneId: Number.parseInt(value) }))
                              }}
                            >
                              <SelectTrigger className="border-teal-200 focus:border-teal-500 focus:ring-teal-500">
                                <SelectValue placeholder="Sélectionner un patient" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                {personnes
                                  .filter((p) => p.id != null && typeof p.id === "number")
                                  .map((personne) => (
                                    <SelectItem
                                      key={personne.id}
                                      value={personne.id!.toString()}
                                      className="bg-white hover:bg-gray-100 cursor-pointer px-3 py-2"
                                    >
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
                              value={`${formatPrice(Number.parseFloat(commandeForm.montantTotal || "0"))}`}
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
                                        <TableHead className="w-[120px] font-semibold">Prix Unitaire</TableHead>
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
                                                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                                  {availableLots.length === 0 ? (
                                                    <SelectItem value="no-lots" disabled className="bg-white">
                                                      Aucun lot disponible
                                                    </SelectItem>
                                                  ) : (
                                                    availableLots
                                                      .filter((lot) => (lot.quantiteDisponible || 0) > 0)
                                                      .map((lot) => (
                                                        <SelectItem
                                                          key={lot.id}
                                                          value={lot.id!.toString()}
                                                          className="bg-white hover:bg-gray-100 cursor-pointer px-3 py-2"
                                                        >
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
                                                value={ligne.prixUnitaire}
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
                                  <span className="text-purple-900">
                                    {formatPrice(Number.parseFloat(commandeForm.montantTotal || "0"))}
                                  </span>
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

        {/* Modal de modification */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[1400px] max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-orange-600" />
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
                    <Card className="border-orange-200 h-full">
                      <CardHeader>
                        <CardTitle className="text-lg text-orange-800">Informations Générales</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-2">
                          <Label htmlFor="dateCommande">Date de Commande</Label>
                          <Input
                            type="date"
                            id="dateCommande"
                            value={commandeForm.dateCommande}
                            onChange={(e) => setCommandeForm((prev) => ({ ...prev, dateCommande: e.target.value }))}
                            className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="personneId">Patient *</Label>
                          <Select
                            value={commandeForm.personneId?.toString() || ""}
                            onValueChange={(value) => {
                              console.log("Patient sélectionné dans le formulaire:", value)
                              setCommandeForm((prev) => ({ ...prev, personneId: Number.parseInt(value) }))
                            }}
                          >
                            <SelectTrigger className="border-orange-200 focus:border-orange-500 focus:ring-orange-500">
                              <SelectValue placeholder="Sélectionner un patient" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg">
                              {personnes
                                .filter((p) => p.id != null && typeof p.id === "number")
                                .map((personne) => (
                                  <SelectItem
                                    key={personne.id}
                                    value={personne.id!.toString()}
                                    className="bg-white hover:bg-gray-100 cursor-pointer px-3 py-2"
                                  >
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
                            value={`${formatPrice(Number.parseFloat(commandeForm.montantTotal || "0"))}`}
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
                            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                          >
                            Suivant: Modifier les lignes
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Onglet Lignes de Commande */}
                  <TabsContent value="lignes" className="h-full m-0 p-6">
                    <Card className="border-orange-200 h-full flex flex-col">
                      <CardHeader className="flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-orange-800">Lignes de Commande</CardTitle>
                          <Button
                            type="button"
                            onClick={addLigneCommande}
                            size="sm"
                            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
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
                              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
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
                                      <TableHead className="w-[120px] font-semibold">Prix Unitaire</TableHead>
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
                                              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                                {availableLots.length === 0 ? (
                                                  <SelectItem value="no-lots" disabled className="bg-white">
                                                    Aucun lot disponible
                                                  </SelectItem>
                                                ) : (
                                                  availableLots
                                                    .filter((lot) => (lot.quantiteDisponible || 0) > 0)
                                                    .map((lot) => (
                                                      <SelectItem
                                                        key={lot.id}
                                                        value={lot.id!.toString()}
                                                        className="bg-white hover:bg-gray-100 cursor-pointer px-3 py-2"
                                                      >
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
                                              value={ligne.prixUnitaire}
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
                    <Card className="border-orange-200 h-full">
                      <CardHeader>
                        <CardTitle className="text-lg text-orange-800">Résumé de la Commande</CardTitle>
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
                                <span className="text-orange-800">Montant Total:</span>
                                <span className="text-orange-900">
                                  {formatPrice(Number.parseFloat(commandeForm.montantTotal || "0"))}
                                </span>
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
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
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

        {/* Modal de visualisation */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Détails de la Commande CMD-{selectedCommande?.id?.toString().padStart(3, "0")}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6">
                {selectedCommande && (
                  <>
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
                        <div className="text-2xl font-bold text-teal-600">
                          {formatPrice(Number.parseFloat(selectedCommande.montantTotal || "0"))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Lignes de Commande</h3>
                      {selectedCommandeLignes && selectedCommandeLignes.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Produit</TableHead>
                              <TableHead>Lot</TableHead>
                              <TableHead>Quantité</TableHead>
                              <TableHead>Prix Unitaire</TableHead>
                              <TableHead>Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedCommandeLignes.map((ligne) => {
                              const lot =
                                ligne.ligneApprovisionnement || getLotInfo(ligne.ligneApprovisionnementId || 0)
                              return (
                                <TableRow key={ligne.id}>
                                  <TableCell>
                                    <div>
                                      <div className="font-medium">
                                        {lot?.medicamentReference?.medicament?.nom || "Produit inconnu"}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {lot?.medicamentReference?.reference?.nom || "Référence inconnue"}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{lot?.numeroLot || "N/A"}</TableCell>
                                  <TableCell>{ligne.quantite}</TableCell>
                                  <TableCell>{formatPrice(ligne.prixUnitaire)}</TableCell>
                                  <TableCell className="font-medium">
                                    {formatPrice(ligne.quantite * ligne.prixUnitaire)}
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-gray-500 text-center py-4">Aucune ligne de commande trouvée</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Modal de confirmation d'annulation */}
        <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <X className="h-5 w-5 text-orange-600" />
                Confirmer l'annulation
              </DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir annuler cette commande ? Les produits seront remis en stock automatiquement.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCancelModalOpen(false)} disabled={isCancelling}>
                Non, garder
              </Button>
              <Button
                onClick={handleCancelCommande}
                disabled={isCancelling}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isCancelling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Annulation...
                  </>
                ) : (
                  "Oui, annuler"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de confirmation de suppression */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                Confirmer la suppression
              </DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer définitivement cette commande ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
                Annuler
              </Button>
              <Button onClick={handleDeleteCommande} disabled={isDeleting} variant="destructive">
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Suppression...
                  </>
                ) : (
                  "Supprimer définitivement"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-600">Total Commandes</p>
                  <p className="text-2xl font-bold text-teal-900">{stats.totalCommandes}</p>
                </div>
                <div className="p-3 bg-teal-100 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cyan-600">Montant Total</p>
                  <p className="text-2xl font-bold text-cyan-900">{formatPrice(stats.montantTotal)}</p>
                </div>
                <div className="p-3 bg-cyan-100 rounded-full">
                  <Euro className="h-6 w-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Ce Mois</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.commandesMois}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Lots Disponibles</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.lotsDisponibles}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche et filtres */}
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par numéro, montant ou patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </div>
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des commandes */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-teal-600" />
              Liste des Commandes ({filteredCommandes.length})
            </CardTitle>
            <CardDescription>Gérez vos commandes de médicaments par lots d'approvisionnement</CardDescription>
          </CardHeader>
          <CardContent>
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
                  <Button
                    onClick={() => {
                      resetForm()
                      setIsCreateModalOpen(true)
                    }}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une commande
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">N° Commande</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Patient</TableHead>
                      <TableHead className="font-semibold">Statut</TableHead>
                      <TableHead className="font-semibold">Montant</TableHead>
                      <TableHead className="font-semibold text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCommandes.map((commande) => (
                      <TableRow key={commande.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">CMD-{commande.id?.toString().padStart(3, "0")}</TableCell>
                        <TableCell>{formatDate(commande.dateCommande)}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {getPatientInfo(commande.personne?.id || 0)?.prenom}{" "}
                              {getPatientInfo(commande.personne?.id || 0)?.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {getPatientInfo(commande.personne?.id || 0)?.telephone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatutBadge(commande.statut)}</TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(Number.parseFloat(commande.montantTotal || "0"))}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewCommande(commande)}
                              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {commande.statut !== "ANNULEE" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => loadCommandeForEdit(commande)}
                                  className="h-8 w-8 p-0 hover:bg-orange-100 hover:text-orange-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePrintCommande(commande)}
                                  disabled={isPrinting}
                                  className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-700"
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {commande.statut !== "ANNULEE" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedCommande(commande)
                                  setIsCancelModalOpen(true)
                                }}
                                className="h-8 w-8 p-0 hover:bg-orange-100 hover:text-orange-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCommandeToDelete(commande)
                                setIsDeleteModalOpen(true)
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
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
      </div>
    </PharmacienSidebar>
  )
}
