import { apiFetch } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";
import { Role } from "@/types/utilisateur";

// Récupérer tous les rôles
export async function getRoles(): Promise<Role[]> {
    return apiFetch<Role[]>(API_ENDPOINTS.UTILISATEUR.ROLES);
}

// Récupérer un rôle par ID
export async function getRoleById(roleId: number): Promise<Role> {
    return apiFetch<Role>(`${API_ENDPOINTS.UTILISATEUR.ROLES}/${roleId}`);
}

// Ajouter un nouveau rôle
export async function addRole(newRole: Role): Promise<Role> {
    const response = await apiFetch<Role>(API_ENDPOINTS.UTILISATEUR.ROLES, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newRole),
    });

    return response;
}

// Mettre à jour un rôle existant
export async function updateRole(updatedRole: Role): Promise<Role> {
    const response = await apiFetch<Role>(
        `${API_ENDPOINTS.UTILISATEUR.ROLES}/${updatedRole.id}`,
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
    await apiFetch<void>(`${API_ENDPOINTS.UTILISATEUR.ROLES}/${roleId}`, {
        method: "DELETE",
    });
}