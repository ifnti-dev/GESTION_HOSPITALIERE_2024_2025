"use client"

import { useState, useEffect, useCallback } from "react"
import type { Medicament, MedicamentSearchParams } from "@/types/pharmacie"
import { medicamentService } from "../services/medicament.service"
import { useDebounce } from "./useDebounce"

// Hook pour récupérer tous les médicaments
export function useMedicaments() {
  const [medicaments, setMedicaments] = useState<Medicament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMedicaments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await medicamentService.getAllMedicaments()
      setMedicaments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des médicaments")
      console.error("Error fetching medicaments:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMedicaments()
  }, [fetchMedicaments])

  return {
    medicaments,
    loading,
    error,
    refetch: fetchMedicaments,
  }
}

// Hook pour récupérer un médicament par ID
export function useMedicament(id: number | null) {
  const [medicament, setMedicament] = useState<Medicament | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchMedicament = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await medicamentService.getMedicamentById(id)
        setMedicament(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement du médicament")
        console.error("Error fetching medicament:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicament()
  }, [id])

  return {
    medicament,
    loading,
    error,
  }
}

// Hook pour la recherche de médicaments avec debounce
export function useMedicamentSearch() {
  const [searchParams, setSearchParams] = useState<MedicamentSearchParams>({})
  const [medicaments, setMedicaments] = useState<Medicament[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce des paramètres de recherche
  const debouncedSearchParams = useDebounce(searchParams, 300)

  const search = useCallback(async (params: MedicamentSearchParams) => {
    try {
      setLoading(true)
      setError(null)
      const data = await medicamentService.searchMedicaments(params)
      setMedicaments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la recherche")
      console.error("Error searching medicaments:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (Object.keys(debouncedSearchParams).length > 0) {
      search(debouncedSearchParams)
    }
  }, [debouncedSearchParams, search])

  return {
    medicaments,
    loading,
    error,
    search: (params: MedicamentSearchParams) => setSearchParams(params),
    clearSearch: () => {
      setSearchParams({})
      setMedicaments([])
    },
  }
}

// Hook pour les mutations (CRUD)
export function useMedicamentMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createMedicament = useCallback(async (medicament: Omit<Medicament, "id">) => {
    try {
      setLoading(true)
      setError(null)
      const newMedicament = await medicamentService.createMedicament(medicament)
      return newMedicament
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la création"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateMedicament = useCallback(async (id: number, medicament: Partial<Medicament>) => {
    try {
      setLoading(true)
      setError(null)
      const updatedMedicament = await medicamentService.updateMedicament(id, medicament)
      return updatedMedicament
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la modification"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteMedicament = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await medicamentService.deleteMedicament(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la suppression"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createMedicament,
    updateMedicament,
    deleteMedicament,
    loading,
    error,
  }
}

// Hook pour les médicaments en stock faible
export function useLowStockMedicaments(seuil = 10) {
  const [medicaments, setMedicaments] = useState<Medicament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLowStockMedicaments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await medicamentService.getMedicamentsLowStock(seuil)
      setMedicaments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement")
      console.error("Error fetching low stock medicaments:", err)
    } finally {
      setLoading(false)
    }
  }, [seuil])

  useEffect(() => {
    fetchLowStockMedicaments()
  }, [fetchLowStockMedicaments])

  return {
    medicaments,
    loading,
    error,
    refetch: fetchLowStockMedicaments,
  }
}
