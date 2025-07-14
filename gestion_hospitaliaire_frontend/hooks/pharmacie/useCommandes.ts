"use client"

import { useState, useEffect, useCallback } from "react"
import type { Commande, CommandeSearchParams } from "@/types/pharmacie"
import { commandeService } from "@/services/pharmacie/commande.service"
import { ligneCommandeService } from "@/services/pharmacie/ligne-commande.service"

export function useCommandes() {
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCommandes = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("Chargement des commandes...")
      const data = await commandeService.getAll()
      console.log("Commandes chargées:", data)
      setCommandes(data)
    } catch (err) {
      console.error("Erreur lors du chargement des commandes:", err)
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des commandes")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCommandes()
  }, [fetchCommandes])

  const createCommande = useCallback(async (commandeData: Omit<Commande, "id">) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Création d'une commande:", commandeData)
      const newCommande = await commandeService.create(commandeData)
      console.log("Commande créée:", newCommande)

      // Mise à jour de l'état local
      setCommandes((prev) => [...prev, newCommande])

      return newCommande
    } catch (err) {
      console.error("Erreur lors de la création de la commande:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de la création de la commande")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCommande = useCallback(async (id: number, commandeData: Partial<Commande>) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Mise à jour de la commande:", id, commandeData)
      const updatedCommande = await commandeService.update(id, commandeData)
      console.log("Commande mise à jour:", updatedCommande)

      // Mise à jour de l'état local
      setCommandes((prev) => prev.map((commande) => (commande.id === id ? updatedCommande : commande)))

      return updatedCommande
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la commande:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour de la commande")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteCommande = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Suppression de la commande:", id)

      // Supprimer d'abord toutes les lignes de commande
      await ligneCommandeService.deleteByCommandeId(id)

      // Puis supprimer la commande
      await commandeService.delete(id)
      console.log("Commande supprimée avec succès")

      // Mise à jour de l'état local
      setCommandes((prev) => prev.filter((commande) => commande.id !== id))
    } catch (err) {
      console.error("Erreur lors de la suppression de la commande:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression de la commande")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const searchCommandes = useCallback(async (params: CommandeSearchParams) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Recherche de commandes:", params)
      const data = await commandeService.search(params)
      console.log("Résultats de recherche:", data)
      setCommandes(data)
    } catch (err) {
      console.error("Erreur lors de la recherche:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de la recherche")
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(() => {
    return fetchCommandes()
  }, [fetchCommandes])

  return {
    commandes,
    loading,
    error,
    createCommande,
    updateCommande,
    deleteCommande,
    searchCommandes,
    refetch,
  }
}
