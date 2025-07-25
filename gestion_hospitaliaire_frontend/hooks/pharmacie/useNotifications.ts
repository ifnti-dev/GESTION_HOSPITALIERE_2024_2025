"use client"

import { useState, useEffect, useCallback } from "react"
import { notificationService, type CreateNotificationRequest } from "@/services/pharmacie/notification.service"
import { ligneApprovisionnementService } from "@/services/pharmacie/ligne-approvisionnement.service"
import { medicamentReferenceService } from "@/services/pharmacie/medicament-reference.service"
import { commandeService } from "@/services/pharmacie/commande.service"
import { approvisionnementService } from "@/services/pharmacie/approvisionnement.service"
import type { Notification } from "@/types/pharmacie"

export interface NotificationStats {
  total: number
  nonLues: number
  prioriteHaute: number
  aujourdhui: number
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    nonLues: 0,
    prioriteHaute: 0,
    aujourdhui: 0,
  })

  // Fonction pour calculer les statistiques
  const calculateStats = useCallback((notificationsList: Notification[]): NotificationStats => {
    const today = new Date().toISOString().split("T")[0]

    return {
      total: notificationsList.length,
      nonLues: notificationsList.filter((n) => n.statut === "non_lue").length,
      prioriteHaute: notificationsList.filter((n) => n.priorite === "haute").length,
      aujourdhui: notificationsList.filter((n) => n.dateNotif === today).length,
    }
  }, [])

  // Fonction pour créer une notification automatique avec vérification de doublons
  const createAutoNotification = useCallback(async (notificationData: CreateNotificationRequest) => {
    try {
      // Vérifier si une notification similaire existe déjà aujourd'hui
      const today = new Date().toISOString().split("T")[0]
      const existingNotifications = await notificationService.getByDate(today)

      // Vérifier les doublons de manière plus précise
      const similarExists = existingNotifications.some((n) => {
        // Pour les notifications de stock, vérifier le nom du produit
        if (notificationData.type.includes("Stock") && n.type.includes("Stock")) {
          const productName = notificationData.message.split(" ")[4] // Extraire le nom du produit
          return n.message.includes(productName)
        }

        // Pour les autres types, vérifier le type exact
        return (
          n.type === notificationData.type &&
          Math.abs(new Date(n.dateNotif).getTime() - new Date(today).getTime()) < 24 * 60 * 60 * 1000
        )
      })

      if (!similarExists) {
        const newNotification = await notificationService.create(notificationData)
        console.log(`✅ Notification automatique créée: ${notificationData.type}`)

        // Mettre à jour la liste locale des notifications
        setNotifications((prev) => [newNotification, ...prev])
        return newNotification
      } else {
        console.log(`ℹ️ Notification similaire déjà existante: ${notificationData.type}`)
      }
    } catch (error) {
      console.error("❌ Erreur lors de la création de notification automatique:", error)
    }
  }, [])

  // Notification pour création de commande
  const notifyCommandeCreated = useCallback(
    async (commandeId: number, montant: number, patientNom: string) => {
      await createAutoNotification({
        type: "Nouvelle Commande",
        message: `Nouvelle commande CMD-${commandeId.toString().padStart(3, "0")} créée pour ${patientNom} - Montant: ${montant.toLocaleString()} FCFA`,
        priorite: "normale",
      })
    },
    [createAutoNotification],
  )

  // Notification pour création d'approvisionnement
  const notifyApprovisionnementCreated = useCallback(
    async (approId: number, fournisseur: string, nbLignes: number) => {
      await createAutoNotification({
        type: "Nouvel Approvisionnement",
        message: `Nouvel approvisionnement APP-${approId.toString().padStart(3, "0")} reçu de ${fournisseur} avec ${nbLignes} produit(s)`,
        priorite: "normale",
      })
    },
    [createAutoNotification],
  )

  // Notification pour commande annulée
  const notifyCommandeAnnulee = useCallback(
    async (commandeId: number, patientNom: string) => {
      await createAutoNotification({
        type: "Commande Annulée",
        message: `Commande CMD-${commandeId.toString().padStart(3, "0")} de ${patientNom} a été annulée - Produits remis en stock`,
        priorite: "moyenne",
      })
    },
    [createAutoNotification],
  )

  // Surveillance automatique du stock critique
  const checkStockCritique = useCallback(async () => {
    try {
      const lots = await ligneApprovisionnementService.getAll()
      const medicamentReferences = await medicamentReferenceService.getAllMedicamentReferences()

      let notificationsCreated = 0

      // Vérifier les stocks critiques (< 10 unités)
      for (const medicamentRef of medicamentReferences) {
        const lotsDisponibles = lots.filter(
          (lot) => lot.medicamentReferenceId === medicamentRef.id && lot.quantiteDisponible > 0,
        )

        const stockTotal = lotsDisponibles.reduce((sum, lot) => sum + lot.quantiteDisponible, 0)
        const nomProduit = `${medicamentRef.medicament?.nom || "Produit"} ${medicamentRef.reference?.nom || ""}`

        if (stockTotal === 0) {
          await createAutoNotification({
            type: "Rupture de Stock",
            message: `🚨 RUPTURE DE STOCK: ${nomProduit} - Stock épuisé, réapprovisionnement urgent requis`,
            priorite: "haute",
          })
          notificationsCreated++
        } else if (stockTotal < 5) {
          await createAutoNotification({
            type: "Stock Critique",
            message: `⚠️ STOCK CRITIQUE: ${nomProduit} - Seulement ${stockTotal} unité(s) restante(s)`,
            priorite: "haute",
          })
          notificationsCreated++
        } else if (stockTotal < 10) {
          await createAutoNotification({
            type: "Stock Faible",
            message: `📉 Stock faible: ${nomProduit} - ${stockTotal} unité(s) disponible(s), prévoir réapprovisionnement`,
            priorite: "moyenne",
          })
          notificationsCreated++
        }
      }

      if (notificationsCreated > 0) {
        console.log(`✅ ${notificationsCreated} notification(s) de stock créée(s)`)
      }
    } catch (error) {
      console.error("❌ Erreur lors de la vérification du stock critique:", error)
    }
  }, [createAutoNotification])

  // Surveillance des lots expirés/expirants
  const checkLotsExpiration = useCallback(async () => {
    try {
      const lots = await ligneApprovisionnementService.getAll()
      const today = new Date()
      const in7Days = new Date()
      const in30Days = new Date()
      in7Days.setDate(today.getDate() + 7)
      in30Days.setDate(today.getDate() + 30)

      let lotsExpires = 0
      let lotsExpirant7Jours = 0
      let lotsExpirant30Jours = 0
      const produitsExpires: string[] = []
      const produitsExpirant7: string[] = []

      for (const lot of lots) {
        if (lot.quantiteDisponible > 0) {
          const dateExpiration = new Date(lot.dateExpiration)
          const nomProduit = `${lot.medicamentReference?.medicament?.nom || "Produit"} (Lot: ${lot.numeroLot})`

          if (dateExpiration < today) {
            lotsExpires++
            produitsExpires.push(nomProduit)
          } else if (dateExpiration <= in7Days) {
            lotsExpirant7Jours++
            produitsExpirant7.push(nomProduit)
          } else if (dateExpiration <= in30Days) {
            lotsExpirant30Jours++
          }
        }
      }

      // Notifications pour lots expirés
      if (lotsExpires > 0) {
        await createAutoNotification({
          type: "Lots Expirés",
          message: `🚨 ${lotsExpires} lot(s) ont expiré et doivent être retirés du stock: ${produitsExpires.slice(0, 3).join(", ")}${produitsExpires.length > 3 ? "..." : ""}`,
          priorite: "haute",
        })
      }

      // Notifications pour lots expirant dans 7 jours
      if (lotsExpirant7Jours > 0) {
        await createAutoNotification({
          type: "Expiration Imminente",
          message: `⏰ ${lotsExpirant7Jours} lot(s) expirent dans les 7 prochains jours: ${produitsExpirant7.slice(0, 2).join(", ")}${produitsExpirant7.length > 2 ? "..." : ""}`,
          priorite: "haute",
        })
      }

      // Notifications pour lots expirant dans 30 jours
      if (lotsExpirant30Jours > 0) {
        await createAutoNotification({
          type: "Expiration Proche",
          message: `📅 ${lotsExpirant30Jours} lot(s) expirent dans les 30 prochains jours - Planifier l'écoulement`,
          priorite: "moyenne",
        })
      }
    } catch (error) {
      console.error("❌ Erreur lors de la vérification des expirations:", error)
    }
  }, [createAutoNotification])

  // Surveillance des nouvelles commandes du jour
  const checkNouvellesCommandes = useCallback(async () => {
    try {
      const commandes = await commandeService.getAll()
      const today = new Date().toISOString().split("T")[0]

      const commandesAujourdhui = commandes.filter((cmd) => cmd.dateCommande === today && cmd.statut !== "ANNULEE")
      const commandesAnnuleesAujourdhui = commandes.filter(
        (cmd) => cmd.dateCommande === today && cmd.statut === "ANNULEE",
      )

      // Notification pour résumé quotidien des commandes
      if (commandesAujourdhui.length > 0) {
        const montantTotal = commandesAujourdhui.reduce(
          (sum, cmd) => sum + (Number.parseFloat(cmd.montantTotal) || 0),
          0,
        )

        await createAutoNotification({
          type: "Résumé Quotidien",
          message: `📊 Aujourd'hui: ${commandesAujourdhui.length} commande(s) validée(s) pour ${montantTotal.toLocaleString()} FCFA${commandesAnnuleesAujourdhui.length > 0 ? ` | ${commandesAnnuleesAujourdhui.length} annulée(s)` : ""}`,
          priorite: "normale",
        })
      }
    } catch (error) {
      console.error("❌ Erreur lors de la vérification des nouvelles commandes:", error)
    }
  }, [createAutoNotification])

  // Surveillance des approvisionnements récents
  const checkNouveauxApprovisionnements = useCallback(async () => {
    try {
      const approvisionnements = await approvisionnementService.getAll()
      const today = new Date().toISOString().split("T")[0]

      const approsAujourdhui = approvisionnements.filter((appro) => appro.dateAppro.split("T")[0] === today)

      if (approsAujourdhui.length > 0) {
        const totalLignes = approsAujourdhui.reduce(
          (sum, appro) => sum + (appro.lignesApprovisionnement?.length || 0),
          0,
        )

        await createAutoNotification({
          type: "Approvisionnements Reçus",
          message: `📦 ${approsAujourdhui.length} approvisionnement(s) reçu(s) aujourd'hui avec ${totalLignes} produit(s) au total`,
          priorite: "normale",
        })
      }
    } catch (error) {
      console.error("❌ Erreur lors de la vérification des nouveaux approvisionnements:", error)
    }
  }, [createAutoNotification])

  // Fonction principale de surveillance automatique
  const runAutoChecks = useCallback(async () => {
    console.log("🔄 Exécution des vérifications automatiques...")
    try {
      await Promise.all([
        checkStockCritique(),
        checkLotsExpiration(),
        checkNouvellesCommandes(),
        checkNouveauxApprovisionnements(),
      ])
      console.log("✅ Vérifications automatiques terminées")
    } catch (error) {
      console.error("❌ Erreur lors des vérifications automatiques:", error)
    }
  }, [checkStockCritique, checkLotsExpiration, checkNouvellesCommandes, checkNouveauxApprovisionnements])

  // Charger les notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Exécuter les vérifications automatiques d'abord
      await runAutoChecks()

      // Puis charger toutes les notifications
      const data = await notificationService.getAll()

      // Trier par priorité puis par date (plus récentes en premier)
      const sortedData = data.sort((a, b) => {
        // D'abord par priorité
        const priorityOrder = { haute: 0, moyenne: 1, normale: 2, basse: 3 }
        const priorityDiff =
          (priorityOrder[a.priorite as keyof typeof priorityOrder] || 2) -
          (priorityOrder[b.priorite as keyof typeof priorityOrder] || 2)

        if (priorityDiff !== 0) return priorityDiff

        // Puis par date (plus récentes en premier)
        return new Date(b.dateNotif).getTime() - new Date(a.dateNotif).getTime()
      })

      setNotifications(sortedData)
      setStats(calculateStats(sortedData))
    } catch (err) {
      setError("Erreur lors du chargement des notifications")
      console.error("❌ Erreur lors du chargement des notifications:", err)
    } finally {
      setLoading(false)
    }
  }, [runAutoChecks, calculateStats])

  // Actions sur les notifications
  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, statut: "lue" } : n)))
      setStats((prev) => ({ ...prev, nonLues: prev.nonLues - 1 }))
    } catch (error) {
      console.error("❌ Erreur lors du marquage comme lue:", error)
    }
  }, [])

  const markAsUnread = useCallback(async (id: number) => {
    try {
      await notificationService.markAsUnread(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, statut: "non_lue" } : n)))
      setStats((prev) => ({ ...prev, nonLues: prev.nonLues + 1 }))
    } catch (error) {
      console.error("❌ Erreur lors du marquage comme non lue:", error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, statut: "lue" as const })))
      setStats((prev) => ({ ...prev, nonLues: 0 }))
    } catch (error) {
      console.error("❌ Erreur lors du marquage de toutes comme lues:", error)
    }
  }, [])

  const deleteNotification = useCallback(
    async (id: number) => {
      try {
        await notificationService.delete(id)
        setNotifications((prev) => prev.filter((n) => n.id !== id))
        setStats((prev) => {
          const notification = notifications.find((n) => n.id === id)
          return {
            ...prev,
            total: prev.total - 1,
            nonLues: notification?.statut === "non_lue" ? prev.nonLues - 1 : prev.nonLues,
            prioriteHaute: notification?.priorite === "haute" ? prev.prioriteHaute - 1 : prev.prioriteHaute,
          }
        })
      } catch (error) {
        console.error("❌ Erreur lors de la suppression:", error)
      }
    },
    [notifications],
  )

  const deleteAllRead = useCallback(async () => {
    try {
      await notificationService.deleteAllRead()
      const unreadNotifications = notifications.filter((n) => n.statut === "non_lue")
      setNotifications(unreadNotifications)
      setStats(calculateStats(unreadNotifications))
    } catch (error) {
      console.error("❌ Erreur lors de la suppression des notifications lues:", error)
    }
  }, [notifications, calculateStats])

  // Filtrer les notifications
  const filterNotifications = useCallback(
    (searchTerm: string, typeFilter: string, statusFilter: string) => {
      return notifications.filter((notif) => {
        const matchesSearch =
          notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notif.type.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = typeFilter === "all" || notif.type === typeFilter
        const matchesStatus = statusFilter === "all" || notif.statut === statusFilter
        return matchesSearch && matchesType && matchesStatus
      })
    },
    [notifications],
  )

  // Charger les données au montage et configurer la surveillance automatique
  useEffect(() => {
    fetchNotifications()

    // Surveillance automatique toutes les 10 minutes
    const interval = setInterval(
      () => {
        console.log("🔄 Vérification automatique programmée...")
        runAutoChecks().then(() => {
          // Recharger les notifications après les vérifications
          notificationService.getAll().then((data) => {
            const sortedData = data.sort((a, b) => {
              const priorityOrder = { haute: 0, moyenne: 1, normale: 2, basse: 3 }
              const priorityDiff =
                (priorityOrder[a.priorite as keyof typeof priorityOrder] || 2) -
                (priorityOrder[b.priorite as keyof typeof priorityOrder] || 2)
              if (priorityDiff !== 0) return priorityDiff
              return new Date(b.dateNotif).getTime() - new Date(a.dateNotif).getTime()
            })
            setNotifications(sortedData)
            setStats(calculateStats(sortedData))
          })
        })
      },
      10 * 60 * 1000,
    ) // 10 minutes

    return () => clearInterval(interval)
  }, [fetchNotifications, runAutoChecks, calculateStats])

  return {
    notifications,
    loading,
    error,
    stats,
    actions: {
      refresh: fetchNotifications,
      markAsRead,
      markAsUnread,
      markAllAsRead,
      deleteNotification,
      deleteAllRead,
      filterNotifications,
      runAutoChecks,
      // Nouvelles fonctions pour déclencher des notifications
      notifyCommandeCreated,
      notifyApprovisionnementCreated,
      notifyCommandeAnnulee,
    },
  }
}
