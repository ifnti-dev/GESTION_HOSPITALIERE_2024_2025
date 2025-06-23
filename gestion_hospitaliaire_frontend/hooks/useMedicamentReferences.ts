"use client"

import { useState, useEffect, useCallback } from "react"
import type { MedicamentReference, MedicamentReferenceSearchParams } from "@/types/pharmacie"
import { medicamentReferenceService } from "@/services/medicament-reference.service"

// Hook pour récupérer toutes les références de médicaments
export function useMedicamentReferences() {
  const [medicamentReferences, setMedicamentReferences] = useState<MedicamentReference[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMedicamentReferences = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await medicamentReferenceService.getAllMedicamentReferences()
      setMedicamentReferences(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des références de médicaments")
      console.error("Error fetching medicament references:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMedicamentReferences()
  }, [fetchMedicamentReferences])

  return {
    medicamentReferences,
    loading,
    error,
    refetch: fetchMedicamentReferences,
  }
}

// Hook pour récupérer une référence de médicament par ID
export function useMedicamentReference(id: number | null) {
  const [medicamentReference, setMedicamentReference] = useState<MedicamentReference | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchMedicamentReference = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await medicamentReferenceService.getMedicamentReferenceById(id)
        setMedicamentReference(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement de la référence de médicament")
        console.error("Error fetching medicament reference:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicamentReference()
  }, [id])

  return {
    medicamentReference,
    loading,
    error,
  }
}

// Hook pour la recherche de références de médicaments
export function useMedicamentReferenceSearch() {
  const [medicamentReferences, setMedicamentReferences] = useState<MedicamentReference[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (params: MedicamentReferenceSearchParams) => {
    try {
      setLoading(true)
      setError(null)
      const data = await medicamentReferenceService.searchMedicamentReferences(params)
      setMedicamentReferences(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la recherche")
      console.error("Error searching medicament references:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearSearch = useCallback(() => {
    setMedicamentReferences([])
    setError(null)
  }, [])

  return {
    medicamentReferences,
    loading,
    error,
    search,
    clearSearch,
  }
}

// Hook pour les mutations (CRUD)
export function useMedicamentReferenceMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createMedicamentReference = useCallback(async (medicamentReference: Omit<MedicamentReference, "id">) => {
    try {
      setLoading(true)
      setError(null)
      const newMedicamentReference = await medicamentReferenceService.createMedicamentReference(medicamentReference)
      return newMedicamentReference
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la création"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateMedicamentReference = useCallback(
    async (id: number, medicamentReference: Partial<MedicamentReference>) => {
      try {
        setLoading(true)
        setError(null)
        const updatedMedicamentReference = await medicamentReferenceService.updateMedicamentReference(
          id,
          medicamentReference,
        )
        return updatedMedicamentReference
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erreur lors de la modification"
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const deleteMedicamentReference = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await medicamentReferenceService.deleteMedicamentReference(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la suppression"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createMedicamentReference,
    updateMedicamentReference,
    deleteMedicamentReference,
    loading,
    error,
  }
}
