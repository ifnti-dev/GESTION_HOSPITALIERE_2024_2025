"use client"

import { MoreHorizontal, Edit, Trash2, Phone, Mail, Eye, User, Briefcase } from "lucide-react"
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
import type { Personne } from "@/types/utilisateur"

interface PersonneTableProps {
  personnes: Personne[]
  loading: boolean
  onEdit: (personne: Personne) => void
  onDelete: (id: number) => void
  onView: (personne: Personne) => void
}

export function PersonneTable({ personnes, loading, onEdit, onDelete, onView }: PersonneTableProps) {
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

  if (personnes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucune personne trouvée</p>
      </div>
    )
  }

  const getInitials = (nom: string, prenom: string) => {
    return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase()
  }

  const getSexeColor = (sexe?: string) => {
    const colors: Record<string, string> = {
      M: "bg-blue-100 text-blue-800",
      F: "bg-pink-100 text-pink-800",
      Autre: "bg-gray-100 text-gray-800",
    }
    return colors[sexe || ""] || "bg-gray-100 text-gray-800"
  }

  const getSexeLabel = (sexe?: string) => {
    const labels: Record<string, string> = {
      M: "Masculin",
      F: "Féminin",
      Autre: "Autre",
    }
    return labels[sexe || ""] || "Non spécifié"
  }

  const getPersonType = (personne: Personne) => {
    if (personne.employe) {
      return { type: "Employé", icon: <Briefcase className="h-3 w-3" />, color: "bg-green-100 text-green-800" }
    }
    if (personne.dossierMedical) {
      return { type: "Patient", icon: <User className="h-3 w-3" />, color: "bg-blue-100 text-blue-800" }
    }
    return { type: "Personne", icon: <User className="h-3 w-3" />, color: "bg-gray-100 text-gray-800" }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Personne</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Sexe</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Situation</TableHead>
            <TableHead>Date de naissance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personnes.map((personne) => {
            const personType = getPersonType(personne)

            return (
              <TableRow key={personne.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                      <AvatarFallback>{getInitials(personne.nom, personne.prenom)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{`${personne.prenom} ${personne.nom}`}</div>
                      <div className="text-sm text-muted-foreground">ID: {personne.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="h-3 w-3 mr-1" />
                      {personne.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-3 w-3 mr-1" />
                      {personne.telephone}
                    </div>
                    {personne.adresse && (
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{personne.adresse}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getSexeColor(personne.sexe)}>{getSexeLabel(personne.sexe)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={personType.color}>
                    {personType.icon}
                    <span className="ml-1">{personType.type}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{personne.situationMatrimoniale || "Non spécifiée"}</div>
                </TableCell>
                <TableCell>
                  {personne.dateNaissance
                    ? new Date(personne.dateNaissance).toLocaleDateString("fr-FR")
                    : "Non spécifiée"}
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
                      <DropdownMenuItem onClick={() => onView(personne)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(personne)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => personne.id && onDelete(personne.id)} className="text-red-600">
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
