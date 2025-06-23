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
import { Tags, Plus, Search, Edit, Trash2, Package, Filter } from "lucide-react"
import { PharmacienSidebar } from "@/components/sidebars/pharmacien-sidebar"

// Garder tout le contenu existant de la page mais l'envelopper dans PharmacienSidebar
export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)

  const categories = [
    {
      id: 1,
      nom: "Antalgiques",
      description: "Médicaments contre la douleur et l'inflammation",
      nombreMedicaments: 45,
      dateCreation: "2024-01-15",
      statut: "active",
    },
    {
      id: 2,
      nom: "Antibiotiques",
      description: "Médicaments antimicrobiens pour traiter les infections",
      nombreMedicaments: 32,
      dateCreation: "2024-01-10",
      statut: "active",
    },
    {
      id: 3,
      nom: "Cardiologie",
      description: "Médicaments pour les troubles cardiovasculaires",
      nombreMedicaments: 28,
      dateCreation: "2024-01-08",
      statut: "active",
    },
    {
      id: 4,
      nom: "Anesthésie",
      description: "Produits anesthésiques et sédatifs",
      nombreMedicaments: 15,
      dateCreation: "2024-01-05",
      statut: "active",
    },
    {
      id: 5,
      nom: "Urgences",
      description: "Médicaments d'urgence et de réanimation",
      nombreMedicaments: 22,
      dateCreation: "2024-01-03",
      statut: "active",
    },
  ]

  const filteredCategories = categories.filter(
    (category) =>
      category.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingCategory(null)
    setIsDialogOpen(true)
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
                <Tags className="h-8 w-8 text-white" />
              </div>
              Gestion des Catégories
            </h1>
            <p className="text-gray-600 mt-2">Organisez et gérez les catégories de médicaments</p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Catégorie
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Total Catégories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">{categories.length}</div>
              <p className="text-xs text-teal-600 mt-1">Catégories actives</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-700">Médicaments Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-900">
                {categories.reduce((sum, cat) => sum + cat.nombreMedicaments, 0)}
              </div>
              <p className="text-xs text-cyan-600 mt-1">Tous médicaments</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Moyenne/Catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {Math.round(categories.reduce((sum, cat) => sum + cat.nombreMedicaments, 0) / categories.length)}
              </div>
              <p className="text-xs text-blue-600 mt-1">Médicaments par catégorie</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">Plus Importante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-teal-900">Antalgiques</div>
              <p className="text-xs text-teal-600 mt-1">45 médicaments</p>
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
                  placeholder="Rechercher une catégorie..."
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

        {/* Categories Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <Package className="h-5 w-5 text-teal-600" />
              Liste des Catégories
            </CardTitle>
            <CardDescription className="text-teal-600">
              {filteredCategories.length} catégorie(s) trouvée(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 py-4">Nom</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Description</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Médicaments</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Date Création</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Statut</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 py-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category, index) => (
                    <TableRow
                      key={category.id}
                      className={`
                        hover:bg-teal-50/50 transition-all duration-200 border-b border-gray-100
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                      `}
                    >
                      <TableCell className="font-medium text-gray-900 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          {category.nom}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-gray-600 py-4">{category.description}</TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 font-medium">
                          {category.nombreMedicaments} médicaments
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 py-4">
                        {new Date(category.dateCreation).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-medium">Actif</Badge>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(category)}
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Tags className="h-5 w-5 text-teal-600" />
                {editingCategory ? "Modifier la Catégorie" : "Nouvelle Catégorie"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Modifiez les informations de la catégorie."
                  : "Ajoutez une nouvelle catégorie de médicaments."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nom">Nom de la catégorie</Label>
                <Input
                  id="nom"
                  defaultValue={editingCategory?.nom || ""}
                  placeholder="Ex: Antalgiques"
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue={editingCategory?.description || ""}
                  placeholder="Description de la catégorie..."
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                {editingCategory ? "Modifier" : "Créer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PharmacienSidebar>
  )
}
