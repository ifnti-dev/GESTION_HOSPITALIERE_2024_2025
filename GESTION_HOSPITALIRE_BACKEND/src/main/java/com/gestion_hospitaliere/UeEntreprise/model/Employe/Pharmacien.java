package com.gestion_hospitaliere.UeEntreprise.model.Employe;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import java.time.LocalDate;
import java.util.List;


@Entity
public class Pharmacien extends Employe {
    private String numeroLicence;
    private LocalDate dateDebutAffectation;
    private String horairesTravail;
    private Boolean actif;

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
}
