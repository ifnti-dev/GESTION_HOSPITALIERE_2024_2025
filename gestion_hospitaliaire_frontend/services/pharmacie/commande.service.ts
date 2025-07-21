import { API_CONFIG, API_ENDPOINTS, API_HEADERS, CORS_CONFIG } from "@/config/api"
import type { Commande } from "@/types/pharmacie"

class CommandeService {
  private baseUrl = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PHARMACIE.COMMANDES}`

  // Créer une nouvelle commande
  async create(commande: Omit<Commande, "id">): Promise<Commande> {
    try {
      console.log("Sending create commande request:", commande)
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: API_HEADERS,
        body: JSON.stringify(commande),
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error creating commande:", errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Commande created successfully:", data)
      return data
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error)
      throw error
    }
  }

  // Récupérer toutes les commandes
  async getAll(): Promise<Commande[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error fetching all commandes:", errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("All commandes fetched:", data)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error)
      throw error
    }
  }

  // Récupérer une commande par ID
  async getById(id: number): Promise<Commande> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error fetching commande ${id}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log(`Commande ${id} fetched:`, data)
      return data
    } catch (error) {
      console.error(`Erreur lors de la récupération de la commande ${id}:`, error)
      throw error
    }
  }

  // Récupérer les commandes par personne
  async getByPersonneId(personneId: number): Promise<Commande[]> {
    try {
      const response = await fetch(`${this.baseUrl}/personne/${personneId}`, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error fetching commandes by personne ${personneId}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log(`Commandes for personne ${personneId} fetched:`, data)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error(`Erreur lors de la récupération des commandes pour la personne ${personneId}:`, error)
      throw error
    }
  }

  // Récupérer les commandes par date
  async getByDate(date: string): Promise<Commande[]> {
    try {
      const response = await fetch(`${this.baseUrl}/date/${date}`, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error fetching commandes by date ${date}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log(`Commandes for date ${date} fetched:`, data)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error(`Erreur lors de la récupération des commandes pour la date ${date}:`, error)
      throw error
    }
  }

  // Récupérer les commandes par période
  async getByDateRange(dateDebut: string, dateFin: string): Promise<Commande[]> {
    try {
      const response = await fetch(`${this.baseUrl}/periode?debut=${dateDebut}&fin=${dateFin}`, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error fetching commandes by date range ${dateDebut}-${dateFin}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log(`Commandes for date range ${dateDebut}-${dateFin} fetched:`, data)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error(`Erreur lors de la récupération des commandes pour la période ${dateDebut} - ${dateFin}:`, error)
      throw error
    }
  }

  // Mettre à jour une commande
  async update(id: number, commande: Partial<Commande>): Promise<Commande> {
    try {
      console.log(`Sending update commande request for ${id}:`, commande)
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: API_HEADERS,
        body: JSON.stringify(commande),
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error updating commande ${id}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log(`Commande ${id} updated successfully:`, data)
      return data
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la commande ${id}:`, error)
      throw error
    }
  }

  // Supprimer une commande
  async delete(id: number): Promise<void> {
    try {
      console.log(`Sending delete commande request for ${id}`)
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error deleting commande ${id}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }
      console.log(`Commande ${id} deleted successfully.`)
    } catch (error) {
      console.error(`Erreur lors de la suppression de la commande ${id}:`, error)
      throw error
    }
  }

  // Recalculer le montant total d'une commande (nouvel endpoint à appeler après ajout de lignes)
  async recalculerMontantTotal(commandeId: number): Promise<void> {
    try {
      console.log(`Sending recalculate total request for commande ${commandeId}`)
      const response = await fetch(`${this.baseUrl}/${commandeId}/recalculer-montant`, {
        method: "POST", // C'est un POST selon votre contrôleur Java
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error recalculating total for commande ${commandeId}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }
      console.log(`Total for commande ${commandeId} recalculated successfully.`)
    } catch (error) {
      console.error(`Erreur lors du recalcul du total pour la commande ${commandeId}:`, error)
      throw error
    }
  }

  // Valider une commande
  async validate(id: number): Promise<Commande> {
    try {
      console.log(`Sending validate commande request for ${id}`)
      const response = await fetch(`${this.baseUrl}/${id}/validate`, {
        method: "POST",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error validating commande ${id}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log(`Commande ${id} validated successfully:`, data)
      return data
    } catch (error) {
      console.error(`Erreur lors de la validation de la commande ${id}:`, error)
      throw error
    }
  }

  // Annuler une commande
  async cancel(id: number): Promise<Commande> {
    try {
      console.log(`Sending cancel commande request for ${id}`)
      const response = await fetch(`${this.baseUrl}/${id}/cancel`, {
        method: "POST",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error canceling commande ${id}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log(`Commande ${id} cancelled successfully:`, data)
      return data
    } catch (error) {
      console.error(`Erreur lors de l'annulation de la commande ${id}:`, error)
      throw error
    }
  }

  // Rechercher des commandes
  async search(query: string): Promise<Commande[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error searching commandes with query "${query}":`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log(`Commandes searched with query "${query}":`, data)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error(`Erreur lors de la recherche de commandes avec la requête "${query}":`, error)
      throw error
    }
  }

  // Obtenir les statistiques des commandes
  async getStats(): Promise<{
    totalCommandes: number
    montantTotal: number
    commandesMois: number
    commandesJour: number
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error fetching commande stats:", errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Commande stats fetched:", data)
      return data
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques des commandes:", error)
      throw error
    }
  }
}

export const commandeService = new CommandeService()
