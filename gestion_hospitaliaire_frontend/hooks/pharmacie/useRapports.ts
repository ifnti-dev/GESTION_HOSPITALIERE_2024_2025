"use client"

import { useState, useEffect } from "react"
import { ligneApprovisionnementService } from "@/services/pharmacie/ligne-approvisionnement.service"
import { commandeService } from "@/services/pharmacie/commande.service"
import { medicamentReferenceService } from "@/services/pharmacie/medicament-reference.service"
import type { LigneApprovisionnement, Commande, MedicamentReference } from "@/types/pharmacie"

// Fonction de formatage des prix spécifique pour les PDFs (sans les "/")
const formatPriceForPDF = (price: number): string => {
  return (
    new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + " FCFA"
  )
}

export interface StockStats {
  totalLots: number
  lotsDisponibles: number
  lotsExpires: number
  lotsExpirantBientot: number
  stockFaible: number
  valeurTotaleStock: number
}

export interface VenteStats {
  totalCommandes: number
  montantTotal: number
  commandesAujourdhui: number
  commandesMois: number
  moyenneCommande: number
  commandesAnnulees?: number
  montantAnnule?: number
}

export interface RapportData {
  stockStats: StockStats
  venteStats: VenteStats
  lotsDisponibles: LigneApprovisionnement[]
  lotsExpires: LigneApprovisionnement[]
  lotsExpirants: LigneApprovisionnement[]
  commandesRecentes: Commande[]
  commandesAnnulees: Commande[]
  produitsActifs: MedicamentReference[]
}

export const useRapports = () => {
  const [data, setData] = useState<RapportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRapportData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Récupération des données de rapport...")

      // Récupération de toutes les lignes d'approvisionnement
      const allLots = await ligneApprovisionnementService.getAll()
      console.log("📦 Tous les lots récupérés:", allLots.length)

      // Filtrage des lots disponibles (quantité > 0)
      const availableLots = allLots.filter((lot) => (lot.quantiteDisponible || 0) > 0)
      console.log("✅ Lots disponibles:", availableLots.length)

      // Filtrage des lots expirés
      const today = new Date()
      const expiredLots = allLots.filter((lot) => {
        if (!lot.dateExpiration) return false
        const expirationDate = new Date(lot.dateExpiration)
        return expirationDate < today
      })
      console.log("❌ Lots expirés:", expiredLots.length)

      // Filtrage des lots expirant dans les 30 prochains jours
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

      const expiringSoonLots = allLots.filter((lot) => {
        if (!lot.dateExpiration) return false
        const expirationDate = new Date(lot.dateExpiration)
        return expirationDate >= today && expirationDate <= thirtyDaysFromNow && (lot.quantiteDisponible || 0) > 0
      })
      console.log("⚠️ Lots expirant bientôt:", expiringSoonLots.length)

      // Récupération des commandes
      const allCommandes = await commandeService.getAll()
      console.log("🛒 Commandes récupérées:", allCommandes.length)

      // Séparation des commandes par statut
      const commandesValides = allCommandes.filter((cmd) => cmd.statut !== "ANNULEE")
      const commandesAnnulees = allCommandes.filter((cmd) => cmd.statut === "ANNULEE")

      console.log("✅ Commandes valides:", commandesValides.length)
      console.log("❌ Commandes annulées:", commandesAnnulees.length)

      // Récupération des produits - utiliser la méthode correcte
      const allProduits = await medicamentReferenceService.getAllMedicamentReferences()
      console.log("💊 Produits récupérés:", allProduits.length)

      // Calcul des statistiques de stock
      const stockFaible = availableLots.filter((lot) => (lot.quantiteDisponible || 0) < 10).length
      const valeurTotaleStock = availableLots.reduce((total, lot) => {
        return total + (lot.quantiteDisponible || 0) * (lot.prixUnitaireVente || 0)
      }, 0)

      const stockStats: StockStats = {
        totalLots: allLots.length,
        lotsDisponibles: availableLots.length,
        lotsExpires: expiredLots.length,
        lotsExpirantBientot: expiringSoonLots.length,
        stockFaible,
        valeurTotaleStock,
      }

      // Calcul des statistiques de vente
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())

      const commandesAujourdhui = commandesValides.filter((cmd) => {
        const cmdDate = new Date(cmd.dateCommande)
        return cmdDate >= startOfDay
      }).length

      const commandesMois = commandesValides.filter((cmd) => {
        const cmdDate = new Date(cmd.dateCommande)
        return cmdDate >= startOfMonth
      }).length

      const montantTotal = commandesValides.reduce((total, cmd) => {
        return total + (Number.parseFloat(cmd.montantTotal?.toString() || "0") || 0)
      }, 0)

      const montantAnnule = commandesAnnulees.reduce((total, cmd) => {
        return total + (Number.parseFloat(cmd.montantTotal?.toString() || "0") || 0)
      }, 0)

      const moyenneCommande = commandesValides.length > 0 ? montantTotal / commandesValides.length : 0

      const venteStats: VenteStats = {
        totalCommandes: commandesValides.length,
        montantTotal,
        commandesAujourdhui,
        commandesMois,
        moyenneCommande,
        commandesAnnulees: commandesAnnulees.length,
        montantAnnule,
      }

      // Commandes récentes (30 derniers jours) - toutes les commandes
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const commandesRecentes = allCommandes
        .filter((cmd) => new Date(cmd.dateCommande) >= thirtyDaysAgo)
        .sort((a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime())
        .slice(0, 10)

      const rapportData: RapportData = {
        stockStats,
        venteStats,
        lotsDisponibles: availableLots,
        lotsExpires: expiredLots,
        lotsExpirants: expiringSoonLots,
        commandesRecentes,
        commandesAnnulees,
        produitsActifs: allProduits,
      }

      setData(rapportData)
      console.log("✅ Données de rapport calculées:", rapportData)
    } catch (err) {
      console.error("❌ Erreur lors de la récupération des données de rapport:", err)
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRapportData()
  }, [])

  const refreshData = () => {
    fetchRapportData()
  }

  return {
    data,
    loading,
    error,
    refreshData,
  }
}
