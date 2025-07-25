import { API_CONFIG, API_ENDPOINTS, API_HEADERS } from "@/config/api"
import { apiClient } from "../api"
import type { 
  Accouchement, 
  CreateAccouchementPayload,
  
} from "@/types/accouchement"  


const ACCOUCHEMENT_API_URL = API_ENDPOINTS.ACCOUCHEMENT  // À définir dans votre config

export const accouchementService = {
  /**
   * Récupère tous les accouchements
   * @returns Liste des accouchements
   */
  getAccouchements: async (): Promise<Accouchement[]> => {
    console.log("🔍 Fetching all deliveries...")
    return apiClient.get<Accouchement[]>(ACCOUCHEMENT_API_URL)
  },

  /**
   * Récupère un accouchement par son ID
   * @param id ID de l'accouchement
   * @returns Détails de l'accouchement
   */
  getAccouchementById: async (id: number): Promise<Accouchement> => {
    console.log(`🔍 Fetching delivery with ID: ${id}`)
    return apiClient.get<Accouchement>(`${ACCOUCHEMENT_API_URL}/${id}`)
  },

  /**
   * Crée un nouvel accouchement
   * @param data Données de l'accouchement
   * @returns Accouchement créé
   */
  createAccouchement: async (
    data: CreateAccouchementPayload
  ): Promise<Accouchement> => {
    console.log("➕ Creating new delivery:", data)
    try {
      // Formatage des données pour l'API
      const payload = {
        ...data,
        date: data.date, // Format YYYY-MM-DD
        heure: data.heure, // Format HH:mm:ss
        employe: {id : data.employe.id},
        dossierGrossesse: {id : data.dossierGrossesse.id}
      }

      const newDelivery = await apiClient.post<Accouchement>(
        ACCOUCHEMENT_API_URL, 
        payload
      )
      console.log("✅ Delivery created:", newDelivery)
      return newDelivery
    } catch (error) {
      console.error("❌ Error creating delivery:", error)
      throw error
    }
  },

  /**
   * Met à jour un accouchement existant
   * @param id ID de l'accouchement
   * @param data Données partielles à mettre à jour
   * @returns Accouchement mis à jour
   */
  updateAccouchement: async (
    id: number, 
    data: Partial<CreateAccouchementPayload>
  ): Promise<Accouchement> => {
    console.log(`✏️ Updating delivery ${id}:`, data)
    try {
      // Formatage des relations
      const payload: any = { ...data }
      if (data.employe) payload.employe = { id: data.employe.id }
      if (data.dossierGrossesse) payload.dossierGrossesse = { id: data.dossierGrossesse.id }

      const updatedDelivery = await apiClient.put<Accouchement>(
        `${ACCOUCHEMENT_API_URL}/${id}`, 
        payload
      )
      console.log("✅ Delivery updated:", updatedDelivery)
      return updatedDelivery
    } catch (error) {
      console.error(`❌ Error updating delivery ${id}:`, error)
      throw error
    }
  },

  /**
   * Supprime un accouchement
   * @param id ID de l'accouchement
   */
  deleteAccouchement: async (id: number): Promise<void> => {
    console.log(`🗑️ Deleting delivery ${id}`)
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${ACCOUCHEMENT_API_URL}/${id}`, 
        {
          method: 'DELETE',
          headers: API_HEADERS,
        }
      )

      if (!response.ok) {
        const errorText = await response.text().catch(() => `Server error: ${response.status}`)
        throw new Error(errorText)
      }

      console.log("✅ Delivery deleted successfully")
    } catch (error) {
      console.error(`❌ Error deleting delivery ${id}:`, error)
      throw error
    }
  },

  /**
   * Recherche des accouchements par dossier de grossesse
   * @param dossierId ID du dossier de grossesse
   * @returns Liste des accouchements liés
   */
  getByDossierGrossesse: async (dossierId: number): Promise<Accouchement[]> => {
    console.log(`🔍 Fetching deliveries for pregnancy file ${dossierId}`)
    return apiClient.get<Accouchement[]>(
      `${ACCOUCHEMENT_API_URL}/dossier/${dossierId}`
    )
  },

  /**
   * Recherche des accouchements par sage-femme
   * @param employeId ID de l'employé/sage-femme
   * @returns Liste des accouchements effectués
   */
  getBySageFemme: async (employeId: number): Promise<Accouchement[]> => {
    console.log(`🔍 Fetching deliveries by employee ${employeId}`)
    return apiClient.get<Accouchement[]>(
      `${ACCOUCHEMENT_API_URL}/employe/${employeId}`
    )
  }
}