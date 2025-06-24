package com.gestion_hospitaliere.UeEntreprise.model.Medical;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;

import jakarta.persistence.Entity;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class DossierMedical extends Dossier {
    
    
	
    @OneToOne
    @JoinColumn(name = "personne_id", referencedColumnName = "id", nullable = true) // Important: nullable=true	
    private Personne personne;



	public Personne getPersonne() {
		return personne;
	}

	public void setPersonne(Personne personne) {
		this.personne = personne;
	}
    
    
    
}