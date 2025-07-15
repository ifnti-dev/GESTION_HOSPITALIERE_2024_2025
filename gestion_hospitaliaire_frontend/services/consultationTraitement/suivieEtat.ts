import { apiClient } from "@/services/api";
import { SuivieEtat, CreateSuivieEtat } from "@/types/consultstionsTraitement";
import { API_ENDPOINTS } from "@/config/api";

// 1. Récupérer tous les suivis d'état
export async function getSuivieEtats(): Promise<SuivieEtat[]> {
  try {
    const response = await apiClient.get<SuivieEtat[]>(API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.SUIVIETATS);
    return response;
  } catch (error) {
    console.error("Erreur API - getSuivieEtats:", error);
    throw new Error("Impossible de charger les suivis d'état. Vérifiez la connexion au serveur.");
  }
}

// 2. Ajouter un nouveau suivi d'état
export async function addSuivieEtat(
  newSuivieEtat: Omit<CreateSuivieEtat, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SuivieEtat> {
  try {
    const payload = {
      date: new Date(newSuivieEtat.date).toISOString(),
      tension: newSuivieEtat.tension,
      temperature: newSuivieEtat.temperature,
      frequenceCardiaque: newSuivieEtat.frequenceCardiaque,
      frequenceRespiratoire: newSuivieEtat.frequenceRespiratoire,
      personne: {
        id: newSuivieEtat.personne?.id,
      },
      employe: {
        id: newSuivieEtat.employe?.id,
      },
    };

    const response = await apiClient.post<SuivieEtat>(
      API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.SUIVIETATS, payload
    );

    return response;
  } catch (error) {
    console.error("Erreur API - addSuivieEtat:", error);
    throw new Error("Échec de la création du suivi d'état. Vérifiez les données et réessayez.");
  }
}

// 3. Modifier un suivi existant
export async function updateSuivieEtat(updatedSuivieEtat: SuivieEtat): Promise<void> {
  await apiClient.put<void>(
    `${API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.SUIVIETATS}/${updatedSuivieEtat.id}`,
    updatedSuivieEtat
  );
}

// 4. Supprimer un suivi d'état
export async function deleteSuivieEtat(suivieEtatId: number): Promise<void> {
  await apiClient.delete<void>(
    `${API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.SUIVIETATS}/${suivieEtatId}`
  );
}
