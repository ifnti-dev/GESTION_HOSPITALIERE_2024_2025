package com.gestion_hospitaliere.UeEntreprise.model.User;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import static com.gestion_hospitaliere.UeEntreprise.Utilis.RegexConstants.*;

import com.gestion_hospitaliere.UeEntreprise.Utilis.Auditable;
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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;


@Entity
public class Employe extends Auditable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "L'horaire ne peut pas être vide.")
	@NotNull(message = "L'horaire ne peut pas être nul.")
	@Pattern(regexp = HEURE_PLAGE, message = "L'horaire doit être au format HH:mm-HH:mm.")
	private String Horaire;

	@NotNull(message = "La date d'affectation ne peut pas être nulle.")
	@Pattern(regexp = DATE, message = "La date d'affectation doit être au format YYYY-MM-DD.")
	@NotBlank(message = "La date d'affectation ne peut pas être vide.")
	private Date DateAffectation;

	@NotBlank(message = "La spécialité ne peut pas être vide.")
	@NotNull(message = "La spécialité ne peut pas être nulle.")
	@Pattern(regexp = LETTRES_SEULEMENT, message = "La spécialité doit contenir entre 3 et 50 caractères alphanumériques.")
	private String specialite;

	@NotBlank(message = "Le numéro d'ordre ne peut pas être vide.")
	@NotNull(message = "Le numéro d'ordre ne peut pas être nul.")
	@Pattern(regexp = NUM_ORDRE, message = "Le numéro d'ordre peut contenir des lettres et des chiffres.")
	@Column(unique = true)
	private String numOrdre;

	
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
	
	



	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}

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
