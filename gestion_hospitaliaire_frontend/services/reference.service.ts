
import { apiClient } from "./api"
import type { Reference, ReferenceSearchParams } from "@/types/pharmacie"
import { API_ENDPOINTS } from "@/config/api"

export class ReferenceService {
  // GET /api/references
  async getAllReferences(): Promise<Reference[]> {
    console.log("🔍 Fetching all references...")
    try {
      const references = await apiClient.get<Reference[]>(API_ENDPOINTS.REFERENCES)
      console.log("✅ References fetched:", references?.length || 0)
      return references || []
    } catch (error) {
      console.error("❌ Error fetching references:", error)
      throw error
    }
  }

  // GET /api/references/{id}
  async getReferenceById(id: number): Promise<Reference> {
    console.log(`🔍 Fetching reference with ID: ${id}`)
    try {
      const reference = await apiClient.get<Reference>(`${API_ENDPOINTS.REFERENCES}/${id}`)
      console.log("✅ Reference fetched:", reference)
      return reference
    } catch (error) {
      console.error(`❌ Error fetching reference ${id}:`, error)
      throw error
    }
  }

  // POST /api/references
  async createReference(reference: Omit<Reference, "id">): Promise<Reference> {
    console.log("➕ Creating reference:", reference)
    try {
      const newReference = await apiClient.post<Reference>(API_ENDPOINTS.REFERENCES, reference)
      console.log("✅ Reference created:", newReference)
      return newReference
    } catch (error) {
      console.error("❌ Error creating reference:", error)
      throw error
    }
  }

  // PUT /api/references/{id}
  async updateReference(id: number, reference: Partial<Reference>): Promise<Reference> {
    console.log(`✏️ Updating reference ${id}:`, reference)
    try {
      const updatedReference = await apiClient.put<Reference>(`${API_ENDPOINTS.REFERENCES}/${id}`, {
        ...reference,
        id,
      })
      console.log("✅ Reference updated:", updatedReference)
      return updatedReference
    } catch (error) {
      console.error(`❌ Error updating reference ${id}:`, error)
      throw error
    }
  }

  // DELETE /api/references/{id}
  async deleteReference(id: number): Promise<void> {
    console.log(`🗑️ Deleting reference ${id}`)
    try {
      await apiClient.delete(`${API_ENDPOINTS.REFERENCES}/${id}`)
      console.log("✅ Reference deleted successfully")
    } catch (error) {
      console.error(`❌ Error deleting reference ${id}:`, error)
      throw error
    }
  }

  // GET /api/references/search/nom?nom=...
  async searchByNom(nom: string): Promise<Reference[]> {
    console.log(`🔍 Searching references by nom: ${nom}`)
    try {
      const references = await apiClient.get<Reference[]>(API_ENDPOINTS.REFERENCES_SEARCH.BY_NOM, { nom })
      console.log("✅ Search results:", references?.length || 0)
      return references || []
    } catch (error) {
      console.error("❌ Error searching references by nom:", error)
      throw error
    }
  }

  // Recherche combinée
  async searchReferences(params: ReferenceSearchParams): Promise<Reference[]> {
    console.log("🔍 Combined search with params:", params)
    try {
      if (params.nom) {
        return await this.searchByNom(params.nom)
      }
      return await this.getAllReferences()
    } catch (error) {
      console.error("❌ Error in combined search:", error)
      throw error
    }
  }
}

// Instance singleton du service
export const referenceService = new ReferenceService()
