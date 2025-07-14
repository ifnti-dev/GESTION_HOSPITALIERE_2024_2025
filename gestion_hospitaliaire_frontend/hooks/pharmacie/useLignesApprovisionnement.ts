"use client"

import { useState, useEffect, useCallback } from "react"
import { ligneApprovisionnementService } from "@/services/pharmacie/ligne-approvisionnement.service"
import type { LigneApprovisionnement } from "@/types/pharmacie"

export function useLignesApprovisionnement(approvisionnementId?: number | null) {
  const [lignes, setLignes] = useState<LigneApprovisionnement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger toutes les lignes d'approvisionnement
  const fetchLignes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await ligneApprovisionnementService.getAll()
      setLignes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger les lignes par approvisionnement
  const fetchByApprovisionnementId = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await ligneApprovisionnementService.getByApprovisionnementId(id)
      setLignes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la recherche")
    } finally {
      setLoading(false)
    }
  }, [])

  // Créer une ligne d'approvisionnement
  const createLigne = useCallback(async (ligne: Omit<LigneApprovisionnement, "id">) => {
    setLoading(true)
    setError(null)
    try {
      const newLigne = await ligneApprovisionnementService.create(ligne)
      setLignes((prev) => [...prev, newLigne])
      return newLigne
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Mettre à jour une ligne d'approvisionnement
  const updateLigne = useCallback(async (id: number, ligne: Partial<LigneApprovisionnement>) => {
    setLoading(true)
    setError(null)
    try {
      const updatedLigne = await ligneApprovisionnementService.update(id, ligne)
      setLignes((prev) => prev.map((item) => (item.id === id ? updatedLigne : item)))
      return updatedLigne
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Supprimer une ligne d'approvisionnement
  const deleteLigne = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await ligneApprovisionnementService.delete(id)
      setLignes((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger les lignes expirant avant une date
  const fetchExpiringBefore = useCallback(async (date: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await ligneApprovisionnementService.getByDateExpirationBefore(date)
      setLignes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la recherche")
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger automatiquement les lignes si un ID d'approvisionnement est fourni
  useEffect(() => {
    if (approvisionnementId) {
      fetchByApprovisionnementId(approvisionnementId)
    } else {
      setLignes([])
    }
  }, [approvisionnementId, fetchByApprovisionnementId])

  return {
    lignes,
    loading,
    error,
    fetchLignes,
    createLigne,
    updateLigne,
    deleteLigne,
    fetchByApprovisionnementId,
    fetchExpiringBefore,
  }
}

// Hook pour une ligne d'approvisionnement spécifique
export function useLigneApprovisionnement(id: number | null) {
  const [ligne, setLigne] = useState<LigneApprovisionnement | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLigne = useCallback(async () => {
    if (!id) return

    setLoading(true)
    setError(null)
    try {
      const data = await ligneApprovisionnementService.getById(id)
      setLigne(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchLigne()
  }, [fetchLigne])

  return {
    ligne,
    loading,
    error,
    refetch: fetchLigne,
  }
}
