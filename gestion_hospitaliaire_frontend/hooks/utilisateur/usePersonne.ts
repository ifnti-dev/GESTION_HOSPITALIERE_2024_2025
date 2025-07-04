import { useCallback, useEffect, useState } from "react";
import {
  getPersonnes,
  getPersonneById,
  addPersonne,
  updatePersonne,
  deletePersonne,
} from "@/services/utilisateur/personne.service";
import { Personne } from "@/types/utilisateur";

export function usePersonne() {
  const [personnes, setPersonnes] = useState<Personne[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les personnes
  const fetchPersonnes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPersonnes();
      setPersonnes(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des personnes");
    } finally {
      setLoading(false);
    }
  }, []);

  // Ajouter une personne
  const createPersonne = useCallback(async (personne: Personne) => {
    setLoading(true);
    setError(null);
    try {
      const newPersonne = await addPersonne(personne);
      setPersonnes((prev) => [...prev, newPersonne]);
      return newPersonne;
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ajout de la personne");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour une personne
  const editPersonne = useCallback(async (personne: Personne) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updatePersonne(personne);
      setPersonnes((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      return updated;
    } catch (err: any) {
      setError(err.message || "Erreur lors de la modification");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer une personne
  const removePersonne = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deletePersonne(id);
      setPersonnes((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer une personne par ID
  const fetchPersonneById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      return await getPersonneById(id);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la récupération");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPersonnes();
  }, [fetchPersonnes]);

  return {
    personnes,
    loading,
    error,
    fetchPersonnes,
    fetchPersonneById,
    createPersonne,
    editPersonne,
    removePersonne,
  };
}