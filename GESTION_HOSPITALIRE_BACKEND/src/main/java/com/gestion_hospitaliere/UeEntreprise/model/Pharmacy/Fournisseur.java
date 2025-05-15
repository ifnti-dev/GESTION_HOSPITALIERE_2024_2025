package com.gestion_hospitaliere.UeEntreprise.model.Pharmacy;

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
public class Fournisseur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String contact;
    
    @OneToMany(mappedBy = "fournisseur", cascade = CascadeType.ALL)
    private List<Approvisionnement> approvisionnements = new ArrayList<>();

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

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public List<Approvisionnement> getApprovisionnements() {
		return approvisionnements;
	}

	public void setApprovisionnements(List<Approvisionnement> approvisionnements) {
		this.approvisionnements = approvisionnements;
	}
    
}