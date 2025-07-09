package com.gestion_hospitaliere.UeEntreprise.model.pharmacy;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;

import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;

@Entity
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateCommande;
    private String montantTotal;

    @ManyToOne
    @JoinColumn(name = "personne_id")
    private Personne personne;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<LigneCommande> lignesCommande;

    // Constructeurs
    public Commande() {}

    public Commande(LocalDate dateCommande, String montantTotal, Personne personne) {
        this.dateCommande = dateCommande;
        this.montantTotal = montantTotal;
        this.personne = personne;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateCommande() {
        return dateCommande;
    }

    public void setDateCommande(LocalDate dateCommande) {
        this.dateCommande = dateCommande;
    }

    public String getMontantTotal() {
        return montantTotal;
    }

    public void setMontantTotal(String montantTotal) {
        this.montantTotal = montantTotal;
    }

    // Méthode utilitaire pour définir le montant total à partir d'un double
    public void setMontantTotal(double montantTotal) {
        this.montantTotal = String.valueOf(montantTotal);
    }

    // Méthode pour obtenir le montant total en double
    public double getMontantTotalAsDouble() {
        try {
            return montantTotal != null ? Double.parseDouble(montantTotal) : 0.0;
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    public Personne getPersonne() {
        return personne;
    }

    public void setPersonne(Personne personne) {
        this.personne = personne;
    }

    public List<LigneCommande> getLignesCommande() {
        return lignesCommande;
    }

    public void setLignesCommande(List<LigneCommande> lignesCommande) {
        this.lignesCommande = lignesCommande;
    }

    // Méthodes utilitaires
    public void calculerMontantTotal() {
        if (lignesCommande != null && !lignesCommande.isEmpty()) {
            double total = lignesCommande.stream()
                .mapToDouble(ligne -> ligne.getQuantite() * ligne.getPrixUnitaire())
                .sum();
            this.montantTotal = String.valueOf(total);
        } else {
            this.montantTotal = "0.0";
        }
    }

    public int getNombreLignes() {
        return lignesCommande != null ? lignesCommande.size() : 0;
    }

    public boolean isValid() {
        return dateCommande != null && 
               personne != null && 
               lignesCommande != null && 
               !lignesCommande.isEmpty();
    }

    @Override
    public String toString() {
        return "Commande{" +
                "id=" + id +
                ", dateCommande=" + dateCommande +
                ", montantTotal='" + montantTotal + '\'' +
                ", personne=" + (personne != null ? personne.getNom() : "null") +
                ", nombreLignes=" + getNombreLignes() +
                '}';
    }
}
