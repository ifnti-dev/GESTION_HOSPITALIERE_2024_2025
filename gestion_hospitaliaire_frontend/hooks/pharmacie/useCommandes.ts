"use client"

import { useState, useEffect, useCallback } from "react"
import { commandeService } from "@/services/pharmacie/commande.service"
import type { Commande } from "@/types/pharmacie"

export function useCommandes() {
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCommandes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await commandeService.getAll()
      setCommandes(data)
    } catch (err) {
      setError("Échec du chargement des commandes.")
      console.error("Error in useCommandes fetchCommandes:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCommandes()
  }, [fetchCommandes])

  const createCommande = useCallback(async (commande: Omit<Commande, "id">) => {
    setLoading(true)
    try {
      const newCommande = await commandeService.create(commande)
      setCommandes((prev) => [...prev, newCommande])
      return newCommande
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Échec de la création de la commande."
      setError(errorMessage)
      console.error("Error in useCommandes createCommande:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCommande = useCallback(async (id: number, commande: Partial<Commande>) => {
    setLoading(true)
    try {
      const updatedCommande = await commandeService.update(id, commande)
      setCommandes((prev) => prev.map((c) => (c.id === id ? updatedCommande : c)))
      return updatedCommande
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Échec de la mise à jour de la commande."
      setError(errorMessage)
      console.error("Error in useCommandes updateCommande:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteCommande = useCallback(async (id: number) => {
    setLoading(true)
    try {
      await commandeService.delete(id)
      setCommandes((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Échec de la suppression de la commande."
      setError(errorMessage)
      console.error("Error in useCommandes deleteCommande:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    commandes,
    loading,
    error,
    createCommande,
    updateCommande,
    deleteCommande,
    refetch: fetchCommandes,
  }
}
