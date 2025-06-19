// Constantes de l'application
export const APP_NAME = "HospitalCare"
export const APP_VERSION = "1.0.0"

// Rôles utilisateur
export const USER_ROLES = {
  DIRECTEUR: "directeur",
  MEDECIN: "medecin",
  INFIRMIER: "infirmier",
  SAGE_FEMME: "sage-femme",
  PHARMACIEN: "pharmacien",
  CAISSIER: "caissier",
} as const

// Statuts génériques
export const STATUTS = {
  ACTIF: "Actif",
  INACTIF: "Inactif",
  SUSPENDU: "Suspendu",
  ARCHIVE: "Archivé",
} as const

// Statuts de consultation
export const CONSULTATION_STATUTS = {
  PROGRAMMEE: "Programmée",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
} as const

// Types de consultation
export const CONSULTATION_TYPES = {
  PREMIERE: "Première",
  SUIVI: "Suivi",
  URGENTE: "Urgente",
  CONTROLE: "Contrôle",
} as const

// Statuts de facture
export const FACTURE_STATUTS = {
  BROUILLON: "Brouillon",
  EMISE: "Émise",
  PAYEE: "Payée",
  IMPAYEE: "Impayée",
  ANNULEE: "Annulée",
} as const

// Modes de paiement
export const MODES_PAIEMENT = {
  ESPECES: "Espèces",
  CB: "CB",
  CHEQUE: "Chèque",
  VIREMENT: "Virement",
} as const

// Types d'assurance
export const TYPES_ASSURANCE = {
  CPAM: "CPAM",
  MUTUELLE: "Mutuelle",
  ALD: "ALD",
  CMU: "CMU",
} as const

// Catégories de permissions
export const PERMISSION_CATEGORIES = {
  PATIENTS: "Patients",
  MEDICAL: "Médical",
  PHARMACIE: "Pharmacie",
  FINANCE: "Finance",
  ADMINISTRATION: "Administration",
  SYSTEME: "Système",
  RAPPORTS: "Rapports",
} as const

// Niveaux de permission
export const PERMISSION_NIVEAUX = {
  LECTURE: "Lecture",
  ECRITURE: "Écriture",
  ADMINISTRATION: "Administration",
} as const

// Situations matrimoniales
export const SITUATIONS_MATRIMONIALES = {
  CELIBATAIRE: "Célibataire",
  MARIE: "Marié(e)",
  DIVORCE: "Divorcé(e)",
  VEUF: "Veuf(ve)",
} as const

// Sexes
export const SEXES = {
  M: "M",
  F: "F",
} as const

// Niveaux de risque
export const NIVEAUX_RISQUE = {
  FAIBLE: "Faible",
  MODERE: "Modéré",
  ELEVE: "Élevé",
} as const

// Pagination par défaut
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

// Délais
export const DEBOUNCE_DELAY = 300
export const TOAST_DURATION = 5000

// Couleurs par rôle
export const ROLE_COLORS = {
  [USER_ROLES.DIRECTEUR]: "red",
  [USER_ROLES.MEDECIN]: "blue",
  [USER_ROLES.INFIRMIER]: "emerald",
  [USER_ROLES.SAGE_FEMME]: "pink",
  [USER_ROLES.PHARMACIEN]: "teal",
  [USER_ROLES.CAISSIER]: "amber",
} as const
