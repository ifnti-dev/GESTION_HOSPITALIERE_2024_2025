package com.gestion_hospitaliere.UeEntreprise.model.HospitalisationService;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Hospitalisation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String lit;
    private LocalDate dateEntree;
    private LocalDate dateSortie;
    
    @ManyToOne
    @JoinColumn(name = "patient_id")
    @JsonIgnore  // Evite la sérialisation de la relation pour éviter la récursivité
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "service_id")
    @JsonIgnore  // Evite la sérialisation de la relation pour éviter la récursivité
    private ServiceHopital service;

    // Getters and setters
    // Note: Le getter pour 'id' manque, il est généralement utile de l'avoir.
	public void setId(Long id) {
		this.id = id;
	}

	public String getLit() {
		return lit;
	}

	public void setLit(String lit) {
		this.lit = lit;
	}

	public LocalDate getDateEntree() {
		return dateEntree;
	}

	public void setDateEntree(LocalDate dateEntree) {
		this.dateEntree = dateEntree;
	}

	public LocalDate getDateSortie() {
		return dateSortie;
	}

	public void setDateSortie(LocalDate dateSortie) {
		this.dateSortie = dateSortie;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public ServiceHopital getService() {
		return service;
	}

	public void setService(ServiceHopital service) {
		this.service = service;
	}

    // Il est généralement bon d'avoir un getter pour l'ID également
    public Long getId() {
        return id;
    }
}
