/**
 * Formate un prix en FCFA
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === "string" ? Number.parseFloat(price) : price
  if (isNaN(numPrice)) return "0 FCFA"

  return (
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice) + " FCFA"
  )
}

/**
 * Formate une devise (alias pour formatPrice pour compatibilité)
 */
export function formatCurrency(amount: number | string): string {
  return formatPrice(amount)
}

/**
 * Formate une date au format français
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A"

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return "N/A"

    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dateObj)
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", error)
    return "N/A"
  }
}

/**
 * Formate une date et heure au format français
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "N/A"

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return "N/A"

    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj)
  } catch (error) {
    console.error("Erreur lors du formatage de la date/heure:", error)
    return "N/A"
  }
}

/**
 * Formate un nombre avec séparateurs de milliers
 */
export function formatNumber(num: number | string): string {
  const numValue = typeof num === "string" ? Number.parseFloat(num) : num
  if (isNaN(numValue)) return "0"

  return new Intl.NumberFormat("fr-FR").format(numValue)
}

/**
 * Formate un pourcentage
 */
export function formatPercentage(value: number | string, decimals = 1): string {
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value
  if (isNaN(numValue)) return "0%"

  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue / 100)
}

/**
 * Formate une quantité avec unité
 */
export function formatQuantity(quantity: number | string, unit = "unité(s)"): string {
  const numQuantity = typeof quantity === "string" ? Number.parseFloat(quantity) : quantity
  if (isNaN(numQuantity)) return `0 ${unit}`

  return `${formatNumber(numQuantity)} ${unit}`
}

/**
 * Formate une durée en jours
 */
export function formatDuration(days: number): string {
  if (days === 0) return "Aujourd'hui"
  if (days === 1) return "1 jour"
  if (days < 0) return `Il y a ${Math.abs(days)} jour(s)`
  return `Dans ${days} jour(s)`
}

/**
 * Calcule et formate la différence entre deux dates en jours
 */
export function formatDateDifference(date1: string | Date, date2: string | Date = new Date()): string {
  try {
    const d1 = typeof date1 === "string" ? new Date(date1) : date1
    const d2 = typeof date2 === "string" ? new Date(date2) : date2

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return "N/A"

    const diffTime = d1.getTime() - d2.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return formatDuration(diffDays)
  } catch (error) {
    console.error("Erreur lors du calcul de la différence de dates:", error)
    return "N/A"
  }
}

/**
 * Formate un statut avec couleur
 */
export function formatStatus(status: string): { text: string; color: string } {
  const statusMap: Record<string, { text: string; color: string }> = {
    ACTIVE: { text: "Actif", color: "green" },
    INACTIVE: { text: "Inactif", color: "gray" },
    PENDING: { text: "En attente", color: "orange" },
    COMPLETED: { text: "Terminé", color: "blue" },
    CANCELLED: { text: "Annulé", color: "red" },
    EXPIRED: { text: "Expiré", color: "red" },
    EXPIRING_SOON: { text: "Expire bientôt", color: "orange" },
    AVAILABLE: { text: "Disponible", color: "green" },
    OUT_OF_STOCK: { text: "Rupture de stock", color: "red" },
    LOW_STOCK: { text: "Stock faible", color: "orange" },
  }

  return statusMap[status.toUpperCase()] || { text: status, color: "gray" }
}
