"use client"

import { useState, useEffect, useCallback } from "react"
import { commandeService } from "@/services/pharmacie/commande.service"

export function useCommandeStats() {
  const [stats, setStats] = useState({
    totalCommandes: 0,
    montantTotal: 0,
    commandesMois: 0,
    commandesJour: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await commandeService.getStats()
      setStats(data)
      console.log("Commande stats fetched:", data)
    } catch (err) {
      setError("Échec du chargement des statistiques de commande.")
      console.error("Error in useCommandeStats fetchStats:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
