// Configuration API pour Spring Boot
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  TIMEOUT: 30000,
} as const

// Headers par défaut pour Spring Boot
export const API_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const

// Configuration CORS - AJOUTÉ
export const CORS_CONFIG = {
  mode: "cors" as RequestMode,
  credentials: "omit" as RequestCredentials,
} as const

// Endpoints API organisés par domaine
export const API_ENDPOINTS = {
  // Pharmacie - Catégories
  PHARMACIE: {
    CATEGORIES: "/api/categories",
    CATEGORIES_SEARCH: {
      BY_NOM: "/api/categories/search/nom",
      BY_DESCRIPTION: "/api/categories/search/description",
    },
      // Médicaments
    MEDICAMENTS: "/api/medicaments",
    MEDICAMENTS_SEARCH: {
      BY_NOM: "/api/medicaments/search/nom",
      BY_DESCRIPTION: "/api/medicaments/search/description",
      LOW_STOCK: "/api/medicaments/low-stock",
      BY_CATEGORIE: "/api/medicaments/by-categorie",
    },

    // Références
    REFERENCES: "/api/references",
    REFERENCES_SEARCH: {
      BY_NOM: "/api/references/search/nom",
    },

    // MedicamentReference - NOUVEAU
    MEDICAMENT_REFERENCES: "/api/medicament-references",
    MEDICAMENT_REFERENCES_SEARCH: {
      BY_MEDICAMENT: "/api/medicament-references/medicament",
      BY_REFERENCE: "/api/medicament-references/reference",
    },

  },

  
  // Utilisateur
  UTILISATEUR: {
    EMPLOYES: "/api/employe",
    PAS_MEDICALE: "/api/personne/pas-dossier-medical",
    PAS_GROSSES: "/api/personne/pas-dossier-grossesse",
    ROLES: "/api/roles",
    PERMISSIONS: "/api/permissions",
    PERSONNES : "/api/personne",
  },

  // Patients
  PATIENTS: "/api/patients",

  // Auth
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },

  //Consultation
  CONSULTATIONS_TRAITEMENTS:{
  CONSULTATIONS: "/api/consultations",
  PRESCRIPTIONS: "/api/prescriptions",
  SUIVIETATS: "/api/suivietats",
  },
      CONSULTATION_PRENATALE: "/api/consultations-prenatales"
  ,

  DOSSIER: {
    DOSSIER_MEDICAL: "/api/dossiers-medical",
    DOSSIER_MEDICAL_SEARCH: {
      ALL: "/api/dossiers-medical",
      BY_PATIENT: "/api/dossiers-medical/search/patient",
      BY_DATE: "/api/dossiers-medical/search/date",

    },
    DOSSIER_MEDICAL_DETAILS: "/api/dossiers-medical/details",
    DOSSIER_GROSSES: "/api/dossiers-grossesse",
    DOSSIER_GROSSES_SEARCH: {
      BY_PATIENT: "/api/dossiers-grossesse/search/patient",
      BY_DATE: "/api/dossiers-grossesse/search/date",
    },
  },

  }




// Types pour la configuration
export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS]
