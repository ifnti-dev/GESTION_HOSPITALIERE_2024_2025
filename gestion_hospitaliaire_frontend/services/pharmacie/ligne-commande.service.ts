import { apiClient } from "../api"
import { API_ENDPOINTS, buildLigneCommandeUrl, buildLigneApprovisionnementUrl } from "@/config/api"
import type { LigneCommande, LigneApprovisionnement } from "@/types/pharmacie"

class LigneCommandeService {
  // CRUD de base
  async getAll(): Promise<LigneCommande[]> {
    try {
      console.log("🔄 Récupération de toutes les lignes de commande...")
      const response = await apiClient.get<LigneCommande[]>(API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE)
      console.log("📦 Lignes de commande récupérées:", response)
      return Array.isArray(response) ? response : []
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des lignes de commande:", error)
      return []
    }
  }

  async getById(id: number): Promise<LigneCommande | null> {
    try {
      console.log(`🔄 Récupération de la ligne de commande ${id}...`)
      const response = await apiClient.get<LigneCommande>(buildLigneCommandeUrl.byId(id))
      console.log("📦 Ligne de commande récupérée:", response)
      return response
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération de la ligne de commande ${id}:`, error)
      if (error instanceof Error && error.message.includes("404")) {
        return null
      }
      throw error
    }
  }

  async create(ligneCommande: Omit<LigneCommande, "id">): Promise<LigneCommande> {
    try {
      console.log("🔄 Création d'une nouvelle ligne de commande:", ligneCommande)
      const response = await apiClient.post<LigneCommande>(API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE, ligneCommande)
      console.log("✅ Ligne de commande créée:", response)
      return response
    } catch (error) {
      console.error("❌ Erreur lors de la création de la ligne de commande:", error)
      throw error
    }
  }

  async update(id: number, ligneCommande: Partial<LigneCommande>): Promise<LigneCommande> {
    try {
      console.log(`🔄 Mise à jour de la ligne de commande ${id}:`, ligneCommande)
      const response = await apiClient.put<LigneCommande>(buildLigneCommandeUrl.byId(id), ligneCommande)
      console.log("✅ Ligne de commande mise à jour:", response)
      return response
    } catch (error) {
      console.error(`❌ Erreur lors de la mise à jour de la ligne de commande ${id}:`, error)
      throw error
    }
  }

  async delete(id: number): Promise<void> {
    try {
      console.log(`🔄 Suppression de la ligne de commande ${id}...`)
      await apiClient.delete(buildLigneCommandeUrl.byId(id))
      console.log("✅ Ligne de commande supprimée avec succès")
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression de la ligne de commande ${id}:`, error)
      throw error
    }
  }

  // Méthodes de recherche basées sur le backend
  async getByCommandeId(commandeId: number): Promise<LigneCommande[]> {
    try {
      console.log(`🔄 Récupération des lignes de commande pour la commande ${commandeId}...`)
      const response = await apiClient.get<LigneCommande[]>(buildLigneCommandeUrl.byCommande(commandeId))
      console.log("📦 Lignes de commande trouvées:", response)
      return Array.isArray(response) ? response : []
    } catch (error) {
      console.error(`❌ Erreur lors de la recherche par commande ${commandeId}:`, error)
      return []
    }
  }

  async deleteByCommandeId(commandeId: number): Promise<void> {
    try {
      console.log(`🔄 Suppression des lignes de commande pour la commande ${commandeId}...`)
      await apiClient.delete(buildLigneCommandeUrl.byCommande(commandeId))
      console.log("✅ Lignes de commande supprimées avec succès")
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression des lignes de commande pour la commande ${commandeId}:`, error)
      throw error
    }
  }

  async getByLigneApprovisionnementId(ligneApprovisionnementId: number): Promise<LigneCommande[]> {
    try {
      console.log(`🔄 Récupération des lignes de commande pour le lot ${ligneApprovisionnementId}...`)
      const response = await apiClient.get<LigneCommande[]>(
        buildLigneCommandeUrl.byLigneApprovisionnement(ligneApprovisionnementId),
      )
      console.log("📦 Lignes de commande trouvées:", response)
      return Array.isArray(response) ? response : []
    } catch (error) {
      console.error(`❌ Erreur lors de la recherche par lot ${ligneApprovisionnementId}:`, error)
      return []
    }
  }

  async getByNumeroLot(numeroLot: string): Promise<LigneCommande[]> {
    try {
      console.log(`🔄 Récupération des lignes de commande pour le lot ${numeroLot}...`)
      const response = await apiClient.get<LigneCommande[]>(buildLigneCommandeUrl.byNumeroLot(numeroLot))
      console.log("📦 Lignes de commande trouvées:", response)
      return Array.isArray(response) ? response : []
    } catch (error) {
      console.error(`❌ Erreur lors de la recherche par numéro de lot ${numeroLot}:`, error)
      return []
    }
  }

  async getByMedicamentReference(medicamentReferenceId: number): Promise<LigneCommande[]> {
    try {
      console.log(`🔄 Récupération des lignes de commande pour le médicament ${medicamentReferenceId}...`)
      const response = await apiClient.get<LigneCommande[]>(
        buildLigneCommandeUrl.byMedicamentReference(medicamentReferenceId),
      )
      console.log("📦 Lignes de commande trouvées:", response)
      return Array.isArray(response) ? response : []
    } catch (error) {
      console.error(`❌ Erreur lors de la recherche par médicament ${medicamentReferenceId}:`, error)
      return []
    }
  }

  // Méthode FIFO pour créer automatiquement des lignes de commande
  async createFifoLigneCommande(
    commandeId: number,
    medicamentReferenceId: number,
    quantite: number,
  ): Promise<LigneCommande> {
    try {
      console.log("🔄 Création FIFO de ligne de commande:", {
        commandeId,
        medicamentReferenceId,
        quantite,
      })

      const requestData = {
        commandeId,
        medicamentReferenceId,
        quantite,
      }

      const response = await apiClient.post<LigneCommande>(
        API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE_ACTIONS.CREATE_FIFO,
        requestData,
      )
      console.log("✅ Ligne de commande FIFO créée:", response)
      return response
    } catch (error) {
      console.error("❌ Erreur lors de la création FIFO de la ligne de commande:", error)
      throw error
    }
  }

  // Méthodes FIFO pour la gestion des lots
  async getAllAvailableLots(): Promise<LigneApprovisionnement[]> {
    try {
      console.log("🔄 Récupération de tous les lots disponibles...")
      const response = await apiClient.get<LigneApprovisionnement[]>(
        API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE_LOTS.DISPONIBLES,
      )
      console.log("📦 Lots disponibles récupérés:", response)

      if (Array.isArray(response)) {
        // Trier par date de réception (FIFO) puis par date d'expiration
        return response.sort((a, b) => {
          const dateA = new Date(a.dateReception)
          const dateB = new Date(b.dateReception)
          if (dateA.getTime() === dateB.getTime()) {
            // Si même date de réception, trier par date d'expiration
            return new Date(a.dateExpiration).getTime() - new Date(b.dateExpiration).getTime()
          }
          return dateA.getTime() - dateB.getTime()
        })
      }

      return []
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des lots disponibles:", error)
      return []
    }
  }

  async getAvailableLotsByMedicament(medicamentReferenceId: number): Promise<LigneApprovisionnement[]> {
    try {
      console.log(`🔄 Récupération des lots disponibles pour le médicament ${medicamentReferenceId}...`)
      const response = await apiClient.get<LigneApprovisionnement[]>(
        buildLigneCommandeUrl.lotsByMedicament(medicamentReferenceId),
      )
      console.log("📦 Lots disponibles par médicament:", response)

      if (Array.isArray(response)) {
        // Trier par date de réception (FIFO)
        return response.sort((a, b) => {
          const dateA = new Date(a.dateReception)
          const dateB = new Date(b.dateReception)
          return dateA.getTime() - dateB.getTime()
        })
      }

      return []
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération des lots par médicament ${medicamentReferenceId}:`, error)
      return []
    }
  }

  async getExpiringLots(days = 30): Promise<LigneApprovisionnement[]> {
    try {
      console.log(`🔄 Récupération des lots expirants dans ${days} jours...`)
      const response = await apiClient.get<LigneApprovisionnement[]>(
        `${API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE_LOTS.EXPIRANTS}?days=${days}`,
      )
      console.log("📦 Lots expirants récupérés:", response)
      return Array.isArray(response) ? response : []
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération des lots expirants dans ${days} jours:`, error)
      return []
    }
  }

  async getExpiredLots(): Promise<LigneApprovisionnement[]> {
    try {
      console.log("🔄 Récupération des lots expirés...")
      const response = await apiClient.get<LigneApprovisionnement[]>(
        API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE_LOTS.EXPIRES,
      )
      console.log("📦 Lots expirés récupérés:", response)
      return Array.isArray(response) ? response : []
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des lots expirés:", error)
      return []
    }
  }

  async getLowStockLots(threshold = 10): Promise<LigneApprovisionnement[]> {
    try {
      console.log(`🔄 Récupération des lots avec stock faible (seuil: ${threshold})...`)
      const response = await apiClient.get<LigneApprovisionnement[]>(
        `${API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE_LOTS.STOCK_FAIBLE}?threshold=${threshold}`,
      )
      console.log("📦 Lots avec stock faible récupérés:", response)
      return Array.isArray(response) ? response : []
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération des lots avec stock faible (seuil: ${threshold}):`, error)
      return []
    }
  }

  // Méthodes utilitaires
  async validateStock(medicamentReferenceId: number, quantite: number): Promise<boolean> {
    try {
      const lots = await this.getAvailableLotsByMedicament(medicamentReferenceId)
      const totalStock = lots.reduce((total, lot) => total + (lot.quantiteDisponible || 0), 0)
      return totalStock >= quantite
    } catch (error) {
      console.error("❌ Erreur lors de la validation du stock:", error)
      return false
    }
  }

  async calculateTotalPrice(lignesCommande: LigneCommande[]): Promise<number> {
    return lignesCommande.reduce((total, ligne) => {
      const prix = ligne.prixUnitaire || 0
      const quantite = ligne.quantite || 0
      return total + (prix * quantite) / 100 // Conversion centimes vers euros
    }, 0)
  }

  // Méthode pour obtenir le résumé des stocks
  async getStockSummary(): Promise<{
    totalLots: number
    lotsDisponibles: number
    lotsExpirants: number
    lotsExpires: number
    lotsStockFaible: number
  }> {
    try {
      const [allLots, expiringLots, expiredLots, lowStockLots] = await Promise.all([
        this.getAllAvailableLots(),
        this.getExpiringLots(),
        this.getExpiredLots(),
        this.getLowStockLots(),
      ])

      const lotsDisponibles = allLots.filter((lot) => (lot.quantiteDisponible || 0) > 0)

      return {
        totalLots: allLots.length,
        lotsDisponibles: lotsDisponibles.length,
        lotsExpirants: expiringLots.length,
        lotsExpires: expiredLots.length,
        lotsStockFaible: lowStockLots.length,
      }
    } catch (error) {
      console.error("❌ Erreur lors du calcul du résumé des stocks:", error)
      return {
        totalLots: 0,
        lotsDisponibles: 0,
        lotsExpirants: 0,
        lotsExpires: 0,
        lotsStockFaible: 0,
      }
    }
  }

  // Méthode pour obtenir les informations détaillées d'un lot
  async getLotDetails(ligneApprovisionnementId: number): Promise<LigneApprovisionnement | null> {
    try {
      console.log(`🔄 Récupération des détails du lot ${ligneApprovisionnementId}...`)
      const response = await apiClient.get<LigneApprovisionnement>(
        buildLigneApprovisionnementUrl.byId(ligneApprovisionnementId),
      )
      console.log("📦 Détails du lot récupérés:", response)
      return response
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération des détails du lot ${ligneApprovisionnementId}:`, error)
      return null
    }
  }
}

export const ligneCommandeService = new LigneCommandeService()
