package com.gestion_hospitaliere.UeEntreprise.model.Employe;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import java.time.LocalDate;
import java.util.List;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.Medicament;

@Entity
public class Pharmacien extends Employe {
    private String numeroLicence;
    private LocalDate dateDebutAffectation;
    private String horairesTravail;
    private Boolean actif;

    // Liste des médicaments gérés :
    // Une relation avec une entité Medicament pour suivre les médicaments gérés par le pharmacien.
    // @OneToMany(mappedBy = "pharmacien", cascade = CascadeType.ALL)
    // private List<Medicament> medicaments;

    // Commandes de médicaments :
    // Une relation avec une entité Commande pour suivre les commandes de médicaments effectuées par le pharmacien.
    // @OneToMany(mappedBy = "pharmacien", cascade = CascadeType.ALL)
    // private List<Commande> commandes;

    // Getters et setters
    public String getNumeroLicence() {
        return numeroLicence;
    }

    public void setNumeroLicence(String numeroLicence) {
        this.numeroLicence = numeroLicence;
    }

    public LocalDate getDateDebutAffectation() {
        return dateDebutAffectation;
    }

    public void setDateDebutAffectation(LocalDate dateDebutAffectation) {
        this.dateDebutAffectation = dateDebutAffectation;
    }

    public String getHorairesTravail() {
        return horairesTravail;
    }

    public void setHorairesTravail(String horairesTravail) {
        this.horairesTravail = horairesTravail;
    }

    public Boolean getActif() {
        return actif;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
    }

    // public List<Medicament> getMedicaments() {
    //     return medicaments;
    // }

    // public void setMedicaments(List<Medicament> medicaments) {
    //     this.medicaments = medicaments;
    // }

    // public List<Commande> getCommandes() {
    //     return commandes;
    // }

    // public void setCommandes(List<Commande> commandes) {
    //     this.commandes = commandes;
    // }
}
