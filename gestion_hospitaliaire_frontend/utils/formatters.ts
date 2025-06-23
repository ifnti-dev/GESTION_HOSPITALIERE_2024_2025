// Formatage des dates
export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const formatTime = (time: string): string => {
  return time.slice(0, 5) // HH:MM
}

// Formatage des montants
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

// Formatage des numéros
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/)
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`
  }
  return phone
}

export const formatSSN = (ssn: string): string => {
  const cleaned = ssn.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{1})(\d{2})(\d{2})(\d{2})(\d{3})(\d{3})(\d{2})$/)
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]} ${match[6]} ${match[7]}`
  }
  return ssn
}

// Calculs d'âge
export const calculateAge = (birthDate: string | Date): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

// Calculs de grossesse
export const calculateWeeksOfPregnancy = (lastMenstrualPeriod: string | Date): number => {
  const today = new Date()
  const lmp = new Date(lastMenstrualPeriod)
  const diffTime = Math.abs(today.getTime() - lmp.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.floor(diffDays / 7)
}

export const calculateDueDate = (lastMenstrualPeriod: string | Date): Date => {
  const lmp = new Date(lastMenstrualPeriod)
  const dueDate = new Date(lmp)
  dueDate.setDate(dueDate.getDate() + 280) // 40 semaines
  return dueDate
}

// Validation des données
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
  return phoneRegex.test(phone)
}

export const isValidSSN = (ssn: string): boolean => {
  const ssnRegex = /^[1-2]\d{2}(0[1-9]|1[0-2])\d{2}\d{3}\d{3}\d{2}$/
  return ssnRegex.test(ssn.replace(/\s/g, ""))
}
