package com.gestion_hospitaliere.UeEntreprise.model.Medical;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class DossierMedical extends Dossier {
    
    
	
    @OneToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id", nullable = true) // Important: nullable=true	
    private Patient patient;

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}
    
    
    
}