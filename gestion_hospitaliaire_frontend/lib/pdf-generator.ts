import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { DossierGrossesse } from "@/types/medical";
import type { ConsultationPrenatale } from "@/types/consultstionsTraitement";
import { formatDate, calculateGestationalAge, calculateTrimestre } from "@/lib/utils";

// Déclaration étendue pour lastAutoTable
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}

interface PDFGeneratorOptions {
  dossier: DossierGrossesse;
  consultations: ConsultationPrenatale[];
  includeConsultations?: boolean;
  includeAntecedents?: boolean;
  includeSerologies?: boolean;
}

export class PDFGenerator {
  private doc: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private margin: number;
  private currentY: number;

  constructor() {
    this.doc = new jsPDF("p", "mm", "a4");
    this.pageHeight = this.doc.internal.pageSize.height;
    this.pageWidth = this.doc.internal.pageSize.width;
    this.margin = 20;
    this.currentY = this.margin;
  }

  private addHeader(title: string) {
    // Logo/Header area
    this.doc.setFillColor(219, 39, 119); // Rose color
    this.doc.rect(0, 0, this.pageWidth, 25, "F");

    // Title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(18);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin, 15);

    // Date and time
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    const now = new Date();
    this.doc.text(
      `Généré le ${formatDate(now.toISOString())} à ${now.toLocaleTimeString("fr-FR")}`,
      this.pageWidth - this.margin,
      15,
      { align: "right" }
    );

    this.currentY = 35;
  }

  private addFooter(pageNumber: number) {
    this.doc.setTextColor(128, 128, 128);
    this.doc.setFontSize(8);
    this.doc.text(
      `Service Maternité - Carnet de Santé Mère et Enfant`,
      this.margin,
      this.pageHeight - 10
    );
    this.doc.text(
      `Page ${pageNumber}`,
      this.pageWidth - this.margin,
      this.pageHeight - 10,
      { align: "right" }
    );
  }

  private checkPageBreak(neededSpace = 20): boolean {
    if (this.currentY + neededSpace > this.pageHeight - 30) {
      this.doc.addPage();
      this.currentY = this.margin;
      return true;
    }
    return false;
  }

  private addSection(title: string, color: [number, number, number] = [59, 130, 246]) {
    this.checkPageBreak(15);

    // Section header
    this.doc.setFillColor(color[0], color[1], color[2]);
    this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 8, "F");

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin + 3, this.currentY + 5.5);

    this.currentY += 12;
    this.doc.setTextColor(0, 0, 0);
  }

  private addField(label: string, value: string, isFullWidth = false) {
    this.checkPageBreak(8);

    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(label + ":", this.margin, this.currentY);

    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(0, 0, 0);

    if (isFullWidth) {
      this.currentY += 4;
      const lines = this.doc.splitTextToSize(value || "Non spécifié", this.pageWidth - 2 * this.margin);
      this.doc.text(lines, this.margin, this.currentY);
      this.currentY += lines.length * 4 + 2;
    } else {
      this.doc.text(value || "Non spécifié", this.margin + 40, this.currentY);
      this.currentY += 6;
    }
  }

  private addTwoColumnFields(leftLabel: string, leftValue: string, rightLabel: string, rightValue: string) {
    this.checkPageBreak(8);

    const midPoint = this.pageWidth / 2;

    // Left column
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(leftLabel + ":", this.margin, this.currentY);

    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(leftValue || "Non spécifié", this.margin + 35, this.currentY);

    // Right column
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(rightLabel + ":", midPoint, this.currentY);

    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(rightValue || "Non spécifié", midPoint + 35, this.currentY);

    this.currentY += 6;
  }

  private addPatientInfo(dossier: DossierGrossesse) {
    this.addSection("👤 INFORMATIONS PATIENTE", [59, 130, 246]);

    this.addTwoColumnFields(
      "Nom complet",
      `${dossier.personne?.prenom || ""} ${dossier.personne?.nom || ""}`.trim(),
      "Date de naissance",
      dossier.personne?.dateNaissance ? formatDate(dossier.personne.dateNaissance) : ""
    );

    this.addTwoColumnFields(
      "Âge",
      dossier.personne?.dateNaissance
        ? `${new Date().getFullYear() - new Date(dossier.personne.dateNaissance).getFullYear()} ans`
        : "",
      "Téléphone",
      dossier.personne?.telephone || ""
    );

    this.addField("Adresse", dossier.personne?.adresse || "", true);

    this.currentY += 5;
  }

  private addPartnerInfo(dossier: DossierGrossesse) {
    if (!dossier.nomPartenaire && !dossier.prenomsPartenaire && !dossier.professionPartenaire) {
      return;
    }

    this.addSection("👥 INFORMATIONS PARTENAIRE", [34, 197, 94]);

    this.addTwoColumnFields(
      "Nom complet",
      `${dossier.prenomsPartenaire || ""} ${dossier.nomPartenaire || ""}`.trim(),
      "Profession",
      dossier.professionPartenaire || ""
    );

    this.addField("Adresse", dossier.adressePartenaire || "", true);

    this.currentY += 5;
  }

  private addPregnancyInfo(dossier: DossierGrossesse) {
    this.addSection("🤱 GROSSESSE ACTUELLE", [168, 85, 247]);

    const gestationalAge = calculateGestationalAge(dossier.dateDerniereRegle);
    const trimester = calculateTrimestre(dossier.dateDerniereRegle);
    const daysRemaining = Math.ceil(
      (new Date(dossier.datePrevueAccouchement).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    this.addTwoColumnFields(
      "DDR",
      formatDate(dossier.dateDerniereRegle),
      "DPA",
      formatDate(dossier.datePrevueAccouchement)
    );

    this.addTwoColumnFields("Âge gestationnel", gestationalAge, "Trimestre", `${trimester}er trimestre`);

    this.addTwoColumnFields(
      "Parité",
      `G${dossier.nombreGrossesses}P${dossier.nombreAccouchements}`,
      "Jours restants",
      `${daysRemaining} jours`
    );

    this.addTwoColumnFields("Date d'ouverture", formatDate(dossier.dateOuverture), "ID Dossier", `DG-${dossier.id}`);

    this.currentY += 5;
  }

  private addMedicalInfo(dossier: DossierGrossesse) {
    this.addSection("🩺 INFORMATIONS MÉDICALES", [239, 68, 68]);

    this.addTwoColumnFields(
      "Groupe sanguin",
      dossier.groupeSanguin ? `${dossier.groupeSanguin}${dossier.rhesus || ""}` : "",
      "Rhésus",
      dossier.rhesus || ""
    );

    this.currentY += 3;

    // Sérologies
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(100, 100, 100);
    this.doc.text("SÉROLOGIES:", this.margin, this.currentY);
    this.currentY += 6;

    const serologies = [
      ["Rubéole", dossier.statutSerologieRubeole],
      ["Toxoplasmose", dossier.statutSerologieToxo],
      ["Hépatite B", dossier.statutSerologieHepatiteB],
      ["VIH", dossier.statutSerologieHiv],
      ["Syphilis", dossier.statutSerologieSyphilis],
    ];

    serologies.forEach(([name, status], index) => {
      if (status) {
        if (index % 2 === 0) {
          this.addTwoColumnFields(
            name,
            status as string,
            serologies[index + 1] ? serologies[index + 1][0] as string : "",
            serologies[index + 1] ? serologies[index + 1][1] as string || "" : ""
          );
        }
      }
    });

    this.currentY += 5;
  }

  private addAntecedents(dossier: DossierGrossesse) {
    this.addSection("📋 ANTÉCÉDENTS", [245, 158, 11]);

    const antecedents = [
      ["Antécédents médicaux", dossier.antecedentsMedicaux],
      ["Antécédents chirurgicaux", dossier.antecedentsChirurgicaux],
      ["Antécédents gynécologiques", dossier.antecedentsGynecologiques],
      ["Antécédents obstétricaux", dossier.antecedentsObstetricaux],
    ];

    antecedents.forEach(([label, value]) => {
      if (value && value.trim()) {
        this.addField(label, value, true);
        this.currentY += 2;
      }
    });

    this.currentY += 5;
  }

  private addConsultationsTable(consultations: ConsultationPrenatale[]) {
    if (consultations.length === 0) return;

    this.checkPageBreak(40);
    this.addSection("🩺 CONSULTATIONS PRÉNATALES", [16, 185, 129]);

    const tableData = consultations.map((consultation) => [
      formatDate(consultation.dateConsultation),
      `${consultation.poidsMere} kg`,
      consultation.hauteurUterine ? `${consultation.hauteurUterine} cm` : "-",
      consultation.bruitsCoeurFoetal || "-",
      consultation.presenceDiabeteGestationnel
        ? "Oui"
        : consultation.presenceHypertensionGestationnelle
          ? "HTA"
          : consultation.oedemes
            ? "Œdèmes"
            : "Normal",
      consultation.dateProchaineConsultation ? formatDate(consultation.dateProchaineConsultation) : "-",
    ]);

    // CORRECTION : Utilisation correcte de autoTable
    autoTable(this.doc, {
      startY: this.currentY,
      head: [["Date", "Poids", "HU (cm)", "BCF", "Complications", "Prochain RDV"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        fontSize: 9,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 8,
        textColor: 50,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: this.margin, right: this.margin },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 30 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
      },
    });

    // CORRECTION : Gestion sécurisée de lastAutoTable
    if (this.doc.lastAutoTable) {
      this.currentY = this.doc.lastAutoTable.finalY + 10;
    } else {
      this.currentY += 100; // Valeur de repli
    }
  }

  private addConsultationDetails(consultations: ConsultationPrenatale[]) {
    if (consultations.length === 0) return;

    consultations.forEach((consultation, index) => {
      this.checkPageBreak(30);

      // Consultation header
      this.doc.setFillColor(240, 240, 240);
      this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 8, "F");

      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(
        `Consultation ${index + 1} - ${formatDate(consultation.dateConsultation)}`,
        this.margin + 3,
        this.currentY + 5.5
      );

      this.doc.setFontSize(9);
      this.doc.text(`ID: CP-${consultation.id}`, this.pageWidth - this.margin - 3, this.currentY + 5.5, {
        align: "right",
      });

      this.currentY += 12;

      // Consultation details
      this.addTwoColumnFields(
        "Poids mère",
        `${consultation.poidsMere} kg`,
        "Hauteur utérine",
        consultation.hauteurUterine ? `${consultation.hauteurUterine} cm` : ""
      );

      this.addTwoColumnFields(
        "BCF",
        consultation.bruitsCoeurFoetal || "",
        "Mouvements fœtaux",
        consultation.mouvementsFoetus || ""
      );

      // Complications
      const complications = [];
      if (consultation.presenceDiabeteGestationnel) complications.push("Diabète gestationnel");
      if (consultation.presenceHypertensionGestationnelle) complications.push("Hypertension gestationnelle");
      if (consultation.oedemes) complications.push("Œdèmes");

      if (complications.length > 0) {
        this.addField("Complications", complications.join(", "));
      }

      // VAT
      if (consultation.derniereDoseVAT) {
        this.addTwoColumnFields(
          "VAT Dose",
          `Dose ${consultation.derniereDoseVAT}`,
          "Date VAT",
          consultation.dateDerniereDoseVAT ? formatDate(consultation.dateDerniereDoseVAT) : ""
        );
      }

      // Observations
      if (consultation.observationsGenerales) {
        this.addField("Observations", consultation.observationsGenerales, true);
      }

      if (consultation.decisionMedicale) {
        this.addField("Décision médicale", consultation.decisionMedicale, true);
      }

      if (consultation.dateProchaineConsultation) {
        this.addField("Prochaine consultation", formatDate(consultation.dateProchaineConsultation));
      }

      this.currentY += 8;
    });
  }

  private addRiskAssessment(dossier: DossierGrossesse) {
    const risks = [];

    if (dossier.antecedentsMedicaux?.toLowerCase().includes("diabète")) {
      risks.push("Antécédents de diabète");
    }
    if (dossier.antecedentsMedicaux?.toLowerCase().includes("hypertension")) {
      risks.push("Antécédents d'hypertension");
    }
    if (dossier.statutSerologieHiv === "Positif") {
      risks.push("VIH positif");
    }
    if (dossier.statutSerologieSyphilis === "Positif") {
      risks.push("Syphilis positive");
    }
    if (dossier.nombreGrossesses > 5) {
      risks.push("Grande multipare");
    }
    if (dossier.personne?.dateNaissance) {
      const age = new Date().getFullYear() - new Date(dossier.personne.dateNaissance).getFullYear();
      if (age > 35) {
        risks.push("Âge maternel élevé");
      }
    }

    if (risks.length > 0) {
      this.addSection("⚠️ ÉVALUATION DES RISQUES", [239, 68, 68]);

      this.doc.setFillColor(254, 242, 242);
      this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, risks.length * 6 + 8, "F");

      this.doc.setTextColor(185, 28, 28);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("⚠️ FACTEURS DE RISQUE IDENTIFIÉS:", this.margin + 3, this.currentY + 6);

      this.currentY += 10;

      risks.forEach((risk) => {
        this.doc.setFontSize(9);
        this.doc.setFont("helvetica", "normal");
        this.doc.text(`• ${risk}`, this.margin + 5, this.currentY);
        this.currentY += 5;
      });

      this.currentY += 8;
      this.doc.setTextColor(0, 0, 0);
    }
  }

  public generateCompletePDF(options: PDFGeneratorOptions): Uint8Array {
    const { dossier, consultations, includeConsultations = true, includeAntecedents = true } = options;

    // Page 1: Patient and Pregnancy Info
    this.addHeader(`Dossier de Grossesse - ${dossier.personne?.prenom} ${dossier.personne?.nom}`);

    this.addPatientInfo(dossier);
    this.addPartnerInfo(dossier);
    this.addPregnancyInfo(dossier);
    this.addMedicalInfo(dossier);

    if (includeAntecedents) {
      this.addAntecedents(dossier);
    }

    this.addRiskAssessment(dossier);

    // Add consultations if requested
    if (includeConsultations && consultations.length > 0) {
      this.doc.addPage();
      this.currentY = this.margin;
      this.addConsultationsTable(consultations);
      this.addConsultationDetails(consultations);
    }

    // Add page numbers
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.addFooter(i);
    }

    return this.doc.output("arraybuffer") as Uint8Array;
  }

  public generateSummaryPDF(dossier: DossierGrossesse): Uint8Array {
    this.addHeader(`Résumé - ${dossier.personne?.prenom} ${dossier.personne?.nom}`);

    this.addPatientInfo(dossier);
    this.addPregnancyInfo(dossier);
    this.addMedicalInfo(dossier);
    this.addRiskAssessment(dossier);

    this.addFooter(1);

    return this.doc.output("arraybuffer") as Uint8Array;
  }
}

// Utility functions for PDF generation
export const generatePatientPDF = async (options: PDFGeneratorOptions): Promise<void> => {
  const generator = new PDFGenerator();
  const pdfBytes = generator.generateCompletePDF(options);

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `dossier-grossesse-${options.dossier.personne?.nom}-${options.dossier.personne?.prenom}-${new Date()
    .toISOString()
    .split("T")[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const generateSummaryPDF = async (dossier: DossierGrossesse): Promise<void> => {
  const generator = new PDFGenerator();
  const pdfBytes = generator.generateSummaryPDF(dossier);

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `resume-grossesse-${dossier.personne?.nom}-${dossier.personne?.prenom}-${new Date()
    .toISOString()
    .split("T")[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};