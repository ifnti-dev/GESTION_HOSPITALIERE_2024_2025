import { apiFetch } from "@/lib/apiClient"
import { API_ENDPOINTS } from "@/config/api"
import type {
  Personne,
  PersonneFormData,
  PersonneResponse,
  PersonneStats,
  PersonneSearchParams,
} from "@/types/utilisateur"

// Récupérer toutes les personnes avec pagination (selon Spring Boot)
export async function getPersonnes(page = 0, size = 10): Promise<PersonneResponse> {
  return apiFetch<PersonneResponse>(`${API_ENDPOINTS.UTILISATEUR.PERSONNES}?page=${page}&size=${size}`)
}

// Récupérer toutes les personnes (sans pagination) - correspond au contrôleur Java
export async function getAllPersonnes(): Promise<Personne[]> {
  return apiFetch<Personne[]>(API_ENDPOINTS.UTILISATEUR.PERSONNES)
}

// Récupérer une personne par ID - correspond à obtenirUtilisateurParId dans PersonneController
export async function getPersonneById(personneId: number): Promise<Personne> {
  return apiFetch<Personne>(API_ENDPOINTS.UTILISATEUR.PERSONNES_BY_ID(personneId))
}

// Ajouter une nouvelle personne - correspond à ajouterPersonne dans PersonneController
export async function addPersonne(newPersonne: PersonneFormData): Promise<Personne> {
  // Validation côté client avant envoi (selon les validations du PersonneService.java)
  if (!newPersonne.nom || newPersonne.nom.trim() === "") {
    throw new Error("Le nom est requis.")
  }

  if (!newPersonne.email || newPersonne.email.trim() === "") {
    throw new Error("L'email est requis.")
  }

  if (!newPersonne.adresse || newPersonne.adresse.trim() === "") {
    throw new Error("L'adresse est requise.")
  }

  if (!newPersonne.telephone || newPersonne.telephone.trim() === "") {
    throw new Error("Le numéro de téléphone est requis.")
  }

  if (!newPersonne.password || newPersonne.password.trim() === "") {
    throw new Error("Le mot de passe est requis.")
  }

  const response = await apiFetch<Personne>(API_ENDPOINTS.UTILISATEUR.PERSONNES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPersonne),
  })

  return response
}

// Mettre à jour une personne existante - correspond à mettreAJourUtilisateur dans PersonneController
export async function updatePersonne(id: number, updatedPersonne: PersonneFormData): Promise<Personne> {
  const response = await apiFetch<Personne>(API_ENDPOINTS.UTILISATEUR.PERSONNES_BY_ID(id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedPersonne),
  })

  return response
}

// Supprimer une personne - correspond à supprimerPersonne dans PersonneController
export async function deletePersonne(personneId: number): Promise<void> {
  await apiFetch<void>(API_ENDPOINTS.UTILISATEUR.PERSONNES_BY_ID(personneId), {
    method: "DELETE",
  })
}

// Rechercher des personnes par nom
export async function searchPersonnesByNom(nom: string): Promise<Personne[]> {
  return apiFetch<Personne[]>(`${API_ENDPOINTS.UTILISATEUR.PERSONNES_SEARCH.BY_NOM}?nom=${encodeURIComponent(nom)}`)
}

// Rechercher des personnes par email
export async function searchPersonnesByEmail(email: string): Promise<Personne[]> {
  return apiFetch<Personne[]>(
    `${API_ENDPOINTS.UTILISATEUR.PERSONNES_SEARCH.BY_EMAIL}?email=${encodeURIComponent(email)}`,
  )
}

// Rechercher des personnes par téléphone
export async function searchPersonnesByTelephone(telephone: string): Promise<Personne[]> {
  return apiFetch<Personne[]>(
    `${API_ENDPOINTS.UTILISATEUR.PERSONNES_SEARCH.BY_TELEPHONE}?telephone=${encodeURIComponent(telephone)}`,
  )
}

// Récupérer seulement les employés
export async function getEmployesOnly(): Promise<Personne[]> {
  return apiFetch<Personne[]>(API_ENDPOINTS.UTILISATEUR.PERSONNES_SEARCH.EMPLOYES_ONLY)
}

// Récupérer seulement les patients
export async function getPatientsOnly(): Promise<Personne[]> {
  return apiFetch<Personne[]>(API_ENDPOINTS.UTILISATEUR.PERSONNES_SEARCH.PATIENTS_ONLY)
}

// Récupérer les statistiques des personnes
export async function getPersonneStats(): Promise<PersonneStats> {
  return apiFetch<PersonneStats>(API_ENDPOINTS.UTILISATEUR.STATS.PERSONNES)
}

// Recherche avancée avec paramètres multiples
export async function searchPersonnes(params: PersonneSearchParams): Promise<PersonneResponse> {
  const searchParams = new URLSearchParams()

  if (params.nom) searchParams.append("nom", params.nom)
  if (params.email) searchParams.append("email", params.email)
  if (params.telephone) searchParams.append("telephone", params.telephone)
  if (params.page !== undefined) searchParams.append("page", params.page.toString())
  if (params.size !== undefined) searchParams.append("size", params.size.toString())

  return apiFetch<PersonneResponse>(`${API_ENDPOINTS.UTILISATEUR.PERSONNES}/search?${searchParams.toString()}`)
}
