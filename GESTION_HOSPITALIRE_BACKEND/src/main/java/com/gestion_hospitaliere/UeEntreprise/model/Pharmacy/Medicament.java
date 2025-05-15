package com.gestion_hospitaliere.UeEntreprise.model.Pharmacy;

import java.util.ArrayList;
import java.util.List;


import com.fasterxml.jackson.annotation.JsonIgnore;


import jakarta.persistence.CascadeType;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String description;
    private String unite;
    private Integer seuilAlerte;
    private Boolean estActif;
    
    @ManyToOne
    @JoinColumn(name = "categorie_id")

	@JsonIgnore

    private CategorieMedicament categorie;
    
    @OneToMany(mappedBy = "medicament", cascade = CascadeType.ALL)
    private List<Reference> references = new ArrayList<>();
    
    @OneToMany(mappedBy = "medicament", cascade = CascadeType.ALL)
    private List<StockProduit> stocks = new ArrayList<>();

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

	public String getUnite() {
		return unite;
	}

	public void setUnite(String unite) {
		this.unite = unite;
	}

	public Integer getSeuilAlerte() {
		return seuilAlerte;
	}

	public void setSeuilAlerte(Integer seuilAlerte) {
		this.seuilAlerte = seuilAlerte;
	}

	public Boolean getEstActif() {
		return estActif;
	}

	public void setEstActif(Boolean estActif) {
		this.estActif = estActif;
	}

	public CategorieMedicament getCategorie() {
		return categorie;
	}

	public void setCategorie(CategorieMedicament categorie) {
		this.categorie = categorie;
	}

	public List<Reference> getReferences() {
		return references;
	}

	public void setReferences(List<Reference> references) {
		this.references = references;
	}

	public List<StockProduit> getStocks() {
		return stocks;
	}

	public void setStocks(List<StockProduit> stocks) {
		this.stocks = stocks;
	}    
    
}