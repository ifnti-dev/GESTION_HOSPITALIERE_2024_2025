import { apiClient } from "@/services/api";
import { Consultation,CreateConsultation } from "@/types/consultstionsTraitement";
import { API_ENDPOINTS } from "@/config/api";

export async function getConsultations(): Promise<Consultation[]> {
  try {
    const response = await apiClient.get<Consultation[]>(API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.CONSULTATIONS);
    return response;
  } catch (error) {
    console.error("Erreur API - getConsultations:", error);
    throw new Error("Impossible de charger les consultations. Vérifiez la connexion au serveur.");
  }
}

export async function addConsultation(
  newConsultation: Omit<CreateConsultation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Consultation> {
  try {
    // Construction propre du payload sans les objets nested
    const payload = {
      date: new Date(newConsultation.date).toISOString(),
      symptomes: newConsultation.symptomes,
      diagnostic: newConsultation.diagnostic,
      personne: {
        id: newConsultation.personne?.id
      },
      employe: {
        id: newConsultation.employe?.id
      }
      
    };

    console.log(payload);

    const response = await apiClient.post<Consultation>(
      API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.CONSULTATIONS, payload
    );

    return response;
  } catch (error) {
    console.error("Erreur API - addConsultation:", error);
    throw new Error("Échec de la création de la consultation. Vérifiez les données et réessayez.");
  }
}


// 3. **Mettre à jour une consultation existante**
export async function updateConsultation(updatedConsultation: Consultation): Promise<void> {
  await apiClient.put<void>(
    `${API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.CONSULTATIONS}/${updatedConsultation.id}`,
    updatedConsultation
  );
}

// 4. **Supprimer une consultation**
export async function deleteConsultation(consultationId: number): Promise<void> {
  await apiClient.delete<void>(
    `${API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.CONSULTATIONS}/${consultationId}`
  );
}
