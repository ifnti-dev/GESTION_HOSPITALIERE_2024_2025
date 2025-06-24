import { apiFetch } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";
import { Permission } from "@/types/utilisateur";

// Récupérer toutes les permissions
export async function getPermissions(): Promise<Permission[]> {
    return apiFetch<Permission[]>(API_ENDPOINTS.UTILISATEUR.PERMISSIONS);
}


// Récupérer une permission par ID
export async function getPermissionById(permissionId: number): Promise<Permission> {
    return apiFetch<Permission>(`${API_ENDPOINTS.UTILISATEUR.PERMISSIONS}/${permissionId}`);
}

// Ajouter une nouvelle permission
export async function addPermission(newPermission: Permission): Promise<Permission> {
    const response = await apiFetch<Permission>(API_ENDPOINTS.UTILISATEUR.PERMISSIONS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newPermission),
    });

    return response;
}

// Mettre à jour une permission existante
export async function updatePermission(updatedPermission: Permission): Promise<Permission> {
    const response = await apiFetch<Permission>(
        `${API_ENDPOINTS.UTILISATEUR.PERMISSIONS}/${updatedPermission.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedPermission),
        }
    );

    return response;
}

// Supprimer une permission
export async function deletePermission(permissionId: number): Promise<void> {
    await apiFetch<void>(`${API_ENDPOINTS.UTILISATEUR.PERMISSIONS}/${permissionId}`, {
        method: "DELETE",
    });
}