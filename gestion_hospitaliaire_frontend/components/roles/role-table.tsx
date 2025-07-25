"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, Edit, Trash2, Eye, Shield, Users, Settings } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Role } from "@/types/utilisateur"

interface RoleTableProps {
  roles: Role[]
  loading: boolean
  onEdit: (role: Role) => void
  onDelete: (id: number) => void
  onView: (role: Role) => void
  getEmployeeCount: (roleId: number) => Promise<number>
}

export function RoleTable({ roles, loading, onEdit, onDelete, onView, getEmployeeCount }: RoleTableProps) {
  const [employeeCounts, setEmployeeCounts] = useState<Record<number, number>>({})

  useEffect(() => {
    const fetchCounts = async () => {
      const counts: Record<number, number> = {}
      for (const role of roles) {
        if (role.id) {
          try {
            counts[role.id] = await getEmployeeCount(role.id)
          } catch (error) {
            counts[role.id] = role.employes?.length || 0
          }
        }
      }
      setEmployeeCounts(counts)
    }

    if (roles.length > 0) {
      fetchCounts()
    }
  }, [roles, getEmployeeCount])

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    )
  }

  if (roles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun rôle trouvé</p>
      </div>
    )
  }

  const getRoleStatusColor = (employeeCount: number) => {
    if (employeeCount > 0) {
      return "bg-green-100 text-green-800"
    }
    return "bg-gray-100 text-gray-800"
  }

  const getRoleStatusLabel = (employeeCount: number) => {
    if (employeeCount > 0) {
      return "Actif"
    }
    return "Inactif"
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rôle</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Employés</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => {
            const employeeCount = employeeCounts[role.id!] || role.employes?.length || 0

            return (
              <TableRow key={role.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">{role.nom}</div>
                      <div className="text-sm text-muted-foreground">ID: {role.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px]">
                    {role.description ? (
                      <p className="text-sm text-gray-900 truncate" title={role.description}>
                        {role.description}
                      </p>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">Aucune description</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {role.permissions?.length || 0} permission{(role.permissions?.length || 0) > 1 ? "s" : ""}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{employeeCount}</span>
                    <span className="text-xs text-muted-foreground">employé{employeeCount > 1 ? "s" : ""}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleStatusColor(employeeCount)}>{getRoleStatusLabel(employeeCount)}</Badge>
                </TableCell>
                <TableCell>
                  {role.createdAt ? new Date(role.createdAt).toLocaleDateString("fr-FR") : "Non spécifiée"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onView(role)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(role)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => role.id && onDelete(role.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
