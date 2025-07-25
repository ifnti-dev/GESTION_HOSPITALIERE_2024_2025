"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Settings, Users, Calendar, CheckCircle, XCircle } from "lucide-react"
import type { Role } from "@/types/utilisateur"

interface RoleDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  getEmployeeCount: (roleId: number) => Promise<number>
}

export function RoleDetailsDialog({ open, onOpenChange, role, getEmployeeCount }: RoleDetailsDialogProps) {
  const [employeeCount, setEmployeeCount] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchEmployeeCount = async () => {
      if (role?.id) {
        setLoading(true)
        try {
          const count = await getEmployeeCount(role.id)
          setEmployeeCount(count)
        } catch (error) {
          setEmployeeCount(role.employes?.length || 0)
        } finally {
          setLoading(false)
        }
      }
    }

    if (open && role) {
      fetchEmployeeCount()
    }
  }, [role, open, getEmployeeCount])

  if (!role) return null

  const getRoleStatusColor = (count: number) => {
    if (count > 0) {
      return "bg-green-100 text-green-800"
    }
    return "bg-gray-100 text-gray-800"
  }

  const getRoleStatusLabel = (count: number) => {
    if (count > 0) {
      return "Actif"
    }
    return "Inactif"
  }

  // Liste des permissions disponibles (même que dans le dialog)
  const availablePermissions = [
    { id: 1, nom: "Lecture", description: "Consulter les données" },
    { id: 2, nom: "Écriture", description: "Modifier les données" },
    { id: 3, nom: "Suppression", description: "Supprimer les données" },
    { id: 4, nom: "Administration", description: "Gérer les utilisateurs" },
    { id: 5, nom: "Gestion Employés", description: "Gérer les employés" },
    { id: 6, nom: "Gestion Patients", description: "Gérer les patients" },
    { id: 7, nom: "Gestion Rôles", description: "Gérer les rôles et permissions" },
    { id: 8, nom: "Rapports", description: "Générer des rapports" },
  ]

  const rolePermissionIds = role.permissions?.map((p) => p.id).filter((id) => id !== undefined) || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Détails du rôle</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête avec icône et infos principales */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="bg-purple-100 p-4 rounded-full">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{role.nom}</h2>
                  <p className="text-gray-600 mb-2">ID: {role.id}</p>
                  <div className="flex gap-2">
                    <Badge className={getRoleStatusColor(employeeCount)}>{getRoleStatusLabel(employeeCount)}</Badge>
                    <Badge variant="outline">
                      {role.permissions?.length || 0} permission{(role.permissions?.length || 0) > 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{loading ? "..." : employeeCount}</div>
                  <div className="text-sm text-gray-600">
                    Employé{employeeCount > 1 ? "s" : ""} assigné{employeeCount > 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations générales */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Informations Générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Nom du rôle:</span>
                  <p className="text-sm text-gray-900 mt-1">{role.nom}</p>
                </div>
                {role.description && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Description:</span>
                    <p className="text-sm text-gray-900 mt-1">{role.description}</p>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Employés assignés:</span>
                    <span className="text-sm text-gray-900 ml-2">
                      {loading ? "Chargement..." : `${employeeCount} employé${employeeCount > 1 ? "s" : ""}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-green-600" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{role.permissions?.length || 0}</div>
                    <div className="text-xs text-blue-700">Permissions</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{loading ? "..." : employeeCount}</div>
                    <div className="text-xs text-green-700">Employés</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{getRoleStatusLabel(employeeCount)}</div>
                  <div className="text-xs text-purple-700">Statut du rôle</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Permissions détaillées */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-purple-600" />
                Permissions Détaillées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availablePermissions.map((permission) => {
                  const hasPermission = rolePermissionIds.includes(permission.id)
                  return (
                    <div
                      key={permission.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg border ${
                        hasPermission ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      {hasPermission ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${hasPermission ? "text-green-900" : "text-gray-500"}`}>
                          {permission.nom}
                        </div>
                        <p className={`text-xs mt-1 ${hasPermission ? "text-green-700" : "text-gray-400"}`}>
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {rolePermissionIds.length === 0 && (
                <div className="text-center py-8">
                  <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune permission assignée à ce rôle</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations système */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
                Informations Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">ID Rôle:</span>
                  <span className="text-gray-900 ml-2">{role.id}</span>
                </div>
                {role.createdAt && (
                  <div>
                    <span className="font-medium text-gray-700">Créé le:</span>
                    <span className="text-gray-900 ml-2">{new Date(role.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                )}
                {role.updatedAt && (
                  <div>
                    <span className="font-medium text-gray-700">Modifié le:</span>
                    <span className="text-gray-900 ml-2">{new Date(role.updatedAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
