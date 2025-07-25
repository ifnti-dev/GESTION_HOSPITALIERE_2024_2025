import { DossierGrossesse, DossierMedical } from "./medical"
import { Medicament } from "./pharmacie"
import { Employe, Personne } from "./utilisateur"

// Types de base
export interface BaseEntity {
  id: number
  createdAt?: string
  updatedAt?: string
}

// Consultation médicale
export type Consultation = {
  id: number;
  date: string; // ISO string format (YYYY-MM-DD)
  symptomes: string | null;
  diagnostic: string | null;
  temperature: number;  // obligatoire
  poids: number;        // obligatoire
  tensionArterielle: string | null;
  pressionArterielle: string | null;

  prescriptions?: Prescription[] 
  dossierMedical: DossierMedical
  employe: Employe ;
}

export type CreateConsultationPayload = {
  date: string; // ISO string format (YYYY-MM-DD)
  symptomes?: string | null;
  diagnostic?: string | null;
  temperature: number;  // obligatoire
  poids: number;        // obligatoire
  tensionArterielle?: string | null;
  pressionArterielle?: string | null;
  dossierMedical: { id: number }; 
  employe:{ id: number }; 
};

export interface Prescription extends BaseEntity {
  date: string | Date;
  instructions: string;
  quantite: number;
  posologie: string;
  duree: number;
  consultation?: Consultation;
  consultationId?: number;
  patient?: Personne;  
  patientId?: number;
  medicaments?: MedicamentPrescrit[];
}


export interface CreatePrescription {

  quantite: number;
  posologie: string;
  duree: number;
  consultation: {
    id: number;
  };
  
  medicaments?: string;
  createdAt?: string;
  updatedAt?: string;
}




export type ConsultationPrenatale = {
  id: number;
  dateConsultation: string; // Format "YYYY-MM-DD"
  poidsMere: number;
  hauteurUterine: number | null;
  bruitsCoeurFoetal: string | null;
  oedemes: boolean | null;
  mouvementsFoetus: string | null;
  presenceDiabeteGestationnel: boolean | null;
  presenceHypertensionGestationnelle: boolean | null;
  resultatsAnalyses: string | null;
  examensComplementaires: string | null;
  traitementsEnCours: string | null;
  observationsGenerales: string | null;
  decisionMedicale: string | null;
  dateProchaineConsultation: string | null; // Format "YYYY-MM-DD"
  derniereDoseVAT: number | null;
  dateDerniereDoseVAT: string | null; // Format "YYYY-MM-DD"
  dossierGrossesse: DossierGrossesse;
  employe: Employe;
};


export type CreateConsultationPrenatalePayload = {
  dateConsultation: string;
  poidsMere: number;
  hauteurUterine?: number | null;
  bruitsCoeurFoetal?: string | null;
  oedemes?: boolean | null;
  mouvementsFoetus?: string | null;
  presenceDiabeteGestationnel?: boolean | null;
  presenceHypertensionGestationnelle?: boolean | null;
  resultatsAnalyses?: string | null;
  examensComplementaires?: string | null;
  traitementsEnCours?: string | null;
  observationsGenerales?: string | null;
  decisionMedicale?: string | null;
  dateProchaineConsultation?: string | null;
  derniereDoseVAT?: number | null;
  dateDerniereDoseVAT?: string | null;
  dossierGrossesse: { id: number };
  employe: { id: number };
};




export type UpdateConsultationPayload = Omit<ConsultationPrenatale, 'nomPatiente'>;
export interface MedicamentPrescrit {
  id?: number;
  medicament: Medicament;
  medicamentId: number;
  dosage: string;
  quantite: number;
  posologie: string;
}

// export interface MedicamentPrescrit {
//   id?: number;
//   medicament: Medicament;
//   medicamentId: number;
//   dosage: string;
//   quantite: number;
//   posologie: string;
// }

// Suivi de l’état du patient// @/types/suivieEtat.ts

export interface SuivieEtat {
  id: number;
  date: string;
  tension: string;
  temperature: number;
  frequenceCardiaque: number;
  frequenceRespiratoire: number;
  personne: { id: number; nom: string };
  employe: { id: number; nom: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateSuivieEtat {
  date: string;
  tension: string;
  temperature: number;
  frequenceCardiaque: number;
  frequenceRespiratoire: number;
  personne?: { id: number };
  employe?: { id: number };
}

export interface Hospitalisation {
  id: number
  date_entree: string
  date_sortie?: string
  lit: number
  patient?: Personne
  service?: {
    id: number
    nom: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface CreateHospitalisation {
  date_entree: string
  date_sortie?: string
  lit: number
  patient: {
    id: number
  }
  service: {
    id: number
  }
}



// Enum pour les types de prescription
export enum TypePrescription {
  MEDICAMENT = "MEDICAMENT",
  EXAMEN = "EXAMEN"
}

// Interface principale d'une prescription prénatale (telle que renvoyée par l'API)
export interface PrescriptionPrenatale {
  id: number;
  type: TypePrescription;
  designation: string;
  instructions?: string | null;
  commentaire?: string | null;
  dateDebut?: string | null;        // Format "YYYY-MM-DD"
  dateFin?: string | null;          // Format "YYYY-MM-DD"

  // Champs spécifiques aux médicaments
  posologie?: string | null;
  quantiteParJour?: number | null;
  dureeJours?: number | null;

  // Champs spécifiques aux examens
  datePrevue?: string | null;       // Format "YYYY-MM-DD"
  lieuRealisation?: string | null;

  // Relation vers la consultation prénatale
  consultationPrenatale: ConsultationPrenatale;
}

// Payload pour la création (POST) d'une prescription prénatale
export interface CreatePrescriptionPrenatalePayload {
  type: TypePrescription;
  designation: string;
  instructions?: string | null;
  commentaire?: string | null;
  dateDebut?: string | null;
  dateFin?: string | null;

  // Champs médicaments
  posologie?: string | null;
  quantiteParJour?: number | null;
  dureeJours?: number | null;

  // Champs examens
  datePrevue?: string | null;
  lieuRealisation?: string | null;

  // Uniquement l'ID de la consultation
  consultationPrenatale: {
    id: number;
  };
}

// Objet de la consultation prénatale (référencée)

