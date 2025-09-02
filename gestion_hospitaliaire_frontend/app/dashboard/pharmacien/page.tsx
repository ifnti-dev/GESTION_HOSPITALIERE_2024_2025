"use client"

import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { useDashboardStats } from "@/hooks/pharmacie/useDashboardStats"
import { formatPrice, formatPercentage } from "@/utils/formatters"
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  Bell,
  DollarSign,
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PharmacienDashboard() {
  const { stats, loading, error, refreshStats } = useDashboardStats()
  const [searchTerm, setSearchTerm] = useState("")

  if (loading) {
    return (
      <PharmacienSidebar>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </PharmacienSidebar>
    )
  }

  if (error) {
    return (
      <PharmacienSidebar>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refreshStats}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </button>
          </div>
        </div>
      </PharmacienSidebar>
    )
  }

  if (!stats) return null

  const allStats = [
    { name: "Ventes Aujourd'hui", value: formatPrice(stats.ventesAujourdhui), type: "ventes" },
    { name: "Valeur Stock Total", value: formatPrice(stats.valeurTotalStock), type: "stock" },
    { name: "Produits Actifs", value: stats.totalMedicaments.toLocaleString(), type: "produits" },
    { name: "Alertes Actives", value: stats.alertesStock.toString(), type: "alertes" },
    { name: "Commandes Aujourd'hui", value: stats.commandesAujourdhui.toString(), type: "commandes" },
    { name: "Total Lots", value: stats.totalLots.toString(), type: "lots" },
    { name: "Nombre Fournisseurs", value: stats.nombreFournisseurs.toString(), type: "fournisseurs" },
    { name: "Lots Expirés", value: stats.lotsExpires.toString(), type: "expiration" },
    { name: "Lots Expirant Bientôt", value: stats.lotsExpirantBientot.toString(), type: "expiration" },
    { name: "Taux Rotation Stock", value: formatPercentage(stats.tauxRotationStock), type: "performance" },
    { name: "Marge Globale", value: formatPercentage(stats.margeGlobale), type: "performance" },
    { name: "Notifications Non Lues", value: stats.notificationsNonLues.toString(), type: "notifications" },
  ]

  const filteredStats = allStats.filter(
    (stat) =>
      stat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <PharmacienSidebar>
      <div className="space-y-6">
        {/* Header avec actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <BarChart3 className="h-8 w-8 text-gray-700" />
              </div>
              Dashboard Pharmacie
            </h1>
            <p className="text-gray-600 mt-2">Tableau de bord analytique et opérationnel</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshStats}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >

            </button>
            {stats.notificationsNonLues > 0 && (
              <Link href="/dashboard/pharmacien/notifications">
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 relative">
                  <Bell className="h-4 w-4" />
                  Notifications
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {stats.notificationsNonLues}
                  </span>
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une statistique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Alertes importantes */}
        {(stats.alertesImportantes.length > 0 || stats.lotsExpires > 0) && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-red-800 font-medium flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5" />
              Alertes Critiques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.lotsExpires > 0 && (
                <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg">
                  <div>
                    <span className="text-red-800 font-medium">{stats.lotsExpires} lot(s) expirés</span>
                    <p className="text-red-600 text-xs">Action immédiate requise</p>
                  </div>
                  <Link href="/dashboard/pharmacien/stock">
                    <button className="px-3 py-1 text-sm border border-red-300 rounded-md text-red-700 hover:bg-red-50">
                      Voir
                    </button>
                  </Link>
                </div>
              )}
              {stats.alertesStock > 10 && (
                <div className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                  <div>
                    <span className="text-orange-800 font-medium">{stats.alertesStock} stocks critiques</span>
                    <p className="text-orange-600 text-xs">Réapprovisionnement nécessaire</p>
                  </div>
                  <Link href="/dashboard/pharmacien/stock">
                    <button className="px-3 py-1 text-sm border border-orange-300 rounded-md text-orange-700 hover:bg-orange-50">
                      Gérer
                    </button>
                  </Link>
                </div>
              )}
              {stats.lotsExpirantBientot > 5 && (
                <div className="flex items-center justify-between p-3 bg-yellow-100 rounded-lg">
                  <div>
                    <span className="text-yellow-800 font-medium">
                      {stats.lotsExpirantBientot} lots expirent bientôt
                    </span>
                    <p className="text-yellow-600 text-xs">Surveillance requise</p>
                  </div>
                  <Link href="/dashboard/pharmacien/stock">
                    <button className="px-3 py-1 text-sm border border-yellow-300 rounded-md text-yellow-700 hover:bg-yellow-50">
                      Planifier
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStats.slice(0, 12).map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">{stat.name}</h3>
                {stat.type === "ventes" && stats.ventesEvolution >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : stat.type === "ventes" ? (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                ) : null}
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              {stat.type === "ventes" && (
                <div className="flex items-center mt-1">
                  <span className={`text-xs ${stats.ventesEvolution >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stats.ventesEvolution >= 0 ? "+" : ""}
                    {stats.ventesEvolution.toFixed(1)}% vs hier
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques Détaillées</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-700">Performance Financière</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Ventes du mois:</span>
                  <span className="font-medium">{formatPrice(stats.ventesAujourdhui * 30)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Marge moyenne:</span>
                  <span className="font-medium">{formatPercentage(stats.margeGlobale)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-700">Gestion Stock</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Rotation stock:</span>
                  <span className="font-medium">{formatPercentage(stats.tauxRotationStock)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valeur moyenne/lot:</span>
                  <span className="font-medium">{formatPrice(stats.valeurTotalStock / stats.totalLots)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-700">Activité</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Commandes/jour:</span>
                  <span className="font-medium">{stats.commandesAujourdhui}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fournisseurs actifs:</span>
                  <span className="font-medium">{stats.nombreFournisseurs}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produits à stock faible */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-gray-600" />
            Stock Critique
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {stats.produitsStockFaible.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>Aucun produit en stock critique</p>
              </div>
            ) : (
              stats.produitsStockFaible.map((produit, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    produit.statut === "rupture"
                      ? "bg-red-50"
                      : produit.statut === "critique"
                        ? "bg-orange-50"
                        : "bg-yellow-50"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{produit.nom}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-600">
                        Stock: {produit.stock} / Min: {produit.minimum}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      produit.statut === "rupture"
                        ? "bg-red-100 text-red-800"
                        : produit.statut === "critique"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {produit.statut === "rupture" ? "Rupture" : produit.statut === "critique" ? "Critique" : "Faible"}
                  </span>
                </div>
              ))
            )}
          </div>
          {stats.produitsStockFaible.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/pharmacien/stock">
                <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2">
                  <Eye className="h-4 w-4" />
                  Gérer les stocks
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Actions rapides */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/pharmacien/stock">
              <button className="w-full h-20 flex flex-col items-center justify-center gap-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Package className="h-6 w-6 text-gray-600" />
                <span className="text-sm">Gérer Stock</span>
              </button>
            </Link>
            <Link href="/dashboard/pharmacien/commandes">
              <button className="w-full h-20 flex flex-col items-center justify-center gap-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                <span className="text-sm">Commandes</span>
              </button>
            </Link>
            <Link href="/dashboard/pharmacien/rapports">
              <button className="w-full h-20 flex flex-col items-center justify-center gap-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <BarChart3 className="h-6 w-6 text-gray-600" />
                <span className="text-sm">Rapports</span>
              </button>
            </Link>
            <Link href="/dashboard/pharmacien/notifications">
              <button className="w-full h-20 flex flex-col items-center justify-center gap-2 border border-gray-300 rounded-md hover:bg-gray-50 relative">
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="text-sm">Notifications</span>
                {stats.notificationsNonLues > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {stats.notificationsNonLues}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </PharmacienSidebar>
  )
}
