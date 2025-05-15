package com.gestion_hospitaliere.UeEntreprise.model.Pharmacy;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class RapportInventaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate dateGeneration;
    private String contenu;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public LocalDate getDateGeneration() {
		return dateGeneration;
	}
	public void setDateGeneration(LocalDate dateGeneration) {
		this.dateGeneration = dateGeneration;
	}
	public String getContenu() {
		return contenu;
	}
	public void setContenu(String contenu) {
		this.contenu = contenu;
	}
    
    
}
