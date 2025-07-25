"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PermissionSearchFiltersProps {
  onSearch: (searchTerm: string) => void
}

export function PermissionSearchFilters({ onSearch }: PermissionSearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const clearSearch = () => {
    setSearchTerm("")
    onSearch("")
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom ou description..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-8"
        />
        {searchTerm && (
          <Button variant="ghost" size="sm" className="absolute right-1 top-1 h-7 w-7 p-0" onClick={clearSearch}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
