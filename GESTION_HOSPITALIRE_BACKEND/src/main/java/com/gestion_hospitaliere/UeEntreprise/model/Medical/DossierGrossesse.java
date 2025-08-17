package com.gestion_hospitaliere.UeEntreprise.model.Medical;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.controller.ConsultationTraitement.ConsultationPrenataleController;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.ConsultationPrenatale;
import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.Accouchement;
import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.SuiviGrossesse;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;


@Entity
public class DossierGrossesse extends Dossier {
    
    // Informations partenaire (statiques)
    private String nomPartenaire;
    private String prenomsPartenaire;
    private String professionPartenaire;
    private String adressePartenaire;

    // Antécédents détaillés (statiques)
    private String antecedentsMedicaux;
    private String antecedentsChirurgicaux;
    private String antecedentsGynecologiques;
    private String antecedentsObstetricaux;

    // Dates clés (statiques)
    private LocalDate dateOuverture;
    private LocalDate dateDerniereRegle;
    private LocalDate datePrevueAccouchement;
    
	private Integer nombreGrossesses;       // Grossesses totales
    private Integer nombreAccouchements;    // Accouchements antérieurs

    // Sérologies (statiques après 1er trimestre)
    private String statutSerologieRubeole;
    private String statutSerologieToxo;
    private String statutSerologieHepatiteB;
    private String statutSerologieHiv;
    private String statutSerologieSyphilis;

    // Relations
    @ManyToOne
	@JoinColumn(name = "personne_id", referencedColumnName = "id", nullable = true) // Important: nullable=true
	private Personne personne;
    
    @OneToMany(mappedBy = "dossierGrossesse", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore  // Ignore dans le JSON
	private List<SuiviGrossesse> suivisGrossesse = new ArrayList<>();


	@OneToMany(mappedBy = "dossierGrossesse", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore  // Ignore dans le JSON
	private List<Accouchement> accouchements = new ArrayList<>();

    @OneToMany(mappedBy = "dossierGrossesse") // ← Correction du nom    
	@JsonIgnore
    private List<ConsultationPrenatale> consultationPrenatale = new ArrayList<>();

    public String getNomPartenaire() {
		return nomPartenaire;
	}

	public void setNomPartenaire(String nomPartenaire) {
		this.nomPartenaire = nomPartenaire;
	}

	public String getPrenomsPartenaire() {
		return prenomsPartenaire;
	}

	public void setPrenomsPartenaire(String prenomsPartenaire) {
		this.prenomsPartenaire = prenomsPartenaire;
	}

	public String getProfessionPartenaire() {
		return professionPartenaire;
	}

	public void setProfessionPartenaire(String professionPartenaire) {
		this.professionPartenaire = professionPartenaire;
	}

	public String getAdressePartenaire() {
		return adressePartenaire;
	}

	public void setAdressePartenaire(String adressePartenaire) {
		this.adressePartenaire = adressePartenaire;
	}

	public String getAntecedentsMedicaux() {
		return antecedentsMedicaux;
	}

	public void setAntecedentsMedicaux(String antecedentsMedicaux) {
		this.antecedentsMedicaux = antecedentsMedicaux;
	}

	public String getAntecedentsChirurgicaux() {
		return antecedentsChirurgicaux;
	}

	public void setAntecedentsChirurgicaux(String antecedentsChirurgicaux) {
		this.antecedentsChirurgicaux = antecedentsChirurgicaux;
	}

	public String getAntecedentsGynecologiques() {
		return antecedentsGynecologiques;
	}

	public void setAntecedentsGynecologiques(String antecedentsGynecologiques) {
		this.antecedentsGynecologiques = antecedentsGynecologiques;
	}

	public String getAntecedentsObstetricaux() {
		return antecedentsObstetricaux;
	}

	public void setAntecedentsObstetricaux(String antecedentsObstetricaux) {
		this.antecedentsObstetricaux = antecedentsObstetricaux;
	}

	public LocalDate getDateOuverture() {
		return dateOuverture;
	}

	public void setDateOuverture(LocalDate dateOuverture) {
		this.dateOuverture = dateOuverture;
	}

	public LocalDate getDateDerniereRegle() {
		return dateDerniereRegle;
	}

	public void setDateDerniereRegle(LocalDate dateDerniereRegle) {
		this.dateDerniereRegle = dateDerniereRegle;
	}

	public LocalDate getDatePrevueAccouchement() {
		return datePrevueAccouchement;
	}

	public void setDatePrevueAccouchement(LocalDate datePrevueAccouchement) {
		this.datePrevueAccouchement = datePrevueAccouchement;
	}

	public Integer getNombreGrossesses() {
		return nombreGrossesses;
	}

	public void setNombreGrossesses(Integer nombreGrossesses) {
		this.nombreGrossesses = nombreGrossesses;
	}

	public Integer getNombreAccouchements() {
		return nombreAccouchements;
	}

	public void setNombreAccouchements(Integer nombreAccouchements) {
		this.nombreAccouchements = nombreAccouchements;
	}

	public String getStatutSerologieRubeole() {
		return statutSerologieRubeole;
	}

	public void setStatutSerologieRubeole(String statutSerologieRubeole) {
		this.statutSerologieRubeole = statutSerologieRubeole;
	}

	public String getStatutSerologieToxo() {
		return statutSerologieToxo;
	}

	public void setStatutSerologieToxo(String statutSerologieToxo) {
		this.statutSerologieToxo = statutSerologieToxo;
	}

	public String getStatutSerologieHepatiteB() {
		return statutSerologieHepatiteB;
	}

	public void setStatutSerologieHepatiteB(String statutSerologieHepatiteB) {
		this.statutSerologieHepatiteB = statutSerologieHepatiteB;
	}

	public String getStatutSerologieHiv() {
		return statutSerologieHiv;
	}

	public void setStatutSerologieHiv(String statutSerologieHiv) {
		this.statutSerologieHiv = statutSerologieHiv;
	}

	public String getStatutSerologieSyphilis() {
		return statutSerologieSyphilis;
	}

	public void setStatutSerologieSyphilis(String statutSerologieSyphilis) {
		this.statutSerologieSyphilis = statutSerologieSyphilis;
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

	public List<Accouchement> getAccouchements() {
		return accouchements;
	}

	public void setAccouchements(List<Accouchement> accouchements) {
		this.accouchements = accouchements;
	}

	public List<ConsultationPrenatale> getConsultationPrenatale() {
		return consultationPrenatale;
	}

	public void setConsultationPrenatale(List<ConsultationPrenatale> consultationPrenatale) {
		this.consultationPrenatale = consultationPrenatale;
	}

}