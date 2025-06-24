// services/consultationService.ts
import { apiFetch } from "@/lib/apiClient"
import { Consultation } from "@/types/consultstionsTraitement"
import { API_ENDPOINTS } from "@/config/api"

export async function getConsultations(): Promise<Consultation[]> {
  return apiFetch<Consultation[]>(API_ENDPOINTS.CONSULTATIONS_TRAITEMENTS.CONSULTATIONS)
}
