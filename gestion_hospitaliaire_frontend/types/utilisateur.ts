import type { Consultation, SuiviEtat } from "./consultstionsTraitement"

// Types pour les entités de l'application de gestion hospitalière
export interface BaseEntity {
  id?: number
  createdAt?: string
  updatedAt?: string
}

// Interfaces qui représentent l'entité Permission
export interface Permission extends BaseEntity {
  id?: number
  nom: string
  description?: string
}

// Interface qui représente l'entité Role
export interface Role extends BaseEntity {
  id?: number
  nom: string
  description?: string
  permissions?: Permission[] // Relation Many-to-Many avec Permissions
}

// Interface qui représente l'entité Personne
export interface Personne extends BaseEntity {
  id?: number
  nom: string
  prenom: string
  email: string
  adresse: string
  telephone: string
  sexe?: "M" | "F" | "Autre"
  dateNaissance?: string
  situationMatrimoniale?: "Célibataire" | "Marié(e)" | "Divorcé(e)" | "Veuf/Veuve" | "Enfant" | "Autre"
  password?: string
  employe?: Employe // Relation One-to-One avec Employé
  consultations?: Consultation[] // Relation One-to-Many avec Consultations
  suiviEtat?: SuiviEtat[] // Relation One-to-Many avec Suivi d'État
}

export interface Employe extends BaseEntity {
  id?: number
  horaire: string
  dateAffectation: Date | string
  specialite: string
  numOrdre: string // Corrigé pour correspondre au backend
  statut?: "Actif" | "Congé" | "Absent" | "Suspendu"
  personne: Personne // Relation One-to-One avec Personne
  roles: Role[] // Relation Many-to-Many avec Rôles
}

// Types pour les formulaires (basés sur les validations du service Java)
export interface PersonneFormData {
  nom: string // Requis selon PersonneService.java
  prenom: string
  email: string // Requis avec validation email selon PersonneService.java
  adresse: string // Requis avec validation lettres seulement selon PersonneService.java
  telephone: string // Requis avec validation chiffres seulement selon PersonneService.java
  sexe?: string
  dateNaissance?: string
  situationMatrimoniale?: string
  password: string // Requis selon PersonneService.java
}

export interface EmployeFormData {
  horaire: string
  dateAffectation: string
  specialite: string
  numOrdre: string // Corrigé pour correspondre au backend
  statut?: "Actif" | "Congé" | "Absent" | "Suspendu"
  personneId: number
  roleIds: number[]
}

// Types pour les réponses API Spring Boot
export interface PersonneResponse {
  content: Personne[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface EmployeResponse {
  content: Employe[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

// Types pour les statistiques
export interface PersonneStats {
  totalPersonnes: number
  totalEmployes: number
  totalPatients: number
  nouveauxCeMois: number
}

export interface EmployeStats {
  totalEmployes: number
  employes_actifs: number
  employes_conge: number
  nouveauxCeMois: number
}

// Types pour les requêtes de recherche
export interface PersonneSearchParams {
  nom?: string
  email?: string
  telephone?: string
  page?: number
  size?: number
}

// Types pour les erreurs API
export interface ApiError {
  message: string
  status: number
  timestamp: string
  path: string
}

// DTOs pour les requêtes
export interface PersonneRequest {
  nom: string
  prenom: string
  email: string
  adresse?: string
  telephone?: string
  sexe?: string
  dateNaissance?: string
  situationMatrimoniale?: string
  password?: string
}

export interface EmployeRequest {
  specialite?: string
  statut?: string
  dateEmbauche?: string
  salaire?: number
  personneId?: number
  roleId?: number
}

export interface RoleRequest {
  nom: string
  description?: string
  permissions?: number[]
}
