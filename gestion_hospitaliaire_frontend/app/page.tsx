import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Shield,
  Users,
  Activity,
  Stethoscope,
  Building2,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const features = [
    {
      icon: <Stethoscope className="h-8 w-8 text-blue-600" />,
      title: "Gestion Médicale",
      description: "Dossiers patients, consultations, prescriptions et suivi médical complet",
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Ressources Humaines",
      description: "Gestion du personnel médical, planning et permissions d'accès",
    },
    {
      icon: <Activity className="h-8 w-8 text-red-600" />,
      title: "Suivi en Temps Réel",
      description: "Monitoring des patients, constantes vitales et alertes automatiques",
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Sécurité Renforcée",
      description: "Authentification sécurisée et protection des données médicales",
    },
  ]

  const stats = [
    { label: "Patients Traités", value: "15,000+", icon: <Heart className="h-5 w-5" /> },
    { label: "Personnel Médical", value: "250+", icon: <Users className="h-5 w-5" /> },
    { label: "Disponibilité", value: "99.9%", icon: <CheckCircle className="h-5 w-5" /> },
    { label: "Support 24/7", value: "365j", icon: <Clock className="h-5 w-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HospitalCare</h1>
                <p className="text-xs text-gray-500">Système de Gestion</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
                Fonctionnalités
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                À Propos
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                Contact
              </Link>
            </div>

            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                <Shield className="h-4 w-4 mr-2" />
                Connexion
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Plateforme Hospitalière Privée</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Gestion Hospitalière
                  <span className="text-blue-600 block">Intelligente</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Système complet de gestion hospitalière pour optimiser les soins, centraliser les données médicales et
                  améliorer l'efficacité opérationnelle.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Accéder au Système
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium"
                >
                  Documentation
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2 text-blue-600">{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8 shadow-2xl">
                <Image
                  src="/images/hospitl.png?height=400&width=500"
                  alt="Dashboard Preview"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                <Activity className="h-8 w-8 text-green-500" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg">
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Fonctionnalités Avancées</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une solution complète pour la gestion hospitalière moderne, conçue pour les professionnels de santé.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">{feature.icon}</div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Modules Spécialisés</h2>
            <p className="text-xl text-gray-600">Chaque professionnel dispose d'un accès personnalisé selon son rôle</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Médecin Généraliste", desc: "Consultations, prescriptions, dossiers médicaux", color: "blue" },
              { title: "Infirmier", desc: "Soins, constantes vitales, suivi patients", color: "green" },
              { title: "Sage-femme", desc: "Grossesses, accouchements, soins postnataux", color: "pink" },
              { title: "Pharmacien", desc: "Gestion stocks, délivrance médicaments", color: "purple" },
              { title: "Caissier", desc: "Facturation, encaissements, prises en charge", color: "orange" },
              { title: "Directeur", desc: "Supervision, statistiques, gestion globale", color: "red" },
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
