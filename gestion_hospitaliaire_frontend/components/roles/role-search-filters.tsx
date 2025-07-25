"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface RoleSearchFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedFilter: string
  onFilterChange: (filter: string) => void
}

export function RoleSearchFilters({
  searchTerm,
  onSearchChange,
  selectedFilter,
  onFilterChange,
}: RoleSearchFiltersProps) {
  const handleReset = () => {
    onSearchChange("")
    onFilterChange("all")
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher par nom ou description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={selectedFilter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filtrer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les rôles</SelectItem>
          <SelectItem value="active">Rôles actifs</SelectItem>
          <SelectItem value="inactive">Rôles inactifs</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={handleReset}>
        Réinitialiser
      </Button>
    </div>
  )
}
