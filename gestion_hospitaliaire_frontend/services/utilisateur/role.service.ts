import { apiFetch } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";
import { Role } from "@/types/utilisateur";

// Récupérer tous les rôles
export async function getRoles(): Promise<Role[]> {
    return apiFetch<Role[]>(API_ENDPOINTS.UTILISATEUR.ROLES.BASE);
}

// Récupérer un rôle par ID
export async function getRoleById(roleId: number): Promise<Role> {
  return apiFetch<Role>(API_ENDPOINTS.UTILISATEUR.ROLES.BY_ID(roleId));
}

// Ajouter un nouveau rôle
export async function addRole(newRole: { nom: string; permissions: number[] }): Promise<Role> {
    const response = await apiFetch<Role>(API_ENDPOINTS.UTILISATEUR.ROLES.BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newRole),
    });

    return response;
}

// Mettre à jour un rôle existant
export async function updateRole(roleId: number, updatedRole: { nom: string; permissions: number[] }): Promise<Role> {
    const response = await apiFetch<Role>(
        API_ENDPOINTS.UTILISATEUR.ROLES.BY_ID(roleId),
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedRole),
        }
    );

    return response;
}

// Supprimer un rôle
export async function deleteRole(roleId: number): Promise<void> {
    await apiFetch<void>(API_ENDPOINTS.UTILISATEUR.ROLES.BY_ID(roleId), {
        method: "DELETE",
    });
}


// Récupérer le nombre d'employés par rôle
export async function getEmployeeCountByRole(roleId: number): Promise<number> {
    const response = await apiFetch<{ count: number }>(`${API_ENDPOINTS.UTILISATEUR.ROLES.STATS.EMPLOYE_COUNT}/${roleId}/count`);
    return response.count;
}