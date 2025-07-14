import { Medicament } from "./pharmacie"
import { Employe, Personne } from "./utilisateur"

// Types de base
export interface BaseEntity {
  id: number
  createdAt?: string
  updatedAt?: string
}

// Consultation médicale
export interface Consultation extends BaseEntity {
  date: string 
  symptomes: string
  diagnostic: string
  personne?: Personne // Relation ManyToOne
  personneId?: number
  employe?: Employe // Relation ManyToOne
  employeId?: number
  prescriptions?: Prescription[] // Relation OneToMany
}

// Prescription de médicaments
export interface Prescription extends BaseEntity {
  quantite: number
  posologie: string
  duree: number
  consultation?: Consultation // Relation ManyToOne
  consultationId?: number
  medicament?: Medicament // Relation ManyToOne
  medicamentId?: number
}

// Suivi de l’état du patient
export interface SuiviEtat extends BaseEntity {
  date: string
  temperature: number
  tension: number
  observations: string
  personne?: Personne // Relation ManyToOne
  personneId?: number
}




export type ConsultationPrenatale = {
  id: number;
  patiente: Personne;
  dateConsultation: string; // Format "YYYY-MM-DD"
  semaineAmenorrhee: number;
  poids: number;
  tensionArterielle: string;
  hauteurUterine: number | null;
  bruitsCardiaquesFoetaux: string | null;
  observations: string | null;
  prochainRdv: string | null; // Format "YYYY-MM-DD"
  alerte: string | null;
};


export type CreateConsultationPrenatalePayload = {
  patiente:{
    id: number;
   };
  dateConsultation: string; // Format "YYYY-MM-DD"
  semaineAmenorrhee: number;
  poids: number;
  tensionArterielle: string;
  hauteurUterine?: number | null;
  bruitsCardiaquesFoetaux?: string | null;
  observations?: string | null;
  prochainRdv?: string | null; // Format "YYYY-MM-DD"
  alerte?: string | null;
};

export type CreateConsultationPayload = Omit<ConsultationPrenatale, 'id' | 'nomPatiente'>;


export type UpdateConsultationPayload = Omit<ConsultationPrenatale, 'nomPatiente'>;

