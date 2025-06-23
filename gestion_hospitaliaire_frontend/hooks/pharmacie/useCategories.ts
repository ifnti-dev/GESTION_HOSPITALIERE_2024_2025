"use client"

import { useState, useEffect } from "react"
import { categorieService } from "@/services/pharmacie/categorie.service"
import type { Categorie, CategorieSearchParams } from "@/types/pharmacie"

// Hook pour récupérer toutes les catégories
export function useCategories() {
  const [categories, setCategories] = useState<Categorie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categorieService.getAllCategories()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des catégories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  }
}

// Hook pour récupérer une catégorie par ID
export function useCategorie(id: number | null) {
  const [categorie, setCategorie] = useState<Categorie | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setCategorie(null)
      return
    }

    const fetchCategorie = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await categorieService.getCategorieById(id)
        setCategorie(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement de la catégorie")
      } finally {
        setLoading(false)
      }
    }

    fetchCategorie()
  }, [id])

  return {
    categorie,
    loading,
    error,
  }
}

// Hook pour la recherche de catégories
export function useCategorieSearch() {
  const [categories, setCategories] = useState<Categorie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchCategories = async (params: CategorieSearchParams) => {
    try {
      setLoading(true)
      setError(null)
      const data = await categorieService.searchCategories(params)
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la recherche")
    } finally {
      setLoading(false)
    }
  }

  return {
    categories,
    loading,
    error,
    searchCategories,
  }
}

// Hook pour les mutations (create, update, delete)
export function useCategorieMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCategorie = async (categorie: Omit<Categorie, "id">) => {
    try {
      setLoading(true)
      setError(null)
      const result = await categorieService.createCategorie(categorie)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la création"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateCategorie = async (id: number, categorie: Omit<Categorie, "id">) => {
    try {
      setLoading(true)
      setError(null)
      const result = await categorieService.updateCategorie(id, categorie)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la modification"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const deleteCategorie = async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await categorieService.deleteCategorie(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la suppression"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    createCategorie,
    updateCategorie,
    deleteCategorie,
    loading,
    error,
  }
}
