"use client"

import { useCallback, useEffect, useState } from "react"
import {
  getAllPersonnes,
  getPersonnes,
  getPersonneById,
  addPersonne,
  updatePersonne,
  deletePersonne,
  searchPersonnesByNom,
  searchPersonnesByEmail,
  getEmployesOnly,
  getPatientsOnly,
  getPersonneStats,
  searchPersonnes,
} from "@/services/utilisateur/personne.service"
import type {
  Personne,
  PersonneFormData,
  PersonneResponse,
  PersonneStats,
  PersonneSearchParams,
} from "@/types/utilisateur"
import { toast } from "@/hooks/use-toast"

export function usePersonne() {
  const [personnes, setPersonnes] = useState<Personne[]>([])
  const [paginatedData, setPaginatedData] = useState<PersonneResponse | null>(null)
  const [stats, setStats] = useState<PersonneStats | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Charger toutes les personnes (sans pagination)
  const fetchAllPersonnes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllPersonnes()
      setPersonnes(data)
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors du chargement des personnes"
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger les personnes avec pagination
  const fetchPersonnes = useCallback(async (page = 0, size = 10) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPersonnes(page, size)
      setPaginatedData(data)
      setPersonnes(data.content)
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors du chargement des personnes"
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger les statistiques
  const fetchStats = useCallback(async () => {
    try {
      const data = await getPersonneStats()
      setStats(data)
    } catch (err: any) {
      console.error("Erreur lors du chargement des statistiques:", err)
    }
  }, [])

  // Ajouter une personne
  const createPersonne = useCallback(async (personne: PersonneFormData) => {
    setLoading(true)
    setError(null)
    try {
      const newPersonne = await addPersonne(personne)
      setPersonnes((prev) => [...prev, newPersonne])
      toast({
        title: "Succès",
        description: "Personne ajoutée avec succès",
      })
      return newPersonne
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de l'ajout de la personne"
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Mettre à jour une personne
  const editPersonne = useCallback(async (id: number, personne: PersonneFormData) => {
    setLoading(true)
    setError(null)
    try {
      const updated = await updatePersonne(id, personne)
      setPersonnes((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      toast({
        title: "Succès",
        description: "Personne modifiée avec succès",
      })
      return updated
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la modification"
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Supprimer une personne
  const removePersonne = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await deletePersonne(id)
      setPersonnes((prev) => prev.filter((p) => p.id !== id))
      toast({
        title: "Succès",
        description: "Personne supprimée avec succès",
      })
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la suppression"
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Recherche avancée
  const searchPersonnesAdvanced = useCallback(async (params: PersonneSearchParams) => {
    setLoading(true)
    setError(null)
    try {
      const data = await searchPersonnes(params)
      setPaginatedData(data)
      setPersonnes(data.content)
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la recherche"
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Rechercher par nom
  const searchByNom = useCallback(async (nom: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await searchPersonnesByNom(nom)
      setPersonnes(data)
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la recherche"
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Rechercher par email
  const searchByEmail = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await searchPersonnesByEmail(email)
      setPersonnes(data)
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la recherche"
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Récupérer une personne par ID
  const fetchPersonneById = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      return await getPersonneById(id)
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la récupération"
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger seulement les employés
  const fetchEmployesOnly = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getEmployesOnly()
      setPersonnes(data)
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors du chargement des employés"
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger seulement les patients
  const fetchPatientsOnly = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPatientsOnly()
      setPersonnes(data)
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors du chargement des patients"
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllPersonnes()
    fetchStats()
  }, [fetchAllPersonnes, fetchStats])

  return {
    personnes,
    paginatedData,
    stats,
    loading,
    error,
    fetchAllPersonnes,
    fetchPersonnes,
    fetchStats,
    fetchPersonneById,
    createPersonne,
    editPersonne,
    removePersonne,
    searchByNom,
    searchByEmail,
    searchPersonnesAdvanced,
    fetchEmployesOnly,
    fetchPatientsOnly,
  }
}
