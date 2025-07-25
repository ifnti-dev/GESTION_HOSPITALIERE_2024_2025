"use client"

import { useState, useEffect } from "react"
import { ligneCommandeService } from "@/services/pharmacie/ligne-commande.service"
import { ligneApprovisionnementService } from "@/services/pharmacie/ligne-approvisionnement.service"
import type { LigneCommande, LigneApprovisionnement } from "@/types/pharmacie"

export function useLignesCommande(commandeId?: number) {
  const [lignes, setLignes] = useState<LigneCommande[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLignes = async () => {
    if (!commandeId) {
      setLignes([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      console.log("Récupération des lignes de commande pour commandeId:", commandeId)
      const lignesData = await ligneCommandeService.getByCommandeId(commandeId)
      console.log("Lignes récupérées:", lignesData)

      // Enrichir chaque ligne avec les détails du lot et du medicamentReference
      const lignesEnrichies = await Promise.all(
        lignesData.map(async (ligne) => {
          if (ligne.ligneApprovisionnementId) {
            try {
              console.log("Récupération du lot pour ligneApprovisionnementId:", ligne.ligneApprovisionnementId)
              const lot = await ligneApprovisionnementService.getById(ligne.ligneApprovisionnementId)
              console.log("Lot récupéré:", lot)
              return {
                ...ligne,
                ligneApprovisionnement: lot,
              }
            } catch (error) {
              console.error(`Erreur lors de la récupération du lot ${ligne.ligneApprovisionnementId}:`, error)
              return ligne
            }
          }
          return ligne
        }),
      )

      console.log("Lignes enrichies avec les lots:", lignesEnrichies)
      setLignes(lignesEnrichies)
    } catch (err) {
      console.error("Erreur lors de la récupération des lignes de commande:", err)
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchLignes()
  }

  useEffect(() => {
    fetchLignes()
  }, [commandeId])

  return {
    lignes,
    loading,
    error,
    refetch,
  }
}

export function useLotsDisponibles() {
  const [lots, setLots] = useState<LigneApprovisionnement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLots = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Récupération des lots disponibles...")
      const lotsData = await ligneApprovisionnementService.getAll()
      console.log("Tous les lots récupérés:", lotsData)

      // Filtrer les lots disponibles (quantité > 0) et enrichir avec les détails
      const lotsDisponibles = lotsData
        .filter((lot) => (lot.quantiteDisponible || 0) > 0)
        .map((lot) => ({
          ...lot,
          // S'assurer que les relations sont bien présentes
          medicamentReference: lot.medicamentReference || null,
        }))

      console.log("Lots disponibles filtrés:", lotsDisponibles)
      setLots(lotsDisponibles)
    } catch (err) {
      console.error("Erreur lors de la récupération des lots disponibles:", err)
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchLots()
  }

  useEffect(() => {
    fetchLots()
  }, [])

  return {
    lots,
    loading,
    error,
    refetch,
  }
}
