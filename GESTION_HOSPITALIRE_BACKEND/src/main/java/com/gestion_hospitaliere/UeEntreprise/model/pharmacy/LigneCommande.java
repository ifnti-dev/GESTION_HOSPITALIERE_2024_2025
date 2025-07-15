package com.gestion_hospitaliere.UeEntreprise.model.pharmacy;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class LigneCommande {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Integer quantite;
  private Integer prixUnitaire; // Prix de vente (copié depuis LigneApprovisionnement.prixUnitaireVente)
  private Integer sousTotal; // quantite * prixUnitaire

  @ManyToOne
  @JoinColumn(name = "commande_id")
  @JsonIgnore
  private Commande commande;

  // Relation directe avec le lot d'approvisionnement (FIFO)
  @ManyToOne
  @JoinColumn(name = "ligne_approvisionnement_id")
  private LigneApprovisionnement ligneApprovisionnement;

  // Constructeurs
  public LigneCommande() {}

  public LigneCommande(Integer quantite, LigneApprovisionnement ligneApprovisionnement) {
      this.quantite = quantite;
      this.ligneApprovisionnement = ligneApprovisionnement;
      if (ligneApprovisionnement != null) {
          this.prixUnitaire = ligneApprovisionnement.getPrixUnitaireVente();
          this.sousTotal = quantite * this.prixUnitaire;
      }
  }

  // Getters et Setters
  public Long getId() {
      return id;
  }

  public void setId(Long id) {
      this.id = id;
  }

  public Integer getQuantite() {
      return quantite;
  }

  public void setQuantite(Integer quantite) {
      this.quantite = quantite;
      // Recalculer le sous-total si le prix unitaire est défini
      if (this.prixUnitaire != null) {
          this.sousTotal = quantite * this.prixUnitaire;
      }
  }

  public Integer getPrixUnitaire() {
      return prixUnitaire;
  }

  public void setPrixUnitaire(Integer prixUnitaire) {
      this.prixUnitaire = prixUnitaire;
      // Recalculer le sous-total si la quantité est définie
      if (this.quantite != null) {
          this.sousTotal = this.quantite * prixUnitaire;
      }
  }

  public Integer getSousTotal() {
      return sousTotal;
  }

  public void setSousTotal(Integer sousTotal) {
      this.sousTotal = sousTotal;
  }

  public Commande getCommande() {
      return commande;
  }

  public void setCommande(Commande commande) {
      this.commande = commande;
  }

  public LigneApprovisionnement getLigneApprovisionnement() {
      return ligneApprovisionnement;
  }

  public void setLigneApprovisionnement(LigneApprovisionnement ligneApprovisionnement) {
      this.ligneApprovisionnement = ligneApprovisionnement;
      // Copier automatiquement le prix de vente du lot
      if (ligneApprovisionnement != null) {
          this.prixUnitaire = ligneApprovisionnement.getPrixUnitaireVente();
          // Recalculer le sous-total si la quantité est définie
          if (this.quantite != null) {
              this.sousTotal = this.quantite * this.prixUnitaire;
          }
      }
  }

  // Méthodes utilitaires
  public void calculerSousTotal() {
      if (this.quantite != null && this.prixUnitaire != null) {
          this.sousTotal = this.quantite * this.prixUnitaire;
      }
  }

  public boolean isValid() {
      return this.quantite != null && this.quantite > 0 &&
             this.prixUnitaire != null && this.prixUnitaire > 0 &&
             this.ligneApprovisionnement != null;
  }

  @Override
  public String toString() {
      return "LigneCommande{" +
              "id=" + id +
              ", quantite=" + quantite +
              ", prixUnitaire=" + prixUnitaire +
              ", sousTotal=" + sousTotal +
              ", numeroLot=" + (ligneApprovisionnement != null ? ligneApprovisionnement.getNumeroLot() : "N/A") +
              '}';
  }
}
