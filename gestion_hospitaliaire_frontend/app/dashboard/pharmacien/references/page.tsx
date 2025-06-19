"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Plus, Search, Edit, Trash2, Package, Filter, Eye, Link } from "lucide-react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"

// Garder tout le contenu existant de la page mais l'envelopper dans PharmacienSidebar
export default function ReferencesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReference, setEditingReference] = useState<any>(null)

  const references = [
    {
      id: 1,
      nom: "REF-ANALG-001",
      description: "Référence pour antalgiques non opioïdes",
      nombreMedicaments: 12,
      dateCreation: "2024-01-15",
      statut: "active",
      type: "Thérapeutique",
    },
    {
      id: 2,
      nom: "REF-ANTIB-002",
      description: "Référence antibiotiques beta-lactamines",
      nombreMedicaments: 8,
      dateCreation: "2024-01-10",
      statut: "active",
      type: "Pharmacologique",
    },
    {
      id: 3,
      nom: "REF-CARD-003",
      description: "Référence médicaments cardiovasculaires",
      nombreMedicaments: 15,
      dateCreation: "2024-01-08",
      statut: "active",
      type: "Thérapeutique",
    },
    {
      id: 4,
      nom: "REF-ANES-004",
      description: "Référence produits anesthésiques",
      nombreMedicaments: 6,
      dateCreation: "2024-01-05",
      statut: "active",
      type: "Spécialisée",
    },
    {
      id: 5,
      nom: "REF-URG-005",
      description: "Référence médicaments d'urgence",
      nombreMedicaments: 10,
      dateCreation: "2024-01-03",
      statut: "active",
      type: "Urgence",
    },
  ]

  const filteredReferences = references.filter(
    (reference) =>
      reference.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reference.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (reference: any) => {
    setEditingReference(reference)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingReference(null)
    setIsDialogOpen(true)
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      Thérapeutique: "bg-blue-100 text-blue-800",
      Pharmacologique: "bg-green-100 text-green-800",
      Spécialisée: "bg-purple-100 text-purple-800",
      Urgence: "bg-red-100 text-red-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <PharmacienSidebar>
      {/* Tout le contenu existant de la page */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              Gestion des Références
            </h1>
            <p className="text-gray-600 mt-2">Organisez les références pharmaceutiques</p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Référence
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Total Références</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">{references.length}</div>
              <p className="text-xs text-teal-600 mt-1">Références actives</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Thérapeutiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {references.filter((r) => r.type === "Thérapeutique").length}
              </div>
              <p className="text-xs text-blue-600 mt-1">Références thérapeutiques</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Pharmacologiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {references.filter((r) => r.type === "Pharmacologique").length}
              </div>
              <p className="text-xs text-green-600 mt-1">Références pharmacologiques</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Médicaments Liés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {references.reduce((sum, ref) => sum + ref.nombreMedicaments, 0)}
              </div>
              <p className="text-xs text-purple-600 mt-1">Total médicaments</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher une référence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* References Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <Package className="h-5 w-5 text-teal-600" />
              Liste des Références
            </CardTitle>
            <CardDescription className="text-teal-600">
              {filteredReferences.length} référence(s) trouvée(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 py-4">Code Référence</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Description</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Type</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Médicaments</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Date Création</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Statut</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 py-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReferences.map((reference, index) => (
                    <TableRow
                      key={reference.id}
                      className={`
                        hover:bg-teal-50/50 transition-all duration-200 border-b border-gray-100
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                      `}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Link className="h-4 w-4 text-teal-600" />
                          <span className="font-medium font-mono text-gray-900">{reference.nom}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-gray-600 py-4">{reference.description}</TableCell>
                      <TableCell className="py-4">
                        <Badge className={`${getTypeBadge(reference.type)} font-medium`}>{reference.type}</Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 font-medium">
                          {reference.nombreMedicaments} médicaments
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 py-4">
                        {new Date(reference.dateCreation).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-medium">Actif</Badge>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 transition-all duration-200"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(reference)}
                            className="h-8 px-3 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                         
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                           
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

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal-600" />
                {editingReference ? "Modifier la Référence" : "Nouvelle Référence"}
              </DialogTitle>
              <DialogDescription>
                {editingReference
                  ? "Modifiez les informations de la référence."
                  : "Ajoutez une nouvelle référence pharmaceutique."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nom">Code de référence</Label>
                <Input
                  id="nom"
                  defaultValue={editingReference?.nom || ""}
                  placeholder="Ex: REF-ANALG-001"
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500 font-mono"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue={editingReference?.description || ""}
                  placeholder="Description de la référence..."
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type de référence</Label>
                <Input
                  id="type"
                  defaultValue={editingReference?.type || ""}
                  placeholder="Ex: Thérapeutique, Pharmacologique..."
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                {editingReference ? "Modifier" : "Créer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PharmacienSidebar>
  )
}
