// Types de base
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// Types Personne et Employé
export interface Personne extends BaseEntity {
  prenom: string
  nom: string
  email: string
  telephone: string
  adresse: string
  dateNaissance: string
  situationMatrimoniale: "Célibataire" | "Marié(e)" | "Divorcé(e)" | "Veuf(ve)"
}

export interface Employe extends BaseEntity {
  personneId: string
  personne?: Personne
  horaireDebut: string
  horaireFin: string
  dateAffectation: string
  specialite: string
  numeroOrdre?: string
  statut: "Actif" | "Congé" | "Absent" | "Suspendu"
  roles: Role[]
}

// Types Rôles et Permissions
export interface Role extends BaseEntity {
  nom: string
  description: string
  permissions: Permission[]
  employeCount?: number
}

export interface Permission extends BaseEntity {
  nom: string
  description: string
  categorie: "Patients" | "Médical" | "Pharmacie" | "Finance" | "Administration" | "Système" | "Rapports"
  niveau: "Lecture" | "Écriture" | "Administration"
}

// Types Patient
export interface Patient extends BaseEntity {
  numeroSecuriteSociale: string
  prenom: string
  nom: string
  dateNaissance: string
  sexe: "M" | "F"
  telephone: string
  email?: string
  adresse: string
  situationMatrimoniale: string
  profession?: string
  personneContact?: string
  telephoneContact?: string
  mutuelle?: string
  numeroMutuelle?: string
}

// Types Médicaux
export interface Antecedent extends BaseEntity {
  description: string
}

export interface Allergie extends BaseEntity {
  nom: string
  reaction: string
}

export interface TraitementEnCours extends BaseEntity {
  medicament: string
  posologie: string
  duree: string
}

export interface Hospitalisation extends BaseEntity {
  dateEntree: string
  dateSortie: string
  motif: string
  diagnostic: string
}

export interface Examen extends BaseEntity {
  nom: string
  resultat: string
  date: string
}

export interface DossierMedical extends BaseEntity {
  patientId: string
  patient?: Patient
  numerosDossier: string
  antecedents: Antecedent[]
  allergies: Allergie[]
  traitements: TraitementEnCours[]
  consultations: Consultation[]
  hospitalisations: Hospitalisation[]
}

export interface Consultation extends BaseEntity {
  patientId: string
  medecinId: string
  patient?: Patient
  medecin?: Employe
  dateConsultation: string
  heureConsultation: string
  motif: string
  diagnostic?: string
  traitement?: string
  observations?: string
  type: "Première" | "Suivi" | "Urgente" | "Contrôle"
  statut: "Programmée" | "En cours" | "Terminée" | "Annulée"
  prescriptions: Prescription[]
  examens: Examen[]
}

export interface Prescription extends BaseEntity {
  consultationId: string
  medicamentId: string
  consultation?: Consultation
  medicament?: Medicament
  posologie: string
  duree: string
  quantite: number
  instructions?: string
  statut: "Active" | "Terminée" | "Annulée"
}

// Types Pharmacie
export interface Medicament extends BaseEntity {
  nom: string
  dci: string
  forme: string
  dosage: string
  categorieId: string
  categorie?: Categorie
  prix: number
  stock: number
  stockMin: number
  dateExpiration: string
  laboratoire: string
  codeATC: string
  statut: "Disponible" | "Rupture" | "Périmé"
}

export interface Categorie extends BaseEntity {
  nom: string
  description: string
  couleur: string
  medicaments?: Medicament[]
}

// Types Infirmier
export interface ConstantesVitales extends BaseEntity {
  patientId: string
  infirmierId: string
  patient?: Patient
  infirmier?: Employe
  dateHeure: string
  temperature?: number
  tensionSystolique?: number
  tensionDiastolique?: number
  pouls?: number
  saturationOxygene?: number
  frequenceRespiratoire?: number
  glycemie?: number
  poids?: number
  taille?: number
  observations?: string
}

export interface SoinsInfirmiers extends BaseEntity {
  patientId: string
  infirmierId: string
  patient?: Patient
  infirmier?: Employe
  dateHeure: string
  typeSoin: string
  description: string
  observations?: string
  statut: "Programmé" | "En cours" | "Terminé" | "Reporté"
}

// Types Sage-femme
export interface Grossesse extends BaseEntity {
  patientId: string
  sageFemmeId: string
  patient?: Patient
  sageFemme?: Employe
  dateDebutGrossesse: string
  dateDernieresRegles: string
  termePrevisionnel: string
  parite: string
  gestite: number
  parite_number: number
  risque: "Faible" | "Modéré" | "Élevé"
  statut: "En cours" | "Terminée" | "Interrompue"
  complications?: string[]
  consultations: ConsultationPrenatale[]
}

export interface ConsultationPrenatale extends BaseEntity {
  grossesseId: string
  grossesse?: Grossesse
  dateConsultation: string
  semainesAmenorrhee: number
  poids: number
  tensionArterielle: string
  hauteurUterine?: number
  bruitsCœurFœtal?: boolean
  mouvementsFœtaux?: boolean
  examens?: string[]
  observations?: string
  prochainRendezVous?: string
}

// Types Caissier
export interface Facture extends BaseEntity {
  numero: string
  patientId: string
  patient?: Patient
  dateEmission: string
  dateEcheance: string
  montantHT: number
  montantTVA: number
  montantTTC: number
  remise?: number
  statut: "Brouillon" | "Émise" | "Payée" | "Impayée" | "Annulée"
  modePaiement?: "Espèces" | "CB" | "Chèque" | "Virement"
  lignesFacture: LigneFacture[]
  priseEnCharge?: PriseEnCharge
}

export interface LigneFacture extends BaseEntity {
  factureId: string
  designation: string
  quantite: number
  prixUnitaire: number
  montant: number
  type: "Consultation" | "Médicament" | "Examen" | "Hospitalisation"
}

export interface PriseEnCharge extends BaseEntity {
  factureId: string
  typeAssurance: "CPAM" | "Mutuelle" | "ALD" | "CMU"
  numeroAssure: string
  pourcentageRemboursement: number
  montantRembourse: number
  montantRestant: number
  statut: "En attente" | "Validée" | "Refusée"
}

// Types API Response
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Types de filtres et recherche
export interface SearchFilters {
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PatientFilters extends SearchFilters {
  sexe?: "M" | "F"
  ageMin?: number
  ageMax?: number
}

export interface ConsultationFilters extends SearchFilters {
  dateDebut?: string
  dateFin?: string
  medecinId?: string
  type?: string
  statut?: string
}
