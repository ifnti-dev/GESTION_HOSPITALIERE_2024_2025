import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// lib/utils.ts
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

export function calculateGestationalAge(dateDernieresRegles: string): string {
  const ddr = new Date(dateDernieresRegles)
  const today = new Date()
  const diff = today.getTime() - ddr.getTime()
  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7))
  const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24))
  return `${weeks} SA + ${days}j`
}

export function calculateTrimestre(dateDernieresRegles: string): number {
  const ddr = new Date(dateDernieresRegles)
  const today = new Date()
  const weeks = Math.floor((today.getTime() - ddr.getTime()) / (1000 * 60 * 60 * 24 * 7))
  
  if (weeks < 14) return 1
  if (weeks < 28) return 2
  return 3
}

export function calculateAge(birthdate?: string): string | number {
  if (!birthdate) return "N/A";
  
  try {
    const today = new Date();
    const birthDate = new Date(birthdate);
    
    // Vérification de la validité de la date
    if (isNaN(birthDate.getTime())) return "N/A";
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Ajustement si l'anniversaire n'est pas encore arrivé cette année
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error("Erreur dans le calcul de l'âge:", error);
    return "N/A";
  }
}