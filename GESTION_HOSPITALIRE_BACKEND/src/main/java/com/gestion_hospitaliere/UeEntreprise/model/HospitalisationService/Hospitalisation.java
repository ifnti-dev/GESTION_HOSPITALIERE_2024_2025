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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
// import jakarta.validation.Valid; // Décommentez si Patient et ServiceHopital ont leurs propres validations


@Entity
public class Hospitalisation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le numéro de lit ne peut pas être vide.")
    private String lit;

    @NotNull(message = "La date d'entrée ne peut pas être nulle.")
    private LocalDate dateEntree;

    // dateSortie peut être nulle si le patient est toujours hospitalisé.
    // Si elle est présente, dateSortie devrait être postérieure à dateEntree (ceci nécessiterait une validation personnalisée ou au niveau du service).
    private LocalDate dateSortie;
    
    @NotNull(message = "Le patient ne peut pas être nul pour une hospitalisation.")
    // @Valid // Décommentez si la classe Patient a ses propres annotations de validation à vérifier
    @ManyToOne
    @JoinColumn(name = "patient_id")
	//@JsonIgnore
    private Patient patient;
    
    @NotNull(message = "Le service ne peut pas être nul pour une hospitalisation.")
    // @Valid // Décommentez si la classe ServiceHopital a ses propres annotations de validation à vérifier
    @ManyToOne
    @JoinColumn(name = "service_id")
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