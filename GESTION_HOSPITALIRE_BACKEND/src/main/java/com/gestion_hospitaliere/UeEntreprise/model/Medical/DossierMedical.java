package com.gestion_hospitaliere.UeEntreprise.model.Medical;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class DossierMedical extends Dossier {
    
    
	
    @OneToOne
    @JoinColumn(name = "personne_id", referencedColumnName = "id", nullable = true) // Important: nullable=true	
    private Personne personne;

	@OneToMany(mappedBy = "dossierMedical", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Consultation> consultations = new ArrayList<>();

	public List<Consultation> getConsultations() {
		return consultations;
	}

	public void setConsultations(List<Consultation> consultations) {
		this.consultations = consultations;
	}

	public Personne getPersonne() {
		return personne;
	}

	public void setPersonne(Personne personne) {
		this.personne = personne;
	}
    
    
    
}