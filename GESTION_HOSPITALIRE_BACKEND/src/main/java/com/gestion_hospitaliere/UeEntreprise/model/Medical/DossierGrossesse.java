package com.gestion_hospitaliere.UeEntreprise.model.Medical;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.controller.ConsultationTraitement.ConsultationPrenataleController;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.ConsultationPrenatale;
import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.Accouchement;
import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.SuiviGrossesse;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;


@Entity
public class DossierGrossesse extends Dossier {

	
    private LocalDate dateOuverture;
    private Integer nombreGrossesses;
    private Integer nombreAccouchements;
    private LocalDate dateDerniereRegle;
    private LocalDate datePrevueAccouchement;
    private String rhesus;
    private String statutImmunisationRubeole;
    private String statutImmunisationToxo;
    private String statutImmunisationHepatiteB;
    private String statutSerologieHiv;
    private String statutSerologieSyphilis;
    private Boolean presenceDiabeteGestationnel;
    private Boolean presenceHypertensionGestationnelle;
    private String observationsGenerales;

	@ManyToOne
	@JoinColumn(name = "personne_id", referencedColumnName = "id", nullable = true) // Important: nullable=true
	private Personne personne;
    
    @OneToMany(mappedBy = "dossierGrossesse", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore  // Ignore dans le JSON
	private List<SuiviGrossesse> suivisGrossesse = new ArrayList<>();


	@OneToMany(mappedBy = "dossierGrossesse", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore  // Ignore dans le JSON
	private List<Accouchement> accouchements = new ArrayList<>();

    @OneToMany(mappedBy = "dossierGrossesse") // ← Correction du nom    
	@JsonIgnore
    private List<ConsultationPrenatale> consultationPrenatale = new ArrayList<>();

 // Getters and setters
    
	public List<ConsultationPrenatale> getConsultationPrenatale() {
		return consultationPrenatale;
	}

	public void setConsultationPrenatale(List<ConsultationPrenatale> consultationPrenatale) {
		this.consultationPrenatale = consultationPrenatale;
	}

	public LocalDate getDateOuverture() {
		return dateOuverture;
	}

	public void setDateOuverture(LocalDate dateOuverture) {
		this.dateOuverture = dateOuverture;
	}

	public Integer getNombreGrossesses() {
		return nombreGrossesses;
	}

	public void setNombreGrossesses(Integer nombreGrossesses) {
		this.nombreGrossesses = nombreGrossesses;
	}

	public Integer getNombreAccouchements() {
		return nombreAccouchements;
	}

	public void setNombreAccouchements(Integer nombreAccouchements) {
		this.nombreAccouchements = nombreAccouchements;
	}

	public LocalDate getDateDerniereRegle() {
		return dateDerniereRegle;
	}

	public void setDateDerniereRegle(LocalDate dateDerniereRegle) {
		this.dateDerniereRegle = dateDerniereRegle;
	}

	public LocalDate getDatePrevueAccouchement() {
		return datePrevueAccouchement;
	}

	public void setDatePrevueAccouchement(LocalDate datePrevueAccouchement) {
		this.datePrevueAccouchement = datePrevueAccouchement;
	}

	public String getRhesus() {
		return rhesus;
	}

	public void setRhesus(String rhesus) {
		this.rhesus = rhesus;
	}

	public String getStatutImmunisationRubeole() {
		return statutImmunisationRubeole;
	}

	public void setStatutImmunisationRubeole(String statutImmunisationRubeole) {
		this.statutImmunisationRubeole = statutImmunisationRubeole;
	}

	public String getStatutImmunisationToxo() {
		return statutImmunisationToxo;
	}

	public void setStatutImmunisationToxo(String statutImmunisationToxo) {
		this.statutImmunisationToxo = statutImmunisationToxo;
	}

	public String getStatutImmunisationHepatiteB() {
		return statutImmunisationHepatiteB;
	}

	public void setStatutImmunisationHepatiteB(String statutImmunisationHepatiteB) {
		this.statutImmunisationHepatiteB = statutImmunisationHepatiteB;
	}

	public String getStatutSerologieHiv() {
		return statutSerologieHiv;
	}

	public void setStatutSerologieHiv(String statutSerologieHiv) {
		this.statutSerologieHiv = statutSerologieHiv;
	}

	public String getStatutSerologieSyphilis() {
		return statutSerologieSyphilis;
	}

	public void setStatutSerologieSyphilis(String statutSerologieSyphilis) {
		this.statutSerologieSyphilis = statutSerologieSyphilis;
	}

	public Boolean getPresenceDiabeteGestationnel() {
		return presenceDiabeteGestationnel;
	}

	public void setPresenceDiabeteGestationnel(Boolean presenceDiabeteGestationnel) {
		this.presenceDiabeteGestationnel = presenceDiabeteGestationnel;
	}

	public Boolean getPresenceHypertensionGestationnelle() {
		return presenceHypertensionGestationnelle;
	}

	public void setPresenceHypertensionGestationnelle(Boolean presenceHypertensionGestationnelle) {
		this.presenceHypertensionGestationnelle = presenceHypertensionGestationnelle;
	}

	public String getObservationsGenerales() {
		return observationsGenerales;
	}

	public void setObservationsGenerales(String observationsGenerales) {
		this.observationsGenerales = observationsGenerales;
	}

	public List<SuiviGrossesse> getSuivisGrossesse() {
		return suivisGrossesse;
	}

	public void setSuivisGrossesse(List<SuiviGrossesse> suivisGrossesse) {
		this.suivisGrossesse = suivisGrossesse;
	}

	public List<Accouchement> getAccouchements() {
		return accouchements;
	}

	public void setAccouchements(List<Accouchement> accouchements) {
		this.accouchements = accouchements;
	}

	public Personne getPersonne() {
		return personne;
	}

	public void setPersonne(Personne personne) {
		this.personne = personne;
	}
    
    
    
}