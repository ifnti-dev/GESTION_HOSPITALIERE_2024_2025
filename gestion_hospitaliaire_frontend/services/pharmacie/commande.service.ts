import { apiClient } from "../api"
import { API_ENDPOINTS } from "@/config/api"
import type { Commande, CommandeSearchParams } from "@/types/pharmacie"

class CommandeService {
  // CRUD de base
  async getAll(): Promise<Commande[]> {
    try {
      console.log("Récupération de toutes les commandes...")
      const response = await apiClient.get<Commande[]>(API_ENDPOINTS.PHARMACIE.COMMANDES)
      console.log("Commandes récupérées:", response)
      return response || []
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error)
      throw error
    }
  }

  async getById(id: number): Promise<Commande | null> {
    try {
      console.log("Récupération de la commande:", id)
      const response = await apiClient.get<Commande>(`${API_ENDPOINTS.PHARMACIE.COMMANDES}/${id}`)
      console.log("Commande récupérée:", response)
      return response
    } catch (error) {
      console.error("Erreur lors de la récupération de la commande:", error)
      throw error
    }
  }

  async create(commande: Omit<Commande, "id">): Promise<Commande> {
    try {
      console.log("Création d'une nouvelle commande:", commande)
      const response = await apiClient.post<Commande>(API_ENDPOINTS.PHARMACIE.COMMANDES, commande)
      console.log("Commande créée:", response)
      return response
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error)
      throw error
    }
  }

  async update(id: number, commande: Partial<Commande>): Promise<Commande> {
    try {
      console.log("Mise à jour de la commande:", id, commande)
      const response = await apiClient.put<Commande>(`${API_ENDPOINTS.PHARMACIE.COMMANDES}/${id}`, commande)
      console.log("Commande mise à jour:", response)
      return response
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la commande:", error)
      throw error
    }
  }

  async delete(id: number): Promise<void> {
    try {
      console.log("Suppression de la commande:", id)
      await apiClient.delete(`${API_ENDPOINTS.PHARMACIE.COMMANDES}/${id}`)
      console.log("Commande supprimée avec succès")
    } catch (error) {
      console.error("Erreur lors de la suppression de la commande:", error)
      throw error
    }
  }

  // Méthodes de recherche spécialisées
  async getByDate(date: string): Promise<Commande[]> {
    try {
      console.log("Recherche des commandes par date:", date)
      const response = await apiClient.get<Commande[]>(
        `${API_ENDPOINTS.PHARMACIE.COMMANDES_SEARCH.BY_DATE}?date=${date}`,
      )
      console.log("Commandes trouvées par date:", response)
      return response || []
    } catch (error) {
      console.error("Erreur lors de la recherche par date:", error)
      throw error
    }
  }

  async getByPersonneId(personneId: number): Promise<Commande[]> {
    try {
      console.log("Recherche des commandes par personne:", personneId)
      const response = await apiClient.get<Commande[]>(
        `${API_ENDPOINTS.PHARMACIE.COMMANDES_SEARCH.BY_PERSONNE}/${personneId}`,
      )
      console.log("Commandes trouvées par personne:", response)
      return response || []
    } catch (error) {
      console.error("Erreur lors de la recherche par personne:", error)
      throw error
    }
  }

  async getByMontantGreaterThan(montant: string): Promise<Commande[]> {
    try {
      console.log("Recherche des commandes par montant supérieur à:", montant)
      const response = await apiClient.get<Commande[]>(
        `${API_ENDPOINTS.PHARMACIE.COMMANDES_SEARCH.BY_MONTANT}?montant=${montant}`,
      )
      console.log("Commandes trouvées par montant:", response)
      return response || []
    } catch (error) {
      console.error("Erreur lors de la recherche par montant:", error)
      throw error
    }
  }

  // Méthode de recherche générale
  async search(params: CommandeSearchParams): Promise<Commande[]> {
    try {
      console.log("Recherche de commandes avec paramètres:", params)

      if (params.dateCommande) {
        return this.getByDate(params.dateCommande)
      }

      if (params.personneId) {
        return this.getByPersonneId(params.personneId)
      }

      if (params.montantMin) {
        return this.getByMontantGreaterThan(params.montantMin)
      }

      return this.getAll()
    } catch (error) {
      console.error("Erreur lors de la recherche:", error)
      throw error
    }
  }
}

export const commandeService = new CommandeService()
