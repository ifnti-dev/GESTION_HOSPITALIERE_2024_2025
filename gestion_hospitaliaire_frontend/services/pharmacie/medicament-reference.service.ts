import { apiClient } from "../api"
import type { MedicamentReference, MedicamentReferenceSearchParams } from "@/types/pharmacie"
import { API_ENDPOINTS } from "@/config/api"

export class MedicamentReferenceService {
  // GET /api/medicament-references
  async getAllMedicamentReferences(): Promise<MedicamentReference[]> {
    console.log("🔍 Fetching all medicament references...")
    try {
      const medicamentReferences = await apiClient.get<MedicamentReference[]>(API_ENDPOINTS.MEDICAMENT_REFERENCES)
      console.log("✅ MedicamentReferences fetched:", medicamentReferences?.length || 0)
      return medicamentReferences || []
    } catch (error) {
      console.error("❌ Error fetching medicament references:", error)
      throw error
    }
  }

  // GET /api/medicament-references/{id}
  async getMedicamentReferenceById(id: number): Promise<MedicamentReference> {
    console.log(`🔍 Fetching medicament reference with ID: ${id}`)
    try {
      const medicamentReference = await apiClient.get<MedicamentReference>(
        `${API_ENDPOINTS.MEDICAMENT_REFERENCES}/${id}`,
      )
      console.log("✅ MedicamentReference fetched:", medicamentReference)
      return medicamentReference
    } catch (error) {
      console.error(`❌ Error fetching medicament reference ${id}:`, error)
      throw error
    }
  }

  // POST /api/medicament-references
  async createMedicamentReference(medicamentReference: Omit<MedicamentReference, "id">): Promise<MedicamentReference> {
    console.log("➕ Creating medicament reference:", medicamentReference)
    try {
      const newMedicamentReference = await apiClient.post<MedicamentReference>(
        API_ENDPOINTS.MEDICAMENT_REFERENCES,
        medicamentReference,
      )
      console.log("✅ MedicamentReference created:", newMedicamentReference)
      return newMedicamentReference
    } catch (error) {
      console.error("❌ Error creating medicament reference:", error)
      throw error
    }
  }

  // PUT /api/medicament-references/{id}
  async updateMedicamentReference(
    id: number,
    medicamentReference: Partial<MedicamentReference>,
  ): Promise<MedicamentReference> {
    console.log(`✏️ Updating medicament reference ${id}:`, medicamentReference)
    try {
      const updatedMedicamentReference = await apiClient.put<MedicamentReference>(
        `${API_ENDPOINTS.MEDICAMENT_REFERENCES}/${id}`,
        {
          ...medicamentReference,
          id,
        },
      )
      console.log("✅ MedicamentReference updated:", updatedMedicamentReference)
      return updatedMedicamentReference
    } catch (error) {
      console.error(`❌ Error updating medicament reference ${id}:`, error)
      throw error
    }
  }

  // DELETE /api/medicament-references/{id}
  async deleteMedicamentReference(id: number): Promise<void> {
    console.log(`🗑️ Deleting medicament reference ${id}`)
    try {
      await apiClient.delete(`${API_ENDPOINTS.MEDICAMENT_REFERENCES}/${id}`)
      console.log("✅ MedicamentReference deleted successfully")
    } catch (error) {
      console.error(`❌ Error deleting medicament reference ${id}:`, error)
      throw error
    }
  }

  // GET /api/medicament-references/medicament/{medicamentId}
  async getByMedicamentId(medicamentId: number): Promise<MedicamentReference[]> {
    console.log(`🔍 Fetching medicament references by medicament ID: ${medicamentId}`)
    try {
      const medicamentReferences = await apiClient.get<MedicamentReference[]>(
        `${API_ENDPOINTS.MEDICAMENT_REFERENCES_SEARCH.BY_MEDICAMENT}/${medicamentId}`,
      )
      console.log("✅ MedicamentReferences by medicament:", medicamentReferences?.length || 0)
      return medicamentReferences || []
    } catch (error) {
      console.error(`❌ Error fetching medicament references by medicament ${medicamentId}:`, error)
      throw error
    }
  }

  // GET /api/medicament-references/reference/{referenceId}
  async getByReferenceId(referenceId: number): Promise<MedicamentReference[]> {
    console.log(`🔍 Fetching medicament references by reference ID: ${referenceId}`)
    try {
      const medicamentReferences = await apiClient.get<MedicamentReference[]>(
        `${API_ENDPOINTS.MEDICAMENT_REFERENCES_SEARCH.BY_REFERENCE}/${referenceId}`,
      )
      console.log("✅ MedicamentReferences by reference:", medicamentReferences?.length || 0)
      return medicamentReferences || []
    } catch (error) {
      console.error(`❌ Error fetching medicament references by reference ${referenceId}:`, error)
      throw error
    }
  }

  // Recherche combinée
  async searchMedicamentReferences(params: MedicamentReferenceSearchParams): Promise<MedicamentReference[]> {
    console.log("🔍 Combined search with params:", params)
    try {
      if (params.medicamentId) {
        return await this.getByMedicamentId(params.medicamentId)
      }
      if (params.referenceId) {
        return await this.getByReferenceId(params.referenceId)
      }
      return await this.getAllMedicamentReferences()
    } catch (error) {
      console.error("❌ Error in combined search:", error)
      throw error
    }
  }
}

// Instance singleton du service
export const medicamentReferenceService = new MedicamentReferenceService()
