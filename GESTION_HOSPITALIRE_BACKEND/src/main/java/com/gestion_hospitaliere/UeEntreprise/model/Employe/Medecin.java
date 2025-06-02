package com.gestion_hospitaliere.UeEntreprise.model.Employe;

import java.time.LocalDate;

import com.gestion_hospitaliere.UeEntreprise.model.HospitalisationService.ServiceHopital;
import com.gestion_hospitaliere.UeEntreprise.model.User.Utilisateur;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class Medecin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String specialite;
    private String numeroOrdre;
    private LocalDate dateDebutAffectation;
    private Boolean actif;

    @OneToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServiceHopital service;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSpecialite() {
		return specialite;
	}

	public void setSpecialite(String specialite) {
		this.specialite = specialite;
	}

	public String getNumeroOrdre() {
		return numeroOrdre;
	}

	public void setNumeroOrdre(String numeroOrdre) {
		this.numeroOrdre = numeroOrdre;
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

	public Utilisateur getUtilisateur() {
		return utilisateur;
	}

	public void setUtilisateur(Utilisateur utilisateur) {
		this.utilisateur = utilisateur;
	}

	public ServiceHopital getService() {
		return service;
	}

	public void setService(ServiceHopital service) {
		this.service = service;
	}

    
}
