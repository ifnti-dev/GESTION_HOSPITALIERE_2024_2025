import { apiClient } from "@/services/api"
import { Hospitalisation, CreateHospitalisation} from "@/types/consultstionsTraitement"
import { API_ENDPOINTS } from "@/config/api"

export async function getHospitalisations(): Promise<Hospitalisation[]> {
  try {
    const response = await apiClient.get<Hospitalisation[]>(API_ENDPOINTS.HOSPITALISATIONS.HOSPITALISATIONS)
    return response
  } catch (error) {
    console.error("Erreur API - getHospitalisations:", error)
    throw new Error("Impossible de charger les hospitalisations. Vérifiez la connexion au serveur.")
  }
}

export async function addHospitalisation(
  newHospitalisation: CreateHospitalisation
): Promise<Hospitalisation> {
  try {
    const response = await apiClient.post<Hospitalisation>(
      API_ENDPOINTS.HOSPITALISATIONS.HOSPITALISATIONS, 
      newHospitalisation
    )
    return response
  } catch (error) {
    console.error("Erreur API - addHospitalisation:", error)
    throw new Error("Échec de la création de l'hospitalisation. Vérifiez les données et réessayez.")
  }
}

export async function deleteHospitalisation(hospitalisationId: number): Promise<void> {
  await apiClient.delete<void>(
    `${API_ENDPOINTS.HOSPITALISATIONS.HOSPITALISATIONS}/${hospitalisationId}`
  )
}