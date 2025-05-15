package com.gestion_hospitaliere.UeEntreprise.model.Pharmacy;

import java.time.LocalDate;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;


@Entity
public class AlerteRupture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate dateAlerte;
    private String message;
    private Boolean estFrelate;
    
    @ManyToOne
    @JoinColumn(name = "medicament_id")
    private Medicament medicament;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDate getDateAlerte() {
		return dateAlerte;
	}

	public void setDateAlerte(LocalDate dateAlerte) {
		this.dateAlerte = dateAlerte;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Boolean getEstFrelate() {
		return estFrelate;
	}

	public void setEstFrelate(Boolean estFrelate) {
		this.estFrelate = estFrelate;
	}

	public Medicament getMedicament() {
		return medicament;
	}

	public void setMedicament(Medicament medicament) {
		this.medicament = medicament;
	}    
    
}