import { Medicament } from "./pharmacie"
import { Employe, Personne } from "./utilisateur"

// Types de base
export interface BaseEntity {
  observations: string
  personne?: Personne // Relation ManyToOne
  personneId?: number
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
  personneId: number // ID de la personne associée
}