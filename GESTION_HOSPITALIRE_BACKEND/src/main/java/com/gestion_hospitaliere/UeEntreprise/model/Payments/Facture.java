package com.gestion_hospitaliere.UeEntreprise.model.Payments;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.model.Employe.Employe;

import jakarta.persistence.CascadeType;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
@Entity
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String type;
    private Double montantTotal;
    private String statut;
    private LocalDate date;
    
    @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL)
	@JsonIgnore
    private List<Paiement> paiements = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "caissier_id")
    private Employe caissier;

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
    // Getters and setters

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Double getMontantTotal() {
		return montantTotal;
	}

	public void setMontantTotal(Double montantTotal) {
		this.montantTotal = montantTotal;
	}

	public String getStatut() {
		return statut;
	}

	public void setStatut(String statut) {
		this.statut = statut;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public List<Paiement> getPaiements() {
		return paiements;
	}

	public void setPaiements(List<Paiement> paiements) {
		this.paiements = paiements;
	}

	public Employe getCaissier() {
		return caissier;
	}

	public void setCaissier(Employe caissier) {
		this.caissier = caissier;
	}
    
    
    
}
