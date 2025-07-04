package com.gestion_hospitaliere.UeEntreprise.model.pharmacy;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.persistence.GeneratedValue;


@Entity
public class Categorie {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique = true, nullable = false)
	@NotBlank(message="Le nom de la catégorie ne peut pas être vide")
	@Size(min=2, message="Le nom de la catégorie doit comporter au moins 2 caractères")
	private String nom;
	
	private String description;
	
	
	@OneToMany(mappedBy="categorie")
	@JsonIgnore
	private List<Medicament> medicaments;


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getNom() {
		return nom;
	}


	public void setNom(String nom) {
		this.nom = nom;
	}


	public String getDescription() {
		return description;
	}


	public void setDescription(String description) {
		this.description = description;
	}


	public List<Medicament> getMedicaments() {
		return medicaments;
	}


	public void setMedicaments(List<Medicament> medicaments) {
		this.medicaments = medicaments;
	}
	
	
	
}
