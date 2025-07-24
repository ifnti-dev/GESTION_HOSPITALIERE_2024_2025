"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp } from "lucide-react"
import { useEmploye } from "@/hooks/utilisateur/useEmploye"

export default function EmployesDashboardPage() {
  const { employes, stats, loading, error } = useEmploye()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Employés</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble des employés de l'hôpital</p>
          </div>
          <Badge variant="outline" className="text-blue-700 border-blue-200">
            <Users className="h-4 w-4 mr-2" />
            {stats ? `${stats.totalEmployes} employés` : "Chargement..."}
          </Badge>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Employés actifs</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats ? stats.employes_actifs : "Chargement..."}
              </div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats ? `${stats.nouveauxCeMois}% ce mois` : ""}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">En congé</CardTitle>
              <Users className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats ? stats.employes_conge : "Chargement..."}
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
              <Users className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats ? stats.totalEmployes : "Chargement..."}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des employés */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Liste des employés</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <div>Chargement...</div>}
            {error && <div className="text-red-600">{error}</div>}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Nom</th>
                    <th className="py-2 px-4 text-left">Spécialité</th>
                    <th className="py-2 px-4 text-left">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {employes.map((employe) => (
                    <tr key={employe.id} className="border-b">
                      {/* <td className="py-2 px-4">{employe.nom}</td> */}
                      <td className="py-2 px-4">{employe.specialite || "-"}</td>
                      {/* <td className="py-2 px-4">{employe.statut}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
              {employes.length === 0 && !loading && (
                <div className="text-gray-500 py-4">Aucun employé trouvé.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}