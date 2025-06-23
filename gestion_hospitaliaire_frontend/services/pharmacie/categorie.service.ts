import { apiClient } from "../api"
import { API_ENDPOINTS } from "@/config/api"
import type { Categorie, CategorieSearchParams } from "@/types/pharmacie"

export class CategorieService {
  private readonly baseEndpoint = API_ENDPOINTS.PHARMACIE.CATEGORIES

  // GET /api/categories - Récupérer toutes les catégories
  async getAllCategories(): Promise<Categorie[]> {
    console.log("🔍 Fetching all categories...")
    return apiClient.get<Categorie[]>(this.baseEndpoint)
  }

  // GET /api/categories/{id} - Récupérer une catégorie par ID
  async getCategorieById(id: number): Promise<Categorie> {
    console.log(`🔍 Fetching category with ID: ${id}`)
    return apiClient.get<Categorie>(`${this.baseEndpoint}/${id}`)
  }

  // POST /api/categories - Créer une nouvelle catégorie
  async createCategorie(categorie: Omit<Categorie, "id">): Promise<Categorie> {
    console.log("➕ Creating new category:", categorie)
    return apiClient.post<Categorie>(this.baseEndpoint, categorie)
  }

  // PUT /api/categories/{id} - Mettre à jour une catégorie
  async updateCategorie(id: number, categorie: Omit<Categorie, "id">): Promise<Categorie> {
    console.log(`✏️ Updating category ${id}:`, categorie)
    return apiClient.put<Categorie>(`${this.baseEndpoint}/${id}`, categorie)
  }

  // DELETE /api/categories/{id} - Supprimer une catégorie
  async deleteCategorie(id: number): Promise<void> {
    console.log(`🗑️ Deleting category with ID: ${id}`)
    return apiClient.delete<void>(`${this.baseEndpoint}/${id}`)
  }

  // GET /api/categories/search/nom?nom=... - Rechercher par nom
  async searchByNom(nom: string): Promise<Categorie[]> {
    console.log(`🔍 Searching categories by nom: ${nom}`)
    return apiClient.get<Categorie[]>(`${this.baseEndpoint}/search/nom`, { nom })
  }

  // GET /api/categories/search/description?description=... - Rechercher par description
  async searchByDescription(description: string): Promise<Categorie[]> {
    console.log(`🔍 Searching categories by description: ${description}`)
    return apiClient.get<Categorie[]>(`${this.baseEndpoint}/search/description`, { description })
  }

  // Recherche combinée (utilise les deux endpoints selon les paramètres)
  async searchCategories(params: CategorieSearchParams): Promise<Categorie[]> {
    console.log("🔍 Combined search with params:", params)

    if (params.nom && params.description) {
      // Si les deux sont fournis, on fait deux requêtes et on combine les résultats
      const [nomResults, descResults] = await Promise.all([
        this.searchByNom(params.nom),
        this.searchByDescription(params.description),
      ])

      // Éliminer les doublons en combinant par ID
      const combined = [...nomResults]
      descResults.forEach((desc) => {
        if (!combined.find((nom) => nom.id === desc.id)) {
          combined.push(desc)
        }
      })
      return combined
    } else if (params.nom) {
      return this.searchByNom(params.nom)
    } else if (params.description) {
      return this.searchByDescription(params.description)
    } else {
      return this.getAllCategories()
    }
  }
}

// Instance singleton du service
export const categorieService = new CategorieService()
