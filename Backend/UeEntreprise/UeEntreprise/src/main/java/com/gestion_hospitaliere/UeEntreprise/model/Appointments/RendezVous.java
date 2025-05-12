package com.gestion_hospitaliere.UeEntreprise.model.Appointments;

import java.time.LocalDateTime;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Medecin;
import com.gestion_hospitaliere.UeEntreprise.model.Employe.SageFemme;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class RendezVous {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDateTime dateHeure;
    private String type;
    private String statut;
    private String notes;
    
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;
    
    @ManyToOne
    @JoinColumn(name = "sagefemme_id")
    private SageFemme sageFemme;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDateTime getDateHeure() {
		return dateHeure;
	}

	public void setDateHeure(LocalDateTime dateHeure) {
		this.dateHeure = dateHeure;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getStatut() {
		return statut;
	}

	public void setStatut(String statut) {
		this.statut = statut;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public Medecin getMedecin() {
		return medecin;
	}

	public void setMedecin(Medecin medecin) {
		this.medecin = medecin;
	}

	public SageFemme getSageFemme() {
		return sageFemme;
	}

	public void setSageFemme(SageFemme sageFemme) {
		this.sageFemme = sageFemme;
	}
    
    // Getters and setters
    
}
