"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Calendar, User, Briefcase, Heart } from "lucide-react"
import type { Personne } from "@/types/utilisateur"

interface PersonneDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  personne: Personne | null
}

export function PersonneDetailsDialog({ open, onOpenChange, personne }: PersonneDetailsDialogProps) {
  if (!personne) return null

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

  const getPersonType = () => {
    if (personne.employe) {
      return { type: "Employé", icon: <Briefcase className="h-5 w-5" />, color: "bg-green-100 text-green-800" }
    }
    if (personne.dossierMedical) {
      return { type: "Patient", icon: <Heart className="h-5 w-5" />, color: "bg-blue-100 text-blue-800" }
    }
    return { type: "Personne", icon: <User className="h-5 w-5" />, color: "bg-gray-100 text-gray-800" }
  }

  const personType = getPersonType()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Détails de la personne</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête avec photo et infos principales */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`/placeholder.svg?height=80&width=80`} />
                  <AvatarFallback className="text-xl">{getInitials(personne.nom, personne.prenom)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{`${personne.prenom} ${personne.nom}`}</h2>
                  <p className="text-gray-600 mb-2">ID: {personne.id}</p>
                  <div className="flex gap-2">
                    <Badge className={getSexeColor(personne.sexe)}>{getSexeLabel(personne.sexe)}</Badge>
                    <Badge className={personType.color}>
                      {personType.icon}
                      <span className="ml-1">{personType.type}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations de contact */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Informations de Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-900">{personne.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-900">{personne.telephone}</span>
                </div>
                {personne.adresse && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-sm text-gray-900">{personne.adresse}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations personnelles */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-green-600" />
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {personne.dateNaissance && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Date de naissance:</span>
                      <span className="text-sm text-gray-900 ml-2">
                        {new Date(personne.dateNaissance).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                )}
                {personne.situationMatrimoniale && (
                  <div className="flex items-center gap-3">
                    <Heart className="h-4 w-4 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Situation matrimoniale:</span>
                      <span className="text-sm text-gray-900 ml-2">{personne.situationMatrimoniale}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Sexe:</span>
                    <span className="text-sm text-gray-900 ml-2">{getSexeLabel(personne.sexe)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations liées */}
          {(personne.employe || personne.dossierMedical) && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  Informations Liées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {personne.employe && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Employé</h4>
                    <p className="text-sm text-green-700">
                      Cette personne est enregistrée comme employé dans le système.
                    </p>
                  </div>
                )}
                {personne.dossierMedical && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Patient</h4>
                    <p className="text-sm text-blue-700">Cette personne possède un dossier médical dans le système.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Informations système */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Informations Système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">ID Personne:</span>
                  <span className="text-gray-900 ml-2">{personne.id}</span>
                </div>
                {personne.createdAt && (
                  <div>
                    <span className="font-medium text-gray-700">Créé le:</span>
                    <span className="text-gray-900 ml-2">
                      {new Date(personne.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                )}
                {personne.updatedAt && (
                  <div>
                    <span className="font-medium text-gray-700">Modifié le:</span>
                    <span className="text-gray-900 ml-2">
                      {new Date(personne.updatedAt).toLocaleDateString("fr-FR")}
                    </span>
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
