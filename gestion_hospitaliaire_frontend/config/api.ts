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
  // Pharmacie - Tous les endpoints regroupés
  PHARMACIE: {
    // Catégories
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

    // MedicamentReference
    MEDICAMENT_REFERENCES: "/api/medicament-references",
    MEDICAMENT_REFERENCES_SEARCH: {
      BY_MEDICAMENT: "/api/medicament-references/medicament",
      BY_REFERENCE: "/api/medicament-references/reference",
    },

    // Approvisionnements
    APPROVISIONNEMENTS: "/api/approvisionnements",
    APPROVISIONNEMENTS_AVEC_LIGNES: "/api/approvisionnements/avec-lignes",
    APPROVISIONNEMENTS_SEARCH: {
      BY_DATE: "/api/approvisionnements/by-date",
      BY_FOURNISSEUR: "/api/approvisionnements/by-fournisseur",
      BY_EMPLOYE: "/api/approvisionnements/by-employe",
    },

    // Lignes d'approvisionnement
    LIGNES_APPROVISIONNEMENT: "/api/lignes-approvisionnement",
    LIGNES_APPROVISIONNEMENT_SEARCH: {
      BY_APPROVISIONNEMENT: "/api/lignes-approvisionnement/by-approvisionnement",
      BY_MEDICAMENT_REFERENCE: "/api/lignes-approvisionnement/by-medicament-reference",
      EXPIRATION_BEFORE: "/api/lignes-approvisionnement/expiration-before",
      DISPONIBLES: "/api/lignes-approvisionnement/disponibles",
      FIFO: "/api/lignes-approvisionnement/fifo",
      EXPIRANTS: "/api/lignes-approvisionnement/expirants",
      EXPIRES: "/api/lignes-approvisionnement/expires",
      STOCK_FAIBLE: "/api/lignes-approvisionnement/stock-faible",
      // Nouveaux endpoints basés sur le backend
      BY_NUMERO_LOT: "/api/lignes-approvisionnement/numero-lot",
      AVAILABLE: "/api/lignes-approvisionnement/available",
      AVAILABLE_BY_MEDICAMENT: "/api/lignes-approvisionnement/available/medicament-reference",
      EXPIRING_SOON: "/api/lignes-approvisionnement/expiring-soon",
      EXPIRED: "/api/lignes-approvisionnement/expired",
      LOW_STOCK: "/api/lignes-approvisionnement/low-stock",
      FIFO_ORDER: "/api/lignes-approvisionnement/fifo-order",
      FIFO_BY_MEDICAMENT: "/api/lignes-approvisionnement/fifo-order/medicament-reference",
    },

    // Commandes - Endpoints basés sur CommandeController.java
    COMMANDES: "/api/commandes",
    COMMANDES_SEARCH: {
      BY_DATE: "/api/commandes/by-date",
      BY_PERSONNE: "/api/commandes/by-personne",
      BY_MONTANT: "/api/commandes/by-montant",
      // Nouveaux endpoints du backend
      BY_DATE_SPECIFIC: "/api/commandes/date",
      BY_PERSONNE_SPECIFIC: "/api/commandes/personne",
      BY_MONTANT_SUPERIEUR: "/api/commandes/montant-superieur",
      BY_DATE_RANGE: "/api/commandes/date-range",
      BY_MONTANT_RANGE: "/api/commandes/montant-range",
      ORDERED_BY_DATE: "/api/commandes/ordered-by-date",
      BY_PERSONNE_ORDERED_BY_DATE: "/api/commandes/personne/{id}/ordered-by-date",
      SEARCH_BY_NOM: "/api/commandes/search-by-nom",
      AUJOURDHUI: "/api/commandes/aujourd-hui",
      COUNT_AUJOURDHUI: "/api/commandes/count-aujourd-hui",
      MONTANT_TOTAL_AUJOURDHUI: "/api/commandes/montant-total-aujourd-hui",
      BY_MOIS: "/api/commandes/mois",
      COUNT_BY_PERSONNE: "/api/commandes/count-by-personne",
      MONTANT_TOTAL_BY_PERSONNE: "/api/commandes/montant-total-by-personne",
      COUNT: "/api/commandes/count",
    },
    COMMANDES_ACTIONS: {
      RECALCULER_MONTANT: "/api/commandes/{id}/recalculer-montant",
    },

    // Lignes de commande - Endpoints basés sur LigneCommandeController.java
    LIGNES_COMMANDE: "/api/lignes-commande",
    LIGNES_COMMANDE_SEARCH: {
      BY_COMMANDE: "/api/lignes-commande/by-commande",
      BY_MEDICAMENT: "/api/lignes-commande/by-medicament",
      BY_PRIX: "/api/lignes-commande/by-prix",
      // Nouveaux endpoints du backend
      BY_LIGNE_APPROVISIONNEMENT: "/api/lignes-commande/ligne-approvisionnement",
      BY_NUMERO_LOT: "/api/lignes-commande/numero-lot",
      BY_MEDICAMENT_REFERENCE: "/api/lignes-commande/medicament-reference",
    },
    LIGNES_COMMANDE_ACTIONS: {
      CREATE_FIFO: "/api/lignes-commande/create-fifo",
    },
    LIGNES_COMMANDE_LOTS: {
      DISPONIBLES: "/api/lignes-commande/lots/disponibles",
      BY_MEDICAMENT: "/api/lignes-commande/lots/medicament",
      EXPIRANTS: "/api/lignes-commande/lots/expirants",
      EXPIRES: "/api/lignes-commande/lots/expires",
      STOCK_FAIBLE: "/api/lignes-commande/lots/stock-faible",
      FIFO: "/api/lignes-commande/lots/fifo",
    },

    // Notifications
    NOTIFICATIONS: "/api/notifications",
    NOTIFICATIONS_SEARCH: {
      BY_TYPE: "/api/notifications/by-type",
      NON_LUES: "/api/notifications/non-lues",
    },

    // Rapports
    RAPPORTS: "/api/rapports-inventaire",
    RAPPORTS_SEARCH: {
      BY_DATE: "/api/rapports-inventaire/by-date",
      BY_TYPE: "/api/rapports-inventaire/by-type",
    },

    // Produits (si nécessaire)
    PRODUITS: "/api/produits",
    PRODUITS_SEARCH: {
      BY_NOM: "/api/produits/search/nom",
      BY_CATEGORIE: "/api/produits/by-categorie",
    },

    // Stock
    STOCK: "/api/stock",
    STOCK_SEARCH: {
      LOW_STOCK: "/api/stock/low-stock",
      BY_MEDICAMENT: "/api/stock/by-medicament",
    },
  },

  UTILISATEUR: {
    // PersonneController endpoints
    PERSONNES: "/api/personne",
    PERSONNES_BY_ID: (id: number) => `/api/personne/${id}`,

    // EmployeController endpoints
    EMPLOYES: "/api/employe",
    EMPLOYES_BY_ID: (id: number) => `/api/employe/${id}`,
    EMPLOYES_SEARCH: {
      BY_SPECIALITE: "/api/employe/search/specialite",
      BY_STATUT: "/api/employe/search/statut",
      BY_PERSONNE: "/api/employe/search/personne",
      BY_ROLE: "/api/employe/search/role",
    },

    // RoleController endpoints
    ROLES: "/api/roles",
    ROLES_BY_ID: (id: number) => `/api/role/${id}`,

    // PermissionController endpoints
    PERMISSIONS: "/api/permissions",
    PERMISSIONS_BY_ID: (id: number) => `/api/permission/${id}`,

    // Endpoints de recherche
    PERSONNES_SEARCH: {
      BY_NOM: "/api/personne/search/nom",
      BY_EMAIL: "/api/personne/search/email",
      BY_TELEPHONE: "/api/personne/search/telephone",
      EMPLOYES_ONLY: "/api/personne/employes",
      PATIENTS_ONLY: "/api/personne/patients",
    },

    // Endpoints statistiques
    STATS: {
      PERSONNES: "/api/personne/stats",
      EMPLOYES: "/api/employe/stats",
    },
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
  SUIVIETATS: "/api/suiviEtats",
  }
,
  HOSPITALISATIONS: {
    HOSPITALISATIONS: "/api/hospitalisations",
  },
    
  
  }

  // Consultation
  CONSULTATIONS_TRAITEMENTS: {
    CONSULTATIONS: "/api/consultations",
    PRESCRIPTIONS: "/api/prescriptions",
    SUIVIETATS: "/api/suivietats",
  },

  // Dossiers
  DOSSIER: {
    DOSSIER_MEDICAL: "/api/dossier-medical",
    DOSSIER_MEDICAL_SEARCH: {
      BY_PATIENT: "/api/dossier-medical/search/patient",
      BY_DATE: "/api/dossier-medical/search/date",
    },
    DOSSIER_MEDICAL_DETAILS: "/api/dossier-medical/details",
    DOSSIER_GROSSES: "/api/dossier-grossesses",
    DOSSIER_GROSSES_SEARCH: {
      BY_PATIENT: "/api/dossier-grossesses/search/patient",
      BY_DATE: "/api/dossier-grossesses/search/date",
    },
  },
}

// Fonctions utilitaires
export const buildApiUrl = (endpoint: string, params?: Record<string, string | number>) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`


  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })
    url += `?${searchParams.toString()}`
  }

  return url
}

export const getApiHeaders = (additionalHeaders?: Record<string, string>) => ({
  ...API_HEADERS,
  ...additionalHeaders,
})

// Types pour la configuration
export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS]

// Fonctions helper pour construire les URLs avec paramètres
export const buildCommandeUrl = {
  byId: (id: number) => `${API_ENDPOINTS.PHARMACIE.COMMANDES}/${id}`,
  byDate: (date: string) => `${API_ENDPOINTS.PHARMACIE.COMMANDES_SEARCH.BY_DATE_SPECIFIC}/${date}`,
  byPersonne: (personneId: number) => `${API_ENDPOINTS.PHARMACIE.COMMANDES_SEARCH.BY_PERSONNE_SPECIFIC}/${personneId}`,
  byMontantSuperieur: (montant: number) =>
    `${API_ENDPOINTS.PHARMACIE.COMMANDES_SEARCH.BY_MONTANT_SUPERIEUR}/${montant}`,
  byPersonneOrderedByDate: (personneId: number) =>
    API_ENDPOINTS.PHARMACIE.COMMANDES_SEARCH.BY_PERSONNE_ORDERED_BY_DATE.replace("{id}", personneId.toString()),
  byMois: (annee: number, mois: number) => `${API_ENDPOINTS.PHARMACIE.COMMANDES_SEARCH.BY_MOIS}/${annee}/${mois}`,
  countByPersonne: (personneId: number) =>
    `${API_ENDPOINTS.PHARMACIE.COMMANDES_SEARCH.COUNT_BY_PERSONNE}/${personneId}`,
  montantTotalByPersonne: (personneId: number) =>
    `${API_ENDPOINTS.PHARMACIE.COMMANDES_SEARCH.MONTANT_TOTAL_BY_PERSONNE}/${personneId}`,
  recalculerMontant: (id: number) =>
    API_ENDPOINTS.PHARMACIE.COMMANDES_ACTIONS.RECALCULER_MONTANT.replace("{id}", id.toString()),
}

export const buildLigneCommandeUrl = {
  byId: (id: number) => `${API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE}/${id}`,
  byCommande: (commandeId: number) => `${API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE_SEARCH.BY_COMMANDE}/${commandeId}`,
  byLigneApprovisionnement: (ligneApproId: number) =>
    `${API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE_SEARCH.BY_LIGNE_APPROVISIONNEMENT}/${ligneApproId}`,
  byNumeroLot: (numeroLot: string) => `${API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE_SEARCH.BY_NUMERO_LOT}/${numeroLot}`,
  byMedicamentReference: (medicamentRefId: number) =>
    `${API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE_SEARCH.BY_MEDICAMENT_REFERENCE}/${medicamentRefId}`,
  lotsByMedicament: (medicamentRefId: number) =>
    `${API_ENDPOINTS.PHARMACIE.LIGNES_COMMANDE_LOTS.BY_MEDICAMENT}/${medicamentRefId}`,
}

export const buildLigneApprovisionnementUrl = {
  byId: (id: number) => `${API_ENDPOINTS.PHARMACIE.LIGNES_APPROVISIONNEMENT}/${id}`,
  byApprovisionnement: (approId: number) =>
    `${API_ENDPOINTS.PHARMACIE.LIGNES_APPROVISIONNEMENT_SEARCH.BY_APPROVISIONNEMENT}/${approId}`,
  byMedicamentReference: (medicamentRefId: number) =>
    `${API_ENDPOINTS.PHARMACIE.LIGNES_APPROVISIONNEMENT_SEARCH.BY_MEDICAMENT_REFERENCE}/${medicamentRefId}`,
  byNumeroLot: (numeroLot: string) =>
    `${API_ENDPOINTS.PHARMACIE.LIGNES_APPROVISIONNEMENT_SEARCH.BY_NUMERO_LOT}/${numeroLot}`,
  availableByMedicament: (medicamentRefId: number) =>
    `${API_ENDPOINTS.PHARMACIE.LIGNES_APPROVISIONNEMENT_SEARCH.AVAILABLE_BY_MEDICAMENT}/${medicamentRefId}`,
  expiringSoon: (days: number) => `${API_ENDPOINTS.PHARMACIE.LIGNES_APPROVISIONNEMENT_SEARCH.EXPIRING_SOON}/${days}`,
  lowStock: (seuil: number) => `${API_ENDPOINTS.PHARMACIE.LIGNES_APPROVISIONNEMENT_SEARCH.LOW_STOCK}/${seuil}`,
  fifoByMedicament: (medicamentRefId: number) =>
    `${API_ENDPOINTS.PHARMACIE.LIGNES_APPROVISIONNEMENT_SEARCH.FIFO_BY_MEDICAMENT}/${medicamentRefId}`,
}
