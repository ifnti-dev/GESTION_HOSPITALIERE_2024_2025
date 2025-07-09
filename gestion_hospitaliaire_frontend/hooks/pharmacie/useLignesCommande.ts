"use client"

import { useState, useEffect, useCallback } from "react"
import type { LigneCommande } from "@/types/pharmacie"
import { ligneCommandeService } from "@/services/pharmacie/ligne-commande.service"

export function useLignesCommande(commandeId?: number) {
  const [lignes, setLignes] = useState<LigneCommande[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLignes = useCallback(async () => {
    if (!commandeId) {
      setLignes([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("Chargement des lignes pour commande:", commandeId)
      const data = await ligneCommandeService.getByCommandeId(commandeId)
      console.log("Lignes chargées:", data)
      setLignes(data || [])
    } catch (err) {
      console.error("Erreur lors du chargement des lignes:", err)
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des lignes")
      setLignes([])
    } finally {
      setLoading(false)
    }
  }, [commandeId])

  useEffect(() => {
    fetchLignes()
  }, [fetchLignes])

  const createLigne = useCallback(async (ligneData: Omit<LigneCommande, "id">) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Création d'une ligne de commande:", ligneData)
      const newLigne = await ligneCommandeService.create(ligneData)
      console.log("Ligne créée:", newLigne)

      // Mise à jour de l'état local
      setLignes((prev) => [...prev, newLigne])

      return newLigne
    } catch (err) {
      console.error("Erreur lors de la création de la ligne:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de la création de la ligne")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createFifoLigne = useCallback(async (commandeId: number, medicamentReferenceId: number, quantite: number) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Création FIFO d'une ligne de commande:", { commandeId, medicamentReferenceId, quantite })
      const newLigne = await ligneCommandeService.createFifoLigneCommande(commandeId, medicamentReferenceId, quantite)
      console.log("Ligne FIFO créée:", newLigne)

      // Mise à jour de l'état local
      setLignes((prev) => [...prev, newLigne])

      return newLigne
    } catch (err) {
      console.error("Erreur lors de la création FIFO de la ligne:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de la création FIFO de la ligne")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateLigne = useCallback(async (id: number, ligneData: Partial<LigneCommande>) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Mise à jour de la ligne:", id, ligneData)
      const updatedLigne = await ligneCommandeService.update(id, ligneData)
      console.log("Ligne mise à jour:", updatedLigne)

      // Mise à jour de l'état local
      setLignes((prev) => prev.map((ligne) => (ligne.id === id ? updatedLigne : ligne)))

      return updatedLigne
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la ligne:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour de la ligne")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteLigne = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Suppression de la ligne:", id)
      await ligneCommandeService.delete(id)
      console.log("Ligne supprimée avec succès")

      // Mise à jour de l'état local
      setLignes((prev) => prev.filter((ligne) => ligne.id !== id))
    } catch (err) {
      console.error("Erreur lors de la suppression de la ligne:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression de la ligne")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Fonction de rechargement exposée
  const refetch = useCallback(() => {
    return fetchLignes()
  }, [fetchLignes])

  return {
    lignes,
    loading,
    error,
    createLigne,
    createFifoLigne,
    updateLigne,
    deleteLigne,
    refetch,
    refetchLignes: refetch, // Alias pour compatibilité
  }
}
