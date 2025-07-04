// Formatage des dates
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "Non défini"

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return "Date invalide"
  }
}

export const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return "Non défini"

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return "Date invalide"
  }
}

// Formatage des prix (conversion centimes -> euros)
export const formatPrice = (priceInCents: number | undefined): string => {
  if (priceInCents === undefined || priceInCents === null) return "0,00 €"

  const euros = priceInCents / 100
  return euros.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  })
}

// Formatage des nombres
export const formatNumber = (num: number | undefined): string => {
  if (num === undefined || num === null) return "0"

  return num.toLocaleString("fr-FR")
}

// Formatage des pourcentages
export const formatPercentage = (value: number | undefined, total: number): string => {
  if (!value || !total) return "0%"

  const percentage = (value / total) * 100
  return `${percentage.toFixed(1)}%`
}

// Formatage du statut
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    Actif: "Actif",
    Inactif: "Inactif",
    "En attente": "En attente",
    Suspendu: "Suspendu",
    Archivé: "Archivé",
  }

  return statusMap[status] || status
}

// Formatage des noms complets
export const formatFullName = (prenom?: string, nom?: string): string => {
  if (!prenom && !nom) return "Non défini"
  if (!prenom) return nom || ""
  if (!nom) return prenom || ""

  return `${prenom} ${nom}`
}

// Formatage des adresses email
export const formatEmail = (email?: string): string => {
  if (!email) return "Non défini"
  return email.toLowerCase()
}

// Formatage des numéros de téléphone
export const formatPhone = (phone?: string): string => {
  if (!phone) return "Non défini"

  // Supprime tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, "")

  // Formate selon le standard français
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5")
  }

  return phone
}

// Formatage des durées
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${remainingMinutes}min`
}

// Formatage des tailles de fichier
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B"

  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
