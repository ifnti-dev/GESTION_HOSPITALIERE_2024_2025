import { API_CONFIG, API_ENDPOINTS, API_HEADERS, CORS_CONFIG } from "@/config/api"
import type { Notification } from "@/types/pharmacie"

export interface NotificationFilters {
  type?: string
  dateNotif?: string
  statut?: "lue" | "non_lue"
  priorite?: "haute" | "moyenne" | "normale" | "basse"
}

export interface CreateNotificationRequest {
  type: string
  message: string
  priorite?: "haute" | "moyenne" | "normale" | "basse"
  dateNotif?: string
}

class NotificationService {
  private baseUrl = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PHARMACIE.NOTIFICATIONS || "/api/notifications"}`

  async getAll(): Promise<Notification[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error fetching notifications:", errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error)
      throw error
    }
  }

  async getById(id: number): Promise<Notification> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error fetching notification ${id}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Erreur lors de la récupération de la notification ${id}:`, error)
      throw error
    }
  }

  async create(notification: CreateNotificationRequest): Promise<Notification> {
    try {
      const notificationData = {
        ...notification,
        dateNotif: notification.dateNotif || new Date().toISOString().split("T")[0],
        priorite: notification.priorite || "normale",
        statut: "non_lue",
      }

      console.log("Creating notification:", notificationData)

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: API_HEADERS,
        body: JSON.stringify(notificationData),
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error creating notification:", errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Notification created successfully:", data)
      return data
    } catch (error) {
      console.error("Erreur lors de la création de la notification:", error)
      throw error
    }
  }

  async update(id: number, notification: Partial<Notification>): Promise<Notification> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: API_HEADERS,
        body: JSON.stringify(notification),
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error updating notification ${id}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la notification ${id}:`, error)
      throw error
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error deleting notification ${id}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de la notification ${id}:`, error)
      throw error
    }
  }

  async getByType(type: string): Promise<Notification[]> {
    try {
      const response = await fetch(`${this.baseUrl}/by-type?type=${encodeURIComponent(type)}`, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error fetching notifications by type ${type}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error(`Erreur lors de la récupération des notifications de type ${type}:`, error)
      throw error
    }
  }

  async getByDate(date: string): Promise<Notification[]> {
    try {
      const response = await fetch(`${this.baseUrl}/by-date?date=${encodeURIComponent(date)}`, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error fetching notifications by date ${date}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error(`Erreur lors de la récupération des notifications du ${date}:`, error)
      throw error
    }
  }

  async searchByMessage(keyword: string): Promise<Notification[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search/message?keyword=${encodeURIComponent(keyword)}`, {
        method: "GET",
        headers: API_HEADERS,
        ...CORS_CONFIG,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error searching notifications with keyword ${keyword}:`, errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error(`Erreur lors de la recherche de notifications avec "${keyword}":`, error)
      throw error
    }
  }

  async markAsRead(id: number): Promise<Notification> {
    return this.update(id, { statut: "lue" })
  }

  async markAsUnread(id: number): Promise<Notification> {
    return this.update(id, { statut: "non_lue" })
  }

  async markAllAsRead(): Promise<void> {
    try {
      const notifications = await this.getAll()
      const unreadNotifications = notifications.filter((n) => n.statut === "non_lue")

      await Promise.all(unreadNotifications.map((notification) => this.markAsRead(notification.id!)))
    } catch (error) {
      console.error("Erreur lors du marquage de toutes les notifications comme lues:", error)
      throw error
    }
  }

  async deleteAllRead(): Promise<void> {
    try {
      const notifications = await this.getAll()
      const readNotifications = notifications.filter((n) => n.statut === "lue")

      await Promise.all(readNotifications.map((notification) => this.delete(notification.id!)))
    } catch (error) {
      console.error("Erreur lors de la suppression des notifications lues:", error)
      throw error
    }
  }
}

export const notificationService = new NotificationService()
