"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Calendar, Clock, User, Briefcase } from "lucide-react"
import type { Employe } from "@/types/utilisateur"

interface EmployeDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employe: Employe | null
}

export function EmployeDetailsDialog({ open, onOpenChange, employe }: EmployeDetailsDialogProps) {
  if (!employe) return null

  const personne = typeof employe.personne === "object" ? employe.personne : null

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Détails de l'employé</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête avec photo et infos principales */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`/placeholder.svg?height=80&width=80`} />
                  <AvatarFallback className="text-xl">
                    {personne ? getInitials(personne.nom, personne.prenom) : "NN"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {personne ? `${personne.prenom} ${personne.nom}` : "Non assigné"}
                  </h2>
                  <p className="text-gray-600 mb-2">N° Ordre: {employe.numOrdre}</p>
                  <Badge className={getStatusColor(employe.specialite)}>{employe.specialite}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-blue-600" />
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {personne ? (
                  <>
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
                    {personne.dateNaissance && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-900">
                          Né(e) le {new Date(personne.dateNaissance).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    )}
                    {personne.sexe && (
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-900">
                          {personne.sexe === "M" ? "Masculin" : personne.sexe === "F" ? "Féminin" : personne.sexe}
                        </span>
                      </div>
                    )}
                    {personne.situationMatrimoniale && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Situation matrimoniale:</span>
                        <span className="text-sm text-gray-900">{personne.situationMatrimoniale}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 italic">Aucune personne assignée</p>
                )}
              </CardContent>
            </Card>

            {/* Informations professionnelles */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-5 w-5 text-green-600" />
                  Informations Professionnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Date d'affectation:</span>
                    <span className="text-sm text-gray-900 ml-2">
                      {new Date(employe.dateAffectation).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Horaire:</span>
                    <span className="text-sm text-gray-900 ml-2">{employe.horaire}</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 block mb-2">Rôles assignés:</span>
                  <div className="flex flex-wrap gap-2">
                    {employe.roles && employe.roles.length > 0 ? (
                      employe.roles.map((role) => (
                        <Badge key={role.id} variant="outline" className="text-xs">
                          {role.nom}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">Aucun rôle assigné</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques ou informations supplémentaires */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Informations Système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">ID Employé:</span>
                  <span className="text-gray-900 ml-2">{employe.id}</span>
                </div>
                {employe.createdAt && (
                  <div>
                    <span className="font-medium text-gray-700">Créé le:</span>
                    <span className="text-gray-900 ml-2">
                      {new Date(employe.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                )}
                {employe.updatedAt && (
                  <div>
                    <span className="font-medium text-gray-700">Modifié le:</span>
                    <span className="text-gray-900 ml-2">
                      {new Date(employe.updatedAt).toLocaleDateString("fr-FR")}
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
