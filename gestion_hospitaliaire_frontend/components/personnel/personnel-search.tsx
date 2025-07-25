"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface PersonneSearchFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedType: string
  onTypeChange: (type: string) => void
  selectedSexe: string
  onSexeChange: (sexe: string) => void
}

export function PersonneSearchFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedSexe,
  onSexeChange,
}: PersonneSearchFiltersProps) {
  const handleReset = () => {
    onSearchChange("")
    onTypeChange("all")
    onSexeChange("all")
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

      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les personnes</SelectItem>
          <SelectItem value="employes">Employés seulement</SelectItem>
          <SelectItem value="patients">Patients seulement</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedSexe} onValueChange={onSexeChange}>
        <SelectTrigger className="w-full sm:w-32">
          <SelectValue placeholder="Sexe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="M">Masculin</SelectItem>
          <SelectItem value="F">Féminin</SelectItem>
          <SelectItem value="Autre">Autre</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={handleReset}>
        Réinitialiser
      </Button>
    </div>
  )
}
