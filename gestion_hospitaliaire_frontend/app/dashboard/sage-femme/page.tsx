import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Baby,
  Heart,
  Calendar,
  AlertTriangle,
  Activity,
  FileText,
  Plus,
  Eye,
  TrendingUp,
  Stethoscope,
  UserCheck,
} from "lucide-react"

export default function SageFemmeDashboard() {
  const maternityStats = [
    {
      title: "Grossesses Suivies",
      value: "45",
      thisMonth: "+3",
      icon: <Heart className="h-5 w-5" />,
      color: "text-pink-600",
    },
    {
      title: "Accouchements ce Mois",
      value: "12",
      planned: "8",
      icon: <Baby className="h-5 w-5" />,
      color: "text-pink-600",
    },
    {
      title: "Consultations Prénatales",
      value: "18",
      today: "6",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-pink-600",
    },
    {
      title: "Urgences Obstétricales",
      value: "2",
      status: "En cours",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-red-600",
    },
  ]

  const pregnancyFollowUp = [
    {
      name: "Emma Bernard",
      gestationalAge: "38 SA + 2j",
      nextAppointment: "Aujourd'hui 14:00",
      riskLevel: "normal",
      lastVisit: "Il y a 1 semaine",
      complications: false,
    },
    {
      name: "Claire Rousseau",
      gestationalAge: "32 SA + 5j",
      nextAppointment: "Demain 10:30",
      riskLevel: "surveillance",
      lastVisit: "Il y a 2 semaines",
      complications: true,
    },
    {
      name: "Sophie Martin",
      gestationalAge: "28 SA + 1j",
      nextAppointment: "Dans 3 jours",
      riskLevel: "normal",
      lastVisit: "Il y a 1 semaine",
      complications: false,
    },
    {
      name: "Marie Dubois",
      gestationalAge: "39 SA + 4j",
      nextAppointment: "Aujourd'hui 16:00",
      riskLevel: "terme",
      lastVisit: "Il y a 3 jours",
      complications: false,
    },
  ]

  const todayAppointments = [
    {
      time: "09:00",
      patient: "Emma Bernard",
      type: "Consultation prénatale",
      gestationalAge: "38 SA",
      priority: "normal",
    },
    {
      time: "10:30",
      patient: "Lisa Petit",
      type: "Première consultation",
      gestationalAge: "12 SA",
      priority: "normal",
    },
    {
      time: "14:00",
      patient: "Marie Dubois",
      type: "Consultation terme",
      gestationalAge: "39 SA",
      priority: "important",
    },
    {
      time: "15:30",
      patient: "Anna Laurent",
      type: "Suivi post-natal",
      gestationalAge: "Post-partum J+7",
      priority: "normal",
    },
  ]

  const recentBirths = [
    {
      mother: "Julie Moreau",
      baby: "Léo Moreau",
      birthDate: "15/01/2024",
      birthTime: "14:30",
      weight: "3.2 kg",
      complications: false,
      status: "Excellent",
    },
    {
      mother: "Sarah Blanc",
      baby: "Emma Blanc",
      birthDate: "14/01/2024",
      birthTime: "22:15",
      weight: "2.9 kg",
      complications: false,
      status: "Bon",
    },
    {
      mother: "Camille Roux",
      baby: "Hugo Roux",
      birthDate: "13/01/2024",
      birthTime: "08:45",
      weight: "3.5 kg",
      complications: true,
      status: "Surveillance",
    },
  ]

  const postnatalCare = [
    {
      mother: "Julie Moreau",
      baby: "Léo Moreau",
      dayPostPartum: "J+2",
      motherStatus: "Bon",
      babyStatus: "Excellent",
      breastfeeding: true,
      nextVisit: "Demain",
    },
    {
      mother: "Sarah Blanc",
      baby: "Emma Blanc",
      dayPostPartum: "J+3",
      motherStatus: "Bon",
      babyStatus: "Bon",
      breastfeeding: true,
      nextVisit: "Dans 2 jours",
    },
    {
      mother: "Anna Laurent",
      baby: "Tom Laurent",
      dayPostPartum: "J+7",
      motherStatus: "Excellent",
      babyStatus: "Excellent",
      breastfeeding: false,
      nextVisit: "Aujourd'hui 15:30",
    },
  ]

  return (
    <DashboardLayout userRole="Sage-femme">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Sage-femme</h1>
            <p className="text-gray-600 mt-1">Service Maternité - Suivi Périnatal</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-pink-700 border-pink-200">
              <Heart className="w-2 h-2 mr-2" />
              Service Maternité
            </Badge>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Grossesse
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {maternityStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={stat.color}>{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  {stat.thisMonth && (
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.thisMonth} ce mois
                    </p>
                  )}
                  {stat.planned && <p className="text-xs text-gray-500">{stat.planned} programmés</p>}
                  {stat.today && (
                    <Badge variant="secondary" className="text-xs">
                      {stat.today} aujourd'hui
                    </Badge>
                  )}
                  {stat.status && (
                    <Badge variant="destructive" className="text-xs">
                      {stat.status}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Rendez-vous du Jour */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Consultations du Jour
              </CardTitle>
              <CardDescription>Planning des consultations prénatales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-500 min-w-[60px]">{appointment.time}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{appointment.patient}</p>
                        {appointment.priority === "important" && (
                          <Badge variant="secondary" className="text-xs">
                            Important
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                      <p className="text-xs text-gray-500">{appointment.gestationalAge}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                        Consulter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions Rapides */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start hover:bg-pink-50 hover:border-pink-200">
                <Heart className="h-4 w-4 mr-2 text-pink-600" />
                Nouveau Dossier Grossesse
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-pink-50 hover:border-pink-200">
                <Baby className="h-4 w-4 mr-2 text-pink-600" />
                Enregistrer Accouchement
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-pink-50 hover:border-pink-200">
                <Calendar className="h-4 w-4 mr-2 text-pink-600" />
                Planifier Consultation
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-pink-50 hover:border-pink-200">
                <Stethoscope className="h-4 w-4 mr-2 text-pink-600" />
                Suivi Post-natal
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-pink-50 hover:border-pink-200">
                <FileText className="h-4 w-4 mr-2 text-pink-600" />
                Rapport de Naissance
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tabs pour Suivi */}
        <Tabs defaultValue="pregnancy" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pregnancy">Suivi Grossesses</TabsTrigger>
            <TabsTrigger value="births">Accouchements Récents</TabsTrigger>
            <TabsTrigger value="postnatal">Soins Post-nataux</TabsTrigger>
          </TabsList>

          <TabsContent value="pregnancy">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  Grossesses en Cours de Suivi
                </CardTitle>
                <CardDescription>Patientes enceintes suivies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pregnancyFollowUp.map((pregnancy, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        pregnancy.riskLevel === "terme"
                          ? "border-orange-200 bg-orange-50"
                          : pregnancy.complications
                            ? "border-red-200 bg-red-50"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{pregnancy.name}</p>
                          {pregnancy.complications && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Complications
                            </Badge>
                          )}
                          {pregnancy.riskLevel === "terme" && (
                            <Badge variant="secondary" className="text-xs">
                              À terme
                            </Badge>
                          )}
                          {pregnancy.riskLevel === "surveillance" && (
                            <Badge variant="outline" className="text-xs">
                              Surveillance
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{pregnancy.gestationalAge}</p>
                        <p className="text-xs text-gray-500">Dernière visite: {pregnancy.lastVisit}</p>
                        <p className="text-xs font-medium text-blue-600">Prochain RDV: {pregnancy.nextAppointment}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                          Consulter
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="births">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="h-5 w-5 text-blue-600" />
                  Accouchements Récents
                </CardTitle>
                <CardDescription>Naissances des derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBirths.map((birth, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{birth.baby}</p>
                          {birth.complications && (
                            <Badge variant="destructive" className="text-xs">
                              Complications
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Mère: {birth.mother}</p>
                        <p className="text-xs text-gray-500">
                          {birth.birthDate} à {birth.birthTime} • {birth.weight}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            birth.status === "Excellent"
                              ? "outline"
                              : birth.status === "Surveillance"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {birth.status}
                        </Badge>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="postnatal">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  Soins Post-nataux
                </CardTitle>
                <CardDescription>Suivi mère-enfant après accouchement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {postnatalCare.map((care, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {care.mother} & {care.baby}
                        </p>
                        <p className="text-sm text-gray-600">{care.dayPostPartum}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-xs text-gray-500">
                            Mère: {care.motherStatus} • Bébé: {care.babyStatus}
                          </p>
                          {care.breastfeeding && (
                            <Badge variant="outline" className="text-xs">
                              Allaitement
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs font-medium text-green-600">Prochaine visite: {care.nextVisit}</p>
                      </div>
                      <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                        Consulter
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
