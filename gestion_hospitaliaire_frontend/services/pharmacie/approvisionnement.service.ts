import { API_CONFIG, API_ENDPOINTS, API_HEADERS, CORS_CONFIG } from "@/config/api"
import type { Approvisionnement } from "@/types/pharmacie"

class ApprovisionnementService {
  private baseUrl = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PHARMACIE.APPROVISIONNEMENTS}`

  // Récupérer tous les approvisionnements
  async getAll(): Promise<Approvisionnement[]> {
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
      console.error("Erreur lors de la récupération des approvisionnements:", error)
      throw error
    }
  }

  // Récupérer un approvisionnement par ID
  async getById(id: number): Promise<Approvisionnement> {
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
      console.error(`Erreur lors de la récupération de l'approvisionnement ${id}:`, error)
      throw error
    }
  }

  // Créer un nouvel approvisionnement
  async create(approvisionnement: Omit<Approvisionnement, "id">): Promise<Approvisionnement> {
    try {
      // Préparer les données selon le format attendu par le backend Java
      const approData = {
        fournisseur: approvisionnement.fournisseur,
        // dateAppro sera générée automatiquement par @PrePersist
        // Relation employé - le backend Java attend l'objet complet
        employe: approvisionnement.employeId ? { id: approvisionnement.employeId } : null,
      }

      console.log("Données d'approvisionnement à envoyer:", approData) // Debug

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: API_HEADERS,
        ...CORS_CONFIG,
        body: JSON.stringify(approData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erreur création approvisionnement:", errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log("Approvisionnement créé:", result) // Debug
      return result
    } catch (error) {
      console.error("Erreur lors de la création de l'approvisionnement:", error)
      throw error
    }
  }

  // Méthode pour créer l'approvisionnement puis ses lignes séparément
  async createWithLignes(approvisionnement: Omit<Approvisionnement, "id">): Promise<Approvisionnement> {
    try {
      // 1. Créer d'abord l'approvisionnement sans les lignes
      const { lignesApprovisionnement, ...approData } = approvisionnement

      console.log("Création de l'approvisionnement:", approData) // Debug

      const createdAppro = await this.create(approData)
      console.log("Approvisionnement créé:", createdAppro) // Debug

      // 2. Si il y a des lignes, les créer une par une
      if (lignesApprovisionnement && lignesApprovisionnement.length > 0) {
        const { ligneApprovisionnementService } = await import("./ligne-approvisionnement.service")

        const createdLignes = []
        for (const [index, ligne] of lignesApprovisionnement.entries()) {
          try {
            console.log(`Création ligne ${index + 1}:`, ligne) // Debug

            const ligneData = {
              quantite: ligne.quantite,
              prixUnitaireAchat: ligne.prixUnitaireAchat,
              prixUnitaireVente: ligne.prixUnitaireVente,
              dateReception: ligne.dateReception,
              dateExpiration: ligne.dateExpiration,
              numeroLot: ligne.numeroLot || "",
              // IMPORTANT: Lier à l'approvisionnement créé
              approvisionnementId: createdAppro.id,
              // IMPORTANT: Lier au médicament référence
              medicamentReferenceId: ligne.medicamentReferenceId,
            }

            console.log(`Données ligne ${index + 1} à envoyer:`, ligneData) // Debug

            const createdLigne = await ligneApprovisionnementService.create(ligneData)
            console.log(`Ligne ${index + 1} créée:`, createdLigne) // Debug
            createdLignes.push(createdLigne)
          } catch (ligneError) {
            console.error(`Erreur lors de la création de la ligne ${index + 1}:`, ligneError)
            // Continue avec les autres lignes mais log l'erreur
          }
        }

        console.log("Toutes les lignes créées:", createdLignes) // Debug

        // Retourner l'approvisionnement avec ses lignes
        return {
          ...createdAppro,
          lignesApprovisionnement: createdLignes,
        }
      }

      return createdAppro
    } catch (error) {
      console.error("Erreur lors de la création de l'approvisionnement avec lignes:", error)
      throw error
    }
  }

  // Mettre à jour un approvisionnement
  async update(id: number, approvisionnement: Partial<Approvisionnement>): Promise<Approvisionnement> {
    try {
      const approData = {
        ...approvisionnement,
        id,
        // Relation employé si fournie
        ...(approvisionnement.employeId && {
          employe: { id: approvisionnement.employeId },
        }),
      }

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: API_HEADERS,
        ...CORS_CONFIG,
        body: JSON.stringify(approData),
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'approvisionnement ${id}:`, error)
      throw error
    }
  }

  // Méthode pour mettre à jour l'approvisionnement avec ses lignes
  async updateWithLignes(id: number, approvisionnement: Partial<Approvisionnement>): Promise<Approvisionnement> {
    try {
      // 1. Mettre à jour d'abord l'approvisionnement sans les lignes
      const { lignesApprovisionnement, ...approData } = approvisionnement

      console.log("Mise à jour de l'approvisionnement:", approData) // Debug

      const updatedAppro = await this.update(id, approData)
      console.log("Approvisionnement mis à jour:", updatedAppro) // Debug

      // 2. Si il y a des lignes, les gérer
      if (lignesApprovisionnement && lignesApprovisionnement.length > 0) {
        const { ligneApprovisionnementService } = await import("./ligne-approvisionnement.service")

        // 3. D'abord récupérer les lignes existantes pour les supprimer individuellement
        try {
          console.log("Récupération des lignes existantes pour suppression...") // Debug
          const existingLignes = await ligneApprovisionnementService.getByApprovisionnementId(id)
          console.log("Lignes existantes trouvées:", existingLignes) // Debug

          // Supprimer chaque ligne existante individuellement
          for (const existingLigne of existingLignes) {
            if (existingLigne.id) {
              try {
                await ligneApprovisionnementService.delete(existingLigne.id)
                console.log(`Ligne ${existingLigne.id} supprimée`) // Debug
              } catch (deleteError) {
                console.warn(`Erreur lors de la suppression de la ligne ${existingLigne.id}:`, deleteError)
              }
            }
          }
        } catch (error) {
          console.warn("Erreur lors de la récupération/suppression des anciennes lignes:", error)
          // Continue même si la suppression échoue
        }

        // 4. Attendre un peu pour s'assurer que les suppressions sont terminées
        await new Promise((resolve) => setTimeout(resolve, 500))

        // 5. Créer les nouvelles lignes
        const createdLignes = []
        for (const [index, ligne] of lignesApprovisionnement.entries()) {
          try {
            console.log(`Création nouvelle ligne ${index + 1}:`, ligne) // Debug

            const ligneData = {
              quantite: ligne.quantite,
              prixUnitaireAchat: ligne.prixUnitaireAchat,
              prixUnitaireVente: ligne.prixUnitaireVente,
              dateReception: ligne.dateReception,
              dateExpiration: ligne.dateExpiration,
              numeroLot: ligne.numeroLot || "",
              // IMPORTANT: Lier à l'approvisionnement mis à jour
              approvisionnementId: id,
              // IMPORTANT: Lier au médicament référence
              medicamentReferenceId: ligne.medicamentReferenceId,
            }

            console.log(`Données nouvelle ligne ${index + 1} à envoyer:`, ligneData) // Debug

            const createdLigne = await ligneApprovisionnementService.create(ligneData)
            console.log(`Nouvelle ligne ${index + 1} créée:`, createdLigne) // Debug
            createdLignes.push(createdLigne)
          } catch (ligneError) {
            console.error(`Erreur lors de la création de la nouvelle ligne ${index + 1}:`, ligneError)
            // Continue avec les autres lignes mais log l'erreur
          }
        }

        console.log("Toutes les nouvelles lignes créées:", createdLignes) // Debug

        // Retourner l'approvisionnement avec ses nouvelles lignes
        return {
          ...updatedAppro,
          lignesApprovisionnement: createdLignes,
        }
      }

      return updatedAppro
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'approvisionnement avec lignes:", error)
      throw error
    }
  }

  // Supprimer un approvisionnement
  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'approvisionnement ${id}:`, error)
      throw error
    }
  }

  // Rechercher par date
  async getByDate(date: string): Promise<Approvisionnement[]> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PHARMACIE.APPROVISIONNEMENTS_SEARCH.BY_DATE}?date=${date}`
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
      console.error("Erreur lors de la recherche par date:", error)
      throw error
    }
  }

  // Rechercher par fournisseur
  async getByFournisseur(fournisseur: string): Promise<Approvisionnement[]> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PHARMACIE.APPROVISIONNEMENTS_SEARCH.BY_FOURNISSEUR}?fournisseur=${encodeURIComponent(fournisseur)}`
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
      console.error("Erreur lors de la recherche par fournisseur:", error)
      throw error
    }
  }

  // Rechercher par employé
  async getByEmployeId(employeId: number): Promise<Approvisionnement[]> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PHARMACIE.APPROVISIONNEMENTS_SEARCH.BY_EMPLOYE}/${employeId}`
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
      console.error("Erreur lors de la recherche par employé:", error)
      throw error
    }
  }
}

export const approvisionnementService = new ApprovisionnementService()
