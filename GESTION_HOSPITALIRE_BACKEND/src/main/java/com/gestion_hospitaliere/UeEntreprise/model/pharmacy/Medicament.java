package com.gestion_hospitaliere.UeEntreprise.model.pharmacy;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Medicament {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	private String nom;
	private String description;
	private Integer stockTotal;
	
	
	@ManyToOne
	@JoinColumn(name="categorie_id")
	@JsonIgnore
	private Categorie categorie;
	
	
	@OneToMany(mappedBy="medicament")
//	@JsonIgnore
	private List<MedicamentReference> medicamentsReference;


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

	public Integer getStockTotal() {
		return stockTotal;
	}

	public void setStockTotal(Integer stockTotal) {
		this.stockTotal = stockTotal;
	}

	public Categorie getCategorie() {
		return categorie;
	}

	public void setCategorie(Categorie categorie) {
		this.categorie = categorie;
	}

	public List<MedicamentReference> getMedicamentReferences() {
		return medicamentsReference;
	}

	public void setMedicamentReferences(List<MedicamentReference> medicamentReferences) {
		this.medicamentsReference = medicamentReferences;
	}


	
	
	
	
	
	
	
	
}
