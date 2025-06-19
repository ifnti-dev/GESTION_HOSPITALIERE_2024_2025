import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Activity,
  Search,
  Filter,
  Eye,
  FileText,
  CreditCard,
  MoreHorizontal,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  Stethoscope,
  Building2,
} from "lucide-react"

export default function ActesMedicauxPage() {
  const stats = [
    {
      title: "Actes à Facturer",
      value: "52",
      change: "+8 vs hier",
      icon: <Clock className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Facturés Aujourd'hui",
      value: "18",
      change: "+5 vs hier",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Montant Total",
      value: "4,560€",
      change: "+22.1%",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Consultations",
      value: "34",
      change: "65% du total",
      icon: <Stethoscope className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const actesMedicaux = [
    {
      id: "ACT-2024-001",
      patient: "Marie Dubois",
      medecin: "Dr. Martin",
      service: "Cardiologie",
      typeActe: "Consultation",
      codeActe: "C001",
      date: "16/01/2024",
      duree: "30 min",
      tarif: "25.00€",
      coefficient: "1.0",
      montant: "25.00€",
      statut: "À facturer",
      urgence: false,
    },
    {
      id: "ACT-2024-002",
      patient: "Jean Martin",
      medecin: "Dr. Rousseau",
      service: "Radiologie",
      typeActe: "Examen",
      codeActe: "RADIO001",
      date: "16/01/2024",
      duree: "45 min",
      tarif: "80.00€",
      coefficient: "1.2",
      montant: "96.00€",
      statut: "Facturé",
      urgence: true,
    },
    {
      id: "ACT-2024-003",
      patient: "Sophie Laurent",
      medecin: "Dr. Bernard",
      service: "Chirurgie",
      typeActe: "Intervention",
      codeActe: "CHIR001",
      date: "15/01/2024",
      duree: "2h 30min",
      tarif: "450.00€",
      coefficient: "1.5",
      montant: "675.00€",
      statut: "Payé",
      urgence: false,
    },
    {
      id: "ACT-2024-004",
      patient: "Pierre Moreau",
      medecin: "Dr. Petit",
      service: "Hospitalisation",
      typeActe: "Hospitalisation",
      codeActe: "HOSP001",
      date: "14/01/2024",
      duree: "3 jours",
      tarif: "120.00€",
      coefficient: "3.0",
      montant: "360.00€",
      statut: "À facturer",
      urgence: true,
    },
    {
      id: "ACT-2024-005",
      patient: "Emma Bernard",
      medecin: "Dr. Martin",
      service: "Médecine générale",
      typeActe: "Consultation",
      codeActe: "C001",
      date: "16/01/2024",
      duree: "20 min",
      tarif: "25.00€",
      coefficient: "1.0",
      montant: "25.00€",
      statut: "Facturé",
      urgence: false,
    },
  ]

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "À facturer":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            À facturer
          </Badge>
        )
      case "Facturé":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Facturé
          </Badge>
        )
      case "Payé":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Payé
          </Badge>
        )
      default:
        return <Badge variant="outline">{statut}</Badge>
    }
  }

  const getTypeActeBadge = (type: string) => {
    switch (type) {
      case "Consultation":
        return <Badge className="bg-blue-600 text-white">Consultation</Badge>
      case "Examen":
        return <Badge className="bg-purple-600 text-white">Examen</Badge>
      case "Intervention":
        return <Badge className="bg-red-600 text-white">Intervention</Badge>
      case "Hospitalisation":
        return <Badge className="bg-green-600 text-white">Hospitalisation</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <DashboardLayout userRole="Caissier">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Actes Médicaux</h1>
            <p className="text-gray-600 mt-1">Gestion des actes médicaux à facturer</p>
          </div>
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Acte
          </Button>
        </div>

        {/* Stats */}
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
              <Filter className="h-5 w-5 text-amber-600" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Rechercher par patient, médecin ou code acte..." className="pl-10" />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Type d'acte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="examen">Examen</SelectItem>
                  <SelectItem value="intervention">Intervention</SelectItem>
                  <SelectItem value="hospitalisation">Hospitalisation</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les services</SelectItem>
                  <SelectItem value="cardiologie">Cardiologie</SelectItem>
                  <SelectItem value="radiologie">Radiologie</SelectItem>
                  <SelectItem value="chirurgie">Chirurgie</SelectItem>
                  <SelectItem value="medecine">Médecine générale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-600" />
              Liste des Actes Médicaux
            </CardTitle>
            <CardDescription>{actesMedicaux.length} actes médicaux trouvés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100">
                    <TableHead className="font-bold text-amber-800">N° Acte</TableHead>
                    <TableHead className="font-bold text-amber-800">Patient</TableHead>
                    <TableHead className="font-bold text-amber-800">Médecin/Service</TableHead>
                    <TableHead className="font-bold text-amber-800">Type d'Acte</TableHead>
                    <TableHead className="font-bold text-amber-800">Durée</TableHead>
                    <TableHead className="font-bold text-amber-800">Tarification</TableHead>
                    <TableHead className="font-bold text-amber-800">Statut</TableHead>
                    <TableHead className="font-bold text-amber-800">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actesMedicaux.map((acte, index) => (
                    <TableRow
                      key={acte.id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-amber-50 transition-colors ${
                        acte.urgence ? "border-l-4 border-l-red-500" : ""
                      }`}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-bold">{acte.id}</p>
                          <p className="text-xs text-gray-500">{acte.codeActe}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{acte.patient}</p>
                          <p className="text-sm text-gray-500">{acte.date}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{acte.medecin}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Building2 className="h-3 w-3 text-gray-400" />
                            <p className="text-xs text-gray-500">{acte.service}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeActeBadge(acte.typeActe)}</TableCell>
                      <TableCell>
                        <p className="text-gray-900">{acte.duree}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-gray-900">{acte.montant}</p>
                          <p className="text-xs text-gray-500">
                            {acte.tarif} × {acte.coefficient}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatutBadge(acte.statut)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {acte.statut === "À facturer" && (
                            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                              <CreditCard className="h-4 w-4 mr-1" />
                              Facturer
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                Détails
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Activity className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
