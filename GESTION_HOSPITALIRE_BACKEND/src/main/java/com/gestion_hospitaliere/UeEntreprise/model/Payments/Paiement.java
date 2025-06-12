package com.gestion_hospitaliere.UeEntreprise.model.Payments;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Paiement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Double montant;
    private LocalDate date;
    private String moyen;
    
    @ManyToOne
    @JoinColumn(name = "caisse_id")
    private Caisse caisse;

    // Relation: Paiement → Facture (Many-to-One) → DÉJÀ PRÉSENTE
    @ManyToOne
    @JoinColumn(name = "facture_id")
    private Facture facture;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getMoyen() { return moyen; }
    public void setMoyen(String moyen) { this.moyen = moyen; }

    public Facture getFacture() { return facture; }
    public void setFacture(Facture facture) { this.facture = facture; }

    public Caisse getCaisse() { return caisse; }
    public void setCaisse(Caisse caisse) { this.caisse = caisse; }
}
