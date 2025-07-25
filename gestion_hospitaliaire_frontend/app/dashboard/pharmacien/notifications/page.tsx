"use client"

import { useState } from "react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useNotifications } from "@/hooks/pharmacie/useNotifications"
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
  RefreshCw,
  AlertCircle,
  ShoppingCart,
  PackageX,
} from "lucide-react"

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const { notifications, loading, error, stats, actions } = useNotifications()

  const getNotificationIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      "Stock Critique": AlertTriangle,
      "Stock Faible": Package,
      "Rupture de Stock": PackageX,
      "Commande Livrée": CheckCircle,
      "Nouvelles Commandes": ShoppingCart,
      "Expiration Proche": Calendar,
      "Lots Expirés": AlertCircle,
      Approvisionnement: Truck,
      Système: Settings,
    }
    return iconMap[type] || Bell
  }

  const getNotificationColor = (type: string, priorite: string) => {
    if (priorite === "haute") {
      return {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      }
    }

    const colorMap: Record<string, any> = {
      "Stock Critique": {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
      "Stock Faible": {
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      },
      "Rupture de Stock": {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
      "Commande Livrée": {
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      "Nouvelles Commandes": {
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      "Expiration Proche": {
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      },
      "Lots Expirés": {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
      Approvisionnement: {
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      Système: {
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      },
    }

    return (
      colorMap[type] || {
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      }
    )
  }

  const getPriorityBadge = (priorite: string) => {
    const priorityConfig = {
      haute: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
      moyenne: { color: "bg-orange-100 text-orange-800", icon: Clock },
      normale: { color: "bg-blue-100 text-blue-800", icon: Info },
      basse: { color: "bg-gray-100 text-gray-800", icon: Info },
    }

    const config = priorityConfig[priorite as keyof typeof priorityConfig] || priorityConfig.normale
    const IconComponent = config.icon

    return (
      <Badge className={`${config.color} hover:${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {priorite.charAt(0).toUpperCase() + priorite.slice(1)}
      </Badge>
    )
  }

  const getStatusBadge = (statut: string) => {
    return statut === "non_lue" ? (
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

  const filteredNotifications = actions.filterNotifications(searchTerm, typeFilter, statusFilter)

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

  if (error) {
    return (
      <PharmacienSidebar>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={actions.refresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </div>
      </PharmacienSidebar>
    )
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
            <Button
              onClick={actions.runAutoChecks}
              variant="outline"
              className="border-blue-200 hover:bg-blue-50 bg-transparent"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Vérifier maintenant
            </Button>
            <Button
              onClick={actions.markAllAsRead}
              variant="outline"
              className="border-teal-200 hover:bg-teal-50 bg-transparent"
              disabled={loading || stats.nonLues === 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marquer tout comme lu
            </Button>
            <Button
              onClick={actions.deleteAllRead}
              variant="outline"
              className="border-red-200 hover:bg-red-50 text-red-600 bg-transparent"
              disabled={loading}
            >
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
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-teal-900">{stats.total}</div>
              )}
              <p className="text-xs text-teal-600 mt-1">Toutes les notifications</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Non Lues</CardTitle>
              <MarkAsUnread className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-blue-900">{stats.nonLues}</div>
              )}
              <p className="text-xs text-blue-600 mt-1">À traiter</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Priorité Haute</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-red-900">{stats.prioriteHaute}</div>
              )}
              <p className="text-xs text-red-600 mt-1">Urgentes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Aujourd'hui</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-green-900">{stats.aujourdhui}</div>
              )}
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
                  <SelectItem value="Rupture de Stock">Rupture de Stock</SelectItem>
                  <SelectItem value="Commande Livrée">Commande Livrée</SelectItem>
                  <SelectItem value="Nouvelles Commandes">Nouvelles Commandes</SelectItem>
                  <SelectItem value="Expiration Proche">Expiration Proche</SelectItem>
                  <SelectItem value="Lots Expirés">Lots Expirés</SelectItem>
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
                  <SelectItem value="non_lue">Non lues</SelectItem>
                  <SelectItem value="lue">Lues</SelectItem>
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
              {!loading && (
                <Badge variant="outline" className="ml-2">
                  {filteredNotifications.length}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {loading ? (
                <Skeleton className="h-4 w-48" />
              ) : (
                `${filteredNotifications.length} notification(s) trouvée(s)`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                // Skeleton de chargement
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="p-4 rounded-lg border-l-4 border-gray-200 bg-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-12" />
                          </div>
                          <Skeleton className="h-4 w-full" />
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune notification</h3>
                  <p className="text-gray-600">
                    {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                      ? "Aucune notification ne correspond à vos critères de recherche."
                      : "Aucune notification pour le moment."}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type)
                  const colors = getNotificationColor(notification.type, notification.priorite || "normale")

                  return (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border-l-4 ${colors.borderColor} ${colors.bgColor} hover:shadow-md transition-all duration-200 ${
                        notification.statut === "non_lue" ? "ring-1 ring-teal-200" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg bg-white shadow-sm ${colors.color}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-gray-900">{notification.type}</h3>
                              {getPriorityBadge(notification.priorite || "normale")}
                              {getStatusBadge(notification.statut || "non_lue")}
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="font-mono">#{notification.id}</span>
                              <span>{formatDate(notification.dateNotif)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-white/50"
                            onClick={() => {
                              if (notification.statut === "non_lue") {
                                actions.markAsRead(notification.id!)
                              } else {
                                actions.markAsUnread(notification.id!)
                              }
                            }}
                            title={notification.statut === "non_lue" ? "Marquer comme lue" : "Marquer comme non lue"}
                          >
                            {notification.statut === "non_lue" ? (
                              <Eye className="h-4 w-4 text-gray-500" />
                            ) : (
                              <MarkAsUnread className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-white/50"
                            onClick={() => actions.deleteNotification(notification.id!)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PharmacienSidebar>
  )
}
