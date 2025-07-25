"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getRoles,
  addRole,
  updateRole,
  deleteRole,
  getEmployeeCountByRole as fetchEmployeeCount,
} from "@/services/utilisateur/role.service"
import type { Role } from "@/types/utilisateur"
import { toast } from "@/hooks/use-toast"

export function useRole() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Charger tous les rôles
  const fetchRoles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRoles()
      setRoles(data)
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors du chargement des rôles"
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
    fetchRoles()
  }, [fetchRoles])

  // Ajouter un rôle
  const handleAddRole = async (newRole: { nom: string; description?: string; permissions: number[] }) => {
    setLoading(true)
    setError(null)
    try {
      const role = await addRole(newRole)
      setRoles((prev) => [...prev, role])
      toast({
        title: "Succès",
        description: "Rôle ajouté avec succès",
      })
      return role
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de l'ajout du rôle"
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
  }

  // Compter les employés par rôle (sans affecter le loading global)
  const getEmployeeCountByRole = async (roleId: number) => {
    try {
      const count = await fetchEmployeeCount(roleId)
      return count
    } catch (err: any) {
      console.error("Erreur lors du comptage des employés:", err)
      return 0
    }
  }

  // Mettre à jour un rôle
  const handleUpdateRole = async (
    roleId: number,
    updatedRole: { nom: string; description?: string; permissions: number[] },
  ) => {
    setLoading(true)
    setError(null)
    try {
      const role = await updateRole(roleId, updatedRole)
      setRoles((prev) => prev.map((r) => (r.id === roleId ? role : r)))
      toast({
        title: "Succès",
        description: "Rôle modifié avec succès",
      })
      return role
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la mise à jour du rôle"
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
  }

  // Supprimer un rôle
  const handleDeleteRole = async (roleId: number) => {
    setLoading(true)
    setError(null)
    try {
      await deleteRole(roleId)
      setRoles((prev) => prev.filter((r) => r.id !== roleId))
      toast({
        title: "Succès",
        description: "Rôle supprimé avec succès",
      })
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la suppression du rôle"
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
  }

  return {
    roles,
    loading,
    error,
    fetchRoles,
    addRole: handleAddRole,
    updateRole: handleUpdateRole,
    deleteRole: handleDeleteRole,
    getEmployeeCountByRole,
  }
}
