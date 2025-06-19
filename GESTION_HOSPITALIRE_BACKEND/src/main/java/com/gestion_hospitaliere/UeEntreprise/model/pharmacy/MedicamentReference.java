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
public class MedicamentReference {
    @Id 
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

   private Integer quantite;

    @ManyToOne
    @JoinColumn(name="medicament_id")
    @JsonIgnore
    private Medicament medicament;

    @ManyToOne
    @JoinColumn(name="reference_id")
    @JsonIgnore
    private Reference reference;

    @OneToMany(mappedBy = "medicamentReference")
    @JsonIgnore
    private List<LigneApprovisionnement> lignesApprovisionnement;

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

	public Medicament getMedicament() {
		return medicament;
	}

	public void setMedicament(Medicament medicament) {
		this.medicament = medicament;
	}

	public Reference getReference() {
		return reference;
	}

	public void setReference(Reference reference) {
		this.reference = reference;
	}

	public List<LigneApprovisionnement> getLignesApprovisionnement() {
		return lignesApprovisionnement;
	}

	public void setLignesApprovisionnement(List<LigneApprovisionnement> lignesApprovisionnement) {
		this.lignesApprovisionnement = lignesApprovisionnement;
	}
    
    
}
