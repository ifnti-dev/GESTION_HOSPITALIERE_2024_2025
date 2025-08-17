"use client"

import { useState, useEffect, useMemo } from "react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { Search, Plus } from "lucide-react"
import { useLignesApprovisionnement } from "@/hooks/pharmacie/useLignesApprovisionnement"
import type { LigneApprovisionnement } from "@/types/pharmacie"
import { formatPrice } from "@/utils/formatters"

export default function StockPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false)
  const [inventoryType, setInventoryType] = useState("")

  const {
    lignes,
    loading: lignesLoading,
    error: lignesError,
    fetchLignes,
    fetchExpiringBefore,
    fetchByApprovisionnementId,
  } = useLignesApprovisionnement()

  useEffect(() => {
    fetchLignes()
  }, [fetchLignes])

  const stockData = useMemo(() => {
    if (!lignes) return []

    return lignes.map((ligne: LigneApprovisionnement) => {
      const quantiteDisponible = ligne.quantiteDisponible || 0
      const dateExpiration = new Date(ligne.dateExpiration)
      const today = new Date()
      const daysUntilExpiration = Math.ceil((dateExpiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      let statut = "Disponible"
      if (quantiteDisponible === 0) {
        statut = "Rupture"
      } else if (quantiteDisponible <= 10) {
        statut = quantiteDisponible <= 5 ? "Critique" : "Stock Faible"
      }

      const isExpiringSoon = daysUntilExpiration <= 90 && daysUntilExpiration > 0
      const isExpired = daysUntilExpiration <= 0

      const medicamentReference = ligne.medicamentReference
      const medicament = medicamentReference?.medicament
      const reference = medicamentReference?.reference

      return {
        id: ligne.id,
        produitNom: `${medicament?.nom || "Médicament inconnu"} - ${reference?.nom || "Référence inconnue"}`,
        medicamentNom: medicament?.nom || "Médicament inconnu",
        referenceName: reference?.nom || "Référence inconnue",
        stockActuel: quantiteDisponible,
        stockMin: 10,
        stockMax: ligne.quantiteInitiale || 100,
        dateExpiration: ligne.dateExpiration,
        fournisseur: ligne.approvisionnement?.fournisseur || "Fournisseur inconnu",
        prixUnitaire: ligne.prixUnitaireVente || 0,
        statut,
        lot: ligne.numeroLot || `LOT-${ligne.id}`,
        dateReception: ligne.dateReception,
        isExpiringSoon,
        isExpired,
        daysUntilExpiration,
        quantiteInitiale: ligne.quantiteInitiale || 0,
        prixAchat: ligne.prixUnitaireAchat || 0,
        medicamentReferenceId: medicamentReference?.id,
      }
    })
  }, [lignes])

  const filteredItems = useMemo(() => {
    return stockData.filter((item) => {
      const matchesSearch =
        item.produitNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.medicamentNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.referenceName.toLowerCase().includes(searchTerm.toLowerCase())

      let matchesStatus = true
      if (statusFilter !== "all") {
        matchesStatus = item.statut === statusFilter
      }

      return matchesSearch && matchesStatus
    })
  }, [stockData, searchTerm, statusFilter])

  const stats = useMemo(() => {
    const totalLots = stockData.length
    const stockFaible = stockData.filter((item) => item.statut === "Stock Faible" || item.statut === "Critique").length
    const ruptures = stockData.filter((item) => item.statut === "Rupture").length
    const valeurStock = stockData.reduce((sum, item) => sum + item.stockActuel * item.prixUnitaire, 0)
    const expirantBientot = stockData.filter((item) => item.isExpiringSoon).length
    const expires = stockData.filter((item) => item.isExpired).length

    const produitsUniques = new Set(stockData.map((item) => item.medicamentReferenceId)).size

    return {
      totalLots,
      produitsUniques,
      stockFaible,
      ruptures,
      valeurStock,
      expirantBientot,
      expires,
    }
  }, [stockData])

  const getStatusBadge = (statut: string, isExpired: boolean, isExpiringSoon: boolean) => {
    if (isExpired) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Expiré</span>
    }

    if (statut === "Rupture") {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Rupture</span>
    } else if (statut === "Critique") {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Critique</span>
    } else if (statut === "Stock Faible") {
      return <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">Stock Faible</span>
    } else {
      const badgeClass = isExpiringSoon ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"

      return (
        <span className={`px-2 py-1 text-xs ${badgeClass} rounded`}>
          {isExpiringSoon ? "Expire bientôt" : "Disponible"}
        </span>
      )
    }
  }

  const getStockProgress = (actuel: number, min: number, max: number) => {
    const percentage = max > 0 ? (actuel / max) * 100 : 0
    let color = "bg-green-500"
    if (actuel === 0) color = "bg-red-500"
    else if (actuel <= min * 0.5) color = "bg-red-500"
    else if (actuel <= min) color = "bg-orange-500"
    return { percentage, color }
  }

  const handleInventoryGeneration = () => {
    console.log("Génération d'inventaire:", inventoryType)
    setIsInventoryModalOpen(false)
  }

  const handleRefresh = () => {
    fetchLignes()
  }

  const handleExport = () => {
    console.log("Export des données de stock")
  }

  if (lignesLoading) {
    return (
      <PharmacienSidebar>
        <div className="p-6">
          <div className="text-center">Chargement des données de stock...</div>
        </div>
      </PharmacienSidebar>
    )
  }

  if (lignesError) {
    return (
      <PharmacienSidebar>
        <div className="p-6">
          <div className="text-red-600 mb-4">Erreur lors du chargement des données: {lignesError}</div>
          <button onClick={handleRefresh} className="btn btn-primary">
            Réessayer
          </button>
        </div>
      </PharmacienSidebar>
    )
  }

  return (
    <PharmacienSidebar>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock & Inventaire</h1>
            <p className="text-gray-600">Gérez votre stock et suivez les niveaux d'inventaire par lots</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExport} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Exporter
            </button>
            <button onClick={handleRefresh} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Actualiser
            </button>
            <button
              onClick={() => setIsInventoryModalOpen(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Inventaire
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher par produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="Disponible">Disponible</option>
            <option value="Stock Faible">Stock Faible</option>
            <option value="Critique">Critique</option>
            <option value="Rupture">Rupture</option>
          </select>
        </div>

        <div className="bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Produit</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Niveau</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Expiration</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Prix Unit.</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Lot</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fournisseur</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Aucun lot trouvé avec les critères de recherche actuels
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => {
                  const { percentage, color } = getStockProgress(item.stockActuel, item.stockMin, item.stockMax)

                  return (
                    <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{item.medicamentNom}</div>
                          <div className="text-sm text-gray-500">{item.referenceName}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-900">
                            {item.stockActuel} / {item.quantiteInitiale}
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 ${color} rounded-full`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Min: {item.stockMin}</div>
                      </td>
                      <td className="px-4 py-4">{getStatusBadge(item.statut, item.isExpired, item.isExpiringSoon)}</td>
                      <td className="px-4 py-4">
                        <div
                          className={`text-sm ${
                            item.isExpired
                              ? "text-red-600 font-medium"
                              : item.isExpiringSoon
                                ? "text-orange-600 font-medium"
                                : "text-gray-600"
                          }`}
                        >
                          {new Date(item.dateExpiration).toLocaleDateString("fr-FR")}
                          {item.isExpired && <div className="text-xs text-red-500 font-medium">Expiré</div>}
                          {item.isExpiringSoon && !item.isExpired && (
                            <div className="text-xs text-orange-500 font-medium">
                              {item.daysUntilExpiration} jours restants
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-green-700">{formatPrice(item.prixUnitaire)}</td>
                      <td className="px-4 py-4 font-mono text-xs text-gray-600">
                        <div className="bg-gray-100 px-2 py-1 rounded">{item.lot}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{item.fournisseur}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {isInventoryModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Lancer un Inventaire</h3>
              <p className="text-gray-600 mb-4">Générer un rapport d'inventaire complet du stock actuel.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type d'inventaire</label>
                  <select
                    value={inventoryType}
                    onChange={(e) => setInventoryType(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner le type</option>
                    <option value="complet">Inventaire Complet</option>
                    <option value="partiel">Inventaire Partiel</option>
                    <option value="critique">Stock Critique Uniquement</option>
                    <option value="expirant">Produits Expirants</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de l'inventaire</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setIsInventoryModalOpen(false)} className="btn btn-secondary">
                  Annuler
                </button>
                <button onClick={handleInventoryGeneration} disabled={!inventoryType} className="btn btn-primary " >
                  Générer l'Inventaire
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PharmacienSidebar>
  )
}
