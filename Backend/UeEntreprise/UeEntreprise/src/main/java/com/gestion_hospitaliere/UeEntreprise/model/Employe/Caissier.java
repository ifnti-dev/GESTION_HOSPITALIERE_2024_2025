package com.gestion_hospitaliere.UeEntreprise.model.Employe;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Caissier extends Employe {
    private String numeroCaisse;
    private Double montantTotalEncaisse;
    private LocalDate dateDebutAffectation;
    private String horairesTravail;
    private Boolean actif;

    // @OneToMany(mappedBy = "caissier", cascade = CascadeType.ALL)
    // private List<RapportCaisse> rapportsCaisse;

    // Getters et setters
    public String getNumeroCaisse() {
        return numeroCaisse;
    }

    public void setNumeroCaisse(String numeroCaisse) {
        this.numeroCaisse = numeroCaisse;
    }

    public Double getMontantTotalEncaisse() {
        return montantTotalEncaisse;
    }

    public void setMontantTotalEncaisse(Double montantTotalEncaisse) {
        this.montantTotalEncaisse = montantTotalEncaisse;
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

    // public List<RapportCaisse> getRapportsCaisse() {
    //     return rapportsCaisse;
    // }

    // public void setRapportsCaisse(List<RapportCaisse> rapportsCaisse) {
    //     this.rapportsCaisse = rapportsCaisse;
    // }
}
