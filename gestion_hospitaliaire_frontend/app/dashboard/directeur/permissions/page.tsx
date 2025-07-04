"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import {
  usePermissions,
  useAddPermission,
  useUpdatePermission,
  useDeletePermission,
} from "@/hooks/utilisateur/usePermission"
import { Permission } from "@/types/utilisateur"

export default function PermissionsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [formPermission, setFormPermission] = useState<Permission>({ nom: "", description: "" })

  const { permissions } = usePermissions()
  const { add } = useAddPermission()
  const { update } = useUpdatePermission()
  const { remove } = useDeletePermission()

  const handleCreatePermission = async () => {
    try {
      await add(formPermission)
      setIsAddDialogOpen(false)
      setFormPermission({ nom: "", description: "" })
    } catch (err) {
      console.error("Erreur lors de la création :", err)
    }
  }

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission)
    setFormPermission(permission)
    setIsEditDialogOpen(true)
  }

  const handleUpdatePermission = async () => {
    try {
      if (selectedPermission) {
        await update({ ...selectedPermission, ...formPermission })
        setIsEditDialogOpen(false)
        setSelectedPermission(null)
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette permission ?")) {
      try {
        await remove(id)
      } catch (err) {
        console.error("Erreur lors de la suppression :", err)
      }
    }
  }

  const PermissionForm = () => (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom de la permission</Label>
        <Input
          id="nom"
          value={formPermission.nom}
          onChange={(e) => setFormPermission({ ...formPermission, nom: e.target.value })}
          placeholder="Ex: Consulter patients..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formPermission.description || ""}
          onChange={(e) => setFormPermission({ ...formPermission, description: e.target.value })}
          placeholder="Description détaillée de la permission..."
          rows={3}
        />
      </div>
    </div>
  )

  return (
    <DashboardLayout userRole="Directeur">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Permissions</h1>
            <p className="text-gray-600 mt-1">Gérez les permissions et droits d'accès</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" /> Nouvelle Permission
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle permission</DialogTitle>
                <DialogDescription>
                  Définissez une nouvelle permission avec ses caractéristiques.
                </DialogDescription>
              </DialogHeader>
              <PermissionForm />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleCreatePermission}>
                  Créer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Liste des Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((perm) => (
                  <TableRow key={perm.id}>
                    <TableCell>{perm.id}</TableCell>
                    <TableCell>{perm.nom}</TableCell>
                    <TableCell>{perm.description}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(perm)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(perm.id!)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Modifier la permission</DialogTitle>
              <DialogDescription>
                Modifiez les informations de la permission sélectionnée.
              </DialogDescription>
            </DialogHeader>
            <PermissionForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdatePermission}>
                Sauvegarder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
