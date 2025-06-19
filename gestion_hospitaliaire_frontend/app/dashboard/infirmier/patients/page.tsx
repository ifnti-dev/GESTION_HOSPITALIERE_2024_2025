import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  AlertTriangle,
  Clock,
  Thermometer,
  Heart,
  Activity,
  Bed,
  Calendar,
} from "lucide-react"

export default function InfirmierPatientsPage() {
  const stats = [
    {
      title: "Patients Assignés",
      value: "18",
      change: "+2 aujourd'hui",
      icon: <Users className="h-5 w-5" />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Soins Urgents",
      value: "5",
      change: "À effectuer",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Constantes à Prendre",
      value: "12",
      change: "Programmées",
      icon: <Thermometer className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Administrations",
      value: "8",
      change: "En attente",
      icon: <Activity className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ]

  const patients = [
    {
      id: "P001",
      nom: "Marie Dubois",
      prenom: "Marie",
      age: 45,
      chambre: "Ch. 201",
      service: "Cardiologie",
      etat: "Stable",
      prochainSoin: "14:00 - Pansement",
      dernieresConstantes: "Il y a 2h",
      alertes: 0,
      hospitalisation: "Post-opératoire",
      medecin: "Dr. Martin",
      entree: "2024-01-15",
      priorite: "normale",
    },
    {
      id: "P002",
      nom: "Jean Martin",
      prenom: "Jean",
      age: 62,
      chambre: "Ch. 203",
      service: "Cardiologie",
      etat: "Surveillance",
      prochainSoin: "13:30 - Médicament",
      dernieresConstantes: "Il y a 30min",
      alertes: 1,
      hospitalisation: "Surveillance cardiaque",
      medecin: "Dr. Durand",
      entree: "2024-01-14",
      priorite: "attention",
    },
    {
      id: "P003",
      nom: "Sophie Laurent",
      prenom: "Sophie",
      age: 38,
      chambre: "Ch. 205",
      service: "Chirurgie",
      etat: "Récupération",
      prochainSoin: "15:00 - Constantes",
      dernieresConstantes: "Il y a 1h",
      alertes: 0,
      hospitalisation: "Post-chirurgie",
      medecin: "Dr. Moreau",
      entree: "2024-01-16",
      priorite: "normale",
    },
    {
      id: "P004",
      nom: "Pierre Moreau",
      prenom: "Pierre",
      age: 71,
      chambre: "Ch. 207",
      service: "Médecine",
      etat: "Critique",
      prochainSoin: "13:00 - Urgent",
      dernieresConstantes: "Il y a 4h",
      alertes: 3,
      hospitalisation: "Observation",
      medecin: "Dr. Bernard",
      entree: "2024-01-13",
      priorite: "urgent",
    },
    {
      id: "P005",
      nom: "Claire Petit",
      prenom: "Claire",
      age: 29,
      chambre: "Ch. 209",
      service: "Maternité",
      etat: "Stable",
      prochainSoin: "16:00 - Soins",
      dernieresConstantes: "Il y a 1h30",
      alertes: 0,
      hospitalisation: "Post-accouchement",
      medecin: "Dr. Sage",
      entree: "2024-01-17",
      priorite: "normale",
    },
  ]

  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case "urgent":
        return "border-red-200 bg-red-50"
      case "attention":
        return "border-orange-200 bg-orange-50"
      default:
        return "border-gray-200 bg-white hover:bg-gray-50"
    }
  }

  const getEtatBadge = (etat: string) => {
    switch (etat) {
      case "Critique":
        return "bg-red-100 text-red-800 border-red-200"
      case "Surveillance":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Récupération":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Stable":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <DashboardLayout userRole="Infirmier">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Patients</h1>
            <p className="text-gray-600 mt-1">Gestion des patients assignés</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-emerald-700 border-emerald-200">
              <Clock className="w-3 h-3 mr-2" />
              18 patients assignés
            </Badge>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Patient
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
              <Filter className="h-5 w-5 text-emerald-600" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par nom, chambre, ou service..."
                    className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les services</SelectItem>
                  <SelectItem value="cardiologie">Cardiologie</SelectItem>
                  <SelectItem value="chirurgie">Chirurgie</SelectItem>
                  <SelectItem value="medecine">Médecine</SelectItem>
                  <SelectItem value="maternite">Maternité</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="État" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les états</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="surveillance">Surveillance</SelectItem>
                  <SelectItem value="critique">Critique</SelectItem>
                  <SelectItem value="recuperation">Récupération</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Liste des Patients Assignés
            </CardTitle>
            <CardDescription>Patients sous votre responsabilité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patients.map((patient, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border transition-all duration-200 ${getPriorityColor(patient.priorite)}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {patient.prenom} {patient.nom}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {patient.age} ans
                        </Badge>
                        <Badge className={`text-xs border ${getEtatBadge(patient.etat)}`}>{patient.etat}</Badge>
                        {patient.alertes > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {patient.alertes} alerte(s)
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Bed className="h-4 w-4 text-purple-500" />
                          <span>
                            {patient.chambre} - {patient.service}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>{patient.hospitalisation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span>Entrée: {patient.entree}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-orange-500" />
                          <span>Constantes: {patient.dernieresConstantes}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-emerald-600">{patient.prochainSoin}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-cyan-500" />
                          <span>Médecin: {patient.medecin}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row lg:flex-col gap-2">
                      <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                        <Thermometer className="h-4 w-4 mr-2" />
                        Constantes
                      </Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 flex-1 lg:flex-none">
                        <Heart className="h-4 w-4 mr-2" />
                        Soins
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
