"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Phone, Mail, MapPin, Building2 } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900">Système de Gestion Hospitalière</h1>

          <p className="text-xl text-gray-600 max-w-2xl">
            Plateforme de gestion complète pour les établissements de santé
          </p>

          <Link href="/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Connexion
            </button>
          </Link>
        </div>
      </div>

      {/* Modules Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Modules Spécialisés</h2>
            <p className="text-xl text-gray-600">Chaque professionnel dispose d'un accès personnalisé selon son rôle</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Pharmacien", desc: "Gestion stocks, délivrance médicaments", color: "purple" },
              // Tu pourras ajouter d’autres modules ici
            ].map((module, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{module.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Support & Contact</h2>
            <p className="text-xl text-gray-600">Notre équipe est disponible 24/7 pour vous accompagner</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <CardTitle>Support Téléphonique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">+33 1 23 45 67 89</p>
                <p className="text-sm text-gray-500 mt-2">24h/24 - 7j/7</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Mail className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <CardTitle>Support Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">support@hospitalcare.fr</p>
                <p className="text-sm text-gray-500 mt-2">Réponse sous 2h</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <MapPin className="h-8 w-8 text-red-600 mx-auto mb-4" />
                <CardTitle>Adresse</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">123 Avenue de la Santé</p>
                <p className="text-sm text-gray-500 mt-2">75001 Paris, France</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">HospitalCare</h3>
                <p className="text-sm text-gray-400">Système de Gestion Hospitalière</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">© {new Date().getFullYear()} HospitalCare. Tous droits réservés.</p>
              <p className="text-sm text-gray-500 mt-1">Plateforme sécurisée et conforme RGPD</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
