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

// NOUVELLE ENTITÉ - Produit final à commander/approvisionner
export interface MedicamentReference {
  id?: number
  quantite: number // Integer - quantité du produit
  medicament?: Medicament // Relation ManyToOne
  medicamentId?: number // Pour les formulaires
  reference?: Reference // Relation ManyToOne
  referenceId?: number // Pour les formulaires
  lignesApprovisionnement?: LigneApprovisionnement[] // Relation OneToMany
}


// Types pour les approvisionnements - MISE À JOUR selon les entités Java
export interface Approvisionnement {
  id?: number // Long en Java
  dateAppro: string // LocalDateTime en Java -> string ISO en TypeScript
  fournisseur: string
  employe?: Employe // Relation ManyToOne
  employeId?: number // Pour les formulaires
  lignesApprovisionnement?: LigneApprovisionnement[] // Relation OneToMany
}

// Types pour les lignes d'approvisionnement - MISE À JOUR selon les entités Java
export interface LigneApprovisionnement {
  id?: number // Long en Java
  quantite: number // Integer
  prixUnitaireAchat: number // Integer (en centimes)
  prixUnitaireVente: number // Integer (en centimes)
  dateReception: string // LocalDate
  dateExpiration: string // LocalDate
  numeroLot: string // Unique, généré automatiquement si vide
  approvisionnement?: Approvisionnement // Relation ManyToOne
  // approvisionnementId?: number // Pour les formulaires
  approvisionnementId?: number // Pour les formulaires - IMPORTANT
  medicamentReference?: MedicamentReference // Relation ManyToOne
  // medicamentReferenceId?: number // Pour les formulaires
   medicamentReferenceId?: number // Pour les formulaires - IMPORTANT
}



// NOUVEAUX TYPES - Commandes selon les entités Java
export interface Commande {
  id?: number // Long en Java
  dateCommande: string // LocalDate en Java -> string ISO en TypeScript
  montantTotal: string // String en Java
  personne?: Personne // Relation ManyToOne
  personneId?: number // Pour les formulaires
  lignesCommande?: LigneCommande[] // Relation OneToMany
}

export interface LigneCommande {
  id?: number // Long en Java
  quantite: number // Integer
  prixUnitaire: number // Integer (en centimes)
  commande?: Commande // Relation ManyToOne
  commandeId?: number // Pour les formulaires
  medicament?: Medicament // Relation ManyToOne
  medicamentId?: number // Pour les formulaires
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
}

export interface CommandeSearchParams {
  dateCommande?: string
  personneId?: number
  montantMin?: string
}

export interface LigneCommandeSearchParams {
  commandeId?: number
  medicamentId?: number
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
