import { API_CONFIG, API_ENDPOINTS, API_HEADERS, CORS_CONFIG } from "@/config/api"
import type { LigneCommande } from "@/types/pharmacie"

class LigneCommandeService {
  private baseUrl = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE}`

  // Créer une nouvelle ligne de commande (pour les cas où le backend gère la liaison)
  async create(ligneCommandeData: Omit<LigneCommande, "id">): Promise<LigneCommande> {
    try {
      // Note: The backend's LigneCommande model has @JsonIgnore on 'commande',
      // so we should not send the full 'commande' object here.
      // Instead, we send the ligneApprovisionnementId and other details.
      const payload = {
        quantite: ligneCommandeData.quantite,
        prixUnitaire: ligneCommandeData.prixUnitaire,
        sousTotal: ligneCommandeData.quantite * ligneCommandeData.prixUnitaire,
        ligneApprovisionnement: { id: ligneCommandeData.ligneApprovisionnementId },
        // 'commande' is handled by the FIFO endpoint or linked separately by backend
      }

      console.log("Sending createLigneCommande request with payload:", payload)
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: API_HEADERS,
        body: JSON.stringify(payload),
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error creating ligneCommande:", errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("LigneCommande created successfully:", data)
      return data
    } catch (error) {
      console.error("Erreur lors de la création de la ligne de commande:", error)
      throw error
    }
  }

  // Créer une ligne de commande en utilisant la logique FIFO du backend
  // Les paramètres sont envoyés via l'URL car le backend utilise @RequestParam pour un POST.
  async createLigneCommandeFIFO(
    commandeId: number,
    medicamentReferenceId: number,
    quantite: number,
  ): Promise<LigneCommande> {
    try {
      // Construct URL with query parameters
      const url = `${this.baseUrl}/fifo?commandeId=${commandeId}&medicamentReferenceId=${medicamentReferenceId}&quantite=${quantite}`
      console.log("Sending createLigneCommandeFIFO request to URL:", url)

      const response = await fetch(url, {
        method: "POST",
        headers: API_HEADERS,
        // IMPORTANT: No body is sent here, as parameters are in the URL for @RequestParam
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error creating ligneCommande FIFO:", errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("LigneCommande FIFO created successfully:", data)
      return data
    } catch (error) {
      console.error("Erreur lors de la création de la ligne de commande (FIFO):", error)
      throw error
    }
  }

  // Récupérer toutes les lignes de commande
  async getAll(): Promise<LigneCommande[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error fetching all lignesCommande:", errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("Erreur lors de la récupération des lignes de commande:", error)
      throw error
    }
  }

  // Récupérer une ligne de commande par ID
  async getById(id: number): Promise<LigneCommande> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error fetching ligneCommande ${id}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Erreur lors de la récupération de la ligne de commande ${id}:`, error)
      throw error
    }
  }

  // Récupérer les lignes de commande par ID de commande
  async getByCommandeId(commandeId: number): Promise<LigneCommande[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/by-commande/${commandeId}`, // Corrected endpoint based on LigneCommandeController
        {
          method: "GET",
          headers: API_HEADERS,
          ...CORS_CONFIG,
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error fetching lignesCommande for commande ${commandeId}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error(`Erreur lors de la récupération des lignes de commande pour la commande ${commandeId}:`, error)
      throw error
    }
  }

  // Mettre à jour une ligne de commande
  async update(id: number, ligneCommandeData: Partial<LigneCommande>): Promise<LigneCommande> {
    try {
      const payload: any = {
        quantite: ligneCommandeData.quantite,
        prixUnitaire: ligneCommandeData.prixUnitaire,
        sousTotal:
          ligneCommandeData.quantite && ligneCommandeData.prixUnitaire
            ? ligneCommandeData.quantite * ligneCommandeData.prixUnitaire
            : undefined,
      }

      if (ligneCommandeData.ligneApprovisionnementId) {
        payload.ligneApprovisionnement = { id: ligneCommandeData.ligneApprovisionnementId }
      }
      // If commandeId is also updated, it would need similar handling, but it's @JsonIgnore.

      console.log(`Sending update ligneCommande request for ${id} with payload:`, payload)
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: API_HEADERS,
        body: JSON.stringify(payload),
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error updating ligneCommande ${id}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log(`LigneCommande ${id} updated successfully:`, data)
      return data
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la ligne de commande ${id}:`, error)
      throw error
    }
  }

  // Supprimer une ligne de commande
  async delete(id: number): Promise<void> {
    try {
      console.log(`Sending delete ligneCommande request for ${id}`)
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error deleting ligneCommande ${id}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }
      console.log(`LigneCommande ${id} deleted successfully.`)
    } catch (error) {
      console.error(`Erreur lors de la suppression de la ligne de commande ${id}:`, error)
      throw error
    }
  }

  // MODIFIED: This method now fetches all lines for a command and deletes them one by one
  async deleteByCommandeId(commandeId: number): Promise<void> {
    try {
      console.log(`Fetching all lignesCommande for commande ${commandeId} to delete...`)
      const lignesToDelete = await this.getByCommandeId(commandeId) // Use existing getByCommandeId

      if (lignesToDelete.length === 0) {
        console.log(`No lignesCommande found for commande ${commandeId} to delete.`)
        return
      }

      console.log(`Deleting ${lignesToDelete.length} lignesCommande for commande ${commandeId}...`)
      for (const ligne of lignesToDelete) {
        if (ligne.id) {
          await this.delete(ligne.id) // Delete each line individually
        }
      }
      console.log(`All lignesCommande for commande ${commandeId} deleted successfully.`)
    } catch (error) {
      console.error(`Erreur lors de la suppression des lignes de commande pour la commande ${commandeId}:`, error)
      throw error
    }
  }
}

export const ligneCommandeService = new LigneCommandeService()
