"use client"

import { useState } from "react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import {
  BarChart3,
  Download,
  TrendingUp,
  Package,
  ShoppingCart,
  Euro,
  AlertTriangle,
  FileText,
  PieChart,
  Activity,
  Clock,
  RefreshCw,
  FileSpreadsheet,
  FileImage,
  Loader2,
} from "lucide-react"
import { useRapports } from "@/hooks/pharmacie/useRapports"
import { RapportGenerator } from "@/utils/rapportGenerator"
import { formatPrice, formatDate } from "@/utils/formatters"
import { toast } from "sonner"

export default function RapportsPage() {
  const { data, loading, error, refreshData } = useRapports()
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState("")
  const [selectedFormat, setSelectedFormat] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [includeAnnulees, setIncludeAnnulees] = useState(false)

  const handleGenerateReport = async () => {
    if (!selectedReportType || !selectedFormat || !data) {
      toast.error("Veuillez sélectionner un type de rapport et un format")
      return
    }

    setIsGenerating(true)

    try {
      switch (selectedFormat) {
        case "pdf":
          if (selectedReportType === "stock") {
            RapportGenerator.generateStockReportPDF(data, includeAnnulees)
            toast.success("Rapport de stock PDF généré avec succès")
          } else if (selectedReportType === "ventes") {
            RapportGenerator.generateVentesReportPDF(data, includeAnnulees)
            toast.success("Rapport de ventes PDF généré avec succès")
          }
          break
        case "excel":
          RapportGenerator.generateInventaireExcel(data, includeAnnulees)
          toast.success("Rapport Excel généré avec succès")
          break
        case "csv":
          RapportGenerator.generateCSVReport(
            data,
            selectedReportType as "stock" | "ventes" | "inventaire",
            includeAnnulees,
          )
          toast.success("Rapport CSV généré avec succès")
          break
      }

      setIsGenerateModalOpen(false)
      setSelectedReportType("")
      setSelectedFormat("")
      setIncludeAnnulees(false)
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error)
      toast.error("Erreur lors de la génération du rapport")
    } finally {
      setIsGenerating(false)
    }
  }

  // const typesRapports = [
  //   {
  //     id: "stock",
  //     nom: "Rapport de Stock",
  //     description: "État détaillé du stock avec niveaux et alertes",
  //     icon: Package,
  //   },
  //   {
  //     id: "ventes",
  //     nom: "Analyse des Ventes",
  //     description: "Performance des ventes et tendances",
  //     icon: TrendingUp,
  //   },
  //   {
  //     id: "financier",
  //     nom: "Rapport Financier",
  //     description: "Chiffre d'affaires, marges et rentabilité",
  //     icon: Euro,
  //   },
  //   {
  //     id: "inventaire",
  //     nom: "Rapport d'Inventaire",
  //     description: "Inventaire complet avec écarts",
  //     icon: BarChart3,
  //   },
  // ]

  if (loading) {
    return (
      <PharmacienSidebar>
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 w-64 mb-2 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </div>
                <div>
                  <div className="h-8 w-20 mb-2 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PharmacienSidebar>
    )
  }

  if (error) {
    return (
      <PharmacienSidebar>
        <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-red-800">Erreur lors du chargement des données: {error}</span>
          </div>
        </div>
      </PharmacienSidebar>
    )
  }

  if (!data) {
    return (
      <PharmacienSidebar>
        <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span>Aucune donnée disponible pour générer les rapports.</span>
          </div>
        </div>
      </PharmacienSidebar>
    )
  }

  return (
    <PharmacienSidebar>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              Rapports & Analyses
            </h1>
            <p className="text-gray-600 mt-2">Tableaux de bord et rapports analytiques détaillés</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={refreshData}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </button>
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Générer un Rapport
            </button>
          </div>
        </div>

        {/* Indicateurs de Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Indicateurs Clés
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">Lots Disponibles</span>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {data.stockStats.lotsDisponibles}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-700">Commandes ce Mois</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {data.venteStats.commandesMois}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Moyenne par Commande</span>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                  {formatPrice(data.venteStats.moyenneCommande)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Actions Rapides
              </h3>
            </div>
            <div className="space-y-3">
              <button
                className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-start gap-2"
                onClick={() => RapportGenerator.generateStockReportPDF(data, false)}
              >
                <FileImage className="h-4 w-4" />
                Rapport Stock PDF
              </button>
              <button
                className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-start gap-2"
                onClick={() => RapportGenerator.generateVentesReportPDF(data, false)}
              >
                <TrendingUp className="h-4 w-4" />
                Rapport Ventes PDF
              </button>
              <button
                className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-start gap-2"
                onClick={() => RapportGenerator.generateInventaireExcel(data, false)}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Inventaire Excel
              </button>
            </div>
          </div>
        </div>

        {/* Types de Rapports Disponibles */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              Types de Rapports Disponibles
            </h3>
            <p className="text-gray-600 mt-1">Sélectionnez le type de rapport que vous souhaitez générer</p>
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {typesRapports.map((rapport) => {
              const IconComponent = rapport.icon
              return (
                <div
                  key={rapport.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500">
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{rapport.nom}</h3>
                      <p className="text-sm text-gray-600">{rapport.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div> */}
        </div>

        {/* Aperçu des Données */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lots Expirant Bientôt */}
          {data.lotsExpirants.length > 0 && (
            <div className="bg-white border border-orange-200 rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Lots Expirant Bientôt
                </h3>
                <p className="text-gray-600 mt-1">Lots qui expirent dans les 30 prochains jours</p>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {data.lotsExpirants.slice(0, 5).map((lot, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{lot.numeroLot}</p>
                      <p className="text-sm text-gray-600">
                        {lot.medicamentReference?.medicament?.nom || "Produit non défini"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-700">{formatDate(lot.dateExpiration)}</p>
                      <p className="text-sm text-gray-600">Qté: {lot.quantiteDisponible}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commandes Récentes */}
          {data.commandesRecentes.length > 0 && (
            <div className="bg-white border border-green-200 rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  Commandes Récentes
                </h3>
                <p className="text-gray-600 mt-1">Dernières commandes effectuées</p>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {data.commandesRecentes.slice(0, 5).map((commande, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {commande.personne
                          ? `${commande.personne.prenom} ${commande.personne.nom}`
                          : "Client non défini"}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">{formatDate(commande.dateCommande)}</p>
                        {commande.statut === "ANNULEE" && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Annulée</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-700">
                        {formatPrice(Number.parseFloat(commande.montantTotal))}
                      </p>
                      <p className="text-sm text-gray-600">{commande.nombreLignes || 0} articles</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isGenerateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Générer un Nouveau Rapport
                </h2>
                <p className="text-gray-600 mt-1">Sélectionnez le type de rapport à générer et le format de sortie.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de rapport</label>
                  <select
                    value={selectedReportType}
                    onChange={(e) => setSelectedReportType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="">Choisir le type de rapport</option>
                    <option value="stock">Rapport de Stock</option>
                    <option value="ventes">Analyse des Ventes</option>
                    <option value="inventaire">Inventaire Complet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format de sortie</label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="">Format du fichier</option>
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>

                {(selectedReportType === "ventes" || selectedReportType === "inventaire") && (
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="includeAnnulees"
                      checked={includeAnnulees}
                      onChange={(e) => setIncludeAnnulees(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="includeAnnulees" className="text-sm font-medium">
                      Inclure les commandes annulées
                    </label>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setIsGenerateModalOpen(false)}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Générer le Rapport
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PharmacienSidebar>
  )
}
