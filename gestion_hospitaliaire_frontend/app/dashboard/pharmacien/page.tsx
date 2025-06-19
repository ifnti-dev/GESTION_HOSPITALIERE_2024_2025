import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pill, Package, AlertTriangle, TrendingUp, Users, ShoppingCart, Activity } from "lucide-react"

export default function PharmacienDashboard() {
  return (
    <PharmacienSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
              <Activity className="h-8 w-8 text-white" />
            </div>
            Tableau de Bord Pharmacien
          </h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble de votre pharmacie</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-teal-700 flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Médicaments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">1,247</div>
              <p className="text-xs text-teal-600 mt-1">+12 ce mois</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Alertes Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">23</div>
              <p className="text-xs text-orange-600 mt-1">Nécessitent attention</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Ventes Aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">€2,450</div>
              <p className="text-xs text-green-600 mt-1">+8% vs hier</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Patients Servis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">156</div>
              <p className="text-xs text-blue-600 mt-1">Aujourd'hui</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-teal-600" />
                Stock Critique
              </CardTitle>
              <CardDescription>Médicaments nécessitant un réapprovisionnement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { nom: "Paracétamol 1000mg", stock: 12, minimum: 50 },
                  { nom: "Amoxicilline 500mg", stock: 8, minimum: 30 },
                  { nom: "Morphine 10mg", stock: 3, minimum: 15 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.nom}</p>
                      <p className="text-sm text-gray-600">
                        Stock: {item.stock} / Min: {item.minimum}
                      </p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Critique</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-teal-600" />
                Commandes Récentes
              </CardTitle>
              <CardDescription>Dernières commandes passées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { numero: "CMD-2025-001", fournisseur: "Pharma Plus", montant: 1250.5, statut: "En cours" },
                  { numero: "CMD-2025-002", fournisseur: "MediSupply", montant: 875.3, statut: "Reçu" },
                  { numero: "CMD-2025-003", fournisseur: "Pharma Secure", montant: 2100.0, statut: "Planifié" },
                ].map((cmd, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{cmd.numero}</p>
                      <p className="text-sm text-gray-600">
                        {cmd.fournisseur} - €{cmd.montant}
                      </p>
                    </div>
                    <Badge
                      className={`${
                        cmd.statut === "Reçu"
                          ? "bg-green-100 text-green-800"
                          : cmd.statut === "En cours"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                      } hover:bg-current`}
                    >
                      {cmd.statut}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PharmacienSidebar>
  )
}
