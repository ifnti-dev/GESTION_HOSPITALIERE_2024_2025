import { apiFetch } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";
import { Personne } from "@/types/utilisateur";

// Récupérer toutes les personnes
export async function getPersonnes(): Promise<Personne[]> {
    return apiFetch<Personne[]>(API_ENDPOINTS.UTILISATEUR.PERSONNES);
}

// Récupérer une personne par ID
export async function getPersonneById(personneId: number): Promise<Personne> {
    return apiFetch<Personne>(`${API_ENDPOINTS.UTILISATEUR.PERSONNES}/${personneId}`);
}

// Ajouter une nouvelle personne
export async function addPersonne(newPersonne: Personne): Promise<Personne> {
    const response = await apiFetch<Personne>(API_ENDPOINTS.UTILISATEUR.PERSONNES, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newPersonne),
    });

    return response;
}

// Mettre à jour une personne existante
export async function updatePersonne(updatedPersonne: Personne): Promise<Personne> {
    const response = await apiFetch<Personne>(
        `${API_ENDPOINTS.UTILISATEUR.PERSONNES}/${updatedPersonne.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedPersonne),
        }
    );

    return response;
}

// Supprimer une personne
export async function deletePersonne(personneId: number): Promise<void> {
    await apiFetch<void>(`${API_ENDPOINTS.UTILISATEUR.PERSONNES}/${personneId}`, {
        method: "DELETE",
    });
}