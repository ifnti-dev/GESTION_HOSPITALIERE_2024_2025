import { apiFetch } from "@/lib/apiClient"
import { API_ENDPOINTS } from "@/config/api"
import type { Employe, EmployeFormData, EmployeResponse, EmployeStats } from "@/types/utilisateur"

// Récupérer tous les employés avec pagination
export async function getEmployes(page = 0, size = 10): Promise<EmployeResponse> {
  return apiFetch<EmployeResponse>(`${API_ENDPOINTS.UTILISATEUR.EMPLOYES}?page=${page}&size=${size}`)
}

// Récupérer tous les employés (sans pagination)
export async function getAllEmployes(): Promise<Employe[]> {
  return apiFetch<Employe[]>(API_ENDPOINTS.UTILISATEUR.EMPLOYES)
}

// Récupérer un employé par ID
export async function getEmployeById(employeId: number): Promise<Employe> {
  return apiFetch<Employe>(`${API_ENDPOINTS.UTILISATEUR.EMPLOYES}/${employeId}`)
}

// Ajouter un nouvel employé
export async function addEmploye(newEmploye: EmployeFormData): Promise<Employe> {
  console.log("=== SERVICE FRONTEND - CRÉATION EMPLOYÉ ===")
  console.log("Données reçues du formulaire:", newEmploye)

  // Transformer les données du formulaire en format attendu par le backend
  const employeData = {
    horaire: newEmploye.horaire,
    dateAffectation: newEmploye.dateAffectation,
    specialite: newEmploye.specialite,
    numOrdre: newEmploye.numOrdre,
    personne: {
      id: newEmploye.personneId,
    },
    roles: newEmploye.roleIds.map((roleId) => ({ id: roleId })),
  }

  console.log("Données transformées pour le backend:", employeData)

  const response = await apiFetch<Employe>(API_ENDPOINTS.UTILISATEUR.EMPLOYES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employeData),
  })

  console.log("Réponse du backend:", response)
  return response
}

// Mettre à jour un employé existant
export async function updateEmploye(id: number, updatedEmploye: EmployeFormData): Promise<Employe> {
  console.log("=== SERVICE FRONTEND - MISE À JOUR EMPLOYÉ ===")
  console.log("ID:", id)
  console.log("Données:", updatedEmploye)

  // Transformer les données du formulaire en format attendu par le backend
  const employeData = {
    horaire: updatedEmploye.horaire,
    dateAffectation: updatedEmploye.dateAffectation,
    specialite: updatedEmploye.specialite,
    numOrdre: updatedEmploye.numOrdre,
    personne: {
      id: updatedEmploye.personneId,
    },
    roles: updatedEmploye.roleIds.map((roleId) => ({ id: roleId })),
  }

  const response = await apiFetch<Employe>(`${API_ENDPOINTS.UTILISATEUR.EMPLOYES}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employeData),
  })

  return response
}

// Supprimer un employé
export async function deleteEmploye(employeId: number): Promise<void> {
  await apiFetch<void>(`${API_ENDPOINTS.UTILISATEUR.EMPLOYES}/${employeId}`, {
    method: "DELETE",
  })
}

// Rechercher des employés par spécialité
export async function searchEmployesBySpecialite(specialite: string): Promise<Employe[]> {
  return apiFetch<Employe[]>(
    `${API_ENDPOINTS.UTILISATEUR.EMPLOYES_SEARCH.BY_SPECIALITE}?specialite=${encodeURIComponent(specialite)}`,
  )
}

// Rechercher des employés par statut
export async function searchEmployesByStatut(statut: string): Promise<Employe[]> {
  return apiFetch<Employe[]>(
    `${API_ENDPOINTS.UTILISATEUR.EMPLOYES_SEARCH.BY_STATUT}?statut=${encodeURIComponent(statut)}`,
  )
}

// Rechercher des employés par personne
export async function searchEmployesByPersonne(personneId: number): Promise<Employe[]> {
  return apiFetch<Employe[]>(`${API_ENDPOINTS.UTILISATEUR.EMPLOYES_SEARCH.BY_PERSONNE}?personneId=${personneId}`)
}

// Rechercher des employés par rôle
export async function searchEmployesByRole(roleId: number): Promise<Employe[]> {
  return apiFetch<Employe[]>(`${API_ENDPOINTS.UTILISATEUR.EMPLOYES_SEARCH.BY_ROLE}?roleId=${roleId}`)
}

// Ajouter un rôle à un employé
export async function addRoleToEmploye(employeId: number, roleId: number): Promise<Employe> {
  return apiFetch<Employe>(`${API_ENDPOINTS.UTILISATEUR.EMPLOYES}/${employeId}/roles/${roleId}`, {
    method: "POST",
  })
}

// Retirer un rôle à un employé
export async function removeRoleFromEmploye(employeId: number, roleId: number): Promise<Employe> {
  return apiFetch<Employe>(`${API_ENDPOINTS.UTILISATEUR.EMPLOYES}/${employeId}/roles/${roleId}`, {
    method: "DELETE",
  })
}

// Affecter une personne à un employé
export async function assignPersonToEmploye(employeId: number, personneId: number): Promise<Employe> {
  return apiFetch<Employe>(`${API_ENDPOINTS.UTILISATEUR.EMPLOYES}/${employeId}/personne/${personneId}`, {
    method: "PUT",
  })
}

// Récupérer les statistiques des employés
export async function getEmployeStats(): Promise<EmployeStats> {
  return apiFetch<EmployeStats>(`${API_ENDPOINTS.UTILISATEUR.STATS.EMPLOYES}`)
}
