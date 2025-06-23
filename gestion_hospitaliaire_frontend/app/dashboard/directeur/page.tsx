import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
  FileText,
  UserCheck,
  Bed,
  Heart,
} from "lucide-react"

export default function DirecteurDashboard() {
  const hospitalStats = [
    {
      title: "Taux d'Occupation",
      value: "78%",
      beds: "156/200",
      icon: <Bed className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      title: "Personnel Actif",
      value: "247",
      present: "231",
      icon: <Users className="h-5 w-5" />,
      color: "text-green-600",
    },
    {
      title: "Revenus Mensuels",
      value: "485,200€",
      growth: "+12%",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-purple-600",
    },
    {
      title: "Indicateurs Qualité",
      value: "94.2%",
      satisfaction: "Excellent",
      icon: <Heart className="h-5 w-5" />,
      color: "text-red-600",
    },
  ]

  const departmentPerformance = [
    {
      name: "Cardiologie",
      patients: 45,
      capacity: 60,
      revenue: "125,400€",
      satisfaction: 96,
      staff: 18,
    },
    {
      name: "Maternité",
      patients: 28,
      capacity: 35,
      revenue: "89,200€",
      satisfaction: 98,
      staff: 12,
    },
    {
      name: "Urgences",
      patients: 156,
      capacity: 200,
      revenue: "78,900€",
      satisfaction: 89,
      staff: 25,
    },
    {
      name: "Chirurgie",
      patients: 18,
      capacity: 25,
      revenue: "156,700€",
      satisfaction: 95,
      staff: 22,
    },
  ]

  const keyIndicators = [
    {
      indicator: "Taux de Mortalité",
      value: "1.2%",
      target: "< 1.5%",
      status: "good",
      trend: "down",
    },
    {
      indicator: "Durée Moyenne de Séjour",
      value: "4.8 jours",
      target: "< 5 jours",
      status: "good",
      trend: "stable",
    },
    {
      indicator: "Taux d'Infection Nosocomiale",
      value: "2.1%",
      target: "< 2%",
      status: "warning",
      trend: "up",
    },
    {
      indicator: "Satisfaction Patients",
      value: "94.2%",
      target: "> 90%",
      status: "excellent",
      trend: "up",
    },
  ]

  const staffManagement = [
    {
      department: "Médecins",
      total: 45,
      present: 42,
      onLeave: 2,
      absent: 1,
      efficiency: 93,
    },
    {
      department: "Infirmiers",
      total: 89,
      present: 85,
      onLeave: 3,
      absent: 1,
      efficiency: 96,
    },
    {
      department: "Sages-femmes",
      total: 12,
      present: 11,
      onLeave: 1,
      absent: 0,
      efficiency: 92,
    },
    {
      department: "Pharmaciens",
      total: 8,
      present: 8,
      onLeave: 0,
      absent: 0,
      efficiency: 98,
    },
  ]

  const recentAlerts = [
    {
      type: "Stock",
      message: "Rupture de stock: Paracétamol",
      severity: "high",
      time: "Il y a 30min",
      department: "Pharmacie",
    },
    {
      type: "Personnel",
      message: "Absence non prévue: Dr. Martin",
      severity: "medium",
      time: "Il y a 1h",
      department: "Cardiologie",
    },
    {
      type: "Équipement",
      message: "Maintenance requise: Scanner IRM",
      severity: "low",
      time: "Il y a 2h",
      department: "Radiologie",
    },
    {
      type: "Qualité",
      message: "Plainte patient: Délai d'attente",
      severity: "medium",
      time: "Il y a 3h",
      department: "Urgences",
    },
  ]

  const financialOverview = [
    { category: "Consultations", revenue: "145,600€", percentage: 30, growth: "+8%" },
    { category: "Hospitalisations", revenue: "198,400€", percentage: 41, growth: "+15%" },
    { category: "Chirurgies", revenue: "89,200€", percentage: 18, growth: "+5%" },
    { category: "Examens", revenue: "52,000€", percentage: 11, growth: "+12%" },
  ]

  return (
    <DashboardLayout userRole="Directeur">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Directeur</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble de l'hôpital et indicateurs clés</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-blue-700 border-blue-200">
              <Building2 className="w-2 h-2 mr-2" />
              Direction Générale
            </Badge>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Rapport Mensuel
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hospitalStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={stat.color}>{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  {stat.beds && <p className="text-xs text-gray-500">{stat.beds} lits</p>}
                  {stat.present && <p className="text-xs text-gray-500">{stat.present} présents</p>}
                  {stat.growth && (
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.growth} ce mois
                    </p>
                  )}
                  {stat.satisfaction && (
                    <Badge variant="outline" className="text-xs">
                      {stat.satisfaction}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alertes Importantes */}
        <Card className="border-l-4 border-l-red-500 bg-red-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Alertes Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {recentAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    alert.severity === "high"
                      ? "border-red-200 bg-red-100"
                      : alert.severity === "medium"
                        ? "border-orange-200 bg-orange-100"
                        : "border-yellow-200 bg-yellow-100"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          alert.severity === "high"
                            ? "destructive"
                            : alert.severity === "medium"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {alert.type}
                      </Badge>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-600">{alert.department}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Traiter
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs pour Gestion */}
        <Tabs defaultValue="departments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="departments">Services</TabsTrigger>
            <TabsTrigger value="staff">Personnel</TabsTrigger>
            <TabsTrigger value="indicators">Indicateurs</TabsTrigger>
            <TabsTrigger value="financial">Finances</TabsTrigger>
          </TabsList>

          <TabsContent value="departments">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Performance des Services
                </CardTitle>
                <CardDescription>Vue d'ensemble de l'activité par service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {departmentPerformance.map((dept, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {dept.staff} personnel
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Occupation</p>
                          <p className="text-lg font-bold text-gray-900">
                            {dept.patients}/{dept.capacity}
                          </p>
                          <Progress value={(dept.patients / dept.capacity) * 100} className="h-2 mt-1" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Revenus</p>
                          <p className="text-lg font-bold text-green-600">{dept.revenue}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Satisfaction</p>
                          <p className="text-lg font-bold text-blue-600">{dept.satisfaction}%</p>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  Gestion du Personnel
                </CardTitle>
                <CardDescription>État du personnel par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffManagement.map((staff, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{staff.department}</p>
                        <p className="text-sm text-gray-600">
                          {staff.present}/{staff.total} présents
                        </p>
                        <div className="flex gap-4 mt-1">
                          <p className="text-xs text-gray-500">Congés: {staff.onLeave}</p>
                          <p className="text-xs text-gray-500">Absents: {staff.absent}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{staff.efficiency}%</p>
                        <p className="text-xs text-gray-500">Efficacité</p>
                        <Progress value={staff.efficiency} className="h-2 mt-1 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="indicators">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Indicateurs Clés de Performance
                </CardTitle>
                <CardDescription>Métriques qualité et performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {keyIndicators.map((indicator, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{indicator.indicator}</p>
                        <p className="text-sm text-gray-600">Objectif: {indicator.target}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold text-gray-900">{indicator.value}</p>
                          <Badge
                            variant={
                              indicator.status === "excellent"
                                ? "outline"
                                : indicator.status === "good"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {indicator.status === "excellent"
                              ? "Excellent"
                              : indicator.status === "good"
                                ? "Bon"
                                : "Attention"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          {indicator.trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                          {indicator.trend === "down" && <TrendingUp className="h-3 w-3 mr-1 rotate-180" />}
                          {indicator.trend === "stable" && <Activity className="h-3 w-3 mr-1" />}
                          Tendance{" "}
                          {indicator.trend === "up" ? "hausse" : indicator.trend === "down" ? "baisse" : "stable"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Vue Financière
                </CardTitle>
                <CardDescription>Répartition des revenus par activité</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialOverview.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{item.category}</p>
                        <p className="text-sm text-gray-600">{item.percentage}% du total</p>
                        <Progress value={item.percentage} className="h-2 mt-2 w-32" />
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{item.revenue}</p>
                        <p className="text-xs text-green-600 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {item.growth} ce mois
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-gray-900">Total Mensuel</p>
                      <p className="text-2xl font-bold text-green-600">485,200€</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
