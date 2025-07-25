import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { EmployeStats } from "@/types/utilisateur"

interface StatsCardsProps {
  stats: EmployeStats | null
  loading: boolean
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const cards = [
    {
      title: "Total Employés",
      value: stats.totalEmployes,
      description: "Nombre total d'employés",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Employés Actifs",
      value: stats.employes_actifs,
      description: "Employés en service",
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "En Congé",
      value: stats.employes_conge,
      description: "Employés en congé",
      icon: UserX,
      color: "text-orange-600",
    },
    {
      title: "Nouveaux ce mois",
      value: stats.nouveauxCeMois,
      description: "Nouvelles embauches",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% ce mois
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
