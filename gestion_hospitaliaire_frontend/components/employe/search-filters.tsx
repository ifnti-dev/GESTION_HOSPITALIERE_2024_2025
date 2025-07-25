"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface SearchFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedSpecialite: string
  onSpecialiteChange: (specialite: string) => void
  selectedStatut: string
  onStatutChange: (statut: string) => void
  selectedRole?: string
  onRoleChange?: (role: string) => void
}

export function SearchFilters({
  searchTerm,
  onSearchChange,
  selectedSpecialite,
  onSpecialiteChange,
  selectedStatut,
  onStatutChange,
  selectedRole,
  onRoleChange,
}: SearchFiltersProps) {
  const specialites = [
    "Médecine générale",
    "Cardiologie",
    "Pédiatrie",
    "Gynécologie",
    "Chirurgie",
    "Radiologie",
    "Anesthésie",
    "Urgences",
  ]

  const statuts = ["Actif", "En congé", "Suspendu", "Formation"]

  const handleReset = () => {
    onSearchChange("")
    onSpecialiteChange("all")
    onStatutChange("all")
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher par nom, email ou téléphone..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={selectedSpecialite} onValueChange={onSpecialiteChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Spécialité" />
        </SelectTrigger>
        <SelectContent className="text-black">
          <SelectItem value="all">Toutes les spécialités</SelectItem>
          {specialites.map((specialite) => (
            <SelectItem key={specialite} value={specialite}>
              {specialite}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedStatut} onValueChange={onStatutChange}>
        <SelectTrigger className="w-full sm:w-32">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent className="text-black">
          <SelectItem value="all">Tous les statuts</SelectItem>
          {statuts.map((statut) => (
            <SelectItem key={statut} value={statut}>
              {statut}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedRole} onValueChange={onRoleChange}>
        <SelectTrigger className="w-full sm:w-32">
          <SelectValue placeholder="Rôle" />
        </SelectTrigger>
        <SelectContent className="text-black">
          <SelectItem value="all">Tous les rôles</SelectItem>
          <SelectItem value="1">Médecin</SelectItem>
          <SelectItem value="2">Infirmier</SelectItem>
          <SelectItem value="3">Administrateur</SelectItem>
          <SelectItem value="4">Technicien</SelectItem>
          <SelectItem value="5">Pharmacien</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={handleReset}>
        Réinitialiser
      </Button>
    </div>
  )
}
