package com.gestion_hospitaliere.UeEntreprise.model.pharmacy;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Reference {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique = true, nullable = false)
	private String nom;
	private String description;

	
	@OneToMany(mappedBy="reference")
	@JsonIgnore
	private List<MedicamentReference> medicamentReferences;


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

	public List<MedicamentReference> getMedicamentReferences() {
		return medicamentReferences;
	}

	public void setMedicamentReferences(List<MedicamentReference> medicamentReferences) {
		this.medicamentReferences = medicamentReferences;
	}

	
	
}
