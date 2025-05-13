package com.gestion_hospitaliere.UeEntreprise.model.Employe;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import java.time.LocalDate;
import java.util.List;

import com.gestion_hospitaliere.UeEntreprise.model.Payments.Caisse;

@Entity
public class Caissier extends Employe {
    private LocalDate dateDebutAffectation;
    private String horairesTravail;
    private Boolean actif;

    @OneToMany(mappedBy = "caissier", cascade = CascadeType.ALL)
    private List<Caisse> caisses;

    // Getters et setters
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

    public List<Caisse> getCaisses() {
        return caisses;
    }

    public void setCaisses(List<Caisse> caisses) {
        this.caisses = caisses;
    }
}
