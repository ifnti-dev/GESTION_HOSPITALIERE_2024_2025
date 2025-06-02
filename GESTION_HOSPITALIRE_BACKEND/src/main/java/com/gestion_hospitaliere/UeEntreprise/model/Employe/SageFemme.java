package com.gestion_hospitaliere.UeEntreprise.model.Employe;

import java.time.LocalDate;

import com.gestion_hospitaliere.UeEntreprise.model.HospitalisationService.ServiceHopital;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class SageFemme {
	
	
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long id;
	 
	private String specialite;
    private String horairesTravail;
    private LocalDate dateDebutAffectation;
    private Boolean actif;

    // Service :
    // Une relation avec une entité Service pour indiquer dans quel service hospitalier la sage-femme travaille (par exemple, maternité).
    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServiceHopital service;

    

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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
