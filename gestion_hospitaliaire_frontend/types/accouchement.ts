import { DossierGrossesse } from "./medical";
import { Employe, Personne } from "./utilisateur";

export type Accouchement = {
  id: number;
  
  // Section Accouchement
  date: string; // Format "YYYY-MM-DD"
  heure: string; // Format "HH:mm:ss"
  lieu: string;
  presentation: string;
  typeAccouchement: string;
  etatPerinee: string | null;
  etatVulve: string | null;
  typeDelivrance: string;
  revisionUterine: boolean | null;
  hemorragieGrave: boolean | null;
  allaitement30min: boolean | null;
  allaitementApres30min: boolean | null;
  suitesCouches: string | null;
  
  // Section Nouveau-né
  aTerme: boolean | null;
  premature: boolean | null;
  vivant: boolean | null;
  criantAussitot: boolean | null;
  mortNe: boolean | null;
  reanime: boolean | null;
  dureeReanimation: number | null;
  reanimationEnVain: boolean | null;
  apgar1min: number | null;
  apgar5min: number | null;
  apgar10min: number | null;
  taille: number | null;
  perimetreCranien: number | null;
  sexe: string | null; // "M" ou "F"
  poids: number;
  dateBCG: string | null; // Format "YYYY-MM-DD"
  datePolio: string | null; // Format "YYYY-MM-DD"
  
  // Relations
  employe: Employe;
  dossierGrossesse: DossierGrossesse;
};

export type CreateAccouchementPayload = {
  // Section Accouchement
  date: string;
  heure: string;
  lieu: string;
  presentation: string;
  typeAccouchement: string;
  etatPerinee?: string | null;
  etatVulve?: string | null;
  typeDelivrance: string;
  revisionUterine?: boolean | null;
  hemorragieGrave?: boolean | null;
  allaitement30min?: boolean | null;
  allaitementApres30min?: boolean | null;
  suitesCouches?: string | null;
  
  // Section Nouveau-né
  aTerme?: boolean | null;
  premature?: boolean | null;
  vivant?: boolean | null;
  criantAussitot?: boolean | null;
  mortNe?: boolean | null;
  reanime?: boolean | null;
  dureeReanimation?: number | null;
  reanimationEnVain?: boolean | null;
  apgar1min?: number | null;
  apgar5min?: number | null;
  apgar10min?: number | null;
  taille?: number | null;
  perimetreCranien?: number | null;
  sexe?: string | null;
  poids: number;
  dateBCG?: string | null;
  datePolio?: string | null;
  
  // Relations (ID seulement)
  employe: { id: number };
  dossierGrossesse: { id: number };
};

