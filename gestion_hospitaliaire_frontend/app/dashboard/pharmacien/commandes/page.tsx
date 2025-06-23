"use client"

import { useState } from "react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Euro,
} from "lucide-react"

export default function CommandesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Données simulées pour les commandes
  const commandes = [
    {
      id: "CMD-001",
      dateCommande: "2024-06-10",
      fournisseur: "PharmaCorp",
      montantTotal: 2450.0,
      statut: "En cours",
      nombreLignes: 5,
      datePrevu: "2024-06-15",
    },
    {
      id: "CMD-002",
      dateCommande: "2024-06-08",
      fournisseur: "MediSupply",
      montantTotal: 1890.5,
      statut: "Livrée",
      nombreLignes: 3,
      datePrevu: "2024-06-12",
    },
    {
      id: "CMD-003",
      dateCommande: "2024-06-07",
      fournisseur: "BioPharm",
      montantTotal: 3200.75,
      statut: "Confirmée",
      nombreLignes: 8,
      datePrevu: "2024-06-14",
    },
    {
      id: "CMD-004",
      dateCommande: "2024-06-05",
      fournisseur: "HealthCare Plus",
      montantTotal: 980.25,
      statut: "Annulée",
      nombreLignes: 2,
      datePrevu: "2024-06-10",
    },
    {
      id: "CMD-005",
      dateCommande: "2024-06-12",
      fournisseur: "PharmaCorp",
      montantTotal: 4150.0,
      statut: "En attente",
      nombreLignes: 12,
      datePrevu: "2024-06-18",
    },
  ]

  const getStatusBadge = (statut: string) => {
    const statusConfig = {
      "En cours": { color: "bg-blue-100 text-blue-800", icon: Clock },
      Livrée: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      Confirmée: { color: "bg-teal-100 text-teal-800", icon: Package },
      Annulée: { color: "bg-red-100 text-red-800", icon: XCircle },
      "En attente": { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    }

    const config = statusConfig[statut as keyof typeof statusConfig]
    const IconComponent = config?.icon || Clock

    return (
      <Badge className={`${config?.color} hover:${config?.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {statut}
      </Badge>
    )
  }

  const filteredCommandes = commandes.filter((commande) => {
    const matchesSearch =
      commande.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commande.fournisseur.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || commande.statut === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalCommandes: commandes.length,
    commandesEnCours: commandes.filter((c) => c.statut === "En cours").length,
    montantTotal: commandes.reduce((sum, c) => sum + c.montantTotal, 0),
    commandesMois: commandes.filter((c) => new Date(c.dateCommande).getMonth() === new Date().getMonth()).length,
  }

  return (
    <PharmacienSidebar>
      <div className="space-y-8">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              Gestion des Commandes
            </h1>
            <p className="text-gray-600 mt-2">Gérez et suivez toutes vos commandes fournisseurs</p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Commande
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-teal-600" />
                  Créer une Nouvelle Commande
                </DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer une nouvelle commande fournisseur.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fournisseur">Fournisseur</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un fournisseur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pharmacorp">PharmaCorp</SelectItem>
                        <SelectItem value="medisupply">MediSupply</SelectItem>
                        <SelectItem value="biopharm">BioPharm</SelectItem>
                        <SelectItem value="healthcare">HealthCare Plus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="datePrevu">Date Prévue</Label>
                    <Input type="date" id="datePrevu" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Notes additionnelles..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Annuler
                </Button>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
                  Créer la Commande
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Total Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">{stats.totalCommandes}</div>
              <p className="text-xs text-teal-600 mt-1">Toutes les commandes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">En Cours</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.commandesEnCours}</div>
              <p className="text-xs text-blue-600 mt-1">Commandes actives</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-700">Montant Total</CardTitle>
              <Euro className="h-4 w-4 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-900">{stats.montantTotal.toLocaleString()}€</div>
              <p className="text-xs text-cyan-600 mt-1">Valeur totale</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Ce Mois</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.commandesMois}</div>
              <p className="text-xs text-green-600 mt-1">Commandes du mois</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et Recherche */}
        <Card className="shadow-lg border-teal-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="h-5 w-5 text-teal-600" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par ID ou fournisseur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 border-teal-200 focus:border-teal-500">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Livrée">Livrée</SelectItem>
                  <SelectItem value="Confirmée">Confirmée</SelectItem>
                  <SelectItem value="Annulée">Annulée</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des Commandes */}
        <Card className="shadow-lg border-teal-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-teal-600" />
              Liste des Commandes
            </CardTitle>
            <CardDescription>{filteredCommandes.length} commande(s) trouvée(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-teal-50/50">
                    <TableHead className="font-semibold text-teal-700">ID Commande</TableHead>
                    <TableHead className="font-semibold text-teal-700">Date</TableHead>
                    <TableHead className="font-semibold text-teal-700">Fournisseur</TableHead>
                    <TableHead className="font-semibold text-teal-700">Montant</TableHead>
                    <TableHead className="font-semibold text-teal-700">Statut</TableHead>
                    <TableHead className="font-semibold text-teal-700">Lignes</TableHead>
                    <TableHead className="font-semibold text-teal-700">Date Prévue</TableHead>
                    <TableHead className="font-semibold text-teal-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCommandes.map((commande) => (
                    <TableRow key={commande.id} className="hover:bg-teal-50/50 transition-colors">
                      <TableCell className="font-mono font-medium text-teal-700">{commande.id}</TableCell>
                      <TableCell>{new Date(commande.dateCommande).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell className="font-medium">{commande.fournisseur}</TableCell>
                      <TableCell className="font-semibold text-green-700">
                        {commande.montantTotal.toLocaleString()}€
                      </TableCell>
                      <TableCell>{getStatusBadge(commande.statut)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-teal-700 border-teal-300">
                          {commande.nombreLignes} lignes
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(commande.datePrevu).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 hover:bg-teal-50">
                            <Eye className="h-4 w-4 text-teal-600" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 hover:bg-blue-50">
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 hover:bg-red-50">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
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
    </PharmacienSidebar>
  )
}
