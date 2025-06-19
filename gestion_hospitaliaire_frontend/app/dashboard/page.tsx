import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Activity,
  Stethoscope,
  Bed,
  Pill,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
  UserCheck,
  FileText,
  DollarSign,
  Baby,
} from "lucide-react"

export default function DashboardPage() {
  const quickStats = [
    {
      title: "Patients Actifs",
      value: "1,247",
      change: "+12%",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      title: "Consultations Aujourd'hui",
      value: "89",
      change: "+5%",
      icon: <Stethoscope className="h-5 w-5" />,
      color: "text-green-600",
    },
    {
      title: "Lits Occupés",
      value: "156/200",
      change: "78%",
      icon: <Bed className="h-5 w-5" />,
      color: "text-orange-600",
    },
    {
      title: "Urgences",
      value: "23",
      change: "-8%",
      icon: <Activity className="h-5 w-5" />,
      color: "text-red-600",
    },
  ]

  const recentActivities = [
    { time: "09:30", action: "Nouvelle consultation", patient: "Marie Dubois", type: "consultation" },
    { time: "09:15", action: "Prescription validée", patient: "Jean Martin", type: "prescription" },
    { time: "09:00", action: "Hospitalisation", patient: "Sophie Laurent", type: "hospitalization" },
    { time: "08:45", action: "Accouchement", patient: "Emma Bernard", type: "birth" },
    { time: "08:30", action: "Sortie d'hôpital", patient: "Pierre Moreau", type: "discharge" },
  ]

  const departmentStats = [
    { name: "Cardiologie", patients: 45, capacity: 60, color: "bg-red-500" },
    { name: "Pédiatrie", patients: 32, capacity: 40, color: "bg-blue-500" },
    { name: "Maternité", patients: 28, capacity: 35, color: "bg-pink-500" },
    { name: "Urgences", patients: 23, capacity: 30, color: "bg-orange-500" },
    { name: "Chirurgie", patients: 18, capacity: 25, color: "bg-purple-500" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble de l'activité hospitalière</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Système Opérationnel
            </Badge>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Rapport
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={stat.color}>{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} ce mois
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Activités Récentes
              </CardTitle>
              <CardDescription>Dernières actions dans le système</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-500 min-w-[60px]">{activity.time}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">Patient: {activity.patient}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type === "consultation" && <Stethoscope className="h-3 w-3 mr-1" />}
                      {activity.type === "prescription" && <Pill className="h-3 w-3 mr-1" />}
                      {activity.type === "hospitalization" && <Bed className="h-3 w-3 mr-1" />}
                      {activity.type === "birth" && <Baby className="h-3 w-3 mr-1" />}
                      {activity.type === "discharge" && <UserCheck className="h-3 w-3 mr-1" />}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Occupancy */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-green-600" />
                Occupation Services
              </CardTitle>
              <CardDescription>Taux d'occupation par service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentStats.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                      <span className="text-sm text-gray-500">
                        {dept.patients}/{dept.capacity}
                      </span>
                    </div>
                    <Progress value={(dept.patients / dept.capacity) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gestion Patients</h3>
              <p className="text-sm text-gray-600">Dossiers et consultations</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Planning</h3>
              <p className="text-sm text-gray-600">Rendez-vous et horaires</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Pill className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pharmacie</h3>
              <p className="text-sm text-gray-600">Stocks et prescriptions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Facturation</h3>
              <p className="text-sm text-gray-600">Paiements et finances</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card className="border-l-4 border-l-yellow-500 bg-yellow-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Alertes Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-800">Stock faible: Paracétamol (12 unités restantes)</span>
                <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-300">
                  Voir
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-800">Maintenance programmée: Système de sauvegarde (23:00)</span>
                <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-300">
                  Détails
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
