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

// Types pour les lignes d'approvisionnement (pour plus tard)
export interface LigneApprovisionnement {
  id?: number
  quantite: number
  prixUnitaireAchat: number
  dateReception: string
  dateExpiration: string
  numeroLot: string
  prixUnitaireVente: number
  medicamentReference?: MedicamentReference
  medicamentReferenceId?: number
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
export interface Personne extends BaseEntity {
  prenom: string
  nom: string
  email: string
  telephone: string
  adresse: string
  dateNaissance: string
  situationMatrimoniale: "Célibataire" | "Marié(e)" | "Divorcé(e)" | "Veuf(ve)"
}

export interface Employe extends BaseEntity {
  personneId: number
  personne?: Personne
  horaireDebut: string
  horaireFin: string
  dateAffectation: string
  specialite: string
  numeroOrdre?: string
  statut: "Actif" | "Congé" | "Absent" | "Suspendu"
  roles: Role[]
}

export interface Role extends BaseEntity {
  nom: string
  description: string
  permissions: Permission[]
  employeCount?: number
}

export interface Permission extends BaseEntity {
  nom: string
  description: string
  categorie: "Patients" | "Médical" | "Pharmacie" | "Finance" | "Administration" | "Système" | "Rapports"
  niveau: "Lecture" | "Écriture" | "Administration"
}

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
