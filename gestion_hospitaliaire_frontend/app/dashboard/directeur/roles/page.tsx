"use client"
import { useState, useCallback, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Shield, Plus, Search, Eye, Edit, Trash2, Users, Loader2, Lock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useRole } from "@/hooks/utilisateur/useRole"
import { usePermissions } from "@/hooks/utilisateur/usePermission"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// 1. Composant RoleForm séparé
const RoleForm = ({ formData, setFormData, permissions }) => (
  <div className="space-y-6">
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label>Nom du rôle *</Label>
        <Input
          value={formData.nom}
          onChange={(e) => setFormData({...formData, nom: e.target.value})}
          placeholder="Ex: Médecin"
        />
      </div>
    </div>
    <div className="space-y-3">
      <Label>Permissions *</Label>
      <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-lg">
        {permissions.map((perm) => (
          <div key={perm.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
            <Checkbox
              checked={formData.permissions.includes(perm.id)}
              onCheckedChange={(checked) => 
                setFormData({
                  ...formData,
                  permissions: checked
                    ? [...formData.permissions, perm.id]
                    : formData.permissions.filter(id => id !== perm.id)
                })
              }
            />
            <div className="grid gap-1.5 leading-none flex-1">
              <Label>{perm.nom}</Label>
              <p className="text-xs text-gray-600">{perm.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const theme = {
  text: {
    primary: "text-gray-900",      // Noir profond pour le texte principal
    secondary: "text-gray-700",    // Gris foncé pour le texte secondaire
    contrast: "text-white",        // Blanc pour contraste
    accent: "text-blue-600"        // Bleu pour les accents
  },
  bg: {
    card: "bg-white",              // Fond blanc pour les cartes
    dialog: "bg-white",            // Fond blanc pour les dialogues
    header: "bg-gray-50"           // Fond gris clair pour les en-têtes
  },
  border: "border-gray-200"        // Bordure grise légère
}

// 2. Composant principal
export default function RolesPage() {
  // États
  const [searchTerm, setSearchTerm] = useState("")
  const [dialog, setDialog] = useState({ type: null, role: null })
  const [formData, setFormData] = useState({ nom: "", permissions: [] })

  // Hooks
  const {
    roles,
    loading: loadingRoles,
    error: errorRoles,
    addRole,
    updateRole,
    deleteRole,
    getEmployeeCountByRole,
    refetch
  } = useRole()

  const { permissions, loading: loadingPerms } = usePermissions()

  // Mémoized values
  const filteredRoles = useMemo(() => 
    roles.filter(role => 
      role.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.permissions?.some(p => p.nom.toLowerCase().includes(searchTerm.toLowerCase()))
  , [roles, searchTerm]), [])

  const stats = useMemo(() => ({
    totalRoles: roles.length,
    totalEmployes: roles.reduce((acc, r) => acc + (r.employes?.length || 0), 0),
    mostPermissions: roles.reduce((max, r) => 
      (r.permissions?.length || 0) > (max.permissions?.length || 0) ? r : max
    , { nom: "-", permissions: [] })
  }), [roles])

  // Handlers
  const handleSubmit = async (isEdit) => {
    try {
      if (!formData.nom.trim()) throw new Error("Nom requis")
      if (!formData.permissions.length) throw new Error("Sélectionnez au moins 1 permission")

      isEdit 
        ? await updateRole(Dialog.role.id, formData)
        : await addRole(formData)

      toast.success(`Rôle ${isEdit ? 'mis à jour' : 'créé'}`)
      setDialog({ type: null, role: null })
      refetch()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const openDialog = (type, role = null) => {
    setDialog({ type, role })
    if (role) setFormData({
      nom: role.nom,
      permissions: role.permissions?.map(p => p.id) || []
    })
    else setFormData({ nom: "", permissions: [] })
  }

  // Render
  return (
    <DashboardLayout userRole="Admin">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className={`p-4 rounded-lg ${theme.bg.header}`}>
          <h1 className={`text-3xl font-bold ${theme.text.primary} flex items-center gap-3`}>
            <Shield className={`h-8 w-8 ${theme.text.accent}`} />
            Gestion des Rôles
          </h1>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              title: "Total Rôles", 
              value: stats.totalRoles,
              icon: <Shield className={`h-5 w-5 ${theme.text.accent}`} />
            },
            { 
              title: "Employés Total", 
              value: stats.totalEmployes,
              icon: <Users className={`h-5 w-5 ${theme.text.accent}`} />
            },
            { 
              title: "Plus de permissions", 
              value: stats.mostPermissions.nom,
              subValue: `${stats.mostPermissions.permissions?.length || 0} permissions`,
              icon: <Lock className={`h-5 w-5 ${theme.text.accent}`} />
            }
          ].map((stat, index) => (
            <Card key={index} className={`${theme.bg.card} ${theme.border} border`}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <CardTitle className={`text-sm font-medium ${theme.text.secondary}`}>
                    {stat.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${theme.text.primary}`}>
                  {stat.value}
                </div>
                {stat.subValue && (
                  <p className={`text-xs ${theme.text.secondary} mt-1`}>
                    {stat.subValue}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tableau */}
        <Card className={`${theme.bg.card} ${theme.border} border`}>
          <CardHeader className={`${theme.bg.header} border-b ${theme.border}`}>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <CardTitle className={`text-lg ${theme.text.primary}`}>
                  Liste des Rôles
                </CardTitle>
                <CardDescription className={theme.text.secondary}>
                  {filteredRoles.length} rôle(s) trouvé(s)
                </CardDescription>
              </div>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.text.secondary}`} />
                <Input
                  placeholder="Rechercher..."
                  className={`pl-10 ${theme.border}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className={`${theme.bg.header}`}>
                <TableRow>
                  <TableHead className={`${theme.text.primary}`}>Rôle</TableHead>
                  <TableHead className={`${theme.text.primary}`}>Permissions</TableHead>
                  <TableHead className={`${theme.text.primary}`}>Employés</TableHead>
                  <TableHead className={`text-right ${theme.text.primary}`}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id} className={`${theme.border} border-b`}>
                    <TableCell className={`font-medium ${theme.text.primary}`}>
                      {role.nom}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions?.slice(0, 3).map((p) => (
                          <Badge 
                            key={p.id} 
                            variant="outline" 
                            className={`${theme.border} ${theme.text.secondary}`}
                          >
                            {p.nom}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className={theme.text.primary}>
                      {role.employes?.length || 0} employés
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={`hover:bg-blue-50 ${theme.text.accent}`}
                        onClick={() => openDialog("edit", role)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm" 
                        className="hover:bg-red-50 text-red-600"
                        onClick={() => openDialog("delete", role)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialogues - Gardez le même style que précédemment mais avec les nouvelles couleurs */}
        {dialog.type && (
          <Dialog open onOpenChange={() => setDialog({ type: null, role: null })}>
            <DialogContent className={`${theme.bg.dialog}`}>
              <DialogHeader>
                <DialogTitle className={theme.text.primary}>
                  {dialog.type === "add" && "Nouveau Rôle"}
                  {dialog.type === "edit" && `Modifier ${dialog.role.nom}`}
                  {dialog.type === "delete" && `Supprimer ${dialog.role.nom} ?`}
                </DialogTitle>
              </DialogHeader>
              
              {/* Contenu du dialogue */}
              <div className={theme.text.primary}>
                {dialog.type !== "delete" ? (
                  <RoleForm 
                    formData={formData}
                    setFormData={setFormData}
                    permissions={permissions}
                  />
                ) : (
                  <p>Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est irréversible.</p>
                )}
              </div>

              <DialogFooter>
                <Button 
                  variant={dialog.type === "delete" ? "destructive" : "default"}
                  onClick={() => {
                    if (dialog.type === "delete") {
                      deleteRole(dialog.role.id).then(refetch)
                    } else {
                      handleSubmit(dialog.type === "edit")
                    }
                    setDialog({ type: null, role: null })
                  }}
                  className={
                    dialog.type === "delete" ? 
                    "bg-red-600 hover:bg-red-700" : 
                    "bg-blue-600 hover:bg-blue-700 text-white"
                  }
                >
                  {dialog.type === "delete" ? "Confirmer" : dialog.type === "add" ? "Créer" : "Sauvegarder"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  )
}

// Composant StatCard réutilisable
const StatCard = ({ title, value, subValue, icon }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
    </CardContent>
  </Card>
)