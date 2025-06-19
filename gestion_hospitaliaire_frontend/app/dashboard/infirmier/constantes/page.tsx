import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Thermometer,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  AlertTriangle,
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"

export default function InfirmierConstantesPage() {
  const stats = [
    {
      title: "Constantes Prises",
      value: "24",
      change: "+8 aujourd'hui",
      icon: <Thermometer className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "À Prendre",
      value: "12",
      change: "Programmées",
      icon: <Clock className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Alertes",
      value: "3",
      change: "Valeurs anormales",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Patients Surveillés",
      value: "18",
      change: "Actifs",
      icon: <Activity className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ]

  const constantesRecentes = [
    {
      id: "C001",
      patient: "Marie Dubois",
      chambre: "Ch. 201",
      heure: "13:30",
      temperature: "37.2°C",
      tension: "120/80",
      pouls: "72",
      saturation: "98%",
      frequenceResp: "16",
      glycemie: "1.2g/L",
      poids: "65kg",
      taille: "165cm",
      alerte: false,
      infirmier: "Marie D.",
      tendance: "stable",
    },
    {
      id: "C002",
      patient: "Jean Martin",
      chambre: "Ch. 203",
      heure: "13:15",
      temperature: "38.5°C",
      tension: "140/95",
      pouls: "88",
      saturation: "95%",
      frequenceResp: "20",
      glycemie: "1.8g/L",
      poids: "78kg",
      taille: "175cm",
      alerte: true,
      infirmier: "Marie D.",
      tendance: "hausse",
    },
    {
      id: "C003",
      patient: "Sophie Laurent",
      chambre: "Ch. 205",
      heure: "12:45",
      temperature: "36.8°C",
      tension: "110/70",
      pouls: "68",
      saturation: "99%",
      frequenceResp: "14",
      glycemie: "1.0g/L",
      poids: "58kg",
      taille: "160cm",
      alerte: false,
      infirmier: "Marie D.",
      tendance: "baisse",
    },
  ]

  const constantesProgrammees = [
    {
      patient: "Pierre Moreau",
      chambre: "Ch. 207",
      heure: "14:00",
      type: "Complètes",
      frequence: "Toutes les 4h",
      derniere: "10:00",
      priorite: "urgent",
    },
    {
      patient: "Claire Petit",
      chambre: "Ch. 209",
      heure: "14:30",
      type: "Tension + Pouls",
      frequence: "Toutes les 6h",
      derniere: "08:30",
      priorite: "normale",
    },
    {
      patient: "Marc Durand",
      chambre: "Ch. 211",
      heure: "15:00",
      type: "Température",
      frequence: "Toutes les 2h",
      derniere: "13:00",
      priorite: "normale",
    },
  ]

  const getAlerteBadge = (alerte: boolean) => {
    return alerte ? "bg-red-100 text-red-800 border-red-200" : "bg-green-100 text-green-800 border-green-200"
  }

  const getTendanceIcon = (tendance: string) => {
    switch (tendance) {
      case "hausse":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "baisse":
        return <TrendingDown className="h-4 w-4 text-blue-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getPrioriteColor = (priorite: string) => {
    return priorite === "urgent" ? "border-red-200 bg-red-50" : "border-gray-200 bg-white hover:bg-gray-50"
  }

  return (
    <DashboardLayout userRole="Infirmier">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Constantes Vitales</h1>
            <p className="text-gray-600 mt-1">Surveillance et enregistrement des constantes</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-orange-700 border-orange-200">
              <Clock className="w-3 h-3 mr-2" />
              12 à prendre
            </Badge>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Prendre Constantes
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-red-600" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par patient, chambre..."
                    className="pl-10 border-gray-200 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aujourd-hui">Aujourd'hui</SelectItem>
                  <SelectItem value="hier">Hier</SelectItem>
                  <SelectItem value="semaine">Cette semaine</SelectItem>
                  <SelectItem value="mois">Ce mois</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Toutes</SelectItem>
                  <SelectItem value="completes">Complètes</SelectItem>
                  <SelectItem value="partielles">Partielles</SelectItem>
                  <SelectItem value="alertes">Avec alertes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="recentes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recentes">Constantes Récentes</TabsTrigger>
            <TabsTrigger value="programmees">À Programmer</TabsTrigger>
          </TabsList>

          <TabsContent value="recentes">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-red-600" />
                  Constantes Récentes
                </CardTitle>
                <CardDescription>Dernières constantes enregistrées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-4 font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50">
                          Patient
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50">
                          Heure
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50">
                          Température
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50">
                          Tension
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50">
                          Pouls
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50">
                          Saturation
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50">
                          Tendance
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {constantesRecentes.map((constante, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                          }`}
                        >
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-900">{constante.patient}</p>
                              <p className="text-sm text-gray-500">{constante.chambre}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {constante.heure}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span
                              className={`font-medium ${
                                Number.parseFloat(constante.temperature) > 37.5 ? "text-red-600" : "text-gray-900"
                              }`}
                            >
                              {constante.temperature}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`font-medium ${
                                constante.tension.includes("140") || constante.tension.includes("95")
                                  ? "text-red-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {constante.tension}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-medium text-gray-900">{constante.pouls}</span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`font-medium ${
                                Number.parseInt(constante.saturation) < 96 ? "text-red-600" : "text-gray-900"
                              }`}
                            >
                              {constante.saturation}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getTendanceIcon(constante.tendance)}
                              <Badge className={`text-xs border ${getAlerteBadge(constante.alerte)}`}>
                                {constante.alerte ? "Alerte" : "Normal"}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-200 hover:bg-green-50"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programmees">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Constantes Programmées
                </CardTitle>
                <CardDescription>Constantes à prendre selon le planning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {constantesProgrammees.map((constante, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border transition-all duration-200 ${getPrioriteColor(constante.priorite)}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{constante.patient}</h3>
                            <Badge variant="outline" className="text-xs">
                              {constante.chambre}
                            </Badge>
                            {constante.priorite === "urgent" && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-orange-500" />
                              <span>Prévue: {constante.heure}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-4 w-4 text-red-500" />
                              <span>{constante.type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-blue-500" />
                              <span>Dernière: {constante.derniere}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Fréquence: {constante.frequence}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Historique
                          </Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            <Thermometer className="h-4 w-4 mr-2" />
                            Prendre
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
