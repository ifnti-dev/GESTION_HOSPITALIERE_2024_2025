"use client"

import { useState, useEffect, useCallback } from "react"
import type { Reference, ReferenceSearchParams } from "@/types/pharmacie"
import { referenceService } from "@/services/reference.service"
import { useDebounce } from "./useDebounce"

// Hook pour récupérer toutes les références
export function useReferences() {
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReferences = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await referenceService.getAllReferences()
      setReferences(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des références")
      console.error("Error fetching references:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReferences()
  }, [fetchReferences])

  return {
    references,
    loading,
    error,
    refetch: fetchReferences,
  }
}

// Hook pour récupérer une référence par ID
export function useReference(id: number | null) {
  const [reference, setReference] = useState<Reference | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchReference = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await referenceService.getReferenceById(id)
        setReference(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement de la référence")
        console.error("Error fetching reference:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchReference()
  }, [id])

  return {
    reference,
    loading,
    error,
  }
}

// Hook pour la recherche de références avec debounce
export function useReferenceSearch() {
  const [searchParams, setSearchParams] = useState<ReferenceSearchParams>({})
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce des paramètres de recherche
  const debouncedSearchParams = useDebounce(searchParams, 300)

  const search = useCallback(async (params: ReferenceSearchParams) => {
    try {
      setLoading(true)
      setError(null)
      const data = await referenceService.searchReferences(params)
      setReferences(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la recherche")
      console.error("Error searching references:", err)
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
    references,
    loading,
    error,
    search: (params: ReferenceSearchParams) => setSearchParams(params),
    clearSearch: () => {
      setSearchParams({})
      setReferences([])
    },
  }
}

// Hook pour les mutations (CRUD)
export function useReferenceMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createReference = useCallback(async (reference: Omit<Reference, "id">) => {
    try {
      setLoading(true)
      setError(null)
      const newReference = await referenceService.createReference(reference)
      return newReference
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la création"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateReference = useCallback(async (id: number, reference: Partial<Reference>) => {
    try {
      setLoading(true)
      setError(null)
      const updatedReference = await referenceService.updateReference(id, reference)
      return updatedReference
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la modification"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteReference = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await referenceService.deleteReference(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la suppression"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createReference,
    updateReference,
    deleteReference,
    loading,
    error,
  }
}
