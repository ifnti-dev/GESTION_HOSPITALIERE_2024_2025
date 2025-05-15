package com.gestion_hospitaliere.UeEntreprise.model.Pharmacy;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Approvisionnement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate date;
    private String factureNumero;
    
    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;
    
    @OneToMany(mappedBy = "approvisionnement", cascade = CascadeType.ALL)
    private List<LigneApprovisionnement> lignes = new ArrayList<>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public String getFactureNumero() {
		return factureNumero;
	}

	public void setFactureNumero(String factureNumero) {
		this.factureNumero = factureNumero;
	}

	public Fournisseur getFournisseur() {
		return fournisseur;
	}

	public void setFournisseur(Fournisseur fournisseur) {
		this.fournisseur = fournisseur;
	}

	public List<LigneApprovisionnement> getLignes() {
		return lignes;
	}

	public void setLignes(List<LigneApprovisionnement> lignes) {
		this.lignes = lignes;
	}
    
    
}
