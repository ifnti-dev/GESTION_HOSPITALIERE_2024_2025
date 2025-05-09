package com.gestion_hospitaliere.UeEntreprise.model.Medical;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class DossierMedical {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String antecedents;
    private String allergies;
    private String traitementsEnCours;
    private Float tension;
    private String groupeSanguin;
    
    @OneToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;


    // Getters and setters


	public String getAntecedents() {
		return antecedents;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setAntecedents(String antecedents) {
		this.antecedents = antecedents;
	}

	public String getAllergies() {
		return allergies;
	}

	public void setAllergies(String allergies) {
		this.allergies = allergies;
	}

	public String getTraitementsEnCours() {
		return traitementsEnCours;
	}

	public void setTraitementsEnCours(String traitementsEnCours) {
		this.traitementsEnCours = traitementsEnCours;
	}

	public Float getTension() {
		return tension;
	}

	public void setTension(Float tension) {
		this.tension = tension;
	}

	public String getGroupeSanguin() {
		return groupeSanguin;
	}

	public void setGroupeSanguin(String groupeSanguin) {
		this.groupeSanguin = groupeSanguin;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}
    
    
    
}