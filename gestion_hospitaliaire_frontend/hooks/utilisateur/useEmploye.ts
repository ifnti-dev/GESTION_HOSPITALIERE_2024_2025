import { useState, useEffect, useCallback } from "react";
import {
    getEmployes,
    getEmployeById,
    addEmploye,
    updateEmploye,
    deleteEmploye,
    addRoleToEmploye,
    removeRoleFromEmploye,
    assignPersonToEmploye,
} from "@/services/utilisateur/employe.service";
import { Employe } from "@/types/utilisateur";

export function useEmploye() {
    const [employes, setEmployes] = useState<Employe[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEmployes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getEmployes();
            setEmployes(data);
        } catch (err: any) {
            setError(err.message || "Erreur lors du chargement des employés");
        } finally {
            setLoading(false);
        }
    }, []);

    const createEmploye = async (employe: Employe) => {
        setLoading(true);
        setError(null);
        try {
            const newEmploye = await addEmploye(employe);
            setEmployes((prev) => [...prev, newEmploye]);
            return newEmploye;
        } catch (err: any) {
            setError(err.message || "Erreur lors de l'ajout de l'employé");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const editEmploye = async (employe: Employe) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await updateEmploye(employe);
            setEmployes((prev) =>
                prev.map((e) => (e.id === updated.id ? updated : e))
            );
            return updated;
        } catch (err: any) {
            setError(err.message || "Erreur lors de la modification de l'employé");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeEmploye = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await deleteEmploye(id);
            setEmployes((prev) => prev.filter((e) => e.id !== id));
        } catch (err: any) {
            setError(err.message || "Erreur lors de la suppression de l'employé");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Pour les opérations avancées, tu peux ajouter d'autres méthodes similaires :
    const addRole = async (employeId: number, roleId: number) => {
        return addRoleToEmploye(employeId, roleId);
    };

    const removeRole = async (employeId: number, roleId: number) => {
        return removeRoleFromEmploye(employeId, roleId);
    };

    const assignPerson = async (employeId: number, personneId: number) => {
        return assignPersonToEmploye(employeId, personneId);
    };

    useEffect(() => {
        fetchEmployes();
    }, [fetchEmployes]);

    return {
        employes,
        loading,
        error,
        fetchEmployes,
        createEmploye,
        editEmploye,
        removeEmploye,
        addRole,
        removeRole,
        assignPerson,
        getEmployeById,
    };
}