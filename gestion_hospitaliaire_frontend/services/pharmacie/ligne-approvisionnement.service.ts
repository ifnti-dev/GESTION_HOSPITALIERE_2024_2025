import { API_CONFIG, API_ENDPOINTS, API_HEADERS, CORS_CONFIG } from "@/config/api"
import type { LigneApprovisionnement } from "@/types/pharmacie"

class LigneApprovisionnementService {
  private baseUrl = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PHARMACIE.LIGNES_APPROVISIONNEMENT}`

  // Récupérer toutes les lignes d'approvisionnement
  async getAll(): Promise<LigneApprovisionnement[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Erreur lors de la récupération des lignes d'approvisionnement:", error)
      throw error
    }
  }

  // Récupérer une ligne d'approvisionnement par ID
  async getById(id: number): Promise<LigneApprovisionnement> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Erreur lors de la récupération de la ligne d'approvisionnement ${id}:`, error)
      throw error
    }
  }

  // Créer une nouvelle ligne d'approvisionnement
  async create(ligne: Omit<LigneApprovisionnement, "id">): Promise<LigneApprovisionnement> {
    try {
      // Préparer les données selon le format attendu par le backend Java
      const ligneData = {
        quantite: ligne.quantite,
        prixUnitaireAchat: ligne.prixUnitaireAchat,
        prixUnitaireVente: ligne.prixUnitaireVente,
        dateReception: ligne.dateReception,
        dateExpiration: ligne.dateExpiration,
        numeroLot: ligne.numeroLot || "", // Sera auto-généré si vide
        // Relations - le backend Java attend les objets complets, pas juste les IDs
        approvisionnement: ligne.approvisionnementId ? { id: ligne.approvisionnementId } : null,
        medicamentReference: ligne.medicamentReferenceId ? { id: ligne.medicamentReferenceId } : null,
      }

      console.log("Données de ligne à envoyer:", ligneData) // Pour debug

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: API_HEADERS,
        ...CORS_CONFIG,
        body: JSON.stringify(ligneData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erreur API:", errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log("Ligne créée:", result) // Pour debug
      return result
    } catch (error) {
      console.error("Erreur lors de la création de la ligne d'approvisionnement:", error)
      throw error
    }
  }

  // Mettre à jour une ligne d'approvisionnement
  async update(id: number, ligne: Partial<LigneApprovisionnement>): Promise<LigneApprovisionnement> {
    try {
      const ligneData = {
        ...ligne,
        id,
        // Relations - le backend Java attend les objets complets
        ...(ligne.approvisionnementId && {
          approvisionnement: { id: ligne.approvisionnementId },
        }),
        ...(ligne.medicamentReferenceId && {
          medicamentReference: { id: ligne.medicamentReferenceId },
        }),
      }

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: API_HEADERS,
        ...CORS_CONFIG,
        body: JSON.stringify(ligneData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la ligne d'approvisionnement ${id}:`, error)
      throw error
    }
  }

  // Supprimer une ligne d'approvisionnement
  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de la ligne d'approvisionnement ${id}:`, error)
      throw error
    }
  }

  // Récupérer les lignes par approvisionnement
  async getByApprovisionnementId(approvisionnementId: number): Promise<LigneApprovisionnement[]> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PHARMACIE.LIGNES_APPROVISIONNEMENT_SEARCH.BY_APPROVISIONNEMENT}/${approvisionnementId}`
      const response = await fetch(url, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Erreur lors de la recherche par approvisionnement:", error)
      throw error
    }
  }

  // Récupérer les lignes expirant avant une date
  async getByDateExpirationBefore(date: string): Promise<LigneApprovisionnement[]> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PHARMACIE.LIGNES_APPROVISIONNEMENT_SEARCH.EXPIRATION_BEFORE}?date=${date}`
      const response = await fetch(url, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Erreur lors de la recherche par date d'expiration:", error)
      throw error
    }
  }
}

export const ligneApprovisionnementService = new LigneApprovisionnementService()