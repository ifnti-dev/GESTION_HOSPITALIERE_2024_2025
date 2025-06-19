import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Receipt,
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
  AlertCircle,
} from "lucide-react"

export default function OrdonnancesPage() {
  const stats = [
    {
      title: "Ordonnances en Attente",
      value: "67",
      change: "+12 vs hier",
      icon: <Clock className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Facturées Aujourd'hui",
      value: "23",
      change: "+8 vs hier",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Montant Total",
      value: "2,890€",
      change: "+15.2%",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Prises en Charge",
      value: "18",
      change: "75% du total",
      icon: <Receipt className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const ordonnances = [
    {
      id: "ORD-2024-001",
      patient: "Marie Dubois",
      medecin: "Dr. Martin",
      date: "16/01/2024",
      medicaments: ["Doliprane 1000mg", "Amoxicilline 500mg"],
      montant: "45.80€",
      priseEnCharge: "75%",
      assurance: "CPAM",
      statut: "À facturer",
      urgence: false,
    },
    {
      id: "ORD-2024-002",
      patient: "Jean Martin",
      medecin: "Dr. Rousseau",
      date: "16/01/2024",
      medicaments: ["Ventoline", "Cortisone"],
      montant: "67.50€",
      priseEnCharge: "80%",
      assurance: "Mutuelle Plus",
      statut: "Facturée",
      urgence: true,
    },
    {
      id: "ORD-2024-003",
      patient: "Sophie Laurent",
      medecin: "Dr. Bernard",
      date: "15/01/2024",
      medicaments: ["Aspirine", "Vitamine D"],
      montant: "23.40€",
      priseEnCharge: "0%",
      assurance: "Aucune",
      statut: "Payée",
      urgence: false,
    },
    {
      id: "ORD-2024-004",
      patient: "Pierre Moreau",
      medecin: "Dr. Petit",
      date: "16/01/2024",
      medicaments: ["Insuline", "Metformine"],
      montant: "89.20€",
      priseEnCharge: "100%",
      assurance: "ALD",
      statut: "À facturer",
      urgence: true,
    },
    {
      id: "ORD-2024-005",
      patient: "Emma Bernard",
      medecin: "Dr. Martin",
      date: "15/01/2024",
      medicaments: ["Antibiotique", "Probiotiques"],
      montant: "56.30€",
      priseEnCharge: "70%",
      assurance: "CPAM",
      statut: "Facturée",
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
      case "Facturée":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Facturée
          </Badge>
        )
      case "Payée":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Payée
          </Badge>
        )
      default:
        return <Badge variant="outline">{statut}</Badge>
    }
  }

  const getPriseEnChargeBadge = (taux: string) => {
    const pourcentage = Number.parseInt(taux.replace("%", ""))
    if (pourcentage === 0) {
      return (
        <Badge variant="outline" className="text-gray-600">
          Aucune
        </Badge>
      )
    } else if (pourcentage === 100) {
      return <Badge className="bg-green-600 text-white">100%</Badge>
    } else if (pourcentage >= 75) {
      return <Badge className="bg-blue-600 text-white">{taux}</Badge>
    } else {
      return <Badge className="bg-amber-600 text-white">{taux}</Badge>
    }
  }

  return (
    <DashboardLayout userRole="Caissier">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ordonnances</h1>
            <p className="text-gray-600 mt-1">Gestion des ordonnances à facturer</p>
          </div>
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Facturation
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
                  <Input placeholder="Rechercher par patient, médecin ou numéro..." className="pl-10" />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="a-facturer">À facturer</SelectItem>
                  <SelectItem value="facturee">Facturée</SelectItem>
                  <SelectItem value="payee">Payée</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Médecin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les médecins</SelectItem>
                  <SelectItem value="martin">Dr. Martin</SelectItem>
                  <SelectItem value="rousseau">Dr. Rousseau</SelectItem>
                  <SelectItem value="bernard">Dr. Bernard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-amber-600" />
              Liste des Ordonnances
            </CardTitle>
            <CardDescription>{ordonnances.length} ordonnances trouvées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100">
                    <TableHead className="font-bold text-amber-800">N° Ordonnance</TableHead>
                    <TableHead className="font-bold text-amber-800">Patient</TableHead>
                    <TableHead className="font-bold text-amber-800">Médecin</TableHead>
                    <TableHead className="font-bold text-amber-800">Médicaments</TableHead>
                    <TableHead className="font-bold text-amber-800">Montant</TableHead>
                    <TableHead className="font-bold text-amber-800">Prise en Charge</TableHead>
                    <TableHead className="font-bold text-amber-800">Statut</TableHead>
                    <TableHead className="font-bold text-amber-800">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordonnances.map((ordonnance, index) => (
                    <TableRow
                      key={ordonnance.id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-amber-50 transition-colors ${
                        ordonnance.urgence ? "border-l-4 border-l-red-500" : ""
                      }`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {ordonnance.urgence && <AlertCircle className="h-4 w-4 text-red-500" />}
                          {ordonnance.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{ordonnance.patient}</p>
                          <p className="text-sm text-gray-500">{ordonnance.date}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-gray-900">{ordonnance.medecin}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {ordonnance.medicaments.map((med, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs mr-1">
                              {med}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-gray-900">{ordonnance.montant}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getPriseEnChargeBadge(ordonnance.priseEnCharge)}
                          <p className="text-xs text-gray-500">{ordonnance.assurance}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatutBadge(ordonnance.statut)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {ordonnance.statut === "À facturer" && (
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
                                Imprimer
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Receipt className="mr-2 h-4 w-4" />
                                Dupliquer
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
