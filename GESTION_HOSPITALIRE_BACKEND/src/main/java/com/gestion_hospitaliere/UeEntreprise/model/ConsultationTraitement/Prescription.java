package com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.Medicament;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Integer quantite;
    private String posologie;
    private Integer duree;
    
    @ManyToOne
    @JoinColumn(name = "consultation_id")
	@JsonBackReference
    private Consultation consultation;
    
    @ManyToOne
    @JoinColumn(name = "medicament_id")
	
    private Medicament medicament;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getQuantite() {
		return quantite;
	}

	public void setQuantite(Integer quantite) {
		this.quantite = quantite;
	}

	public String getPosologie() {
		return posologie;
	}

	public void setPosologie(String posologie) {
		this.posologie = posologie;
	}

	public Integer getDuree() {
		return duree;
	}

	public void setDuree(Integer duree) {
		this.duree = duree;
	}

	public Consultation getConsultation() {
		return consultation;
	}

	public void setConsultation(Consultation consultation) {
		this.consultation = consultation;
	}

	public Medicament getMedicament() {
		return medicament;
	}

	public void setMedicament(Medicament medicament) {
		this.medicament = medicament;
	}
    
    // Getters and setters
    
    
}