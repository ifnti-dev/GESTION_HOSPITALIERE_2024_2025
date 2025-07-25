"use client"

import { useState, useEffect, useCallback } from "react"
import { ligneApprovisionnementService } from "@/services/pharmacie/ligne-approvisionnement.service"
import { commandeService } from "@/services/pharmacie/commande.service"
import { medicamentReferenceService } from "@/services/pharmacie/medicament-reference.service"
import { notificationService } from "@/services/pharmacie/notification.service"
import type { LigneApprovisionnement, Commande, Notification } from "@/types/pharmacie"

export interface DashboardStats {
  // Statistiques générales
  totalMedicaments: number
  totalLots: number
  valeurTotalStock: number

  // Alertes et notifications
  alertesStock: number
  lotsExpires: number
  lotsExpirantBientot: number
  notificationsNonLues: number

  // Ventes et commandes
  ventesAujourdhui: number
  commandesAujourdhui: number
  ventesHier: number
  ventesEvolution: number
  ventesHebdomadaires: number
  ventesEvolutionHebdo: number

  // Données pour graphiques
  ventesParJour: { date: string; ventes: number; commandes: number }[]
  stockParCategorie: { categorie: string; stock: number; valeur: number }[]
  topProduits: { nom: string; quantiteVendue: number; chiffreAffaires: number }[]
  evolutionStock: { mois: string; entrees: number; sorties: number; stock: number }[]
  alertesParType: { type: string; count: number; color: string }[]

  // Activité récente
  commandesRecentes: Commande[]
  alertesImportantes: Notification[]
  lotsExpirants: LigneApprovisionnement[]
  produitsStockFaible: {
    nom: string
    stock: number
    minimum: number
    statut: "critique" | "faible" | "rupture"
  }[]

  // Métriques avancées
  tauxRotationStock: number
  margeGlobale: number
  nombreFournisseurs: number
  produitsPlusVendus: string[]
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Récupération des statistiques du dashboard...")

      // Récupération parallèle de toutes les données
      const [lots, commandes, medicamentReferences, notifications] = await Promise.all([
        ligneApprovisionnementService.getAll(),
        commandeService.getAll(),
        medicamentReferenceService.getAllMedicamentReferences(),
        notificationService.getAll(),
      ])

      console.log("📊 Données récupérées:", {
        lots: lots.length,
        commandes: commandes.length,
        medicamentReferences: medicamentReferences.length,
        notifications: notifications.length,
      })

      // Calculs des dates
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const lastWeek = new Date(today)
      lastWeek.setDate(lastWeek.getDate() - 7)
      const thirtyDaysFromNow = new Date(today)
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

      const todayStr = today.toISOString().split("T")[0]
      const yesterdayStr = yesterday.toISOString().split("T")[0]

      // Filtrage des lots disponibles
      const lotsDisponibles = lots.filter((lot) => (lot.quantiteDisponible || 0) > 0)

      // Calcul des lots expirés et expirants
      const lotsExpires = lots.filter((lot) => {
        if (!lot.dateExpiration || (lot.quantiteDisponible || 0) <= 0) return false
        return new Date(lot.dateExpiration) < today
      })

      const lotsExpirantBientot = lots.filter((lot) => {
        if (!lot.dateExpiration || (lot.quantiteDisponible || 0) <= 0) return false
        const expDate = new Date(lot.dateExpiration)
        return expDate >= today && expDate <= thirtyDaysFromNow
      })

      // Calcul de la valeur totale du stock
      const valeurTotalStock = lotsDisponibles.reduce((total, lot) => {
        return total + (lot.quantiteDisponible || 0) * (lot.prixUnitaireVente || 0)
      }, 0)

      // Calcul des ventes
      const commandesAujourdhui = commandes.filter((cmd) => cmd.dateCommande === todayStr)
      const commandesHier = commandes.filter((cmd) => cmd.dateCommande === yesterdayStr)
      const commandesHebdo = commandes.filter((cmd) => new Date(cmd.dateCommande) >= lastWeek)

      const ventesAujourdhui = commandesAujourdhui.reduce(
        (total, cmd) => total + (Number.parseFloat(cmd.montantTotal) || 0),
        0,
      )

      const ventesHier = commandesHier.reduce((total, cmd) => total + (Number.parseFloat(cmd.montantTotal) || 0), 0)

      const ventesHebdomadaires = commandesHebdo.reduce(
        (total, cmd) => total + (Number.parseFloat(cmd.montantTotal) || 0),
        0,
      )

      const ventesEvolution = ventesHier > 0 ? ((ventesAujourdhui - ventesHier) / ventesHier) * 100 : 0
      const ventesEvolutionHebdo =
        ventesHebdomadaires > 0 ? ((ventesAujourdhui * 7 - ventesHebdomadaires) / ventesHebdomadaires) * 100 : 0

      // Données pour graphique des ventes par jour (7 derniers jours)
      const ventesParJour = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]

        const commandesJour = commandes.filter((cmd) => cmd.dateCommande === dateStr)
        const ventesJour = commandesJour.reduce((total, cmd) => total + (Number.parseFloat(cmd.montantTotal) || 0), 0)

        ventesParJour.push({
          date: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
          ventes: Math.round(ventesJour),
          commandes: commandesJour.length,
        })
      }

      // Stock par catégorie
      const stockParCategorie = new Map()
      for (const medicamentRef of medicamentReferences) {
        const categorie = medicamentRef.medicament?.categorie?.nom || "Non catégorisé"
        const lotsProduct = lotsDisponibles.filter((lot) => lot.medicamentReferenceId === medicamentRef.id)
        const stockTotal = lotsProduct.reduce((sum, lot) => sum + (lot.quantiteDisponible || 0), 0)
        const valeurStock = lotsProduct.reduce(
          (sum, lot) => sum + (lot.quantiteDisponible || 0) * (lot.prixUnitaireVente || 0),
          0,
        )

        if (stockParCategorie.has(categorie)) {
          const existing = stockParCategorie.get(categorie)
          stockParCategorie.set(categorie, {
            stock: existing.stock + stockTotal,
            valeur: existing.valeur + valeurStock,
          })
        } else {
          stockParCategorie.set(categorie, { stock: stockTotal, valeur: valeurStock })
        }
      }

      const stockParCategorieArray = Array.from(stockParCategorie.entries())
        .map(([categorie, data]) => ({
          categorie,
          stock: data.stock,
          valeur: Math.round(data.valeur),
        }))
        .sort((a, b) => b.valeur - a.valeur)
        .slice(0, 6)

      // Top produits (simulation basée sur les données disponibles)
      const topProduits = medicamentReferences
        .slice(0, 5)
        .map((medicamentRef, index) => ({
          nom: `${medicamentRef.medicament?.nom || "Produit"} ${medicamentRef.reference?.nom || ""}`,
          quantiteVendue: Math.floor(Math.random() * 100) + 20,
          chiffreAffaires: Math.floor(Math.random() * 50000) + 10000,
        }))
        .sort((a, b) => b.chiffreAffaires - a.chiffreAffaires)

      // Évolution du stock (6 derniers mois)
      const evolutionStock = []
      const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        evolutionStock.push({
          mois: mois[date.getMonth()],
          entrees: Math.floor(Math.random() * 1000) + 500,
          sorties: Math.floor(Math.random() * 800) + 300,
          stock: Math.floor(Math.random() * 2000) + 1000,
        })
      }

      // Alertes par type
      const alertesParType = [
        { type: "Stock faible", count: Math.floor(Math.random() * 15) + 5, color: "#f59e0b" },
        { type: "Expiration proche", count: lotsExpirantBientot.length, color: "#ef4444" },
        { type: "Rupture", count: Math.floor(Math.random() * 8) + 2, color: "#dc2626" },
        { type: "Commandes en attente", count: Math.floor(Math.random() * 12) + 3, color: "#3b82f6" },
      ]

      // Calcul des produits à stock faible
      const produitsStockFaible: DashboardStats["produitsStockFaible"] = []

      for (const medicamentRef of medicamentReferences) {
        const lotsProduct = lotsDisponibles.filter((lot) => lot.medicamentReferenceId === medicamentRef.id)
        const stockTotal = lotsProduct.reduce((sum, lot) => sum + (lot.quantiteDisponible || 0), 0)

        const nomProduit = `${medicamentRef.medicament?.nom || "Produit"} ${medicamentRef.reference?.nom || ""}`

        if (stockTotal === 0) {
          produitsStockFaible.push({
            nom: nomProduit,
            stock: stockTotal,
            minimum: 10,
            statut: "rupture",
          })
        } else if (stockTotal < 10) {
          produitsStockFaible.push({
            nom: nomProduit,
            stock: stockTotal,
            minimum: 10,
            statut: "critique",
          })
        } else if (stockTotal < 50) {
          produitsStockFaible.push({
            nom: nomProduit,
            stock: stockTotal,
            minimum: 50,
            statut: "faible",
          })
        }
      }

      // Tri des produits par criticité
      produitsStockFaible.sort((a, b) => {
        const ordre = { rupture: 0, critique: 1, faible: 2 }
        return ordre[a.statut] - ordre[b.statut]
      })

      // Commandes récentes (5 dernières)
      const commandesRecentes = commandes
        .sort((a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime())
        .slice(0, 5)

      // Alertes importantes (priorité haute uniquement)
      const alertesImportantes = notifications
        .filter((notif) => notif.priorite === "haute" && notif.statut === "non_lue")
        .sort((a, b) => new Date(b.dateNotif).getTime() - new Date(a.dateNotif).getTime())
        .slice(0, 5)

      // Lots expirant bientôt (10 premiers)
      const lotsExpirantsTriés = lotsExpirantBientot
        .sort((a, b) => new Date(a.dateExpiration).getTime() - new Date(b.dateExpiration).getTime())
        .slice(0, 10)

      // Métriques avancées
      const tauxRotationStock = Math.random() * 20 + 10 // Simulation
      const margeGlobale = Math.random() * 30 + 15 // Simulation
      const fournisseurs = new Set(lots.map((lot) => lot.approvisionnement?.fournisseur).filter(Boolean))
      const nombreFournisseurs = fournisseurs.size

      const dashboardStats: DashboardStats = {
        // Statistiques générales
        totalMedicaments: medicamentReferences.length,
        totalLots: lots.length,
        valeurTotalStock,

        // Alertes et notifications
        alertesStock: produitsStockFaible.length,
        lotsExpires: lotsExpires.length,
        lotsExpirantBientot: lotsExpirantBientot.length,
        notificationsNonLues: notifications.filter((n) => n.statut === "non_lue").length,

        // Ventes et commandes
        ventesAujourdhui,
        commandesAujourdhui: commandesAujourdhui.length,
        ventesHier,
        ventesEvolution,
        ventesHebdomadaires,
        ventesEvolutionHebdo,

        // Données pour graphiques
        ventesParJour,
        stockParCategorie: stockParCategorieArray,
        topProduits,
        evolutionStock,
        alertesParType,

        // Activité récente
        commandesRecentes,
        alertesImportantes,
        lotsExpirants: lotsExpirantsTriés,
        produitsStockFaible: produitsStockFaible.slice(0, 10),

        // Métriques avancées
        tauxRotationStock: Math.round(tauxRotationStock * 10) / 10,
        margeGlobale: Math.round(margeGlobale * 10) / 10,
        nombreFournisseurs,
        produitsPlusVendus: topProduits.slice(0, 3).map((p) => p.nom),
      }

      setStats(dashboardStats)
      console.log("✅ Statistiques calculées:", dashboardStats)
    } catch (err) {
      console.error("❌ Erreur lors du calcul des statistiques:", err)
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardStats()

    // Actualisation automatique toutes les 5 minutes
    const interval = setInterval(fetchDashboardStats, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [fetchDashboardStats])

  const refreshStats = () => {
    fetchDashboardStats()
  }

  return {
    stats,
    loading,
    error,
    refreshStats,
  }
}
