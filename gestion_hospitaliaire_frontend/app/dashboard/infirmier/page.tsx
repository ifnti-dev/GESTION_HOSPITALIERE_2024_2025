import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Bed, Pill, Clock, AlertTriangle, Thermometer, Users, Plus, Eye, CheckCircle } from "lucide-react"

export default function InfirmierDashboard() {
  const shiftStats = [
    {
      title: "Patients Assignés",
      value: "18",
      sector: "Cardiologie",
      icon: <Users className="h-5 w-5" />,
      color: "text-emerald-600",
    },
    {
      title: "Soins Programmés",
      value: "24",
      completed: "16",
      icon: <Activity className="h-5 w-5" />,
      color: "text-emerald-600",
    },
    {
      title: "Médicaments à Administrer",
      value: "12",
      urgent: "3",
      icon: <Pill className="h-5 w-5" />,
      color: "text-emerald-600",
    },
    {
      title: "Constantes à Prendre",
      value: "8",
      pending: "5",
      icon: <Thermometer className="h-5 w-5" />,
      color: "text-emerald-600",
    },
  ]

  const assignedPatients = [
    {
      name: "Marie Dubois",
      room: "Ch. 201",
      condition: "Post-opératoire",
      lastVitals: "Il y a 2h",
      alerts: 0,
      nextCare: "14:00 - Pansement",
      status: "stable",
    },
    {
      name: "Jean Martin",
      room: "Ch. 203",
      condition: "Surveillance cardiaque",
      lastVitals: "Il y a 30min",
      alerts: 1,
      nextCare: "13:30 - Médicament",
      status: "attention",
    },
    {
      name: "Sophie Laurent",
      room: "Ch. 205",
      condition: "Récupération",
      lastVitals: "Il y a 1h",
      alerts: 0,
      nextCare: "15:00 - Constantes",
      status: "stable",
    },
    {
      name: "Pierre Moreau",
      room: "Ch. 207",
      condition: "Observation",
      lastVitals: "Il y a 4h",
      alerts: 2,
      nextCare: "13:00 - Urgent",
      status: "urgent",
    },
  ]

  const medicationSchedule = [
    {
      time: "13:00",
      patient: "Jean Martin",
      medication: "Aspirine 100mg",
      route: "Per os",
      status: "pending",
    },
    {
      time: "13:30",
      patient: "Marie Dubois",
      medication: "Morphine 10mg",
      route: "IV",
      status: "pending",
    },
    {
      time: "14:00",
      patient: "Sophie Laurent",
      medication: "Paracétamol 1g",
      route: "Per os",
      status: "administered",
    },
    {
      time: "14:30",
      patient: "Pierre Moreau",
      medication: "Antibiotique",
      route: "IV",
      status: "pending",
    },
  ]

  const careSchedule = [
    {
      time: "13:00",
      patient: "Pierre Moreau",
      care: "Prise de constantes vitales",
      priority: "urgent",
      duration: "15min",
    },
    {
      time: "13:30",
      patient: "Marie Dubois",
      care: "Changement de pansement",
      priority: "normal",
      duration: "20min",
    },
    {
      time: "14:00",
      patient: "Jean Martin",
      care: "Surveillance cardiaque",
      priority: "important",
      duration: "10min",
    },
    {
      time: "15:00",
      patient: "Sophie Laurent",
      care: "Mobilisation",
      priority: "normal",
      duration: "30min",
    },
  ]

  const bedManagement = [
    { room: "Ch. 201", patient: "Marie Dubois", status: "occupied", cleaning: false },
    { room: "Ch. 202", patient: null, status: "available", cleaning: false },
    { room: "Ch. 203", patient: "Jean Martin", status: "occupied", cleaning: false },
    { room: "Ch. 204", patient: null, status: "cleaning", cleaning: true },
    { room: "Ch. 205", patient: "Sophie Laurent", status: "occupied", cleaning: false },
    { room: "Ch. 206", patient: null, status: "maintenance", cleaning: false },
  ]

  return (
    <DashboardLayout userRole="Infirmier">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Infirmier</h1>
            <p className="text-gray-600 mt-1">Service Cardiologie - Équipe de jour</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-emerald-700 border-emerald-200">
              <Clock className="w-2 h-2 mr-2" />
              Équipe 07h-19h
            </Badge>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Soin
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shiftStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={stat.color}>{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  {stat.completed && (
                    <p className="text-xs text-gray-500">
                      {stat.completed}/{stat.value} effectués
                    </p>
                  )}
                  {stat.sector && <p className="text-xs text-blue-600">{stat.sector}</p>}
                  {stat.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      {stat.urgent} urgent(s)
                    </Badge>
                  )}
                  {stat.pending && (
                    <Badge variant="secondary" className="text-xs">
                      {stat.pending} en attente
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Patients Assignés */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Mes Patients Assignés
              </CardTitle>
              <CardDescription>Patients sous ma responsabilité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedPatients.map((patient, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                      patient.status === "urgent"
                        ? "border-red-200 bg-red-50"
                        : patient.status === "attention"
                          ? "border-orange-200 bg-orange-50"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        {patient.alerts > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {patient.alerts}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {patient.room} • {patient.condition}
                      </p>
                      <p className="text-xs text-gray-500">Constantes: {patient.lastVitals}</p>
                      <p className="text-xs font-medium text-blue-600">{patient.nextCare}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Thermometer className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        Soins
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gestion des Lits */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-purple-600" />
                Gestion des Lits
              </CardTitle>
              <CardDescription>État des chambres</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bedManagement.map((bed, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">{bed.room}</p>
                      <p className="text-sm text-gray-600">
                        {bed.patient || (bed.status === "cleaning" ? "Nettoyage" : "Libre")}
                      </p>
                    </div>
                    <Badge
                      variant={
                        bed.status === "occupied" ? "secondary" : bed.status === "available" ? "outline" : "destructive"
                      }
                      className="text-xs"
                    >
                      {bed.status === "occupied"
                        ? "Occupé"
                        : bed.status === "available"
                          ? "Libre"
                          : bed.status === "cleaning"
                            ? "Nettoyage"
                            : "Maintenance"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs pour Planning */}
        <Tabs defaultValue="medications" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="medications">Médicaments</TabsTrigger>
            <TabsTrigger value="care">Soins Programmés</TabsTrigger>
          </TabsList>

          <TabsContent value="medications">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-orange-600" />
                  Planning des Médicaments
                </CardTitle>
                <CardDescription>Médicaments à administrer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicationSchedule.map((med, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-gray-500 min-w-[60px]">{med.time}</div>
                        <div>
                          <p className="font-medium text-gray-900">{med.patient}</p>
                          <p className="text-sm text-gray-600">
                            {med.medication} - {med.route}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {med.status === "administered" ? (
                          <Badge variant="outline" className="text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Administré
                          </Badge>
                        ) : (
                          <>
                            <Badge variant="secondary" className="text-xs">
                              En attente
                            </Badge>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                              Administrer
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="care">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Planning des Soins
                </CardTitle>
                <CardDescription>Soins programmés pour la journée</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {careSchedule.map((care, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-gray-500 min-w-[60px]">{care.time}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{care.patient}</p>
                            {care.priority === "urgent" && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                            {care.priority === "important" && (
                              <Badge variant="secondary" className="text-xs">
                                Important
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{care.care}</p>
                          <p className="text-xs text-gray-500">Durée estimée: {care.duration}</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        Effectuer
                      </Button>
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
