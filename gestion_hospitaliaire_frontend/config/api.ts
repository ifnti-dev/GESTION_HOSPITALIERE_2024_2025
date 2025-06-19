// Configuration API Spring Boot
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  TIMEOUT: 15000, // Spring Boot peut être plus lent
  RETRY_ATTEMPTS: 3,
} as const

// Endpoints API Spring Boot (convention REST)
export const API_ENDPOINTS = {
  // Auth endpoints Spring Security
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh-token",
    PROFILE: "/auth/me",
  },

  // Personnel endpoints
  PERSONNEL: {
    BASE: "/personnel",
    EMPLOYES: "/employes",
    ROLES: "/roles",
    PERMISSIONS: "/permissions",
  },

  // Patients endpoints
  PATIENTS: {
    BASE: "/patients",
    DOSSIERS: "/dossiers-medicaux",
    SEARCH: "/patients/search",
  },

  // Médecin endpoints
  MEDECIN: {
    CONSULTATIONS: "/consultations",
    PRESCRIPTIONS: "/prescriptions",
    EXAMENS: "/examens",
    PATIENTS: "/medecin/patients",
  },

  // Pharmacie endpoints
  PHARMACIE: {
    MEDICAMENTS: "/medicaments",
    CATEGORIES: "/categories-medicaments",
    STOCK: "/stock",
    COMMANDES: "/commandes",
    APPROVISIONNEMENTS: "/approvisionnements",
  },

  // Infirmier endpoints
  INFIRMIER: {
    CONSTANTES: "/constantes-vitales",
    SOINS: "/soins-infirmiers",
    PATIENTS: "/infirmier/patients",
    ADMINISTRATIONS: "/administrations",
  },

  // Sage-femme endpoints
  SAGE_FEMME: {
    GROSSESSES: "/grossesses",
    CONSULTATIONS_PRENATALES: "/consultations-prenatales",
    PATIENTES: "/sage-femme/patientes",
    ACCOUCHEMENTS: "/accouchements",
  },

  // Caissier endpoints
  CAISSIER: {
    FACTURES: "/factures",
    PAIEMENTS: "/paiements",
    ORDONNANCES: "/ordonnances",
    ACTES_MEDICAUX: "/actes-medicaux",
    PRISES_EN_CHARGE: "/prises-en-charge",
  },

  // Directeur endpoints
  DIRECTEUR: {
    RAPPORTS: "/rapports",
    STATISTIQUES: "/statistiques",
    FINANCES: "/finances",
    DASHBOARD: "/directeur/dashboard",
  },
} as const

// Headers pour Spring Boot
export const API_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest", // Pour Spring Security CSRF
} as const

// Configuration CORS pour Spring Boot
export const CORS_CONFIG = {
  credentials: "include", // Pour les cookies de session Spring
  mode: "cors" as RequestMode,
}
