import { API_CONFIG, API_ENDPOINTS, API_HEADERS } from "@/config/api"
import { apiClient } from "../api" // Importation de apiClient
import { DossierMedical, CreateDossierMedicalPayload } from "@/types/medical" // Chemin corrigé
import { Personne } from "@/types/utilisateur"

// Type pour la création d'un dossier médical (correspond au DTO attendu par le backend)
const DOSSIER_MEDICAL_API_URL = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.DOSSIER.DOSSIER_MEDICAL}`

export const dossierMedicalService = {
  /**
   * Récupère tous les dossiers médicaux.
   * @returns Une promesse qui résout en un tableau de DossierMedical.
  */
  getAllDossiers: async (): Promise<DossierMedical[]> => {
    const allDossiersUrl = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.DOSSIER.DOSSIER_MEDICAL_SEARCH}`
    console.log("🔍 Fetching all medical records...")
    return apiClient.get<DossierMedical[]>(allDossiersUrl)
  },

  /**
   * Récupère un dossier médical par son ID.
   * @param id L'ID du dossier médical.
   * @returns Une promesse qui résout en un objet DossierMedical.
  */
  getDossierById: async (id: number): Promise<DossierMedical> => {
    console.log(`🔍 Fetching medical record with ID: ${id}`)
    return apiClient.get<DossierMedical>(`${DOSSIER_MEDICAL_API_URL}/${id}`)
  },

  /**
   * Crée un nouveau dossier médical.
   * @param data Les données pour le nouveau dossier médical.
   * @returns Une promesse qui résout en l'objet DossierMedical créé.
  */
  createDossier: async (data: CreateDossierMedicalPayload): Promise<DossierMedical> => {
    console.log("➕ Creating new medical record:", data)
    try {
      const newDossier = await apiClient.post<DossierMedical>(DOSSIER_MEDICAL_API_URL, data)
      console.log("✅ Medical record created:", newDossier)
      return newDossier
    } catch (error) {
      console.error("❌ Error creating medical record:", error)
      throw error
    }
  },

  /**
   * Met à jour un dossier médical existant.
   * @param id L'ID du dossier médical à mettre à jour.
   * @param data Les données à mettre à jour.
   * @returns Une promesse qui résout en l'objet DossierMedical mis à jour.
  */
  updateDossier: async (id: number, data: CreateDossierMedicalPayload): Promise<DossierMedical> => {
    console.log(`✏️ Updating medical record ${id}:`, data)
    try {
      const updatedDossier = await apiClient.put<DossierMedical>(`${DOSSIER_MEDICAL_API_URL}/${id}`, data)
      console.log("✅ Medical record updated:", updatedDossier)
      return updatedDossier
    } catch (error) {
      console.error(`❌ Error updating medical record ${id}:`, error)
      throw error
    }
  },

  /**
   * Supprime un dossier médical par son ID.
   * @param id L'ID du dossier médical à supprimer.
   * @returns Une promesse qui résout lorsque la suppression est réussie.
  */
  deleteDossier: async (id: number): Promise<void> => {
    console.log(`🗑️ Deleting medical record ${id}`)
    try {
      await apiClient.delete<void>(`${DOSSIER_MEDICAL_API_URL}/${id}`)
      console.log("✅ Medical record deleted successfully")
    } catch (error) {
      console.error(`❌ Error deleting medical record ${id}:`, error)
      throw error
    }
  },

  /**
   * Récupère tous les patients. Nécessaire pour la sélection du patient dans le formulaire.
   * @returns Une promesse qui résout en un tableau de Personne.
  */
  getAllPatients: async (): Promise<Personne[]> => {
    const PATIENTS_API_URL = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.UTILISATEUR.PERSONNES}`
    console.log("🔍 Fetching all patients...")
    try {
      const patients = await apiClient.get<Personne[]>(PATIENTS_API_URL)
      console.log("✅ Patients fetched:", patients?.length || 0)
      return patients
    } catch (error) {
      console.error("❌ Error fetching patients:", error)
      throw error
    }
  },
}
