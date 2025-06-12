package com.gestion_hospitaliere.UeEntreprise.model.Employe;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.model.User.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.UniqueConstraint;


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
    @JoinColumn(name = "personne_id",unique = true)
	@JsonBackReference
    private Personne personne;
	
	
	private String Horaire;
	private Date DateAffectation;
	private String specialite;
	@Column(unique = true)
	private String numOrdre;
	
	
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
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
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
	
}
