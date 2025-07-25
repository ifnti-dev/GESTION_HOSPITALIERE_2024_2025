"use client"
import { MoreHorizontal, Edit, Trash2, Phone, Mail, Eye } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import type { Employe } from "@/types/utilisateur"

interface EmployeTableProps {
  employes: Employe[]
  loading: boolean
  onEdit: (employe: Employe) => void
  onDelete: (id: number) => void
  onView: (employe: Employe) => void // Nouvelle prop pour voir les détails
}

export function EmployeTable({ employes, loading, onEdit, onDelete, onView }: EmployeTableProps) {
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

  if (employes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun employé trouvé</p>
      </div>
    )
  }

  const getInitials = (nom: string, prenom: string) => {
    return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase()
  }

  const getStatusColor = (specialite: string) => {
    const colors: Record<string, string> = {
      "Médecine générale": "bg-blue-100 text-blue-800",
      Cardiologie: "bg-red-100 text-red-800",
      Pédiatrie: "bg-green-100 text-green-800",
      Gynécologie: "bg-pink-100 text-pink-800",
      Chirurgie: "bg-purple-100 text-purple-800",
      Radiologie: "bg-yellow-100 text-yellow-800",
      Anesthésie: "bg-indigo-100 text-indigo-800",
      Urgences: "bg-orange-100 text-orange-800",
    }
    return colors[specialite] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Spécialité</TableHead>
            <TableHead>Rôles</TableHead>
            <TableHead>Date d'affectation</TableHead>
            <TableHead>Horaire</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employes.map((employe) => {
            const personne = typeof employe.personne === "object" ? employe.personne : null

            return (
              <TableRow key={employe.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                      <AvatarFallback>{personne ? getInitials(personne.nom, personne.prenom) : "NN"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {personne ? `${personne.prenom} ${personne.nom}` : "Non assigné"}
                      </div>
                      <div className="text-sm text-muted-foreground">N° Ordre: {employe.numOrdre}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {personne && (
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {personne.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {personne.telephone}
                      </div>
                      {personne.adresse && <div className="text-xs text-muted-foreground">{personne.adresse}</div>}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(employe.specialite)}>{employe.specialite}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {employe.roles && employe.roles.length > 0 ? (
                      employe.roles.map((role) => (
                        <Badge key={role.id} variant="outline" className="text-xs text-black">
                          {role.nom}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">Aucun rôle assigné</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{new Date(employe.dateAffectation).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>
                  <div className="text-sm">{employe.horaire}</div>
                  <div className="text-xs text-muted-foreground">
                    Depuis: {new Date(employe.dateAffectation).toLocaleDateString("fr-FR")}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-black">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onView(employe)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(employe)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => employe.id && onDelete(employe.id)} className="text-red-600">
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
