import { ConsultationPrenatale } from "./consultstionsTraitement"
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
  nomPartenaire: string
  prenomsPartenaire: string
  professionPartenaire: string
  adressePartenaire: string

  antecedentsMedicaux: string
  antecedentsChirurgicaux: string
  antecedentsGynecologiques: string
  antecedentsObstetricaux: string

  dateOuverture: string
  dateDerniereRegle: string
  datePrevueAccouchement: string

  nombreGrossesses: number
  nombreAccouchements: number

  groupeSanguin: string
  rhesus: string

  statutSerologieRubeole: string
  statutSerologieToxo: string
  statutSerologieHepatiteB: string
  statutSerologieHiv: string
  statutSerologieSyphilis: string

  personne: Personne
  consultationPrenatale: ConsultationPrenatale[] // si tu veux inclure ça côté front
  // accouchements: Accouchement[]
  // suivisGrossesse: SuiviGrossesse[]
}


export interface CreateDossierGrossessePayload {
  nomPartenaire: string
  prenomsPartenaire: string
  professionPartenaire: string
  adressePartenaire: string

  antecedentsMedicaux: string
  antecedentsChirurgicaux: string
  antecedentsGynecologiques: string
  antecedentsObstetricaux: string

  dateOuverture: string
  dateDerniereRegle: string
  datePrevueAccouchement: string

  nombreGrossesses: number
  nombreAccouchements: number

  groupeSanguin: string
  rhesus: string

  statutSerologieRubeole: string
  statutSerologieToxo: string
  statutSerologieHepatiteB: string
  statutSerologieHiv: string
  statutSerologieSyphilis: string

  personne: {
    id: number
  }


}