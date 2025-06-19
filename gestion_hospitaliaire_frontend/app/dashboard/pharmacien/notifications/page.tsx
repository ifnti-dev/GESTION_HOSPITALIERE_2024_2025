"use client"

import { useState } from "react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  Search,
  Filter,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Package,
  Truck,
  Calendar,
  Settings,
  Trash2,
  Eye,
  BookMarkedIcon as MarkAsUnread,
} from "lucide-react"

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Données simulées pour les notifications
  const notifications = [
    {
      id: "NOTIF-001",
      type: "Stock Critique",
      message: "Le stock de Paracétamol 500mg est critique (5 unités restantes)",
      dateNotif: "2024-06-12T10:30:00",
      statut: "Non lue",
      priorite: "Haute",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      id: "NOTIF-002",
      type: "Commande Livrée",
      message: "La commande CMD-002 de MediSupply a été livrée avec succès",
      dateNotif: "2024-06-12T09:15:00",
      statut: "Lue",
      priorite: "Normale",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "NOTIF-003",
      type: "Expiration Proche",
      message: "15 médicaments expirent dans les 30 prochains jours",
      dateNotif: "2024-06-12T08:45:00",
      statut: "Non lue",
      priorite: "Moyenne",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      id: "NOTIF-004",
      type: "Approvisionnement",
      message: "Nouvel approvisionnement programmé pour le 15/06/2024",
      dateNotif: "2024-06-11T16:20:00",
      statut: "Lue",
      priorite: "Normale",
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "NOTIF-005",
      type: "Système",
      message: "Mise à jour du système programmée pour ce soir à 22h00",
      dateNotif: "2024-06-11T14:10:00",
      statut: "Non lue",
      priorite: "Basse",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    {
      id: "NOTIF-006",
      type: "Stock Faible",
      message: "Le stock d'Amoxicilline 250mg est en dessous du seuil minimum",
      dateNotif: "2024-06-11T11:30:00",
      statut: "Lue",
      priorite: "Moyenne",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ]

  const getPriorityBadge = (priorite: string) => {
    const priorityConfig = {
      Haute: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
      Moyenne: { color: "bg-orange-100 text-orange-800", icon: Clock },
      Normale: { color: "bg-blue-100 text-blue-800", icon: Info },
      Basse: { color: "bg-gray-100 text-gray-800", icon: Info },
    }

    const config = priorityConfig[priorite as keyof typeof priorityConfig]
    const IconComponent = config?.icon || Info

    return (
      <Badge className={`${config?.color} hover:${config?.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {priorite}
      </Badge>
    )
  }

  const getStatusBadge = (statut: string) => {
    return statut === "Non lue" ? (
      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">
        <MarkAsUnread className="h-3 w-3 mr-1" />
        Non lue
      </Badge>
    ) : (
      <Badge variant="outline" className="text-gray-600 border-gray-300">
        <Eye className="h-3 w-3 mr-1" />
        Lue
      </Badge>
    )
  }

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || notif.type === typeFilter
    const matchesStatus = statusFilter === "all" || notif.statut === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const stats = {
    totalNotifications: notifications.length,
    nonLues: notifications.filter((n) => n.statut === "Non lue").length,
    prioriteHaute: notifications.filter((n) => n.priorite === "Haute").length,
    aujourdhui: notifications.filter((n) => new Date(n.dateNotif).toDateString() === new Date().toDateString()).length,
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `Il y a ${diffInMinutes} min`
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  return (
    <PharmacienSidebar>
      <div className="space-y-8">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                <Bell className="h-8 w-8 text-white" />
              </div>
              Centre de Notifications
            </h1>
            <p className="text-gray-600 mt-2">Suivez toutes les alertes et informations importantes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-teal-200 hover:bg-teal-50">
              <CheckCircle className="h-4 w-4 mr-2" />
              Marquer tout comme lu
            </Button>
            <Button variant="outline" className="border-red-200 hover:bg-red-50 text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer lues
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Total</CardTitle>
              <Bell className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">{stats.totalNotifications}</div>
              <p className="text-xs text-teal-600 mt-1">Toutes les notifications</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Non Lues</CardTitle>
              <MarkAsUnread className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.nonLues}</div>
              <p className="text-xs text-blue-600 mt-1">À traiter</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Priorité Haute</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{stats.prioriteHaute}</div>
              <p className="text-xs text-red-600 mt-1">Urgentes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Aujourd'hui</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.aujourdhui}</div>
              <p className="text-xs text-green-600 mt-1">Reçues aujourd'hui</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et Recherche */}
        <Card className="shadow-lg border-teal-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="h-5 w-5 text-teal-600" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher dans les notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48 border-teal-200 focus:border-teal-500">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="Stock Critique">Stock Critique</SelectItem>
                  <SelectItem value="Stock Faible">Stock Faible</SelectItem>
                  <SelectItem value="Commande Livrée">Commande Livrée</SelectItem>
                  <SelectItem value="Expiration Proche">Expiration Proche</SelectItem>
                  <SelectItem value="Approvisionnement">Approvisionnement</SelectItem>
                  <SelectItem value="Système">Système</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 border-teal-200 focus:border-teal-500">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Non lue">Non lues</SelectItem>
                  <SelectItem value="Lue">Lues</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des Notifications */}
        <Card className="shadow-lg border-teal-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5 text-teal-600" />
              Notifications
            </CardTitle>
            <CardDescription>{filteredNotifications.length} notification(s) trouvée(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredNotifications.map((notification) => {
                const IconComponent = notification.icon
                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border-l-4 ${notification.borderColor} ${notification.bgColor} hover:shadow-md transition-all duration-200`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg bg-white shadow-sm ${notification.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{notification.type}</h3>
                            {getPriorityBadge(notification.priorite)}
                            {getStatusBadge(notification.statut)}
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{notification.message}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500 font-mono">{notification.id}</span>
                            <span className="text-xs text-gray-500">{formatDate(notification.dateNotif)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-white/50">
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-white/50">
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PharmacienSidebar>
  )
}
