import jsPDF from "jspdf"
import "jspdf-autotable"
import type { ConsultationPrenatale, PrescriptionPrenatale } from "@/types/consultstionsTraitement"
import { formatDate } from "@/lib/utils"

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

interface OrdonnanceGeneratorOptions {
  consultation: ConsultationPrenatale
  prescriptions: PrescriptionPrenatale[]
}

export class OrdonnanceGenerator {
  private doc: jsPDF
  private pageHeight: number
  private pageWidth: number
  private margin: number
  private currentY: number

  constructor() {
    this.doc = new jsPDF("p", "mm", "a4")
    this.pageHeight = this.doc.internal.pageSize.height
    this.pageWidth = this.doc.internal.pageSize.width
    this.margin = 20
    this.currentY = this.margin
  }

  private addHeader(consultation: ConsultationPrenatale) {
    // En-tête avec logo/titre
    this.doc.setFillColor(59, 130, 246) // Bleu
    this.doc.rect(0, 0, this.pageWidth, 30, "F")

    // Titre principal
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(20)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("ORDONNANCE MÉDICALE", this.pageWidth / 2, 15, { align: "center" })

    // Sous-titre
    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "normal")
    this.doc.text("Service de Maternité", this.pageWidth / 2, 22, { align: "center" })

    this.currentY = 40
    this.doc.setTextColor(0, 0, 0)

    // Informations du praticien
    this.doc.setFontSize(11)
    this.doc.setFont("helvetica", "bold")
    this.doc.text(
      "Dr. " + (consultation.employe?.personne?.prenom || "") + " " + (consultation.employe?.personne?.nom || ""),
      this.margin,
      this.currentY,
    )
    this.doc.setFont("helvetica", "normal")
    this.doc.setFontSize(9)
    this.doc.text("Sage-femme", this.margin, this.currentY + 5)
    this.doc.text("Service de Maternité", this.margin, this.currentY + 10)

    // Date et numéro d'ordonnance
    this.doc.setFontSize(9)
    this.doc.text(`Date: ${formatDate(consultation.dateConsultation)}`, this.pageWidth - this.margin, this.currentY, {
      align: "right",
    })
    this.doc.text(
      `N° Ordonnance: ORD-${consultation.id}-${new Date().getTime()}`,
      this.pageWidth - this.margin,
      this.currentY + 5,
      { align: "right" },
    )

    this.currentY += 25
  }

  private addPatientInfo(consultation: ConsultationPrenatale) {
    // Cadre patient
    this.doc.setDrawColor(200, 200, 200)
    this.doc.setFillColor(248, 250, 252)
    this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 25, "FD")

    this.currentY += 8

    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("PATIENTE:", this.margin + 5, this.currentY)

    this.doc.setFont("helvetica", "normal")
    const patientName =
      `${consultation.dossierGrossesse?.personne?.prenom || ""} ${consultation.dossierGrossesse?.personne?.nom || ""}`.trim()
    this.doc.text(patientName, this.margin + 30, this.currentY)

    this.currentY += 6

    this.doc.setFontSize(10)
    if (consultation.dossierGrossesse?.personne?.dateNaissance) {
      const birthDate = new Date(consultation.dossierGrossesse.personne.dateNaissance)
      const age = new Date().getFullYear() - birthDate.getFullYear()
      this.doc.text(`Âge: ${age} ans`, this.margin + 5, this.currentY)
    }

    this.doc.text(`Dossier: DG-${consultation.dossierGrossesse?.id}`, this.margin + 60, this.currentY)

    if (consultation.dossierGrossesse?.personne?.telephone) {
      this.doc.text(`Tél: ${consultation.dossierGrossesse.personne.telephone}`, this.margin + 120, this.currentY)
    }

    this.currentY += 20
  }

  private addPrescriptions(prescriptions: PrescriptionPrenatale[]) {
    const medicaments = prescriptions.filter((p) => p.type === "MEDICAMENT")
    const examens = prescriptions.filter((p) => p.type === "EXAMEN")

    // Médicaments
    if (medicaments.length > 0) {
      this.doc.setFontSize(14)
      this.doc.setFont("helvetica", "bold")
      this.doc.text("PRESCRIPTIONS MÉDICAMENTEUSES", this.margin, this.currentY)
      this.currentY += 10

      medicaments.forEach((medicament, index) => {
        this.doc.setFontSize(12)
        this.doc.setFont("helvetica", "bold")
        this.doc.text(`${index + 1}. ${medicament.designation}`, this.margin + 5, this.currentY)
        this.currentY += 6

        if (medicament.posologie) {
          this.doc.setFontSize(10)
          this.doc.setFont("helvetica", "normal")
          this.doc.text(`   Posologie: ${medicament.posologie}`, this.margin + 5, this.currentY)
          this.currentY += 5
        }

        const details = []
        if (medicament.quantiteParJour) {
          details.push(`${medicament.quantiteParJour} prise(s) par jour`)
        }
        if (medicament.dureeJours) {
          details.push(`pendant ${medicament.dureeJours} jour(s)`)
        }
        if (medicament.dateDebut) {
          details.push(`à partir du ${formatDate(medicament.dateDebut)}`)
        }

        if (details.length > 0) {
          this.doc.text(`   ${details.join(", ")}`, this.margin + 5, this.currentY)
          this.currentY += 5
        }

        if (medicament.instructions) {
          this.doc.setFont("helvetica", "italic")
          this.doc.text(`   Instructions: ${medicament.instructions}`, this.margin + 5, this.currentY)
          this.currentY += 5
        }

        this.currentY += 3
      })

      this.currentY += 10
    }

    // Examens
    if (examens.length > 0) {
      this.doc.setFontSize(14)
      this.doc.setFont("helvetica", "bold")
      this.doc.text("EXAMENS PRESCRITS", this.margin, this.currentY)
      this.currentY += 10

      examens.forEach((examen, index) => {
        this.doc.setFontSize(12)
        this.doc.setFont("helvetica", "bold")
        this.doc.text(`${index + 1}. ${examen.designation}`, this.margin + 5, this.currentY)
        this.currentY += 6

        if (examen.datePrevue) {
          this.doc.setFontSize(10)
          this.doc.setFont("helvetica", "normal")
          this.doc.text(`   Date prévue: ${formatDate(examen.datePrevue)}`, this.margin + 5, this.currentY)
          this.currentY += 5
        }

        if (examen.lieuRealisation) {
          this.doc.text(`   Lieu: ${examen.lieuRealisation}`, this.margin + 5, this.currentY)
          this.currentY += 5
        }

        if (examen.instructions) {
          this.doc.setFont("helvetica", "italic")
          this.doc.text(`   Instructions: ${examen.instructions}`, this.margin + 5, this.currentY)
          this.currentY += 5
        }

        this.currentY += 3
      })
    }
  }

  private addFooter() {
    // Signature
    this.currentY = Math.max(this.currentY, this.pageHeight - 60)

    this.doc.setFontSize(10)
    this.doc.setFont("helvetica", "normal")
    this.doc.text("Signature et cachet du praticien:", this.pageWidth - this.margin - 60, this.currentY)

    // Cadre pour signature
    this.doc.setDrawColor(150, 150, 150)
    this.doc.rect(this.pageWidth - this.margin - 60, this.currentY + 5, 50, 25, "D")

    // Informations légales
    this.doc.setFontSize(8)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(
      "Cette ordonnance est valable 3 mois à compter de sa date d'émission",
      this.margin,
      this.pageHeight - 20,
    )
    this.doc.text("En cas d'urgence, contactez le service de maternité", this.margin, this.pageHeight - 15)
    this.doc.text(
      `Généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`,
      this.margin,
      this.pageHeight - 10,
    )
  }

  public generateOrdonnance(options: OrdonnanceGeneratorOptions): Uint8Array {
    const { consultation, prescriptions } = options

    this.addHeader(consultation)
    this.addPatientInfo(consultation)
    this.addPrescriptions(prescriptions)
    this.addFooter()

    return this.doc.output("arraybuffer") as Uint8Array
  }
}

// Fonction utilitaire pour générer et télécharger l'ordonnance
export const generateOrdonnancePDF = async (options: OrdonnanceGeneratorOptions): Promise<void> => {
  const generator = new OrdonnanceGenerator()
  const pdfBytes = generator.generateOrdonnance(options)

  const blob = new Blob([pdfBytes], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)

  const patientName =
    `${options.consultation.dossierGrossesse?.personne?.prenom}-${options.consultation.dossierGrossesse?.personne?.nom}`.replace(
      /\s+/g,
      "-",
    )
  const date = new Date().toISOString().split("T")[0]

  const link = document.createElement("a")
  link.href = url
  link.download = `ordonnance-${patientName}-${date}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
