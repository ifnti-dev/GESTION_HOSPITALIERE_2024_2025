import { API_CONFIG, API_ENDPOINTS, API_HEADERS } from "@/config/api"
import { apiClient } from "../api" // Importation de apiClient

import type { DossierGrossesse, CreateDossierGrossessePayload } from "@/types/medical"

const DOSSIER_GROSSESSE_API_URL = API_ENDPOINTS.DOSSIER.DOSSIER_GROSSES

export const dossierGrossesseService = {
  /**
   * Récupère tous les dossiers de grossesse.
   * @returns Une promesse qui résout en un tableau de DossierGrossesse.
   */
  getAllDossiersGrossesse: async (): Promise<DossierGrossesse[]> => {
    console.log("🔍 Fetching all pregnancy records...")
    return apiClient.get<DossierGrossesse[]>(DOSSIER_GROSSESSE_API_URL)
  },

  /**
   * Récupère un dossier de grossesse par son ID.
   * @param id L'ID du dossier de grossesse.
   * @returns Une promesse qui résout en un objet DossierGrossesse.
   */
  getDossierGrossesseById: async (id: number): Promise<DossierGrossesse> => {
    console.log(`🔍 Fetching pregnancy record with ID: ${id}`)
    return apiClient.get<DossierGrossesse>(`${DOSSIER_GROSSESSE_API_URL}/${id}`)
  },

  /**
   * Crée un nouveau dossier de grossesse.
   * @param data Les données pour le nouveau dossier de grossesse.
   * @returns Une promesse qui résout en l'objet DossierGrossesse créé.
   */
  createDossierGrossesse: async (data: CreateDossierGrossessePayload): Promise<DossierGrossesse> => {
    console.log("➕ Creating new pregnancy record:", data)
    try {
      const newDossier = await apiClient.post<DossierGrossesse>(DOSSIER_GROSSESSE_API_URL, data)
      console.log("✅ Pregnancy record created:", newDossier)
      return newDossier
    } catch (error) {
      console.error("❌ Error creating pregnancy record:", error)
      throw error
    }
  },

  /**
   * Met à jour un dossier de grossesse existant.
   * @param id L'ID du dossier de grossesse à mettre à jour.
   * @param data Les données à mettre à jour.
   * @returns Une promesse qui résout en l'objet DossierGrossesse mis à jour.
   */
  updateDossierGrossesse: async (id: number, data: Partial<CreateDossierGrossessePayload>): Promise<DossierGrossesse> => {
    console.log(`✏️ Updating pregnancy record ${id}:`, data)
    try {
      const updatedDossier = await apiClient.put<DossierGrossesse>(`${DOSSIER_GROSSESSE_API_URL}/${id}`, data)
      console.log("✅ Pregnancy record updated:", updatedDossier)
      return updatedDossier
    } catch (error) {
      console.error(`❌ Error updating pregnancy record ${id}:`, error)
      throw error
    }
  },

  /**
   * Supprime un dossier de grossesse par son ID.
   * @param id L'ID du dossier de grossesse à supprimer.
   * @returns Une promesse qui résout lorsque la suppression est réussie.
   */
  deleteDossierGrossesse: async (id: number): Promise<void> => {
    console.log(`🗑️ Deleting pregnancy record ${id}`)
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${DOSSIER_GROSSESSE_API_URL}/${id}`, {
        method: 'DELETE',
        headers: API_HEADERS,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => `Erreur serveur: ${response.status}`);
        throw new Error(errorText);
      }

      console.log("✅ Pregnancy record deleted successfully");
    } catch (error) {
      console.error(`❌ Error deleting pregnancy record ${id}:`, error)
      throw error
    }
  },
}