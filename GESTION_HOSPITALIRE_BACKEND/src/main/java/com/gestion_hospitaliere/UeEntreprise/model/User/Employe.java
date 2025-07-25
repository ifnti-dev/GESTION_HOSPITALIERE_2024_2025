package com.gestion_hospitaliere.UeEntreprise.model.User;

import java.time.LocalDate;
import java.util.ArrayList;
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
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter 
@Setter 
@NoArgsConstructor
@Entity
@Table(indexes = {
    @Index(name = "idx_num_ordre", columnList = "numOrdre"),
    @Index(name = "idx_specialite", columnList = "specialite")
})
public class Employe extends Auditable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "L'horaire ne peut pas être vide.")
	@Pattern(regexp = HEURE_PLAGE, message = "L'horaire doit être au format HH:mm-HH:mm.")
	private String horaire;

	@NotNull
	@PastOrPresent(message = "La date d'affectation doit être dans le passé ou le présent.")
	private LocalDate dateAffectation;

	@NotBlank(message = "La spécialité ne peut pas être vide.")
	@Pattern(regexp = LETTRES_SEULEMENT, message = "La spécialité doit contenir entre 3 et 50 caractères alphanumériques.")
	private String specialite;

	@NotBlank(message = "Le numéro d'ordre ne peut pas être vide.")
	@Pattern(regexp = NUM_ORDRE, message = "Le numéro d'ordre peut contenir des lettres et des chiffres.")
	@Column(unique = true)
	private String numOrdre;

	
	@ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "employe_roles",
        joinColumns = @JoinColumn(name = "employe_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
	
	@OneToOne
    @JoinColumn(name = "personne_id", referencedColumnName = "id")
    private Personne personne;

	
	@OneToMany(mappedBy = "employe", cascade = CascadeType.ALL)
	@JsonIgnore  // Ignore dans le JSON
    private List<Accouchement> accouchements = new ArrayList<>();
	 
	@OneToMany(mappedBy = "employe", cascade = CascadeType.ALL)
	@JsonIgnore // Pour éviter la récursivité JSON
	private List<SuiviGrossesse> suivisGrossesse = new ArrayList<>();

	@OneToMany(mappedBy = "employe")
	@JsonIgnore // Pour éviter la récursivité JSON
    private List<Facture> factures = new ArrayList<>();
	
	



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
		return horaire;
	}
	public void setHoraire(String horaire) {
		this.horaire = horaire;
	}
	public LocalDate getDateAffectation() {
		return dateAffectation;
	}
	
	public void setDateAffectation(LocalDate dateAffectation) {
		this.dateAffectation = dateAffectation;
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

	public void addRole(Role role) {
		this.roles.add(role);
	}

	public void removeRole(Role role) {
		this.roles.remove(role);
	}

	@Override
	public String toString() {
		return "Employe{id=" + id + ", numOrdre='" + numOrdre + "'}";
	}
}
