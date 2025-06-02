package com.gestion_hospitaliere.UeEntreprise.model.Employe;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.gestion_hospitaliere.UeEntreprise.model.HospitalisationService.ServiceHopital;
import com.gestion_hospitaliere.UeEntreprise.model.Payments.Caisse;
import com.gestion_hospitaliere.UeEntreprise.model.User.Utilisateur;

import jakarta.annotation.Generated;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
@Entity
public class Caissier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateDebutAffectation;
    private String horairesTravail;
    private Boolean actif;

    @OneToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @OneToMany(mappedBy = "caissier", cascade = CascadeType.ALL)
    private List<Caisse> caisses = new ArrayList<>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDate getDateDebutAffectation() {
		return dateDebutAffectation;
	}

	public void setDateDebutAffectation(LocalDate dateDebutAffectation) {
		this.dateDebutAffectation = dateDebutAffectation;
	}

	public String getHorairesTravail() {
		return horairesTravail;
	}

	public void setHorairesTravail(String horairesTravail) {
		this.horairesTravail = horairesTravail;
	}

	public Boolean getActif() {
		return actif;
	}

	public void setActif(Boolean actif) {
		this.actif = actif;
	}

	public Utilisateur getUtilisateur() {
		return utilisateur;
	}

	public void setUtilisateur(Utilisateur utilisateur) {
		this.utilisateur = utilisateur;
	}

	public List<Caisse> getCaisses() {
		return caisses;
	}

	public void setCaisses(List<Caisse> caisses) {
		this.caisses = caisses;
	}

    
    
}
