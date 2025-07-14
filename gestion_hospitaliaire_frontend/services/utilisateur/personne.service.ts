import { apiFetch } from "@/lib/apiClient";
import { API_CONFIG, API_ENDPOINTS, API_HEADERS } from "@/config/api";
import { Personne } from "@/types/utilisateur";

// Récupérer toutes les personnes
export async function getPersonnes(): Promise<Personne[]> {
    return apiFetch<Personne[]>(API_ENDPOINTS.UTILISATEUR.PERSONNES);
}

export async function getPersonnesPasMedical(): Promise<Personne[]> {
    return apiFetch<Personne[]>(API_ENDPOINTS.UTILISATEUR.PAS_MEDICALE);
}

export async function getPersonnesPasGrossesse(): Promise<Personne[]> {
    return apiFetch<Personne[]>(API_ENDPOINTS.UTILISATEUR.PAS_GROSSES);

}
// Récupérer une personne par ID
export async function getPersonneById(personneId: number): Promise<Personne> {
    return apiFetch<Personne>(`${API_ENDPOINTS.UTILISATEUR.PERSONNES}/${personneId}`);
}

// Ajouter une nouvelle personne
export async function addPersonne(newPersonne: Personne): Promise<Personne> {
    console.log("Adding new person:", newPersonne);
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
    // Utilisation de fetch directement pour gérer correctement les réponses vides (204 No Content)
    // que `apiFetch` pourrait mal interpréter en essayant de parser du JSON.
    // C'est la cause de l'erreur "JSON.parse: unexpected end of data".
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.UTILISATEUR.PERSONNES}/${personneId}`, {
        method: "DELETE",
        headers: API_HEADERS,
    });

    if (!response.ok) {
        // Tente de lire le corps de l'erreur pour un message plus clair
        const errorText = await response.text().catch(() => `Erreur serveur: ${response.status}`);
        throw new Error(`Erreur API: ${response.status} - ${errorText}`);
    }
}