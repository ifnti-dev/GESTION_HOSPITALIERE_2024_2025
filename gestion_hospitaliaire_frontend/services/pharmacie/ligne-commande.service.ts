import { apiClient } from "../api"
import { API_ENDPOINTS } from "@/config/api"
import type { LigneCommande, LigneCommandeSearchParams } from "@/types/pharmacie"

class LigneCommandeService {
  // CRUD de base
  async getAll(): Promise<LigneCommande[]> {
    try {
      console.log("Récupération de toutes les lignes de commande...")
      const response = await apiClient.get<LigneCommande[]>(API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE)
      console.log("Lignes de commande récupérées:", response)
      return response || []
    } catch (error) {
      console.error("Erreur lors de la récupération des lignes de commande:", error)
      throw error
    }
  }

  async getById(id: number): Promise<LigneCommande | null> {
    try {
      console.log("Récupération de la ligne de commande:", id)
      const response = await apiClient.get<LigneCommande>(`${API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE}/${id}`)
      console.log("Ligne de commande récupérée:", response)
      return response
    } catch (error) {
      console.error("Erreur lors de la récupération de la ligne de commande:", error)
      throw error
    }
  }

  async create(ligneCommande: Omit<LigneCommande, "id">): Promise<LigneCommande> {
    try {
      console.log("Création d'une nouvelle ligne de commande:", ligneCommande)
      const response = await apiClient.post<LigneCommande>(API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE, ligneCommande)
      console.log("Ligne de commande créée:", response)
      return response
    } catch (error) {
      console.error("Erreur lors de la création de la ligne de commande:", error)
      throw error
    }
  }

  async update(id: number, ligneCommande: Partial<LigneCommande>): Promise<LigneCommande> {
    try {
      console.log("Mise à jour de la ligne de commande:", id, ligneCommande)
      const response = await apiClient.put<LigneCommande>(
        `${API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE}/${id}`,
        ligneCommande,
      )
      console.log("Ligne de commande mise à jour:", response)
      return response
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la ligne de commande:", error)
      throw error
    }
  }

  async delete(id: number): Promise<void> {
    try {
      console.log("Suppression de la ligne de commande:", id)
      await apiClient.delete(`${API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE}/${id}`)
      console.log("Ligne de commande supprimée avec succès")
    } catch (error) {
      console.error("Erreur lors de la suppression de la ligne de commande:", error)
      throw error
    }
  }

  // Méthodes de recherche spécialisées
  async getByCommandeId(commandeId: number): Promise<LigneCommande[]> {
    try {
      console.log("Recherche des lignes par commande:", commandeId)
      const response = await apiClient.get<LigneCommande[]>(
        `${API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE_SEARCH.BY_COMMANDE}/${commandeId}`,
      )
      console.log("Lignes trouvées par commande:", response)
      return response || []
    } catch (error) {
      console.error("Erreur lors de la recherche par commande:", error)
      throw error
    }
  }

  async getByMedicamentId(medicamentId: number): Promise<LigneCommande[]> {
    try {
      console.log("Recherche des lignes par médicament:", medicamentId)
      const response = await apiClient.get<LigneCommande[]>(
        `${API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE_SEARCH.BY_MEDICAMENT}/${medicamentId}`,
      )
      console.log("Lignes trouvées par médicament:", response)
      return response || []
    } catch (error) {
      console.error("Erreur lors de la recherche par médicament:", error)
      throw error
    }
  }

  async getByPrixUnitaireGreaterThan(prix: number): Promise<LigneCommande[]> {
    try {
      console.log("Recherche des lignes par prix supérieur à:", prix)
      const response = await apiClient.get<LigneCommande[]>(
        `${API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE_SEARCH.BY_PRIX}?prix=${prix}`,
      )
      console.log("Lignes trouvées par prix:", response)
      return response || []
    } catch (error) {
      console.error("Erreur lors de la recherche par prix:", error)
      throw error
    }
  }

  // Méthode de recherche générale
  async search(params: LigneCommandeSearchParams): Promise<LigneCommande[]> {
    try {
      console.log("Recherche de lignes de commande avec paramètres:", params)

      if (params.commandeId) {
        return this.getByCommandeId(params.commandeId)
      }

      if (params.medicamentId) {
        return this.getByMedicamentId(params.medicamentId)
      }

      if (params.prixMin) {
        return this.getByPrixUnitaireGreaterThan(params.prixMin)
      }

      return this.getAll()
    } catch (error) {
      console.error("Erreur lors de la recherche:", error)
      throw error
    }
  }

  // Suppression par commande (pour la gestion des commandes avec lignes)
  async deleteByCommandeId(commandeId: number): Promise<void> {
    try {
      console.log("Suppression de toutes les lignes de la commande:", commandeId)
      const lignes = await this.getByCommandeId(commandeId)

      for (const ligne of lignes) {
        if (ligne.id) {
          await this.delete(ligne.id)
        }
      }

      console.log("Toutes les lignes de la commande supprimées avec succès")
    } catch (error) {
      console.error("Erreur lors de la suppression des lignes par commande:", error)
      throw error
    }
  }
}

export const ligneCommandeService = new LigneCommandeService()
