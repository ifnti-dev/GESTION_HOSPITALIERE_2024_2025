import { z } from "zod"

// Schémas de validation Zod
export const PersonneSchema = z.object({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  telephone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Numéro de téléphone invalide"),
  adresse: z.string().min(5, "Adresse trop courte"),
  dateNaissance: z.string().refine((date) => {
    const d = new Date(date)
    const today = new Date()
    return d < today && d > new Date("1900-01-01")
  }, "Date de naissance invalide"),
  situationMatrimoniale: z.enum(["Célibataire", "Marié(e)", "Divorcé(e)", "Veuf(ve)"]),
})

export const EmployeSchema = z.object({
  personneId: z.string().uuid("ID personne invalide"),
  horaireDebut: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Heure invalide"),
  horaireFin: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Heure invalide"),
  dateAffectation: z.string(),
  specialite: z.string().min(2, "Spécialité requise"),
  numeroOrdre: z.string().optional(),
  statut: z.enum(["Actif", "Congé", "Absent", "Suspendu"]),
})

export const PatientSchema = z.object({
  numeroSecuriteSociale: z.string().regex(/^[1-2]\d{12}\d{2}$/, "Numéro de sécurité sociale invalide"),
  prenom: z.string().min(2, "Prénom requis"),
  nom: z.string().min(2, "Nom requis"),
  dateNaissance: z.string(),
  sexe: z.enum(["M", "F"]),
  telephone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Téléphone invalide"),
  email: z.string().email("Email invalide").optional(),
  adresse: z.string().min(5, "Adresse requise"),
  situationMatrimoniale: z.string(),
  profession: z.string().optional(),
  personneContact: z.string().optional(),
  telephoneContact: z.string().optional(),
  mutuelle: z.string().optional(),
  numeroMutuelle: z.string().optional(),
})

export const ConsultationSchema = z.object({
  patientId: z.string().uuid(),
  medecinId: z.string().uuid(),
  dateConsultation: z.string(),
  heureConsultation: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Heure invalide"),
  motif: z.string().min(5, "Motif requis"),
  diagnostic: z.string().optional(),
  traitement: z.string().optional(),
  observations: z.string().optional(),
  type: z.enum(["Première", "Suivi", "Urgente", "Contrôle"]),
  statut: z.enum(["Programmée", "En cours", "Terminée", "Annulée"]),
})

export const ConstantesVitalesSchema = z.object({
  patientId: z.string().uuid(),
  infirmierId: z.string().uuid(),
  dateHeure: z.string(),
  temperature: z.number().min(30).max(45).optional(),
  tensionSystolique: z.number().min(50).max(300).optional(),
  tensionDiastolique: z.number().min(30).max(200).optional(),
  pouls: z.number().min(30).max(200).optional(),
  saturationOxygene: z.number().min(70).max(100).optional(),
  frequenceRespiratoire: z.number().min(5).max(50).optional(),
  glycemie: z.number().min(0.3).max(5).optional(),
  poids: z.number().min(0.5).max(300).optional(),
  taille: z.number().min(30).max(250).optional(),
  observations: z.string().optional(),
})

// Fonctions de validation
export const validatePersonne = (data: any) => {
  return PersonneSchema.safeParse(data)
}

export const validateEmploye = (data: any) => {
  return EmployeSchema.safeParse(data)
}

export const validatePatient = (data: any) => {
  return PatientSchema.safeParse(data)
}

export const validateConsultation = (data: any) => {
  return ConsultationSchema.safeParse(data)
}

export const validateConstantesVitales = (data: any) => {
  return ConstantesVitalesSchema.safeParse(data)
}
