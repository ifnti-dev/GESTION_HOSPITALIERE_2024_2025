package com.gestion_hospitaliere.UeEntreprise.model.pharmacy;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class LigneApprovisionnement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantite;
    private Integer prixUnitaireAchat;
    private Integer prixUnitaireVente;
    private LocalDate dateReception;
    private LocalDate dateExpiration;
    private String numeroLot;

    @ManyToOne
    @JoinColumn(name = "approvisionnement_id")
    @JsonIgnore
    private Approvisionnement approvisionnement;
    
    @ManyToOne
    @JoinColumn(name="medicamentReference_id")
    @JsonIgnore
    private MedicamentReference medicamentReference;

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

	
	
	public Integer getPrixUnitaireAchat() {
		return prixUnitaireAchat;
	}

	public void setPrixUnitaireAchat(Integer prixUnitaireAchat) {
		this.prixUnitaireAchat = prixUnitaireAchat;
	}

	public Integer getPrixUnitaireVente() {
		return prixUnitaireVente;
	}

	public void setPrixUnitaireVente(Integer prixUnitaireVente) {
		this.prixUnitaireVente = prixUnitaireVente;
	}

	public LocalDate getDateReception() {
		return dateReception;
	}

	public void setDateReception(LocalDate dateReception) {
		this.dateReception = dateReception;
	}

	public LocalDate getDateExpiration() {
		return dateExpiration;
	}

	public void setDateExpiration(LocalDate dateExpiration) {
		this.dateExpiration = dateExpiration;
	}

	public String getNumeroLot() {
		return numeroLot;
	}

	public void setNumeroLot(String numeroLot) {
		this.numeroLot = numeroLot;
	}

	public Approvisionnement getApprovisionnement() {
		return approvisionnement;
	}

	public void setApprovisionnement(Approvisionnement approvisionnement) {
		this.approvisionnement = approvisionnement;
	}

	public MedicamentReference getMedicamentReference() {
		return medicamentReference;
	}

	public void setMedicamentReference(MedicamentReference medicamentReference) {
		this.medicamentReference = medicamentReference;
	}

	
    
    
    
}
