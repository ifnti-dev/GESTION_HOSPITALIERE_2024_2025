import { apiClient } from "../api"
import type { Medicament, MedicamentSearchParams } from "@/types/pharmacie"
import { API_ENDPOINTS } from "@/config/api"

export class MedicamentService {
  // GET /api/medicaments
  async getAllMedicaments(): Promise<Medicament[]> {
    console.log("🔍 Fetching all medicaments...")
    try {
      const medicaments = await apiClient.get<Medicament[]>(API_ENDPOINTS.MEDICAMENTS)
      console.log("✅ Medicaments fetched:", medicaments?.length || 0)
      return medicaments || []
    } catch (error) {
      console.error("❌ Error fetching medicaments:", error)
      throw error
    }
  }

  // GET /api/medicaments/{id}
  async getMedicamentById(id: number): Promise<Medicament> {
    console.log(`🔍 Fetching medicament with ID: ${id}`)
    try {
      const medicament = await apiClient.get<Medicament>(`${API_ENDPOINTS.MEDICAMENTS}/${id}`)
      console.log("✅ Medicament fetched:", medicament)
      return medicament
    } catch (error) {
      console.error(`❌ Error fetching medicament ${id}:`, error)
      throw error
    }
  }

  // POST /api/medicaments
  async createMedicament(medicament: Omit<Medicament, "id">): Promise<Medicament> {
    console.log("➕ Creating medicament:", medicament)
    try {
      const newMedicament = await apiClient.post<Medicament>(API_ENDPOINTS.MEDICAMENTS, medicament)
      console.log("✅ Medicament created:", newMedicament)
      return newMedicament
    } catch (error) {
      console.error("❌ Error creating medicament:", error)
      throw error
    }
  }

  // PUT /api/medicaments/{id}
  async updateMedicament(id: number, medicament: Partial<Medicament>): Promise<Medicament> {
    console.log(`✏️ Updating medicament ${id}:`, medicament)
    try {
      const updatedMedicament = await apiClient.put<Medicament>(`${API_ENDPOINTS.MEDICAMENTS}/${id}`, {
        ...medicament,
        id,
      })
      console.log("✅ Medicament updated:", updatedMedicament)
      return updatedMedicament
    } catch (error) {
      console.error(`❌ Error updating medicament ${id}:`, error)
      throw error
    }
  }

  // DELETE /api/medicaments/{id}
  async deleteMedicament(id: number): Promise<void> {
    console.log(`🗑️ Deleting medicament ${id}`)
    try {
      await apiClient.delete(`${API_ENDPOINTS.MEDICAMENTS}/${id}`)
      console.log("✅ Medicament deleted successfully")
    } catch (error) {
      console.error(`❌ Error deleting medicament ${id}:`, error)
      throw error
    }
  }

  // GET /api/medicaments/search/nom?nom=...
  async searchByNom(nom: string): Promise<Medicament[]> {
    console.log(`🔍 Searching medicaments by nom: ${nom}`)
    try {
      const medicaments = await apiClient.get<Medicament[]>(API_ENDPOINTS.MEDICAMENTS_SEARCH.BY_NOM, { nom })
      console.log("✅ Search results:", medicaments?.length || 0)
      return medicaments || []
    } catch (error) {
      console.error("❌ Error searching medicaments by nom:", error)
      throw error
    }
  }

  // GET /api/medicaments/search/description?keyword=...
  async searchByDescription(keyword: string): Promise<Medicament[]> {
    console.log(`🔍 Searching medicaments by description: ${keyword}`)
    try {
      const medicaments = await apiClient.get<Medicament[]>(API_ENDPOINTS.MEDICAMENTS_SEARCH.BY_DESCRIPTION, {
        keyword,
      })
      console.log("✅ Search results:", medicaments?.length || 0)
      return medicaments || []
    } catch (error) {
      console.error("❌ Error searching medicaments by description:", error)
      throw error
    }
  }

  // GET /api/medicaments/low-stock?seuil=...
  async getMedicamentsLowStock(seuil: number): Promise<Medicament[]> {
    console.log(`🔍 Fetching medicaments with low stock (seuil: ${seuil})`)
    try {
      const medicaments = await apiClient.get<Medicament[]>(API_ENDPOINTS.MEDICAMENTS_SEARCH.LOW_STOCK, { seuil })
      console.log("✅ Low stock medicaments:", medicaments?.length || 0)
      return medicaments || []
    } catch (error) {
      console.error("❌ Error fetching low stock medicaments:", error)
      throw error
    }
  }

  // GET /api/medicaments/by-categorie/{categorieId}
  async getByCategorieId(categorieId: number): Promise<Medicament[]> {
    console.log(`🔍 Fetching medicaments by categorie ID: ${categorieId}`)
    try {
      const medicaments = await apiClient.get<Medicament[]>(
        `${API_ENDPOINTS.MEDICAMENTS_SEARCH.BY_CATEGORIE}/${categorieId}`,
      )
      console.log("✅ Medicaments by categorie:", medicaments?.length || 0)
      return medicaments || []
    } catch (error) {
      console.error(`❌ Error fetching medicaments by categorie ${categorieId}:`, error)
      throw error
    }
  }

  // Recherche combinée
  async searchMedicaments(params: MedicamentSearchParams): Promise<Medicament[]> {
    console.log("🔍 Combined search with params:", params)
    try {
      if (params.nom) {
        return await this.searchByNom(params.nom)
      }
      if (params.description) {
        return await this.searchByDescription(params.description)
      }
      if (params.categorieId) {
        return await this.getByCategorieId(params.categorieId)
      }
      if (params.seuil !== undefined) {
        return await this.getMedicamentsLowStock(params.seuil)
      }
      return await this.getAllMedicaments()
    } catch (error) {
      console.error("❌ Error in combined search:", error)
      throw error
    }
  }
}

// Instance singleton du service
export const medicamentService = new MedicamentService()
