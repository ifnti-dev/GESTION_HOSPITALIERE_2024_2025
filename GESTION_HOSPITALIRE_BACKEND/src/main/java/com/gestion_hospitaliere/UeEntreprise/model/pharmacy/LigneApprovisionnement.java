package com.gestion_hospitaliere.UeEntreprise.model.pharmacy;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class LigneApprovisionnement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantiteInitiale; // Quantité reçue initialement
    private Integer quantiteDisponible; // Quantité encore disponible pour la vente
    private Integer prixUnitaireAchat;
    private Integer prixUnitaireVente;
    private LocalDate dateReception;
    private LocalDate dateExpiration;
    @Column(unique = true) 
    private String numeroLot;

    @ManyToOne
    @JoinColumn(name = "approvisionnement_id")
    private Approvisionnement approvisionnement;
    
    @ManyToOne
    @JoinColumn(name="medicamentReference_id")
    private MedicamentReference medicamentReference;

    // Relation avec les lignes de commande (ventes de ce lot)
    @OneToMany(mappedBy = "ligneApprovisionnement")
    @JsonIgnore
    private List<LigneCommande> lignesCommande;

    // Constructeurs
    public LigneApprovisionnement() {}

    public LigneApprovisionnement(Integer quantiteInitiale, Integer prixUnitaireAchat, 
                                 Integer prixUnitaireVente, LocalDate dateReception, 
                                 LocalDate dateExpiration, String numeroLot) {
        this.quantiteInitiale = quantiteInitiale;
        this.quantiteDisponible = quantiteInitiale;
        this.prixUnitaireAchat = prixUnitaireAchat;
        this.prixUnitaireVente = prixUnitaireVente;
        this.dateReception = dateReception;
        this.dateExpiration = dateExpiration;
        this.numeroLot = numeroLot;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantiteInitiale() {
        return quantiteInitiale;
    }

    public void setQuantiteInitiale(Integer quantiteInitiale) {
        this.quantiteInitiale = quantiteInitiale;
        // Initialiser la quantité disponible si pas encore définie
        if (this.quantiteDisponible == null) {
            this.quantiteDisponible = quantiteInitiale;
        }
    }

    public Integer getQuantiteDisponible() {
        return quantiteDisponible;
    }

    public void setQuantiteDisponible(Integer quantiteDisponible) {
        this.quantiteDisponible = quantiteDisponible;
    }

    // Ancienne méthode pour compatibilité
    public Integer getQuantite() {
        return quantiteInitiale;
    }

    public void setQuantite(Integer quantite) {
        setQuantiteInitiale(quantite);
    }

    public Integer getPrixUnitaireAchat() {
        return prixUnitaireAchat;
    }

    public void setPrixUnitaireAchat(Integer prixUnitaireAchat) {
        this.prixUnitaireAchat = prixUnitaireAchat;
    }

    public Integer getPrixUnitaireVente() {
        return prixUnitaireVente;
    }

    public void setPrixUnitaireVente(Integer prixUnitaireVente) {
        this.prixUnitaireVente = prixUnitaireVente;
    }

    public LocalDate getDateReception() {
        return dateReception;
    }

    public void setDateReception(LocalDate dateReception) {
        this.dateReception = dateReception;
    }

    public LocalDate getDateExpiration() {
        return dateExpiration;
    }

    public void setDateExpiration(LocalDate dateExpiration) {
        this.dateExpiration = dateExpiration;
    }

    public String getNumeroLot() {
        return numeroLot;
    }

    public void setNumeroLot(String numeroLot) {
        this.numeroLot = numeroLot;
    }

    public Approvisionnement getApprovisionnement() {
        return approvisionnement;
    }

    public void setApprovisionnement(Approvisionnement approvisionnement) {
        this.approvisionnement = approvisionnement;
    }

    public MedicamentReference getMedicamentReference() {
        return medicamentReference;
    }

    public void setMedicamentReference(MedicamentReference medicamentReference) {
        this.medicamentReference = medicamentReference;
    }

    public List<LigneCommande> getLignesCommande() {
        return lignesCommande;
    }

    public void setLignesCommande(List<LigneCommande> lignesCommande) {
        this.lignesCommande = lignesCommande;
    }

    // Méthodes utilitaires pour la gestion du stock FIFO
    public boolean hasStock(Integer quantiteDemandee) {
        return this.quantiteDisponible != null && this.quantiteDisponible >= quantiteDemandee;
    }

    public void reduireStock(Integer quantiteVendue) {
        if (this.quantiteDisponible != null && this.quantiteDisponible >= quantiteVendue) {
            this.quantiteDisponible -= quantiteVendue;
        } else {
            throw new RuntimeException("Stock insuffisant pour le lot " + this.numeroLot + 
                ". Stock disponible: " + (this.quantiteDisponible != null ? this.quantiteDisponible : 0));
        }
    }

    public void restaurerStock(Integer quantiteRestauree) {
        if (this.quantiteDisponible == null) {
            this.quantiteDisponible = quantiteRestauree;
        } else {
            this.quantiteDisponible += quantiteRestauree;
        }
        
        // Ne pas dépasser la quantité initiale
        if (this.quantiteInitiale != null && this.quantiteDisponible > this.quantiteInitiale) {
            this.quantiteDisponible = this.quantiteInitiale;
        }
    }

    public boolean isExpired() {
        return this.dateExpiration != null && this.dateExpiration.isBefore(LocalDate.now());
    }

    public boolean isAvailable() {
        return !isExpired() && hasStock(1);
    }

    public boolean isExpiringSoon(int daysAhead) {
        if (this.dateExpiration == null) return false;
        LocalDate limitDate = LocalDate.now().plusDays(daysAhead);
        return this.dateExpiration.isBefore(limitDate) || this.dateExpiration.isEqual(limitDate);
    }

    public int getQuantiteVendue() {
        if (this.quantiteInitiale == null || this.quantiteDisponible == null) {
            return 0;
        }
        return this.quantiteInitiale - this.quantiteDisponible;
    }

    public double getTauxUtilisation() {
        if (this.quantiteInitiale == null || this.quantiteInitiale == 0) {
            return 0.0;
        }
        return (double) getQuantiteVendue() / this.quantiteInitiale * 100;
    }

    @Override
    public String toString() {
        return "LigneApprovisionnement{" +
                "id=" + id +
                ", numeroLot='" + numeroLot + '\'' +
                ", quantiteInitiale=" + quantiteInitiale +
                ", quantiteDisponible=" + quantiteDisponible +
                ", prixUnitaireVente=" + prixUnitaireVente +
                ", dateExpiration=" + dateExpiration +
                '}';
    }
}
