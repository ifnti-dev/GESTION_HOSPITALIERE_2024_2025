"use client"

import { useState, useEffect, useCallback } from "react"
import { ligneCommandeService } from "@/services/pharmacie/ligne-commande.service"
import { ligneApprovisionnementService } from "@/services/pharmacie/ligne-approvisionnement.service"
import type { LigneCommande, LigneApprovisionnement } from "@/types/pharmacie"

export function useLignesCommande(commandeId?: number) {
  const [lignes, setLignes] = useState<LigneCommande[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLignes = useCallback(async () => {
    if (!commandeId) {
      setLignes([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await ligneCommandeService.getByCommandeId(commandeId)
      setLignes(data)
    } catch (err) {
      setError("Échec du chargement des lignes de commande.")
      console.error("Error in useLignesCommande fetchLignes:", err)
    } finally {
      setLoading(false)
    }
  }, [commandeId])

  useEffect(() => {
    fetchLignes()
  }, [fetchLignes])

  const createLigneCommande = useCallback(async (ligne: Omit<LigneCommande, "id">) => {
    setLoading(true)
    try {
      // Corrected: Call the specific createLigneCommande method
      const newLigne = await ligneCommandeService.createLigneCommande(ligne)
      setLignes((prev) => [...prev, newLigne])
      return newLigne
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Échec de la création de la ligne de commande."
      setError(errorMessage)
      console.error("Error in useLignesCommande createLigneCommande:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateLigneCommande = useCallback(async (id: number, ligne: Partial<LigneCommande>) => {
    setLoading(true)
    try {
      const updatedLigne = await ligneCommandeService.update(id, ligne)
      setLignes((prev) => prev.map((l) => (l.id === id ? updatedLigne : l)))
      return updatedLigne
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Échec de la mise à jour de la ligne de commande."
      setError(errorMessage)
      console.error("Error in useLignesCommande updateLigneCommande:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteLigneCommande = useCallback(async (id: number) => {
    setLoading(true)
    try {
      await ligneCommandeService.delete(id)
      setLignes((prev) => prev.filter((l) => l.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Échec de la suppression de la ligne de commande."
      setError(errorMessage)
      console.error("Error in useLignesCommande deleteLigneCommande:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    lignes,
    loading,
    error,
    createLigneCommande,
    updateLigneCommande,
    deleteLigneCommande,
    refetch: fetchLignes,
  }
}

export function useLotsDisponibles() {
  const [lots, setLots] = useState<LigneApprovisionnement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLots = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Use the service method that fetches available lots, which should include medicamentReference
      const data = await ligneApprovisionnementService.getAvailableLots()
      setLots(data)
      console.log("Fetched available lots for dropdown:", data)
    } catch (err) {
      setError("Échec du chargement des lots disponibles.")
      console.error("Error in useLotsDisponibles fetchLots:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLots()
  }, [fetchLots])

  return {
    lots,
    loading,
    error,
    refetch: fetchLots,
  }
}
