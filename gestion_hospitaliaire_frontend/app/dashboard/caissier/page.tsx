import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  CreditCard,
  FileText,
  Clock,
  TrendingUp,
  Users,
  Calculator,
  Receipt,
  Plus,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function CaissierDashboard() {
  const financialStats = [
    {
      title: "Recettes du Jour",
      value: "12,450€",
      yesterday: "11,200€",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-amber-600",
    },
    {
      title: "Factures en Attente",
      value: "18",
      amount: "5,680€",
      icon: <FileText className="h-5 w-5" />,
      color: "text-amber-600",
    },
    {
      title: "Paiements Aujourd'hui",
      value: "67",
      cash: "23",
      card: "44",
      icon: <CreditCard className="h-5 w-5" />,
      color: "text-amber-600",
    },
    {
      title: "Prises en Charge",
      value: "12",
      pending: "3",
      icon: <Users className="h-5 w-5" />,
      color: "text-amber-600",
    },
  ]

  const pendingBills = [
    {
      id: "FACT-2024-001",
      patient: "Marie Dubois",
      services: ["Consultation", "Radiographie"],
      amount: "125.50€",
      date: "16/01/2024",
      status: "pending",
      insurance: true,
    },
    {
      id: "FACT-2024-002",
      patient: "Jean Martin",
      services: ["Hospitalisation 2j", "Médicaments"],
      amount: "890.00€",
      date: "16/01/2024",
      status: "partial",
      insurance: true,
    },
    {
      id: "FACT-2024-003",
      patient: "Sophie Laurent",
      services: ["Consultation urgente", "Examens"],
      amount: "245.00€",
      date: "16/01/2024",
      status: "pending",
      insurance: false,
    },
  ]

  const recentPayments = [
    {
      id: "PAY-001",
      patient: "Emma Bernard",
      amount: "75.50€",
      method: "Carte bancaire",
      time: "09:30",
      status: "completed",
      receipt: true,
    },
    {
      id: "PAY-002",
      patient: "Lucas Petit",
      amount: "156.00€",
      method: "Espèces",
      time: "10:15",
      status: "completed",
      receipt: true,
    },
    {
      id: "PAY-003",
      patient: "Claire Rousseau",
      amount: "320.00€",
      method: "Chèque",
      time: "11:00",
      status: "pending",
      receipt: false,
    },
  ]

  const insuranceClaims = [
    {
      patient: "Marie Dubois",
      insurer: "CPAM",
      amount: "89.25€",
      coverage: "75%",
      status: "approved",
      date: "15/01/2024",
    },
    {
      patient: "Jean Martin",
      insurer: "Mutuelle Plus",
      amount: "445.00€",
      coverage: "80%",
      status: "pending",
      date: "16/01/2024",
    },
    {
      patient: "Pierre Moreau",
      insurer: "CPAM",
      amount: "156.75€",
      coverage: "70%",
      status: "rejected",
      date: "14/01/2024",
    },
  ]

  const dailyReport = [
    { category: "Consultations", count: 45, amount: "3,375€" },
    { category: "Hospitalisations", count: 8, amount: "4,560€" },
    { category: "Médicaments", count: 67, amount: "2,890€" },
    { category: "Examens", count: 23, amount: "1,625€" },
  ]

  return (
    <DashboardLayout userRole="Caissier">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Caissier</h1>
            <p className="text-gray-600 mt-1">Gestion financière et facturation</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-amber-700 border-amber-200">
              <DollarSign className="w-2 h-2 mr-2" />
              Caisse Ouverte
            </Badge>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Facture
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {financialStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={stat.color}>{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  {stat.yesterday && (
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />+
                      {(
                        Number.parseFloat(stat.value.replace(/[€,]/g, "")) -
                        Number.parseFloat(stat.yesterday.replace(/[€,]/g, ""))
                      ).toFixed(0)}
                      € vs hier
                    </p>
                  )}
                  {stat.amount && <p className="text-xs text-gray-500">Total: {stat.amount}</p>}
                  {stat.cash && (
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        {stat.cash} espèces
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {stat.card} CB
                      </Badge>
                    </div>
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
          {/* Factures en Attente */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Factures en Attente
              </CardTitle>
              <CardDescription>Factures à encaisser</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingBills.map((bill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{bill.patient}</p>
                        {bill.insurance && (
                          <Badge variant="outline" className="text-blue-700 border-blue-200 text-xs">
                            Assurance
                          </Badge>
                        )}
                        {bill.status === "partial" && (
                          <Badge variant="secondary" className="text-xs">
                            Partiel
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{bill.services.join(", ")}</p>
                      <p className="text-xs text-gray-500">
                        {bill.id} • {bill.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{bill.amount}</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                          Encaisser
                        </Button>
                      </div>
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
                <Calculator className="h-5 w-5 text-amber-600" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Receipt className="h-4 w-4 mr-2" />
                Nouvelle Facture
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Encaisser Paiement
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Prise en Charge
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Rapport de Caisse
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Remboursement
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tabs pour Gestion */}
        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="insurance">Prises en Charge</TabsTrigger>
            <TabsTrigger value="report">Rapport Journalier</TabsTrigger>
          </TabsList>

          <TabsContent value="payments">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                  Paiements Récents
                </CardTitle>
                <CardDescription>Transactions effectuées aujourd'hui</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPayments.map((payment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{payment.patient}</p>
                          <Badge variant={payment.status === "completed" ? "outline" : "secondary"} className="text-xs">
                            {payment.status === "completed" ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Encaissé
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                En attente
                              </>
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{payment.method}</p>
                        <p className="text-xs text-gray-500">
                          {payment.time} • {payment.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{payment.amount}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {payment.receipt && (
                            <Badge variant="outline" className="text-xs">
                              Reçu émis
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insurance">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Prises en Charge
                </CardTitle>
                <CardDescription>Remboursements et assurances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insuranceClaims.map((claim, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{claim.patient}</p>
                          <Badge
                            variant={
                              claim.status === "approved"
                                ? "outline"
                                : claim.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {claim.status === "approved" && (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approuvé
                              </>
                            )}
                            {claim.status === "pending" && (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                En attente
                              </>
                            )}
                            {claim.status === "rejected" && (
                              <>
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Rejeté
                              </>
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{claim.insurer}</p>
                        <p className="text-xs text-gray-500">
                          Couverture: {claim.coverage} • {claim.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{claim.amount}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Rapport Journalier
                </CardTitle>
                <CardDescription>Résumé des recettes par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyReport.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{item.category}</p>
                        <p className="text-sm text-gray-600">{item.count} transactions</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{item.amount}</p>
                        <p className="text-xs text-gray-500">
                          Moy: {(Number.parseFloat(item.amount.replace(/[€,]/g, "")) / item.count).toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-gray-900">Total Journalier</p>
                      <p className="text-2xl font-bold text-green-600">12,450€</p>
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
