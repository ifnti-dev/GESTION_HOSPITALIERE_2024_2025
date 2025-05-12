package com.gestion_hospitaliere.UeEntreprise.model.Employe;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.time.LocalDate;
import java.util.List;

import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.Accouchement;

@Entity
public class SageFemme extends Employe {
    private String specialite;
    private String horairesTravail;
    private LocalDate dateDebutAffectation;
    private Boolean actif;

    // Service :
    // Une relation avec une entité Service pour indiquer dans quel service hospitalier la sage-femme travaille (par exemple, maternité).
    // @ManyToOne
    // @JoinColumn(name = "service_id")
    // private Service service;

    // Liste des patientes :
    // Une relation avec une entité Patiente pour suivre les patientes prises en charge par la sage-femme.
    // @OneToMany(mappedBy = "sageFemme", cascade = CascadeType.ALL)
    // private List<Patiente> patientes;

    // Accouchements réalisés :
    // Une relation avec une entité Accouchement pour suivre les accouchements réalisés par la sage-femme.
    // @OneToMany(mappedBy = "sageFemme", cascade = CascadeType.ALL)
    // private List<Accouchement> accouchements;

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

    // public Service getService() {
    //     return service;
    // }

    // public void setService(Service service) {
    //     this.service = service;
    // }

    // public List<Patiente> getPatientes() {
    //     return patientes;
    // }

    // public void setPatientes(List<Patiente> patientes) {
    //     this.patientes = patientes;
    // }

    // public List<Accouchement> getAccouchements() {
    //     return accouchements;
    // }

    // public void setAccouchements(List<Accouchement> accouchements) {
    //     this.accouchements = accouchements;
    // }
}