package com.gestion_hospitaliere.UeEntreprise.model.Employe;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

import java.time.LocalDate;
import java.util.List;

import com.gestion_hospitaliere.UeEntreprise.model.HospitalisationService.ServiceHopital;


@Entity
public class SageFemme extends Employe {
    private String specialite;
    private String horairesTravail;
    private LocalDate dateDebutAffectation;
    private Boolean actif;

    // Service :
    // Une relation avec une entité Service pour indiquer dans quel service hospitalier la sage-femme travaille (par exemple, maternité).
    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServiceHopital service;

    

    // Getters et setters
    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public String getHorairesTravail() {
        return horairesTravail;
    }

    public void setHorairesTravail(String horairesTravail) {
        this.horairesTravail = horairesTravail;
    }

    public LocalDate getDateDebutAffectation() {
        return dateDebutAffectation;
    }

    public void setDateDebutAffectation(LocalDate dateDebutAffectation) {
        this.dateDebutAffectation = dateDebutAffectation;
    }

    public Boolean getActif() {
        return actif;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
    }

    public ServiceHopital getService() {
        return service;
    }

    public void setService(ServiceHopital service) {
        this.service = service;
    }
}
