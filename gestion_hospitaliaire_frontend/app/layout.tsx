import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

// Import des polices
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// Métadonnées pour l'onglet, les favicons, etc.
export const metadata: Metadata = {
  title: "HospitalCare - Système de Gestion Hospitalière",
  description:
    "Plateforme complète de gestion hospitalière pour optimiser les soins et centraliser les données médicales.",
  icons: {
    icon: [
      {
        url: "/projeticon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/projeticon.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/projeticon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/projeticon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
