import { useState, useEffect, useCallback } from "react";
import { getRoles, addRole, updateRole, deleteRole, getEmployeeCountByRole as fetchEmployeeCount } from "@/services/utilisateur/role.service";
import { Role } from "@/types/utilisateur";

export function useRole() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Charger tous les rôles
    const fetchRoles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getRoles();
            setRoles(data);
        } catch (err: any) {
            setError(err.message || "Erreur lors du chargement des rôles");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    // Ajouter un rôle
    const handleAddRole = async (newRole: { nom: string; permissions: number[] }) => {
        setLoading(true);
        setError(null);
        try {
            const role = await addRole(newRole);
            setRoles((prev) => [...prev, role]);
        } catch (err: any) {
            setError(err.message || "Erreur lors de l'ajout du rôle");
        } finally {
            setLoading(false);
        }
    };

    // Compter les employés par rôle
    const getEmployeeCountByRole = async (roleId: number) => {
        setLoading(true);
        setError(null);
        try {
            const count = await fetchEmployeeCount(roleId);
            return count; // Retourne le nombre d'employés
        } catch (err: any) {
            setError(err.message || "Erreur lors du comptage des employés");
            return 0; // Retourne 0 en cas d'erreur
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un rôle
    const handleUpdateRole = async (roleId: number, updatedRole: { nom: string; permissions: number[] }) => {
        setLoading(true);
        setError(null);
        try {
            const role = await updateRole(roleId, updatedRole);
            setRoles((prev) =>
                prev.map((r) => (r.id === roleId ? role : r))
            );
        } catch (err: any) {
            setError(err.message || "Erreur lors de la mise à jour du rôle");
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un rôle
    const handleDeleteRole = async (roleId: number) => {
        setLoading(true);
        setError(null);
        try {
            await deleteRole(roleId);
            setRoles((prev) => prev.filter((r) => r.id !== roleId));
        } catch (err: any) {
            setError(err.message || "Erreur lors de la suppression du rôle");
        } finally {
            setLoading(false);
        }
    };

    return {
        roles,
        loading,
        error,
        fetchRoles,
        addRole: handleAddRole,
        updateRole: handleUpdateRole,
        deleteRole: handleDeleteRole,
        getEmployeeCountByRole,
    };
}