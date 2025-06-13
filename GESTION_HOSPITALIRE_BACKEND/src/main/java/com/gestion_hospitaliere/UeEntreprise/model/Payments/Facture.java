package com.gestion_hospitaliere.UeEntreprise.model.Payments;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.model.Employe.Employe;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Schema(description = "Représente une facture dans le système")
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID unique généré automatiquement pour la facture.",
            example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Column(nullable = false, unique = true)
    @Schema(description = "Numéro unique de la facture.", example = "FAC-2024-00123", requiredMode = Schema.RequiredMode.REQUIRED)
    private String numeroFacture;

    @Column(nullable = false)
    @Schema(description = "Date d'émission de la facture.", example = "2024-06-11", requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDate dateEmission;

    @Column(nullable = false, precision = 19, scale = 2)
    @Schema(description = "Montant total de la facture.", example = "250.75", requiredMode = Schema.RequiredMode.REQUIRED)
    private BigDecimal montantTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Schema(description = "Statut actuel de la facture (ex: NON_PAYEE, PAYEE, ANNULEE).", example = "NON_PAYEE", requiredMode = Schema.RequiredMode.REQUIRED)
    private StatutFacture statut;

    @Schema(description = "ID du patient concerné par la facture.", example = "102")
    private Long patientId;

    @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Schema(description = "Liste des paiements associés à cette facture.")
    private List<Paiement> paiements = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "employe_id")
    @Schema(description = "Employé ayant généré la facture.")
    private Employe employe;

    // Constructeurs
    public Facture() {}

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroFacture() { return numeroFacture; }
    public void setNumeroFacture(String numeroFacture) { this.numeroFacture = numeroFacture; }

    public LocalDate getDateEmission() { return dateEmission; }
    public void setDateEmission(LocalDate dateEmission) { this.dateEmission = dateEmission; }

    public BigDecimal getMontantTotal() { return montantTotal; }
    public void setMontantTotal(BigDecimal montantTotal) { this.montantTotal = montantTotal; }

    public StatutFacture getStatut() { return statut; }
    public void setStatut(StatutFacture statut) { this.statut = statut; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public List<Paiement> getPaiements() { return paiements; }
    public void setPaiements(List<Paiement> paiements) { this.paiements = paiements; }

    public Employe getEmploye() { return employe; }
    public void setEmploye(Employe employe) { this.employe = employe; }
}
