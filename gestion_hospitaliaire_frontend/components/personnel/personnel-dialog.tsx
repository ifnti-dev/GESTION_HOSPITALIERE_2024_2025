"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Personne, PersonneFormData } from "@/types/utilisateur"

interface PersonneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  personne?: Personne | null
  onSave: (data: PersonneFormData) => void
}

export function PersonneDialog({ open, onOpenChange, personne, onSave }: PersonneDialogProps) {
  const [formData, setFormData] = useState<PersonneFormData>({
    nom: "",
    prenom: "",
    email: "",
    adresse: "",
    telephone: "",
    password: "",
    sexe: "",
    dateNaissance: "",
    situationMatrimoniale: "",
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (personne) {
      setFormData({
        nom: personne.nom || "",
        prenom: personne.prenom || "",
        email: personne.email || "",
        adresse: personne.adresse || "",
        telephone: personne.telephone || "",
        password: "", // Ne pas pré-remplir le mot de passe
        sexe: personne.sexe || "",
        dateNaissance: personne.dateNaissance || "",
        situationMatrimoniale: personne.situationMatrimoniale || "",
      })
    } else {
      // Reset form for new person
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        adresse: "",
        telephone: "",
        password: "",
        sexe: "",
        dateNaissance: "",
        situationMatrimoniale: "",
      })
    }
  }, [personne, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSave(formData)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{personne ? "Modifier la personne" : "Nouvelle personne"}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {personne ? "Modifiez les informations de la personne" : "Ajoutez une nouvelle personne au système"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Informations Personnelles</CardTitle>
              <CardDescription className="text-gray-600">
                Renseignez les informations de base de la personne
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-gray-700">
                    Nom *
                  </Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nom: e.target.value }))}
                    required
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom" className="text-gray-700">
                    Prénom *
                  </Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => setFormData((prev) => ({ ...prev, prenom: e.target.value }))}
                    required
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telephone" className="text-gray-700">
                    Téléphone *
                  </Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, telephone: e.target.value }))}
                    required
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexe" className="text-gray-700">
                    Sexe
                  </Label>
                  <Select
                    value={formData.sexe}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, sexe: value }))}
                  >
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="M">Masculin</SelectItem>
                      <SelectItem value="F">Féminin</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse" className="text-gray-700">
                  Adresse *
                </Label>
                <Textarea
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => setFormData((prev) => ({ ...prev, adresse: e.target.value }))}
                  required
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateNaissance" className="text-gray-700">
                    Date de naissance
                  </Label>
                  <Input
                    id="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dateNaissance: e.target.value }))}
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="situationMatrimoniale" className="text-gray-700">
                    Situation matrimoniale
                  </Label>
                  <Select
                    value={formData.situationMatrimoniale}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, situationMatrimoniale: value }))}
                  >
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Célibataire">Célibataire</SelectItem>
                      <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                      <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                      <SelectItem value="Veuf/Veuve">Veuf/Veuve</SelectItem>
                      <SelectItem value="Enfant">Enfant</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {!personne && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Mot de passe *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required={!personne}
                    className="bg-white border-gray-300"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : personne ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
