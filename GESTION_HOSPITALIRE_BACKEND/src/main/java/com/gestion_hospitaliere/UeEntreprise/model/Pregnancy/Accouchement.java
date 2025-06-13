package com.gestion_hospitaliere.UeEntreprise.model.Pregnancy;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.model.Employe.Employe;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Accouchement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate date;
    private String type;
    private String complications;
    private Float bebePoids;
    
    @ManyToOne
    @JoinColumn(name = "employe_id")
    private Employe employe;
    
    @ManyToOne

    @JoinColumn(name = "dossier_grossesse_id")
	
    private DossierGrossesse dossierGrossesse;

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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getComplications() {
		return complications;
	}

	public void setComplications(String complications) {
		this.complications = complications;
	}

	public Float getBebePoids() {
		return bebePoids;
	}

	public void setBebePoids(Float bebePoids) {
		this.bebePoids = bebePoids;
	}

	public Employe getEmploye() {
		return employe;
	}

	public void setEmploye(Employe employe) {
		this.employe = employe;
	}


	public DossierGrossesse getDossierGrossesse() {
		return dossierGrossesse;
	}

	public void setDossierGrossesse(DossierGrossesse dossierGrossesse) {
		this.dossierGrossesse = dossierGrossesse;
	}
    
}