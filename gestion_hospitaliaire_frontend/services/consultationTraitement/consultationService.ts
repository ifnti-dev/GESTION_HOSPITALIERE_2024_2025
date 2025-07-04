import { apiFetch } from "@/lib/apiClient";
import { Consultation } from "@/types/consultstionsTraitement";
import { API_ENDPOINTS } from "@/config/api";

// 1. **Récupérer toutes les consultations**
export async function getConsultations(): Promise<Consultation[]> {
  return apiFetch<Consultation[]>(API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.CONSULTATIONS);
}

// 2. **Ajouter une nouvelle consultation**
export async function addConsultation(newConsultation: Consultation): Promise<Consultation> {
  const response = await apiFetch<Consultation>(API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.CONSULTATIONS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newConsultation),
  });

  return response;
}

// 3. **Mettre à jour une consultation existante**
export async function updateConsultation(updatedConsultation: Consultation): Promise<Consultation> {
  const response = await apiFetch<Consultation>(
    `${API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.CONSULTATIONS}/${updatedConsultation.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedConsultation),
    }
  );

  return response;
}

// 4. **Supprimer une consultation**
export async function deleteConsultation(consultationId: number): Promise<void> {
  await apiFetch<void>(`${API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.CONSULTATIONS}/${consultationId}`, {
    method: "DELETE",
  });
}
