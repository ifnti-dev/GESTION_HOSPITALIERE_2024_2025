import { API_CONFIG, API_ENDPOINTS, API_HEADERS } from "@/config/api"
import { apiClient } from "../api"
import type { 
  ConsultationPrenatale, 
  CreateConsultationPrenatalePayload 
} from "@/types/consultstionsTraitement"

const CONSULTATION_PRENATALE_API_URL = API_ENDPOINTS.CONSULTATION_PRENATALE

export const consultationPrenataleService = {
  /**
   * Récupère toutes les consultations prénatales.
   * @returns Une promesse qui résout en un tableau de ConsultationPrenatale.
   */
  getConsultationsPrenatales: async (): Promise<ConsultationPrenatale[]> => {
    console.log("🔍 Fetching all prenatal consultations...")
    return apiClient.get<ConsultationPrenatale[]>(CONSULTATION_PRENATALE_API_URL)
  },

  /**
   * Récupère une consultation prénatale par son ID.
   * @param id L'ID de la consultation prénatale.
   * @returns Une promesse qui résout en un objet ConsultationPrenatale.
   */
  getConsultationPrenataleById: async (id: number): Promise<ConsultationPrenatale> => {
    console.log(`🔍 Fetching prenatal consultation with ID: ${id}`)
    return apiClient.get<ConsultationPrenatale>(`${CONSULTATION_PRENATALE_API_URL}/${id}`)
  },

  /**
   * Crée une nouvelle consultation prénatale.
   * @param data Les données pour la nouvelle consultation.
   * @returns Une promesse qui résout en la consultation créée.
   */
  createConsultationPrenatale: async (
    data: CreateConsultationPrenatalePayload
  ): Promise<ConsultationPrenatale> => {
    console.log("➕ Creating new prenatal consultation:", data)
    try {
      const newConsultation = await apiClient.post<ConsultationPrenatale>(
        CONSULTATION_PRENATALE_API_URL, 
        data
      )
      console.log("✅ Prenatal consultation created:", newConsultation)
      return newConsultation
    } catch (error) {
      console.error("❌ Error creating prenatal consultation:", error)
      throw error
    }
  },

  /**
   * Met à jour une consultation prénatale existante.
   * @param id L'ID de la consultation à mettre à jour.
   * @param data Les données partielles à mettre à jour.
   * @returns Une promesse qui résout en la consultation mise à jour.
   */
  updateConsultationPrenatale: async (
    id: number, 
    data: Partial<CreateConsultationPrenatalePayload>
  ): Promise<ConsultationPrenatale> => {
    console.log(`✏️ Updating prenatal consultation ${id}:`, data)
    try {
      const updatedConsultation = await apiClient.put<ConsultationPrenatale>(
        `${CONSULTATION_PRENATALE_API_URL}/${id}`, 
        data
      )
      console.log("✅ Prenatal consultation updated:", updatedConsultation)
      return updatedConsultation
    } catch (error) {
      console.error(`❌ Error updating prenatal consultation ${id}:`, error)
      throw error
    }
  },

  /**
   * Supprime une consultation prénatale par son ID.
   * @param id L'ID de la consultation à supprimer.
   * @returns Une promesse qui résout lorsque la suppression est réussie.
   */
  deleteConsultationPrenatale: async (id: number): Promise<void> => {
    console.log(`🗑️ Deleting prenatal consultation ${id}`)
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${CONSULTATION_PRENATALE_API_URL}/${id}`, 
        {
          method: 'DELETE',
          headers: API_HEADERS,
        }
      )

      if (!response.ok) {
        const errorText = await response.text().catch(() => `Server error: ${response.status}`)
        throw new Error(errorText)
      }

      console.log("✅ Prenatal consultation deleted successfully")
    } catch (error) {
      console.error(`❌ Error deleting prenatal consultation ${id}:`, error)
      throw error
    }
  },

  /**
   * Récupère toutes les consultations prénatales d'un dossier de grossesse donné.
   * @param dossierGrossesseId L'ID du dossier de grossesse.
   * @returns Une promesse qui résout en un tableau de ConsultationPrenatale.
   */
  getConsultationsByDossier: async (dossierGrossesseId: number): Promise<ConsultationPrenatale[]> => {
    console.log(`🔍 Fetching consultations for dossierGrossesseId: ${dossierGrossesseId}`)
    return apiClient.get<ConsultationPrenatale[]>(
      `${CONSULTATION_PRENATALE_API_URL}/dossier-grossesse/${dossierGrossesseId}`
    )
  },
}