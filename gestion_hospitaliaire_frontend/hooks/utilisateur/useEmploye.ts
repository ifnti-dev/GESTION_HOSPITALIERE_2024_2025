"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getAllEmployes,
  getEmployes,
  getEmployeById,
  addEmploye,
  updateEmploye,
  deleteEmploye,
  addRoleToEmploye,
  removeRoleFromEmploye,
  assignPersonToEmploye,
  searchEmployesBySpecialite,
  searchEmployesByStatut,
  getEmployeStats,
  searchEmployesByRole,
  searchEmployesByPersonne,
} from "@/services/utilisateur/employe.service"
import type { Employe, EmployeFormData, EmployeResponse, EmployeStats } from "@/types/utilisateur"
import { toast } from "@/hooks/use-toast"

export function useEmploye() {
  const [employes, setEmployes] = useState<Employe[]>([])
  const [paginatedData, setPaginatedData] = useState<EmployeResponse | null>(null)
  const [stats, setStats] = useState<EmployeStats | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedEmploye, setSelectedEmploye] = useState<Employe | null>(null)

  // Charger tous les employés (sans pagination)
  const fetchAllEmployes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllEmployes()
      setEmployes(data)
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

  // Charger les employés avec pagination
  const fetchEmployes = useCallback(async (page = 0, size = 10) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getEmployes(page, size)
      setPaginatedData(data)
      setEmployes(data.content)
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

  // Charger les statistiques
  const fetchStats = useCallback(async () => {
    try {
      const data = await getEmployeStats()
      setStats(data)
    } catch (err: any) {
      console.error("Erreur lors du chargement des statistiques:", err)
    }
  }, [])

  // Créer un employé
  const createEmploye = useCallback(async (employe: EmployeFormData) => {
    setLoading(true)
    setError(null)
    try {
      const newEmploye = await addEmploye(employe)
      setEmployes((prev) => [...prev, newEmploye])
      toast({
        title: "Succès",
        description: "Employé ajouté avec succès",
      })
      return newEmploye
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de l'ajout de l'employé"
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

  // Modifier un employé
  const editEmploye = useCallback(async (id: number, employe: EmployeFormData) => {
    setLoading(true)
    setError(null)
    try {
      const updated = await updateEmploye(id, employe)
      setEmployes((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
      toast({
        title: "Succès",
        description: "Employé modifié avec succès",
      })
      return updated
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la modification de l'employé"
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

  // Supprimer un employé
  const removeEmploye = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await deleteEmploye(id)
      setEmployes((prev) => prev.filter((e) => e.id !== id))
      toast({
        title: "Succès",
        description: "Employé supprimé avec succès",
      })
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la suppression de l'employé"
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

  // Rechercher par spécialité
  const searchBySpecialite = useCallback(async (specialite: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await searchEmployesBySpecialite(specialite)
      setEmployes(data)
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

  // Rechercher par statut
  const searchByStatut = useCallback(async (statut: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await searchEmployesByStatut(statut)
      setEmployes(data)
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

  // Ajouter un rôle
  const addRole = useCallback(async (employeId: number, roleId: number) => {
    try {
      const updated = await addRoleToEmploye(employeId, roleId)
      setEmployes((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
      toast({
        title: "Succès",
        description: "Rôle ajouté avec succès",
      })
      return updated
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de l'ajout du rôle"
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }, [])

  // Retirer un rôle
  const removeRole = useCallback(async (employeId: number, roleId: number) => {
    try {
      const updated = await removeRoleFromEmploye(employeId, roleId)
      setEmployes((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
      toast({
        title: "Succès",
        description: "Rôle retiré avec succès",
      })
      return updated
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la suppression du rôle"
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }, [])

  // Affecter une personne
  const assignPerson = useCallback(async (employeId: number, personneId: number) => {
    try {
      const updated = await assignPersonToEmploye(employeId, personneId)
      setEmployes((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
      toast({
        title: "Succès",
        description: "Personne affectée avec succès",
      })
      return updated
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de l'affectation"
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }, [])

  const fetchEmployeById = async (id: number) => {
    try {
      const employe = await getEmployeById(id)
      setSelectedEmploye(employe)
    } catch (error) {
      console.error("Erreur lors de la récupération de l'employé :", error)
    }
  }

  const searchByRole = async (roleId: number) => {
    try {
      const result = await searchEmployesByRole(roleId)
      setEmployes(result)
    } catch (error) {
      console.error("Erreur lors de la recherche par rôle :", error)
    }
  }

  const searchByPersonne = async (personneId: number) => {
    try {
      const result = await searchEmployesByPersonne(personneId)
      setEmployes(result)
    } catch (error) {
      console.error("Erreur lors de la recherche par personne :", error)
    }
  }

  useEffect(() => {
    fetchAllEmployes()
    fetchStats()
  }, [fetchAllEmployes, fetchStats])

  return {
    employes,
    paginatedData,
    stats,
    loading,
    error,
    selectedEmploye,
    fetchAllEmployes,
    fetchEmployes,
    fetchStats,
    createEmploye,
    editEmploye,
    removeEmploye,
    searchBySpecialite,
    searchByStatut,
    addRole,
    removeRole,
    assignPerson,
    getEmployeById,
    fetchEmployeById,
    searchByRole,
    searchByPersonne,
  }
}
