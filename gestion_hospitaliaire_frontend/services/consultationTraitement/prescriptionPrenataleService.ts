import { CreatePrescriptionPrenatalePayload, PrescriptionPrenatale } from "@/types/consultstionsTraitement"
import { apiClient } from "../api"

import { API_ENDPOINTS } from "@/config/api"

const PRESCRIPTION_API_URL = API_ENDPOINTS.PRESCRIPTION_PRENATALE

export const prescriptionPrenataleService = {
  /**
   * Récupérer toutes les prescriptions prénatales
   */
  getAll: async (): Promise<PrescriptionPrenatale[]> => {
    console.log("Fetching all prenatal prescriptions...")
    return apiClient.get<PrescriptionPrenatale[]>(PRESCRIPTION_API_URL)
  },

  /**
   * Récupérer une prescription prénatale par son ID
   */
  getById: async (id: number): Promise<PrescriptionPrenatale> => {
    console.log(`Fetching prenatal prescription with ID: ${id}`)
    return apiClient.get<PrescriptionPrenatale>(`${PRESCRIPTION_API_URL}/${id}`)
  },

  /**
   * Créer une nouvelle prescription prénatale
   */
  create: async (
    data: CreatePrescriptionPrenatalePayload
  ): Promise<PrescriptionPrenatale> => {
    console.log("Creating new prenatal prescription:", data)
    try {
      const payload = {
        ...data,
        consultationPrenatale: {
          id: data.consultationPrenatale.id,
        },
      }

      const created = await apiClient.post<PrescriptionPrenatale>(
        PRESCRIPTION_API_URL,
        payload
      )
      console.log("Prescription created:", created)
      return created
    } catch (error) {
      console.error("Error creating prescription:", error)
      throw error
    }
  },

  /**
   * Mettre à jour une prescription prénatale
   */
  update: async (
    id: number,
    data: Partial<CreatePrescriptionPrenatalePayload>
  ): Promise<PrescriptionPrenatale> => {
    console.log(`Updating prenatal prescription ${id}:`, data)
    try {
      const payload: any = { ...data }

      if (data.consultationPrenatale)
        payload.consultationPrenatale = {
          id: data.consultationPrenatale.id,
        }

      const updated = await apiClient.put<PrescriptionPrenatale>(
        `${PRESCRIPTION_API_URL}/${id}`,
        payload
      )
      console.log("Prescription updated:", updated)
      return updated
    } catch (error) {
      console.error("Error updating prescription:", error)
      throw error
    }
  },

  /**
   * Supprimer une prescription prénatale
   */
  delete: async (id: number): Promise<void> => {
    console.log(`Deleting prescription ${id}`)
    try {
      await apiClient.delete(`${PRESCRIPTION_API_URL}/${id}`)
      console.log("Prescription deleted successfully")
    } catch (error) {
      console.error(`Error deleting prescription ${id}:`, error)
      throw error
    }
  },

  /**
   * Récupérer les prescriptions d'une consultation prénatale donnée
   */
  getByConsultationId: async (
    consultationPrenataleId: number
  ): Promise<PrescriptionPrenatale[]> => {
    console.log(
      `Fetching prescriptions for prenatal consultation ID ${consultationPrenataleId}`
    )
    return apiClient.get<PrescriptionPrenatale[]>(
      `${PRESCRIPTION_API_URL}/consultation-prenatale/${consultationPrenataleId}`
    )
  },
}
