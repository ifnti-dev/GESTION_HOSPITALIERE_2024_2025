package com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement;

import java.time.LocalDate;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class SuiviEtat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate date;
    private Integer temperature;
    private Float tension;
    private String observations;
    
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public Integer getTemperature() {
		return temperature;
	}

	public void setTemperature(Integer temperature) {
		this.temperature = temperature;
	}

	public Float getTension() {
		return tension;
	}

	public void setTension(Float tension) {
		this.tension = tension;
	}

	public String getObservations() {
		return observations;
	}

	public void setObservations(String observations) {
		this.observations = observations;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}
    
    // Getters and setters
    
    
    
}