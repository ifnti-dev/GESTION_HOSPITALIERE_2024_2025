import { apiFetch } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";
import { Employe } from "@/types/utilisateur";

// Récupérer tous les employés
export async function getEmployes(): Promise<Employe[]> {
    return apiFetch<Employe[]>(API_ENDPOINTS.UTILISATEUR.EMPLOYES);
}

// Récupérer un employé par ID
export async function getEmployeById(employeId: number): Promise<Employe> {
    return apiFetch<Employe>(`${API_ENDPOINTS.UTILISATEUR.EMPLOYES}/${employeId}`);
}

// Ajouter un nouvel employé
export async function addEmploye(newEmploye: Employe): Promise<Employe> {
    const response = await apiFetch<Employe>(API_ENDPOINTS.UTILISATEUR.EMPLOYES, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmploye),
    });

    return response;
}

// Mettre à jour un employé existant
export async function updateEmploye(updatedEmploye: Employe): Promise<Employe> {
    const response = await apiFetch<Employe>(
        `${API_ENDPOINTS.UTILISATEUR.EMPLOYES}/${updatedEmploye.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedEmploye),
        }
    );

    return response;
}

// Supprimer un employé
export async function deleteEmploye(employeId: number): Promise<void> {
    await apiFetch<void>(`${API_ENDPOINTS.UTILISATEUR.EMPLOYES}/${employeId}`, {
        method: "DELETE",
    });
}

// Ajouter un rôle à un employé
export async function addRoleToEmploye(employeId: number, roleId: number): Promise<Employe> {
    return apiFetch<Employe>(`${API_ENDPOINTS.UTILISATEUR.EMPLOYES}/${employeId}/roles/${roleId}`, {
        method: "POST",
    });
}

// Retirer un rôle à un employé
export async function removeRoleFromEmploye(employeId: number, roleId: number): Promise<Employe> {
    return apiFetch<Employe>(`${API_ENDPOINTS.UTILISATEUR.EMPLOYES}/${employeId}/roles/${roleId}`, {
        method: "DELETE",
    });
}

// Affecter une personne à un employé
export async function assignPersonToEmploye(employeId: number, personneId: number): Promise<Employe> {
    return apiFetch<Employe>(`${API_ENDPOINTS.UTILISATEUR.EMPLOYES}/${employeId}/personne/${personneId}`, {
        method: "PUT",
    });
}