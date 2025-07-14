import { Medicament } from "./pharmacie"
import { Employe, Personne } from "./utilisateur"

// Types de base
export interface BaseEntity {
    id?: number
    createdAt?: string
    updatedAt?: string
}

// Dossier médical (peut être lié à Personne)
export interface DossierMedical extends BaseEntity {
  antecedents: string
  allergies: string
  traitementsEnCours: string
  tension: number
  groupeSanguin: string
  personne: Personne // Relation OneToOne with Personne
  // Autres informations médicales
}

export interface CreateDossierMedicalPayload {
  antecedents: string
  allergies: string
  traitementsEnCours: string
  tension: number
  groupeSanguin: string
  observations?: string
  personne: {
    id: number
  }
}

// Dossier de Grossesse
export interface DossierGrossesse extends BaseEntity {
  antecedents: string
  allergies: string
  traitementsEnCours: string
  tension: number
  groupeSanguin: string
  dateOuverture: string
  nombreGrossesses: number
  nombreAccouchements: number
  dateDerniereRegle: string
  datePrevueAccouchement: string
  rhesus: string
  statutImmunisationRubeole: string
  statutImmunisationToxo: string
  statutImmunisationHepatiteB: string
  statutSerologieHiv: string
  statutSerologieSyphilis: string
  presenceDiabeteGestationnel: boolean
  presenceHypertensionGestationnelle: boolean
  observationsGenerales: string
  personne: Personne // Relation OneToOne with Personne
}

export interface CreateDossierGrossessePayload {
  antecedents: string
  allergies: string
  traitementsEnCours: string
  tension: number
  groupeSanguin: string
  dateOuverture: string
  nombreGrossesses: number
  nombreAccouchements: number
  dateDerniereRegle: string
  datePrevueAccouchement: string
  rhesus: string
  statutImmunisationRubeole: string
  statutImmunisationToxo: string
  statutImmunisationHepatiteB: string
  statutSerologieHiv: string
  statutSerologieSyphilis: string
  presenceDiabeteGestationnel: boolean
  presenceHypertensionGestationnelle: boolean
  observationsGenerales: string
  personne: {
    id: number
  }
}