"use client"

import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useDashboardStats } from "@/hooks/pharmacie/useDashboardStats"
import { formatPrice, formatPercentage } from "@/utils/formatters"
import {
  Pill,
  Package,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
  Activity,
  Bell,
  DollarSign,
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChartIcon as RechartsPieChart,
  Users,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Link from "next/link"
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function PharmacienDashboard() {
  const { stats, loading, error, refreshStats } = useDashboardStats()

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
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
            <Button onClick={refreshStats} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </div>
      </PharmacienSidebar>
    )
  }

  if (!stats) return null

  const chartConfig = {
    ventes: {
      label: "Ventes",
      color: "hsl(var(--chart-1))",
    },
    commandes: {
      label: "Commandes",
      color: "hsl(var(--chart-2))",
    },
    stock: {
      label: "Stock",
      color: "hsl(var(--chart-3))",
    },
    entrees: {
      label: "Entrées",
      color: "hsl(var(--chart-4))",
    },
    sorties: {
      label: "Sorties",
      color: "hsl(var(--chart-5))",
    },
  }

  return (
    <PharmacienSidebar>
      <div className="space-y-6">
        {/* Header avec actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              Dashboard Pharmacie
            </h1>
            <p className="text-gray-600 mt-2">Tableau de bord analytique et opérationnel</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={refreshStats} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            {stats.notificationsNonLues > 0 && (
              <Link href="/dashboard/pharmacien/notifications">
                <Button variant="outline" size="sm" className="relative bg-transparent">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5">
                    {stats.notificationsNonLues}
                  </Badge>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Alertes importantes */}
        {(stats.alertesImportantes.length > 0 || stats.lotsExpires > 0) && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertes Critiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.lotsExpires > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg">
                    <div>
                      <span className="text-red-800 font-medium">{stats.lotsExpires} lot(s) expirés</span>
                      <p className="text-red-600 text-xs">Action immédiate requise</p>
                    </div>
                    <Link href="/dashboard/pharmacien/stock">
                      <Button size="sm" variant="outline" className="text-red-700 border-red-300 bg-transparent">
                        Voir
                      </Button>
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
                      <Button size="sm" variant="outline" className="text-orange-700 border-orange-300 bg-transparent">
                        Gérer
                      </Button>
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
                      <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-300 bg-transparent">
                        Planifier
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50 hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-teal-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Ventes Aujourd'hui
                </div>
                {stats.ventesEvolution >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">{formatPrice(stats.ventesAujourdhui)}</div>
              <div className="flex items-center mt-1">
                <span className={`text-xs ${stats.ventesEvolution >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stats.ventesEvolution >= 0 ? "+" : ""}
                  {stats.ventesEvolution.toFixed(1)}% vs hier
                </span>
              </div>
              <p className="text-xs text-teal-600 mt-1">{stats.commandesAujourdhui} commandes</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Valeur Stock Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{formatPrice(stats.valeurTotalStock)}</div>
              <div className="flex items-center mt-1">
                <Target className="h-3 w-3 text-blue-600 mr-1" />
                <span className="text-xs text-blue-600">Rotation: {stats.tauxRotationStock}%</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">{stats.totalLots} lots actifs</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Produits Actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.totalMedicaments.toLocaleString()}</div>
              <div className="flex items-center mt-1">
                <Users className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">{stats.nombreFournisseurs} fournisseurs</span>
              </div>
              <p className="text-xs text-green-600 mt-1">Marge: {stats.margeGlobale}%</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Alertes Actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.alertesStock}</div>
              <div className="flex items-center mt-1">
                <Zap className="h-3 w-3 text-orange-600 mr-1" />
                <span className="text-xs text-orange-600">{stats.lotsExpirantBientot} expirent bientôt</span>
              </div>
              <p className="text-xs text-orange-600 mt-1">{stats.lotsExpires} lots expirés</p>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Évolution des ventes */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                Évolution des Ventes (7 jours)
              </CardTitle>
              <CardDescription>Ventes quotidiennes et nombre de commandes</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.ventesParJour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="ventes"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.3}
                      name="Ventes (FCFA)"
                    />
                    <Line
                      type="monotone"
                      dataKey="commandes"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      name="Commandes"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Répartition du stock par catégorie */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RechartsPieChart className="h-5 w-5 text-blue-600" />
                Stock par Catégorie
              </CardTitle>
              <CardDescription>Répartition de la valeur du stock</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={stats.stockParCategorie}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="valeur"
                      label={({ categorie, percent }) => `${categorie} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {stats.stockParCategorie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 border rounded shadow">
                              <p className="font-medium">{data.categorie}</p>
                              <p className="text-sm">Valeur: {formatPrice(data.valeur)}</p>
                              <p className="text-sm">Stock: {data.stock} unités</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques secondaires */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top produits */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Top Produits
              </CardTitle>
              <CardDescription>Produits les plus performants</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topProduits} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nom" type="category" width={100} />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 border rounded shadow">
                              <p className="font-medium">{data.nom}</p>
                              <p className="text-sm">CA: {formatPrice(data.chiffreAffaires)}</p>
                              <p className="text-sm">Quantité: {data.quantiteVendue}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="chiffreAffaires" fill="hsl(var(--chart-3))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Alertes par type */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Alertes par Type
              </CardTitle>
              <CardDescription>Distribution des alertes actives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.alertesParType.map((alerte, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: alerte.color }} />
                      <span className="text-sm font-medium">{alerte.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(alerte.count / Math.max(...stats.alertesParType.map((a) => a.count))) * 100}
                        className="w-20 h-2"
                      />
                      <Badge variant="outline">{alerte.count}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Évolution du stock */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Évolution du Stock (6 mois)
            </CardTitle>
            <CardDescription>Mouvements d'entrées et sorties de stock</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.evolutionStock}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="entrees"
                    stackId="1"
                    stroke="hsl(var(--chart-4))"
                    fill="hsl(var(--chart-4))"
                    name="Entrées"
                  />
                  <Area
                    type="monotone"
                    dataKey="sorties"
                    stackId="2"
                    stroke="hsl(var(--chart-5))"
                    fill="hsl(var(--chart-5))"
                    name="Sorties"
                  />
                  <Line
                    type="monotone"
                    dataKey="stock"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    name="Stock Total"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Activité récente et actions rapides */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Produits à stock faible */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-600" />
                Stock Critique
              </CardTitle>
              <CardDescription>Produits nécessitant un réapprovisionnement</CardDescription>
            </CardHeader>
            <CardContent>
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
                          ? "bg-red-50 border border-red-200"
                          : produit.statut === "critique"
                            ? "bg-orange-50 border border-orange-200"
                            : "bg-yellow-50 border border-yellow-200"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{produit.nom}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-600">
                            Stock: {produit.stock} / Min: {produit.minimum}
                          </span>
                          {produit.stock > 0 && (
                            <Progress value={(produit.stock / produit.minimum) * 100} className="w-16 h-2" />
                          )}
                        </div>
                      </div>
                      <Badge
                        className={
                          produit.statut === "rupture"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : produit.statut === "critique"
                              ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        }
                      >
                        {produit.statut === "rupture"
                          ? "Rupture"
                          : produit.statut === "critique"
                            ? "Critique"
                            : "Faible"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
              {stats.produitsStockFaible.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Link href="/dashboard/pharmacien/stock">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      Gérer les stocks
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
              <CardDescription>Accès rapide aux fonctionnalités principales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/dashboard/pharmacien/stock">
                  <Button variant="outline" className="w-full h-20 flex-col hover:bg-teal-50 bg-transparent">
                    <Package className="h-6 w-6 mb-2 text-teal-600" />
                    <span className="text-sm">Gérer Stock</span>
                  </Button>
                </Link>
                <Link href="/dashboard/pharmacien/commandes">
                  <Button variant="outline" className="w-full h-20 flex-col hover:bg-blue-50 bg-transparent">
                    <ShoppingCart className="h-6 w-6 mb-2 text-blue-600" />
                    <span className="text-sm">Commandes</span>
                  </Button>
                </Link>
                <Link href="/dashboard/pharmacien/rapports">
                  <Button variant="outline" className="w-full h-20 flex-col hover:bg-green-50 bg-transparent">
                    <BarChart3 className="h-6 w-6 mb-2 text-green-600" />
                    <span className="text-sm">Rapports</span>
                  </Button>
                </Link>
                <Link href="/dashboard/pharmacien/notifications">
                  <Button variant="outline" className="w-full h-20 flex-col relative hover:bg-orange-50 bg-transparent">
                    <Bell className="h-6 w-6 mb-2 text-orange-600" />
                    <span className="text-sm">Notifications</span>
                    {stats.notificationsNonLues > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5">
                        {stats.notificationsNonLues}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </div>

              {/* Métriques supplémentaires */}
              <div className="mt-6 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg">
                    <div className="text-lg font-bold text-teal-800">{formatPercentage(stats.tauxRotationStock)}</div>
                    <div className="text-xs text-teal-600">Taux de rotation</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-lg font-bold text-green-800">{formatPercentage(stats.margeGlobale)}</div>
                    <div className="text-xs text-green-600">Marge globale</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PharmacienSidebar>
  )
}
