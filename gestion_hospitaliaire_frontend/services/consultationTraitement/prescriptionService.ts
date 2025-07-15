

import { apiClient } from "@/services/api";
import { Prescription, CreatePrescription } from "@/types/consultstionsTraitement";
import { API_ENDPOINTS } from "@/config/api";


export async function getPrescriptions(): Promise<Prescription[]> {
  try {
    const response = await apiClient.get<Prescription[]>(API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.PRESCRIPTIONS);
    return response;
  } catch (error) {
    console.error("Erreur API - getPrescriptions:", error);
    throw new Error("Impossible de charger les prescriptions. Vérifiez la connexion au serveur.");
  }
}


export async function addPrescription(
  newPrescription: CreatePrescription
): Promise<Prescription> {
  try {
    const payload = {
    
      quantite: newPrescription.quantite,
      posologie: newPrescription.posologie,
      duree: newPrescription.duree,
      consultation: {
        id: newPrescription.consultation.id
      },
      medicament: {
        id: newPrescription.medicament.id
      },
      medicaments: newPrescription.medicaments
    };

    const response = await apiClient.post<Prescription>(
      API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.PRESCRIPTIONS, payload
    );

    return response;
  } catch (error) {
    console.error("Erreur API - addPrescription:", error);
    throw new Error("Échec de la création de la prescription. Vérifiez les données et réessayez.");
  }
}

export async function deletePrescription(prescriptionId: number): Promise<void> {
  await apiClient.delete<void>(
    `${API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.PRESCRIPTIONS}/${prescriptionId}`
  );
}