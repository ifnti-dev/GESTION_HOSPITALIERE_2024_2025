"use client"

import { useState, useEffect, useCallback } from "react"
import { approvisionnementService } from "@/services/pharmacie/approvisionnement.service"
import type { Approvisionnement } from "@/types/pharmacie"

export function useApprovisionnements() {
  const [approvisionnements, setApprovisionnements] = useState<Approvisionnement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger tous les approvisionnements
  const fetchApprovisionnements = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await approvisionnementService.getAll()
      setApprovisionnements(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }, [])

  // Créer un approvisionnement avec validation des relations
  const createApprovisionnement = useCallback(
    async (approvisionnement: Omit<Approvisionnement, "id">) => {
      setLoading(true)
      setError(null)
      try {
        console.log("Création approvisionnement avec données:", approvisionnement) // Debug

        // Validation des lignes avant envoi
        if (approvisionnement.lignesApprovisionnement) {
          for (const [index, ligne] of approvisionnement.lignesApprovisionnement.entries()) {
            if (!ligne.medicamentReferenceId) {
              throw new Error(`Ligne ${index + 1}: medicamentReferenceId manquant`)
            }
            console.log(`Ligne ${index + 1} - medicamentReferenceId:`, ligne.medicamentReferenceId) // Debug
          }
        }

        // Utiliser la méthode qui gère les lignes séparément
        const newApprovisionnement = await approvisionnementService.createWithLignes(approvisionnement)

        // Rafraîchir la liste des approvisionnements
        await fetchApprovisionnements()

        return newApprovisionnement
      } catch (err) {
        console.error("Erreur dans createApprovisionnement:", err)
        setError(err instanceof Error ? err.message : "Erreur lors de la création")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchApprovisionnements],
  )

  // Mettre à jour un approvisionnement
  const updateApprovisionnement = useCallback(async (id: number, approvisionnement: Partial<Approvisionnement>) => {
    setLoading(true)
    setError(null)
    try {
      console.log("Mise à jour approvisionnement avec données:", approvisionnement) // Debug

      let updatedApprovisionnement

      // Si des lignes sont fournies, utiliser updateWithLignes
      if (approvisionnement.lignesApprovisionnement && approvisionnement.lignesApprovisionnement.length > 0) {
        // Validation des lignes avant envoi
        for (const [index, ligne] of approvisionnement.lignesApprovisionnement.entries()) {
          if (!ligne.medicamentReferenceId) {
            throw new Error(`Ligne ${index + 1}: medicamentReferenceId manquant`)
          }
          console.log(`Ligne ${index + 1} - medicamentReferenceId:`, ligne.medicamentReferenceId) // Debug
        }

        updatedApprovisionnement = await approvisionnementService.updateWithLignes(id, approvisionnement)
      } else {
        // Sinon, mise à jour simple sans les lignes
        updatedApprovisionnement = await approvisionnementService.update(id, approvisionnement)
      }

      // Mettre à jour la liste locale
      setApprovisionnements((prev) => prev.map((item) => (item.id === id ? updatedApprovisionnement : item)))

      return updatedApprovisionnement
    } catch (err) {
      console.error("Erreur dans updateApprovisionnement:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Supprimer un approvisionnement
  const deleteApprovisionnement = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await approvisionnementService.delete(id)
      setApprovisionnements((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Rechercher par fournisseur
  const searchByFournisseur = useCallback(async (fournisseur: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await approvisionnementService.getByFournisseur(fournisseur)
      setApprovisionnements(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la recherche")
    } finally {
      setLoading(false)
    }
  }, [])

  // Rechercher par date
  const searchByDate = useCallback(async (date: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await approvisionnementService.getByDate(date)
      setApprovisionnements(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la recherche")
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger les données au montage du composant
  useEffect(() => {
    fetchApprovisionnements()
  }, [fetchApprovisionnements])

  return {
    approvisionnements,
    loading,
    error,
    fetchApprovisionnements,
    createApprovisionnement,
    updateApprovisionnement,
    deleteApprovisionnement,
    searchByFournisseur,
    searchByDate,
  }
}

// Hook pour un approvisionnement spécifique
export function useApprovisionnement(id: number | null) {
  const [approvisionnement, setApprovisionnement] = useState<Approvisionnement | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchApprovisionnement = useCallback(async () => {
    if (!id) return

    setLoading(true)
    setError(null)
    try {
      const data = await approvisionnementService.getById(id)
      setApprovisionnement(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchApprovisionnement()
  }, [fetchApprovisionnement])

  return {
    approvisionnement,
    loading,
    error,
    refetch: fetchApprovisionnement,
  }
}
