
import type { Employe } from "./utilisateur"
import type { Personne } from "./utilisateur"

// Types de base

export interface BaseEntity {
  id: number // Long en Java = number en TypeScript
  createdAt?: string
  updatedAt?: string
}

// Types Pharmacie - correspondant EXACTEMENT aux entités Java
export interface Categorie {
  id?: number // Optional pour la création
  nom: string
  description: string
  medicaments?: Medicament[] // Relation OneToMany
}

export interface Medicament {
  id?: number // Optional pour la création
  nom: string
  description: string
  stockTotal: number // Integer en Java
  categorie?: Categorie // Relation ManyToOne - OBLIGATOIRE
  categorieId?: number // Pour les formulaires
  medicamentReferences?: MedicamentReference[] // Relation OneToMany
}

export interface Reference {
  id?: number // Optional pour la création
  nom: string
  description: string
  medicamentReferences?: MedicamentReference[] // Relation OneToMany
}

// ENTITÉ MedicamentReference - Produit final
export interface MedicamentReference {
  id?: number
  quantite: number // Integer - stock total (calculé depuis les lots)
  medicament?: Medicament // Relation ManyToOne
  medicamentId?: number // Pour les formulaires
  reference?: Reference // Relation ManyToOne
  referenceId?: number // Pour les formulaires
  lignesApprovisionnement?: LigneApprovisionnement[] // Relation OneToMany
}

// Types pour les approvisionnements
export interface Approvisionnement {
  id?: number // Long en Java
  dateAppro: string // LocalDateTime en Java -> string ISO en TypeScript
  fournisseur: string
  employe?: Employe // Relation ManyToOne
  employeId?: number // Pour les formulaires
  lignesApprovisionnement?: LigneApprovisionnement[] // Relation OneToMany
}

// LIGNE APPROVISIONNEMENT - Lots individuels (FIFO)
export interface LigneApprovisionnement {
  id?: number // Long en Java
  quantiteInitiale: number // Quantité reçue initialement
  quantiteDisponible: number // Quantité encore disponible pour la vente
  quantite?: number // Alias pour compatibilité
  prixUnitaireAchat: number // Integer (en centimes)
  prixUnitaireVente: number // Integer (en centimes) - Prix de vente
  dateReception: string // LocalDate
  dateExpiration: string // LocalDate
  numeroLot: string // Unique, généré automatiquement si vide
  approvisionnement?: Approvisionnement // Relation ManyToOne
  approvisionnementId?: number // Pour les formulaires
  medicamentReference?: MedicamentReference // Relation ManyToOne
  medicamentReferenceId?: number // Pour les formulaires
  lignesCommande?: LigneCommande[] // Relation OneToMany - ventes de ce lot
}

// // TYPES COMMANDES
// export interface Commande {
//   id?: number // Long en Java
//   dateCommande: string // LocalDate en Java -> string ISO en TypeScript
//   montantTotal: string // String en Java
//   personne?: Personne // Relation ManyToOne
//   personneId?: number // Pour les formulaires
//   lignesCommande?: LigneCommande[] // Relation OneToMany
// }



export interface Commande {
  id?: number
  dateCommande: string
  montantTotal: string
  personne?: Personne // CHANGEMENT ICI : Utilise l'objet Personne complet
  lignesCommande?: LigneCommande[]
  nombreLignes?: number
  montantTotalAsDouble?: number
  valid?: boolean
}


// LIGNE COMMANDE - Vente d'un lot spécifique
export interface LigneCommande {
  id?: number // Long en Java
  quantite: number // Integer
  prixUnitaire: number // Integer (en centimes) - copié depuis LigneApprovisionnement.prixUnitaireVente
  sousTotal?: number // Integer (en centimes) - quantite * prixUnitaire
  commande?: Commande // Relation ManyToOne
  commandeId?: number // Pour les formulaires
  ligneApprovisionnement?: LigneApprovisionnement // Relation ManyToOne - lot vendu
  ligneApprovisionnementId?: number // Pour les formulaires
}

// Types pour les requêtes de recherche
export interface CategorieSearchParams {
  nom?: string
  description?: string
}

export interface MedicamentSearchParams {
  nom?: string
  description?: string
  categorieId?: number
  seuil?: number // Pour low-stock
}

export interface ReferenceSearchParams {
  nom?: string
}

export interface MedicamentReferenceSearchParams {
  medicamentId?: number
  referenceId?: number
  stockMin?: number // Pour filtrer par stock minimum
  disponible?: boolean // Pour filtrer les produits disponibles
}

export interface LigneApprovisionnementSearchParams {
  medicamentReferenceId?: number
  approvisionnementId?: number
  disponible?: boolean // Lots avec stock disponible
  expirant?: boolean // Lots bientôt expirés
  expire?: boolean // Lots expirés
}

export interface CommandeSearchParams {
  dateCommande?: string
  personneId?: number
  montantMin?: string
}

export interface LigneCommandeSearchParams {
  commandeId?: number
  ligneApprovisionnementId?: number // Recherche par lot
  medicamentReferenceId?: number // Recherche par produit (via lot)
  prixMin?: number
}

// Types API Response (pour Spring Boot)
export interface ApiResponse<T> {
  data?: T
  message?: string
  success?: boolean
}

// Types de filtres
export interface SearchFilters {
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

// Autres types existants...
export interface Patient extends BaseEntity {
  numeroSecuriteSociale: string
  prenom: string
  nom: string
  dateNaissance: string
  sexe: "M" | "F"
  telephone: string
  email?: string
  adresse: string
  situationMatrimoniale: string
  profession?: string
  personneContact?: string
  telephoneContact?: string
  mutuelle?: string
  numeroMutuelle?: string
}

// Types utilitaires pour la gestion du stock FIFO
export interface LotInfo {
  id: number
  numeroLot: string
  quantiteDisponible: number
  prixUnitaireVente: number
  dateReception: string
  dateExpiration: string
  medicamentReference?: MedicamentReference
  isExpired: boolean
  isExpiringSoon: boolean // Dans les 30 jours
}

export interface StockInfo {
  produitId: number
  nomProduit: string
  stockTotal: number
  lotsDisponibles: LotInfo[]
  lotsExpirants: LotInfo[]
  enRupture: boolean
}

// Types pour les statistiques
export interface StockSummary {
  totalLots: number
  lotsDisponibles: number
  lotsExpirants: number
  lotsExpires: number
  lotsStockFaible: number
}

export interface VenteStats {
  medicamentReferenceId: number
  nomProduit: string
  quantiteVendue: number
  chiffreAffaires: number
  nombreCommandes: number
}

// Types pour les filtres avancés
export interface LotFilters {
  medicamentReferenceId?: number
  stockMinimum?: number
  expirantDans?: number // jours
  disponibleUniquement?: boolean
  categorieId?: number
  fournisseur?: string
}

export interface CommandeFilters {
  dateDebut?: string
  dateFin?: string
  personneId?: number
  montantMin?: number
  montantMax?: number
  statut?: "en_cours" | "validee" | "annulee"
}

// Types pour les rapports
export interface RapportVentes {
  periode: string
  totalCommandes: number
  chiffreAffaires: number
  produitsVendus: VenteStats[]
  evolutionMensuelle: {
    mois: string
    commandes: number
    montant: number
  }[]
}

export interface RapportStock {
  date: string
  totalProduits: number
  valeursStock: number
  alertesStock: {
    produitsRupture: number
    produitsStockFaible: number
    lotsExpirants: number
    lotsExpires: number
  }
  mouvements: {
    entrees: number
    sorties: number
    ajustements: number
  }
}

export interface CommandeFilters {
  dateDebut?: string
  dateFin?: string
  personneId?: number
  montantMin?: number
  montantMax?: number
  search?: string
}

export interface CommandeStats {
  totalCommandes: number
  montantTotal: number
  commandesAujourdhui: number
  commandesMois: number
  moyenneCommande: number
}

export interface LigneApprovisionnementFilters {
  approvisionnementId?: number
  medicamentReferenceId?: number
  numeroLot?: string
  dateExpirationBefore?: string
  quantiteMin?: number
  disponibleOnly?: boolean
  expiredOnly?: boolean
  lowStockOnly?: boolean
  threshold?: number
}

export interface StockStats {
  totalLots: number
  lotsDisponibles: number
  lotsExpires: number
  lotsExpirantBientot: number
  stockFaible: number
  valeurTotaleStock: number
}

// export interface LigneApprovisionnement {
//   id?: number
//   approvisionnementId?: number
//   medicamentReferenceId?: number
//   numeroLot?: string
//   dateFabrication?: string
//   dateExpiration?: string
//   quantiteRecue?: number
//   quantiteDisponible?: number
//   prixAchatUnitaire?: number
//   prixVenteUnitaire?: number
//   createdAt?: string
//   updatedAt?: string
// }

export interface LotInfo extends LigneApprovisionnement {
  isExpired: boolean
  isExpiringSoon: boolean
  isLowStock: boolean
  daysUntilExpiration: number
  stockStatus: "good" | "low" | "critical" | "expired"
}
