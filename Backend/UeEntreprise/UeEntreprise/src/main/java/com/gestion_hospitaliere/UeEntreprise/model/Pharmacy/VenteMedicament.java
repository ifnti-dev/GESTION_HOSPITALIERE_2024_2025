package com.gestion_hospitaliere.UeEntreprise.model.Pharmacy;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Caissier;
import com.gestion_hospitaliere.UeEntreprise.model.Employe.Pharmacien;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class VenteMedicament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate dateVente;
    private Integer quantite;
    private Double montantTotal;
    
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "caissier_id")
    private Caissier caissier;
    
    @ManyToOne
    @JoinColumn(name = "pharmacien_id")
    private Pharmacien pharmacien;
    
    @OneToMany(mappedBy = "vente", cascade = CascadeType.ALL)
    private List<LigneVente> lignes = new ArrayList<>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDate getDateVente() {
		return dateVente;
	}

	public void setDateVente(LocalDate dateVente) {
		this.dateVente = dateVente;
	}

	public Integer getQuantite() {
		return quantite;
	}

	public void setQuantite(Integer quantite) {
		this.quantite = quantite;
	}

	public Double getMontantTotal() {
		return montantTotal;
	}

	public void setMontantTotal(Double montantTotal) {
		this.montantTotal = montantTotal;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public Caissier getCaissier() {
		return caissier;
	}

	public void setCaissier(Caissier caissier) {
		this.caissier = caissier;
	}

	public Pharmacien getPharmacien() {
		return pharmacien;
	}

	public void setPharmacien(Pharmacien pharmacien) {
		this.pharmacien = pharmacien;
	}

	public List<LigneVente> getLignes() {
		return lignes;
	}

	public void setLignes(List<LigneVente> lignes) {
		this.lignes = lignes;
	}    
    
}
