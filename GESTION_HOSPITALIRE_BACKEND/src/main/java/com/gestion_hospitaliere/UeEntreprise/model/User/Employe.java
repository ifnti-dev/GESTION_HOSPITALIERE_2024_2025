package com.gestion_hospitaliere.UeEntreprise.model.User;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.model.Payments.Facture;
import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.Accouchement;
import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.SuiviGrossesse;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;


@Entity
public class Employe{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	@ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "personne_roles",
        joinColumns = @JoinColumn(name = "personne_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
	
	@OneToOne
    @JoinColumn(name = "personne_id")
    private Personne personne;
	
	@OneToMany(mappedBy = "employe", cascade = CascadeType.ALL)
	@JsonIgnore  // Ignore dans le JSON
    private List<Accouchement> accouchements = new ArrayList<>();
	 
	@OneToMany(mappedBy = "employe", cascade = CascadeType.ALL)
	@JsonIgnore // Pour éviter la récursivité JSON
	private List<SuiviGrossesse> suivisGrossesse = new ArrayList<>();

	@OneToMany(mappedBy = "employe")
	@JsonIgnore // Pour éviter la récursivité JSON
    private List<Facture> factures;
	
	
	private String Horaire;
	private Date DateAffectation;
	private String specialite;
	@Column(unique = true)
	private String numOrdre;


	public List<Accouchement> getAccouchements() {
		return accouchements;
	}
	public void setAccouchements(List<Accouchement> accouchements) {
		this.accouchements = accouchements;
	}
	
	
	public Set<Role> getRoles() {
		return roles;
	}
	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}
	public String getHoraire() {
		return Horaire;
	}
	public void setHoraire(String horaire) {
		Horaire = horaire;
	}
	public Date getDateAffectation() {
		return DateAffectation;
	}
	
	public void setDateAffectation(Date dateAffectation) {
		DateAffectation = dateAffectation;
	}
	public String getSpecialite() {
		return specialite;
	}
	public void setSpecialite(String specialite) {
		this.specialite = specialite;
	}
	public String getNumOrdre() {
		return numOrdre;
	}
	public void setNumOrdre(String numOrdre) {
		this.numOrdre = numOrdre;
	}
	public Personne getPersonne() {
		return personne;
	}
	public void setPersonne(Personne personne) {
		this.personne = personne;
	}

	public List<SuiviGrossesse> getSuivisGrossesse() {
		return suivisGrossesse;
	}
	public void setSuivisGrossesse(List<SuiviGrossesse> suivisGrossesse) {
		this.suivisGrossesse = suivisGrossesse;
	}
	public List<Facture> getFactures() {
		return factures;
	}
	public void setFactures(List<Facture> factures) {
		this.factures = factures;
	}
}
