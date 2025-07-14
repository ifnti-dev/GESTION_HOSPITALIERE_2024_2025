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
  employe?: Employe // Relation ManyToOne
  prescriptions?: Prescription[] // Relation OneToMany
}

export interface CreateConsultation   {
  date: string 
  symptomes: string
  diagnostic: string
  personne: {
    id: number
  }
  employe: {
    id: number
  } 
  prescriptions?: Prescription[]
   createdAt?: string
  updatedAt?: string

}
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
  medicament: {
    id: number;
  };
  medicaments?: MedicamentPrescrit[];
  createdAt?: string;
  updatedAt?: string;
}

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

