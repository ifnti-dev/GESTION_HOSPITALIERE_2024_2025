
import { DossierMedical } from "./medical"
import { Consultation, SuiviEtat } from "./consultstionsTraitement"


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
    dossierMedical?: DossierMedical // Relation One-to-One avec Dossier Médical
    dossierGrossesse?: DossierGrossesse // Relation One-to-Many avec Dossier de Grossesse
    rendezVous?: RendezVous[] // Relation One-to-Many avec Rendez-vous
    consultations?: Consultation[] // Relation One-to-Many avec Consultations
    suiviEtat?: SuiviEtat[] // Relation One-to-Many avec Suivi d'État
    suiviGrossesse?: SuiviGrossesse[] // Relation One-to-Many avec Suivi de Grossesse
    accouchements?: Accouchement[] // Relation One-to-Many avec Accouchements
}



export interface Employe extends BaseEntity {
    id?: number
    horaire: string
    dateAffectation: Date
    specialite: string
    numeroOrdre: string
    personne: Personne // Relation One-to-One avec Personne
    roles: Role[] // Relation Many-to-Many avec Rôles
    accouchements?: Accouchement[] // Relation One-to-Many avec Accouchements
    suivisGrossesse?: SuiviGrossesse[] // Relation One-to-Many avec Suivi de Grossesse
    factures?: Facture[] // Relation One-to-Many avec Factures
}


