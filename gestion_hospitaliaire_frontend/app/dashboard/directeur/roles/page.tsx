"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Shield,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  MoreHorizontal,
  Lock,
} from "lucide-react"
import { useState, useRef } from "react"
import { useRole } from "@/hooks/utilisateur/useRole"
import { usePermissions } from "@/hooks/utilisateur/usePermission"
import { Role, Permission } from "@/types/utilisateur"

export default function RolesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  // Hooks pour rôles et permissions
  const { roles, loading: loadingRoles, error: errorRoles, addRole, updateRole, deleteRole } = useRole()
  const { permissions, loading: loadingPermissions, error: errorPermissions } = usePermissions()

  // Statistiques simples
  // const stats = [
  //   {
  //     title: "Total Rôles",
  //     value: roles.length.toString(),
  //     icon: <Shield className="h-5 w-5" />,
  //     color: "text-blue-600",
  //   },
  //   {
  //     title: "Permissions",
  //     value: permissions.length.toString(),
  //     icon: <Lock className="h-5 w-5" />,
  //     color: "text-purple-600",
  //   },
  //   {
  //     title: "Employés assignés",
  //     value: roles.reduce((acc, r) => acc + (r.employesCount || 0), 0).toString(),
  //     icon: <Users className="h-5 w-5" />,
  //     color: "text-orange-600",
  //   },
  // ]

  // Formulaire pour ajouter/modifier un rôle
  function RoleForm({
    role = null,
    onClose,
    onSubmit,
  }: {
    role?: Role | null
    onClose: () => void
    onSubmit: (data: { nom: string; permissions: number[] }) => void
  }) {
    const formRef = useRef<HTMLFormElement>(null)
    const [formError, setFormError] = useState<string | null>(null)

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault()
      const form = formRef.current
      if (!form) return

      const formData = new FormData(form)
      const nom = formData.get("nom")?.toString().trim()
      const permissionsChecked = permissions
        .filter((perm) => formData.get(`perm_${perm.id}`))
        .map((perm) => perm.id!)
      
      if (!nom) {
        setFormError("Le nom du rôle est requis.")
        return
      }
      if (permissionsChecked.length === 0) {
        setFormError("Veuillez sélectionner au moins une permission.")
        return
      }

      setFormError(null)
      onSubmit({
        nom,
        permissions: permissionsChecked,
      })
    }

    return (
      <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 py-4" id={role ? "editRoleForm" : "addRoleForm"}>
        <div className="space-y-2">
          <Label htmlFor="nom">Nom du rôle</Label>
          <Input id="nom" name="nom" defaultValue={role?.nom || ""} placeholder="Ex: Médecin, Infirmier..." />
        </div>
        <div className="space-y-2">
          <Label>Permissions associées</Label>
          {loadingPermissions ? (
            <div className="text-gray-500">Chargement des permissions...</div>
          ) : errorPermissions ? (
            <div className="text-red-600">Erreur lors du chargement des permissions</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto border rounded-lg p-4">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={`perm_${permission.id}`}
                    name={`perm_${permission.id}`}
                    defaultChecked={role?.permissions?.some((p) => p.id === permission.id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={`perm_${permission.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.nom}
                    </label>
                    <p className="text-xs text-muted-foreground">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {formError && <div className="text-red-600 text-sm">{formError}</div>}
        <div className="hidden">
          <button type="submit" />
        </div>
      </form>
    )
  }

  // Handlers pour créer, modifier, supprimer
  const handleAddRole = async (data: { nom: string; permissions: number[] }) => {
    await addRole(data)
    setIsAddDialogOpen(false)
  }

  const handleEdit = (role: Role) => {
    setSelectedRole(role)
    setIsEditDialogOpen(true)
  }

  const handleUpdateRole = async (data: { nom: string; permissions: number[] }) => {
    if (!selectedRole) return
    await updateRole(selectedRole.id!, data)
    setIsEditDialogOpen(false)
    setSelectedRole(null)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?")) {
      await deleteRole(id)
    }
  }

  return (
    <DashboardLayout userRole="Directeur">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Rôles</h1>
            <p className="text-gray-600 mt-1">Gérez les rôles et leurs permissions</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Rôle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Créer un nouveau rôle</DialogTitle>
                <DialogDescription>Définissez un nouveau rôle avec ses permissions associées.</DialogDescription>
              </DialogHeader>
              <RoleForm onClose={() => setIsAddDialogOpen(false)} onSubmit={handleAddRole} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button
                  className="bg-teal-600 hover:bg-teal-700"
                  type="submit"
                  form="addRoleForm"
                  onClick={() => {}}
                >
                  Créer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={stat.color}>{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div> */}

        {/* Filtres */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Rechercher un rôle..." className="pl-10" />
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Affichage erreurs et chargements */}
        {errorRoles && <div className="text-red-600 text-center">{typeof errorRoles === "string" ? errorRoles : errorRoles.message}</div>}
        {loadingRoles && <div className="text-center text-gray-500">Chargement des rôles...</div>}
        {errorPermissions && <div className="text-red-600 text-center">{typeof errorPermissions === "string" ? errorPermissions : errorPermissions.message}</div>}
        {loadingPermissions && <div className="text-center text-gray-500">Chargement des permissions...</div>}

        {/* Table des rôles */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal-600" />
              Liste des Rôles
            </CardTitle>
            <CardDescription>Tous les rôles définis dans le système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100">
                    <TableHead className="font-semibold text-teal-900">ID</TableHead>
                    <TableHead className="font-semibold text-teal-900">Rôle</TableHead>
                    <TableHead className="font-semibold text-teal-900">Permissions</TableHead>
                    <TableHead className="font-semibold text-teal-900">Employés</TableHead>
                    <TableHead className="font-semibold text-teal-900 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role, index) => (
                    <TableRow
                      key={role.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      } hover:bg-teal-50/50 transition-colors duration-200`}
                    >
                      <TableCell className="font-medium text-gray-900">{role.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            {role.nom}
                          </div>
                          <div className="text-xs text-gray-500">
                            Créé le {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : ""}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(role.permissions ?? []).slice(0, 2).map((perm, idx) => (
                            <Badge key={perm.id ?? idx} variant="outline" className="text-xs">
                              {perm.nom}
                            </Badge>
                          ))}
                          {(role.permissions ?? []).length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{(role.permissions ?? []).length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="font-medium text-gray-900">{role.employesCount || 0}</span>
                          <span className="text-sm text-gray-500">employés</span>
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                            title="Voir"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            title="Modifier"
                            onClick={() => handleEdit(role)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            title="Supprimer"
                            onClick={() => handleDelete(role.id!)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 border-gray-200 text-gray-600 hover:bg-gray-50"
                                title="Plus d'actions"
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Voir les permissions</DropdownMenuItem>
                              <DropdownMenuItem>Gérer les employés</DropdownMenuItem>
                              <DropdownMenuItem>Dupliquer le rôle</DropdownMenuItem>
                              <DropdownMenuItem>Historique</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Désactiver</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Dialog de modification */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Modifier le rôle</DialogTitle>
              <DialogDescription>
                Modifiez les informations et permissions du rôle {selectedRole?.nom}.
              </DialogDescription>
            </DialogHeader>
            <RoleForm role={selectedRole} onClose={() => setIsEditDialogOpen(false)} onSubmit={handleUpdateRole} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                className="bg-teal-600 hover:bg-teal-700"
                type="submit"
                form="editRoleForm"
                onClick={() => {}}
              >
                Sauvegarder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
