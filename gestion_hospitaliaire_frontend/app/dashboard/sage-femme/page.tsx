"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect, useMemo } from "react"
import { dossierGrossesseService } from "@/services/medical/dossier-grossesse.service"
import type { DossierGrossesse } from "@/types/medical"
import { useRouter } from "next/navigation"
import {
  Heart,
  Search,
  Plus,
  Eye,
  Activity,
  Calendar,
  Baby,
  TrendingUp,
  AlertTriangle,
  Users,
  Phone,
  MapPin,
  FileText,
  TestTube,
  User,
} from "lucide-react"
import { formatDate, calculateGestationalAge, calculateTrimestre } from "@/lib/utils"
import { CreatePatientModal } from "@/components/modals/medical/create-patiente"

export default function SageFemmePatientesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [trimesterFilter, setTrimesterFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dossiers, setDossiers] = useState<DossierGrossesse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
 // État pour contrôler le modal

  // Enhanced stats calculation
  const stats = useMemo(() => {
    const totalDossiers = dossiers.length
    const trimester1 = dossiers.filter((d) => calculateTrimestre(d.dateDerniereRegle) === 1).length
    const trimester2 = dossiers.filter((d) => calculateTrimestre(d.dateDerniereRegle) === 2).length
    const trimester3 = dossiers.filter((d) => calculateTrimestre(d.dateDerniereRegle) === 3).length

    return [
      {
        title: "Patientes Suivies",
        value: totalDossiers.toString(),
        change: "Grossesses actives",
        icon: <Heart className="h-5 w-5" />,
        color: "text-rose-600",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
      },
      {
        title: "1er Trimestre",
        value: trimester1.toString(),
        change: "Nouvelles grossesses",
        icon: <Activity className="h-5 w-5" />,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      {
        title: "2ème Trimestre",
        value: trimester2.toString(),
        change: "Suivi régulier",
        icon: <Baby className="h-5 w-5" />,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      {
        title: "3ème Trimestre",
        value: trimester3.toString(),
        change: "Proche du terme",
        icon: <Calendar className="h-5 w-5" />,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      },
    ]
  }, [dossiers])

  // Helper function to check for risk factors
  const hasRiskFactors = (dossier: DossierGrossesse) => {
    return (
      dossier.antecedentsMedicaux?.toLowerCase().includes("diabète") ||
      dossier.antecedentsMedicaux?.toLowerCase().includes("hypertension") ||
      dossier.antecedentsObstetricaux?.toLowerCase().includes("césarienne") ||
      dossier.antecedentsChirurgicaux?.length > 0 ||
      dossier.statutSerologieHiv === "Positif" ||
      dossier.statutSerologieSyphilis === "Positif" ||
      dossier.nombreGrossesses > 5 ||
      new Date().getFullYear() - new Date(dossier.personne?.dateNaissance || "").getFullYear() > 35
    )
  }

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const dossiersData = await dossierGrossesseService.getAllDossiersGrossesse()
      setDossiers(dossiersData)
    } catch (err) {
      setError("Erreur lors de la récupération des données.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Enhanced filter dossiers
  const filteredDossiers = useMemo(() => {
    return dossiers.filter((dossier) => {
      const matchesSearch =
        dossier.personne?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dossier.personne?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dossier.nomPartenaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dossier.prenomsPartenaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dossier.id?.toString().includes(searchTerm)

      const matchesTrimester =
        trimesterFilter === "all" || calculateTrimestre(dossier.dateDerniereRegle).toString() === trimesterFilter

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "risk" && hasRiskFactors(dossier)) ||
        (statusFilter === "normal" && !hasRiskFactors(dossier))

      return matchesSearch && matchesTrimester && matchesStatus
    })
  }, [dossiers, searchTerm, trimesterFilter, statusFilter])

  // Get status badge based on risk factors and gestational age
  const getStatutBadge = (dossier: DossierGrossesse) => {
    const hasRisks = hasRiskFactors(dossier)
    const weeks = calculateGestationalAge(dossier.dateDerniereRegle).split(" ")[0]
    const weeksNum = Number.parseInt(weeks)

    if (hasRisks) {
      return (
        <Badge variant="destructive" className="text-xs">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Surveillance
        </Badge>
      )
    }

    if (weeksNum < 14) {
      return (
        <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50 text-xs">
          Début
        </Badge>
      )
    }
    if (weeksNum < 28) {
      return (
        <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 text-xs">
          Normal
        </Badge>
      )
    }
    if (weeksNum < 37) {
      return (
        <Badge variant="outline" className="text-orange-700 border-orange-200 bg-orange-50 text-xs">
          Surveillance
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50 text-xs">
        À terme
      </Badge>
    )
  }

  const getTrimestreBadge = (trimestre: number) => {
    const colors = {
      1: "text-blue-700 border-blue-200 bg-blue-50",
      2: "text-green-700 border-green-200 bg-green-50",
      3: "text-purple-700 border-purple-200 bg-purple-50",
    }
    return (
      <Badge variant="outline" className={`text-xs ${colors[trimestre as keyof typeof colors]}`}>
        T{trimestre}
      </Badge>
    )
  }

  // Get risk factors display
  const getRiskFactorsDisplay = (dossier: DossierGrossesse) => {
    const risks = []

    if (dossier.antecedentsMedicaux?.toLowerCase().includes("diabète")) {
      risks.push("Diabète")
    }
    if (dossier.antecedentsMedicaux?.toLowerCase().includes("hypertension")) {
      risks.push("HTA")
    }
    if (dossier.statutSerologieHiv === "Positif") {
      risks.push("VIH+")
    }
    if (dossier.nombreGrossesses > 5) {
      risks.push("Grande multipare")
    }
    if (new Date().getFullYear() - new Date(dossier.personne?.dateNaissance || "").getFullYear() > 35) {
      risks.push("Âge maternel")
    }

    return risks
  }

  // Handle patient card click
  const handlePatientClick = (dossierId: number) => {
    router.push(`/dashboard/sage-femme/patientes/${dossierId}`)
  }

  if (isLoading) {
    return (
      <DashboardLayout >
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <Activity className="h-12 w-12 animate-spin text-rose-500 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des patientes...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
            Réessayer
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="h-8 w-8 text-rose-600" />
              Mes Patientes
            </h1>
            <p className="text-gray-600 mt-1">Suivi des grossesses et dossiers médicaux</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-rose-700 border-rose-200 bg-rose-50">
              <Heart className="w-3 h-3 mr-2" />
              {dossiers.length} Patientes suivies
            </Badge>
            <Button 
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-lg"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Patiente
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${stat.borderColor} border-l-4`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-3 rounded-lg ${stat.bgColor} shadow-sm`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <p className="text-xs text-gray-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-rose-600" />
              Recherche et Filtres
            </CardTitle>
            <CardDescription>Filtrez et recherchez parmi {dossiers.length} patientes</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Input
                  placeholder="Rechercher par nom, prénom, partenaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={trimesterFilter} onValueChange={setTrimesterFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par trimestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les trimestres</SelectItem>
                  <SelectItem value="1">1er Trimestre</SelectItem>
                  <SelectItem value="2">2ème Trimestre</SelectItem>
                  <SelectItem value="3">3ème Trimestre</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="normal">Grossesses normales</SelectItem>
                  <SelectItem value="risk">Grossesses à risque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Patientes Cards */}
        <div className="space-y-4">
          {filteredDossiers.map((dossier) => {
            const riskFactors = getRiskFactorsDisplay(dossier)
            const trimestre = calculateTrimestre(dossier.dateDerniereRegle)
            const gestationalAge = calculateGestationalAge(dossier.dateDerniereRegle)

            return (
              <Card
                key={dossier.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handlePatientClick(dossier.id!)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Left Section - Patient Info */}
                    <div className="flex items-center space-x-6">
                      {/* Avatar */}
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center shadow-md">
                        <User className="h-8 w-8 text-rose-600" />
                      </div>

                      {/* Patient Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                            {dossier.personne?.prenom} {dossier.personne?.nom}
                          </h3>
                          <div className="flex gap-2">
                            {getTrimestreBadge(trimestre)}
                            {getStatutBadge(dossier)}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {dossier.personne?.dateNaissance
                                ? `${new Date().getFullYear() - new Date(dossier.personne.dateNaissance).getFullYear()} ans`
                                : "Âge non renseigné"}
                            </span>
                          </div>
                          {dossier.personne?.telephone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{dossier.personne.telephone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>DG-{dossier.id}</span>
                          </div>
                        </div>

                        {dossier.personne?.adresse && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate max-w-md">{dossier.personne.adresse}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Center Section - Pregnancy Info */}
                    <div className="flex flex-col items-center space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{gestationalAge}</div>
                        <div className="text-sm text-gray-500">Âge gestationnel</div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">
                            G{dossier.nombreGrossesses}P{dossier.nombreAccouchements}
                          </div>
                          <div className="text-xs text-gray-500">Parité</div>
                        </div>

                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">
                            {Math.ceil(
                              (new Date(dossier.datePrevueAccouchement).getTime() - new Date().getTime()) /
                                (1000 * 60 * 60 * 24),
                            )}
                          </div>
                          <div className="text-xs text-gray-500">Jours restants</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Medical Info & Actions */}
                    <div className="flex flex-col items-end space-y-3">
                      {/* Medical Info */}
                      <div className="text-right space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">DDR:</span>
                          <span className="text-sm font-medium">{formatDate(dossier.dateDerniereRegle)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">DPA:</span>
                          <span className="text-sm font-medium">{formatDate(dossier.datePrevueAccouchement)}</span>
                        </div>
                        {dossier.groupeSanguin && (
                          <div className="flex items-center gap-2">
                            <TestTube className="h-4 w-4 text-red-500" />
                            <Badge variant="outline" className="text-xs">
                              {dossier.groupeSanguin}
                              {dossier.rhesus}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Risk Factors */}
                      {riskFactors.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                          {riskFactors.slice(0, 2).map((risk, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {risk}
                            </Badge>
                          ))}
                          {riskFactors.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{riskFactors.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Action Button */}
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePatientClick(dossier.id!)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir Dossier
                      </Button>
                    </div>
                  </div>

                  {/* Partner Info (if available) */}
                  {(dossier.nomPartenaire || dossier.prenomsPartenaire) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>
                          Partenaire: {dossier.prenomsPartenaire} {dossier.nomPartenaire}
                        </span>
                        {dossier.professionPartenaire && <span>• {dossier.professionPartenaire}</span>}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {filteredDossiers.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <div className="text-gray-500">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-medium">Aucune patiente trouvée</p>
                  <p className="text-sm mt-2">
                    {searchTerm || trimesterFilter !== "all" || statusFilter !== "all"
                      ? "Essayez de modifier vos critères de recherche"
                      : "Commencez par créer un nouveau dossier de grossesse"}
                  </p>
                  
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de création de patiente */}
      <CreatePatientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false)
          fetchData() // Recharge les données après création
        }}
      />
    </DashboardLayout>
  )
}