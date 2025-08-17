"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users } from "lucide-react"
import { addPersonne } from "@/services/utilisateur/personne.service"

type CreatePatientModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreatePatientModal({ isOpen, onClose, onSuccess }: CreatePatientModalProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    adresse: "",
    telephone: "",
    sexe: "Féminin",
    dateNaissance: "",
    situationMatrimoniale: "",
    password: "00000000"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    try {
      console.log("Données du formulaire :", formData)
      const newPersonne = await addPersonne(formData)
      console.log("Patiente créée:", newPersonne)

      setFormData({
        nom: "",
        prenom: "",
        email: "",
        adresse: "",
        telephone: "",
        sexe: "Féminin",
        dateNaissance: "",
        situationMatrimoniale: "",
        password: "00000000"
      })

      onSuccess()
    } catch (error) {
      console.error("Erreur lors de la création :", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-rose-600" />
            Ajouter une Nouvelle Patiente
          </DialogTitle>
          <DialogDescription>
            Enregistrer une nouvelle patiente pour le suivi obstétrical
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom*</Label>
            <Input id="nom" value={formData.nom} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom*</Label>
            <Input id="prenom" value={formData.prenom} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email*</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone*</Label>
            <Input id="telephone" value={formData.telephone} onChange={handleChange} />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="adresse">Adresse*</Label>
            <Input id="adresse" value={formData.adresse} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateNaissance">Date de naissance*</Label>
            <Input id="dateNaissance" type="date" value={formData.dateNaissance} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sexe">Sexe*</Label>
            <Select value={formData.sexe} onValueChange={val => handleSelectChange("sexe", val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="f">Féminin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="situationMatrimoniale">Situation matrimoniale</Label>
            <Select value={formData.situationMatrimoniale} onValueChange={val => handleSelectChange("situationMatrimoniale", val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Célibataire">Célibataire</SelectItem>
                <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                <SelectItem value="Veuf(ve)">Veuf(ve)</SelectItem>
                <SelectItem value="Concubinage">Concubinage</SelectItem>
                <SelectItem value="Pacsé(e)">Pacsé(e)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button className="bg-rose-600 text-white hover:bg-rose-700" onClick={handleSubmit}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
