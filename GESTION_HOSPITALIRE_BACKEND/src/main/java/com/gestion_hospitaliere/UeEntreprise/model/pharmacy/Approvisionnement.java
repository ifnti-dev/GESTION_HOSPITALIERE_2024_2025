package com.gestion_hospitaliere.UeEntreprise.model.pharmacy;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;

@Entity
public class Approvisionnement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateAppro;
    private String fournisseur;

    @ManyToOne
    @JoinColumn(name = "employe_id")
    @JsonIgnore
    private Employe employe;

    @OneToMany(mappedBy = "approvisionnement")
    @JsonIgnore
    private List<LigneApprovisionnement> lignesApprovisionnement;
    
    @PrePersist
    protected void onCreate() {
        this.dateAppro = LocalDateTime.now(); // Initialisation automatique
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDateTime getDateAppro() {
		return dateAppro;
	}

	public void setDateAppro(LocalDateTime dateAppro) {
		this.dateAppro = dateAppro;
	}

	public String getFournisseur() {
		return fournisseur;
	}

	public void setFournisseur(String fournisseur) {
		this.fournisseur = fournisseur;
	}

	public Employe getEmploye() {
		return employe;
	}

	public void setEmploye(Employe employe) {
		this.employe = employe;
	}

	public List<LigneApprovisionnement> getLignesApprovisionnement() {
		return lignesApprovisionnement;
	}

	public void setLignesApprovisionnement(List<LigneApprovisionnement> lignesApprovisionnement) {
		this.lignesApprovisionnement = lignesApprovisionnement;
	}
    
    
    
}