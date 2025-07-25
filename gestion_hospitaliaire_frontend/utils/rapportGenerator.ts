import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import type { RapportData } from "@/hooks/pharmacie/useRapports"
import type { LigneApprovisionnement } from "@/types/pharmacie"
import { formatPrice, formatDate } from "./formatters"

export class RapportGenerator {
  // Générer un rapport de stock en PDF
  static generateStockReportPDF(data: RapportData, includeAnnulees = false): void {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width

    // En-tête
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("RAPPORT DE STOCK", pageWidth / 2, 20, { align: "center" })

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Généré le ${formatDate(new Date().toISOString())}`, pageWidth / 2, 30, { align: "center" })

    if (includeAnnulees) {
      doc.setFontSize(10)
      doc.setTextColor(220, 38, 38)
      doc.text("(Inclut les données des commandes annulées)", pageWidth / 2, 35, { align: "center" })
      doc.setTextColor(0, 0, 0)
    }

    let yPosition = 50

    // Statistiques générales
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("STATISTIQUES GÉNÉRALES", 20, yPosition)
    yPosition += 15

    const statsData = [
      ["Total des lots", data.stockStats.totalLots.toString()],
      ["Lots disponibles", data.stockStats.lotsDisponibles.toString()],
      ["Lots expirés", data.stockStats.lotsExpires.toString()],
      ["Lots expirant bientôt", data.stockStats.lotsExpirantBientot.toString()],
      ["Stock faible", data.stockStats.stockFaible.toString()],
      ["Valeur totale du stock", formatPrice(data.stockStats.valeurTotaleStock)],
    ]

    if (includeAnnulees && data.venteStats.commandesAnnulees) {
      statsData.push(["Commandes annulées", data.venteStats.commandesAnnulees.toString()])
      statsData.push(["Montant annulé", formatPrice(data.venteStats.montantAnnule || 0)])
    }

    autoTable(doc, {
      startY: yPosition,
      head: [["Indicateur", "Valeur"]],
      body: statsData,
      theme: "grid",
      headStyles: { fillColor: [20, 184, 166] },
      margin: { left: 20, right: 20 },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 20

    // Lots disponibles
    if (data.lotsDisponibles.length > 0) {
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text("LOTS DISPONIBLES", 20, yPosition)
      yPosition += 10

      const lotsData = data.lotsDisponibles
        .slice(0, 20)
        .map((lot) => [
          lot.numeroLot || "N/A",
          this.getMedicamentName(lot),
          lot.quantiteDisponible?.toString() || "0",
          formatPrice(lot.prixUnitaireVente || 0),
          formatDate(lot.dateExpiration),
        ])

      autoTable(doc, {
        startY: yPosition,
        head: [["N° Lot", "Produit", "Quantité", "Prix unitaire", "Expiration"]],
        body: lotsData,
        theme: "striped",
        headStyles: { fillColor: [20, 184, 166] },
        margin: { left: 20, right: 20 },
        styles: { fontSize: 8 },
      })

      yPosition = (doc as any).lastAutoTable.finalY + 20
    }

    // Nouvelle page pour les lots expirés/expirants
    if (data.lotsExpires.length > 0 || data.lotsExpirants.length > 0) {
      doc.addPage()
      yPosition = 20

      if (data.lotsExpires.length > 0) {
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(220, 38, 38)
        doc.text("LOTS EXPIRÉS", 20, yPosition)
        yPosition += 10

        const lotsExpiresData = data.lotsExpires
          .slice(0, 15)
          .map((lot) => [
            lot.numeroLot || "N/A",
            this.getMedicamentName(lot),
            lot.quantiteDisponible?.toString() || "0",
            formatPrice(lot.prixUnitaireVente || 0),
            formatDate(lot.dateExpiration),
          ])

        autoTable(doc, {
          startY: yPosition,
          head: [["N° Lot", "Produit", "Quantité", "Prix unitaire", "Expiration"]],
          body: lotsExpiresData,
          theme: "striped",
          headStyles: { fillColor: [220, 38, 38] },
          margin: { left: 20, right: 20 },
          styles: { fontSize: 8 },
        })

        yPosition = (doc as any).lastAutoTable.finalY + 20
      }

      if (data.lotsExpirants.length > 0) {
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(245, 158, 11)
        doc.text("LOTS EXPIRANT BIENTÔT", 20, yPosition)
        yPosition += 10

        const lotsExpirantsData = data.lotsExpirants
          .slice(0, 15)
          .map((lot) => [
            lot.numeroLot || "N/A",
            this.getMedicamentName(lot),
            lot.quantiteDisponible?.toString() || "0",
            formatPrice(lot.prixUnitaireVente || 0),
            formatDate(lot.dateExpiration),
          ])

        autoTable(doc, {
          startY: yPosition,
          head: [["N° Lot", "Produit", "Quantité", "Prix unitaire", "Expiration"]],
          body: lotsExpirantsData,
          theme: "striped",
          headStyles: { fillColor: [245, 158, 11] },
          margin: { left: 20, right: 20 },
          styles: { fontSize: 8 },
        })
      }
    }

    // Télécharger le PDF
    const suffix = includeAnnulees ? "-avec-annulees" : ""
    doc.save(`rapport-stock-${new Date().toISOString().split("T")[0]}${suffix}.pdf`)
  }

  // Générer un rapport de ventes en PDF
  static generateVentesReportPDF(data: RapportData, includeAnnulees = false): void {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width

    // En-tête
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("RAPPORT DES VENTES", pageWidth / 2, 20, { align: "center" })

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Généré le ${formatDate(new Date().toISOString())}`, pageWidth / 2, 30, { align: "center" })

    if (includeAnnulees) {
      doc.setFontSize(10)
      doc.setTextColor(220, 38, 38)
      doc.text("(Inclut les commandes annulées)", pageWidth / 2, 35, { align: "center" })
      doc.setTextColor(0, 0, 0)
    }

    let yPosition = 50

    // Statistiques de vente
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("STATISTIQUES DE VENTE", 20, yPosition)
    yPosition += 15

    const ventesStatsData = [
      ["Total des commandes valides", data.venteStats.totalCommandes.toString()],
      ["Commandes aujourd'hui", data.venteStats.commandesAujourdhui.toString()],
      ["Commandes ce mois", data.venteStats.commandesMois.toString()],
      ["Montant total", formatPrice(data.venteStats.montantTotal)],
      ["Moyenne par commande", formatPrice(data.venteStats.moyenneCommande)],
    ]

    if (includeAnnulees && data.venteStats.commandesAnnulees) {
      ventesStatsData.push(["Commandes annulées", data.venteStats.commandesAnnulees.toString()])
      ventesStatsData.push(["Montant annulé", formatPrice(data.venteStats.montantAnnule || 0)])
    }

    autoTable(doc, {
      startY: yPosition,
      head: [["Indicateur", "Valeur"]],
      body: ventesStatsData,
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94] },
      margin: { left: 20, right: 20 },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 20

    // Commandes récentes
    const commandesToShow = includeAnnulees
      ? data.commandesRecentes
      : data.commandesRecentes.filter((cmd) => cmd.statut !== "ANNULEE")

    if (commandesToShow.length > 0) {
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(includeAnnulees ? "COMMANDES RÉCENTES (TOUTES)" : "COMMANDES RÉCENTES", 20, yPosition)
      yPosition += 10

      const commandesData = commandesToShow.map((commande) => [
        formatDate(commande.dateCommande),
        commande.personne ? `${commande.personne.prenom} ${commande.personne.nom}` : "N/A",
        commande.nombreLignes?.toString() || "0",
        formatPrice(Number.parseFloat(commande.montantTotal) || 0),
        commande.statut === "ANNULEE" ? "ANNULÉE" : "VALIDE",
      ])

      autoTable(doc, {
        startY: yPosition,
        head: [["Date", "Client", "Nb articles", "Montant", "Statut"]],
        body: commandesData,
        theme: "striped",
        headStyles: { fillColor: [34, 197, 94] },
        margin: { left: 20, right: 20 },
        styles: { fontSize: 9 },
      })
    }

    // Commandes annulées sur une page séparée si incluses
    if (includeAnnulees && data.commandesAnnulees.length > 0) {
      doc.addPage()
      yPosition = 20

      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(220, 38, 38)
      doc.text("COMMANDES ANNULÉES", 20, yPosition)
      doc.setTextColor(0, 0, 0)
      yPosition += 10

      const commandesAnnuleesData = data.commandesAnnulees.map((commande) => [
        formatDate(commande.dateCommande),
        commande.personne ? `${commande.personne.prenom} ${commande.personne.nom}` : "N/A",
        commande.nombreLignes?.toString() || "0",
        formatPrice(Number.parseFloat(commande.montantTotal) || 0),
      ])

      autoTable(doc, {
        startY: yPosition,
        head: [["Date", "Client", "Nb articles", "Montant annulé"]],
        body: commandesAnnuleesData,
        theme: "striped",
        headStyles: { fillColor: [220, 38, 38] },
        margin: { left: 20, right: 20 },
        styles: { fontSize: 9 },
      })
    }

    const suffix = includeAnnulees ? "-avec-annulees" : ""
    doc.save(`rapport-ventes-${new Date().toISOString().split("T")[0]}${suffix}.pdf`)
  }

  // Générer un inventaire complet en Excel
  static generateInventaireExcel(data: RapportData, includeAnnulees = false): void {
    const wb = XLSX.utils.book_new()

    // Feuille 1: Résumé
    const resumeData = [
      ["INVENTAIRE COMPLET"],
      [`Généré le ${formatDate(new Date().toISOString())}`],
      includeAnnulees ? ["(Inclut les commandes annulées)"] : [""],
      [""],
      ["STATISTIQUES GÉNÉRALES"],
      ["Total des lots", data.stockStats.totalLots],
      ["Lots disponibles", data.stockStats.lotsDisponibles],
      ["Lots expirés", data.stockStats.lotsExpires],
      ["Lots expirant bientôt", data.stockStats.lotsExpirantBientot],
      ["Stock faible", data.stockStats.stockFaible],
      ["Valeur totale du stock (FCFA)", data.stockStats.valeurTotaleStock],
      [""],
      ["STATISTIQUES DE VENTE"],
      ["Total des commandes valides", data.venteStats.totalCommandes],
      ["Montant total (FCFA)", data.venteStats.montantTotal],
      ["Moyenne par commande (FCFA)", data.venteStats.moyenneCommande],
    ]

    if (includeAnnulees && data.venteStats.commandesAnnulees) {
      resumeData.push(["Commandes annulées", data.venteStats.commandesAnnulees])
      resumeData.push(["Montant annulé (FCFA)", data.venteStats.montantAnnule || 0])
    }

    const wsResume = XLSX.utils.aoa_to_sheet(resumeData)
    XLSX.utils.book_append_sheet(wb, wsResume, "Résumé")

    // Feuille 2: Lots disponibles
    if (data.lotsDisponibles.length > 0) {
      const lotsHeaders = [
        "N° Lot",
        "Produit",
        "Quantité Initiale",
        "Quantité Disponible",
        "Prix Achat (FCFA)",
        "Prix Vente (FCFA)",
        "Date Réception",
        "Date Expiration",
        "Valeur Stock (FCFA)",
      ]
      const lotsData = data.lotsDisponibles.map((lot) => [
        lot.numeroLot || "N/A",
        this.getMedicamentName(lot),
        lot.quantiteInitiale || 0,
        lot.quantiteDisponible || 0,
        lot.prixUnitaireAchat || 0,
        lot.prixUnitaireVente || 0,
        lot.dateReception || "",
        lot.dateExpiration || "",
        (lot.quantiteDisponible || 0) * (lot.prixUnitaireVente || 0),
      ])

      const wsLots = XLSX.utils.aoa_to_sheet([lotsHeaders, ...lotsData])
      XLSX.utils.book_append_sheet(wb, wsLots, "Lots Disponibles")
    }

    // Feuille 3: Lots expirés
    if (data.lotsExpires.length > 0) {
      const expiresHeaders = [
        "N° Lot",
        "Produit",
        "Quantité",
        "Prix Vente (FCFA)",
        "Date Expiration",
        "Perte Estimée (FCFA)",
      ]
      const expiresData = data.lotsExpires.map((lot) => [
        lot.numeroLot || "N/A",
        this.getMedicamentName(lot),
        lot.quantiteDisponible || 0,
        lot.prixUnitaireVente || 0,
        lot.dateExpiration || "",
        (lot.quantiteDisponible || 0) * (lot.prixUnitaireVente || 0),
      ])

      const wsExpires = XLSX.utils.aoa_to_sheet([expiresHeaders, ...expiresData])
      XLSX.utils.book_append_sheet(wb, wsExpires, "Lots Expirés")
    }

    // Feuille 4: Commandes récentes
    const commandesToShow = includeAnnulees
      ? data.commandesRecentes
      : data.commandesRecentes.filter((cmd) => cmd.statut !== "ANNULEE")

    if (commandesToShow.length > 0) {
      const commandesHeaders = ["Date", "Client", "Nombre d'articles", "Montant (FCFA)", "Statut"]
      const commandesData = commandesToShow.map((commande) => [
        commande.dateCommande,
        commande.personne ? `${commande.personne.prenom} ${commande.personne.nom}` : "N/A",
        commande.nombreLignes || 0,
        Number.parseFloat(commande.montantTotal) || 0,
        commande.statut === "ANNULEE" ? "ANNULÉE" : "VALIDE",
      ])

      const wsCommandes = XLSX.utils.aoa_to_sheet([commandesHeaders, ...commandesData])
      XLSX.utils.book_append_sheet(wb, wsCommandes, includeAnnulees ? "Toutes Commandes" : "Commandes Valides")
    }

    // Feuille 5: Commandes annulées (si incluses)
    if (includeAnnulees && data.commandesAnnulees.length > 0) {
      const annuleesHeaders = ["Date", "Client", "Nombre d'articles", "Montant Annulé (FCFA)"]
      const annuleesData = data.commandesAnnulees.map((commande) => [
        commande.dateCommande,
        commande.personne ? `${commande.personne.prenom} ${commande.personne.nom}` : "N/A",
        commande.nombreLignes || 0,
        Number.parseFloat(commande.montantTotal) || 0,
      ])

      const wsAnnulees = XLSX.utils.aoa_to_sheet([annuleesHeaders, ...annuleesData])
      XLSX.utils.book_append_sheet(wb, wsAnnulees, "Commandes Annulées")
    }

    // Télécharger le fichier Excel
    const suffix = includeAnnulees ? "-avec-annulees" : ""
    XLSX.writeFile(wb, `inventaire-complet-${new Date().toISOString().split("T")[0]}${suffix}.xlsx`)
  }

  // Générer un rapport CSV
  static generateCSVReport(data: RapportData, type: "stock" | "ventes" | "inventaire", includeAnnulees = false): void {
    let csvContent = ""
    let filename = ""

    switch (type) {
      case "stock":
        csvContent = this.generateStockCSV(data, includeAnnulees)
        filename = `rapport-stock-${new Date().toISOString().split("T")[0]}${includeAnnulees ? "-avec-annulees" : ""}.csv`
        break
      case "ventes":
        csvContent = this.generateVentesCSV(data, includeAnnulees)
        filename = `rapport-ventes-${new Date().toISOString().split("T")[0]}${includeAnnulees ? "-avec-annulees" : ""}.csv`
        break
      case "inventaire":
        csvContent = this.generateInventaireCSV(data, includeAnnulees)
        filename = `inventaire-${new Date().toISOString().split("T")[0]}${includeAnnulees ? "-avec-annulees" : ""}.csv`
        break
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  private static generateStockCSV(data: RapportData, includeAnnulees: boolean): string {
    let csv = "N° Lot,Produit,Quantité Disponible,Prix Vente (FCFA),Date Expiration,Statut\n"

    data.lotsDisponibles.forEach((lot) => {
      csv += `"${lot.numeroLot || "N/A"}","${this.getMedicamentName(lot)}",${lot.quantiteDisponible || 0},${lot.prixUnitaireVente || 0},"${lot.dateExpiration || ""}","Disponible"\n`
    })

    data.lotsExpires.forEach((lot) => {
      csv += `"${lot.numeroLot || "N/A"}","${this.getMedicamentName(lot)}",${lot.quantiteDisponible || 0},${lot.prixUnitaireVente || 0},"${lot.dateExpiration || ""}","Expiré"\n`
    })

    if (includeAnnulees) {
      csv += "\n# Statistiques incluant les commandes annulées\n"
      csv += `# Commandes annulées: ${data.venteStats.commandesAnnulees || 0}\n`
      csv += `# Montant annulé: ${data.venteStats.montantAnnule || 0} FCFA\n`
    }

    return csv
  }

  private static generateVentesCSV(data: RapportData, includeAnnulees: boolean): string {
    let csv = "Date,Client,Nombre d'articles,Montant (FCFA),Statut\n"

    const commandesToShow = includeAnnulees
      ? data.commandesRecentes
      : data.commandesRecentes.filter((cmd) => cmd.statut !== "ANNULEE")

    commandesToShow.forEach((commande) => {
      const client = commande.personne ? `${commande.personne.prenom} ${commande.personne.nom}` : "N/A"
      const statut = commande.statut === "ANNULEE" ? "ANNULÉE" : "VALIDE"
      csv += `"${commande.dateCommande}","${client}",${commande.nombreLignes || 0},${Number.parseFloat(commande.montantTotal) || 0},"${statut}"\n`
    })

    return csv
  }

  private static generateInventaireCSV(data: RapportData, includeAnnulees: boolean): string {
    let csv = "Type,N° Lot,Produit,Quantité,Prix Unitaire (FCFA),Valeur Totale (FCFA),Date Expiration\n"

    data.lotsDisponibles.forEach((lot) => {
      const valeur = (lot.quantiteDisponible || 0) * (lot.prixUnitaireVente || 0)
      csv += `"Disponible","${lot.numeroLot || "N/A"}","${this.getMedicamentName(lot)}",${lot.quantiteDisponible || 0},${lot.prixUnitaireVente || 0},${valeur},"${lot.dateExpiration || ""}"\n`
    })

    if (includeAnnulees) {
      csv += "\n# Données incluant les commandes annulées\n"
      csv += `# Total commandes annulées: ${data.venteStats.commandesAnnulees || 0}\n`
      csv += `# Montant total annulé: ${data.venteStats.montantAnnule || 0} FCFA\n`
    }

    return csv
  }

  private static getMedicamentName(lot: LigneApprovisionnement): string {
    if (lot.medicamentReference?.medicament?.nom && lot.medicamentReference?.reference?.nom) {
      return `${lot.medicamentReference.medicament.nom} - ${lot.medicamentReference.reference.nom}`
    }
    return "Produit non défini"
  }

  private static getCategoryName(lot: LigneApprovisionnement): string {
    return lot.medicamentReference?.medicament?.categorie?.nom || "Non définie"
  }
}
