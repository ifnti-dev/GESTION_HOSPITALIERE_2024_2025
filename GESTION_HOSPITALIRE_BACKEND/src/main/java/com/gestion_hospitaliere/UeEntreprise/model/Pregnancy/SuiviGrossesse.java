package com.gestion_hospitaliere.UeEntreprise.model.Pregnancy;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
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
public class SuiviGrossesse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String trimestre;
    private Float tension;
    private Float poids;
    private String remarque;


	@ManyToOne
@JoinColumn(name = "personne_id")
private Personne personne;

	@ManyToOne
	@JoinColumn(name = "employe_id")
	private Employe employe;

    
    public Employe getEmploye() {
		return employe;
	}

	public void setEmploye(Employe employe) {
		this.employe = employe;
	}

	@ManyToOne
    @JoinColumn(name = "dossier_grossesse_id")
    private DossierGrossesse dossierGrossesse;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTrimestre() {
		return trimestre;
	}

	public void setTrimestre(String trimestre) {
		this.trimestre = trimestre;
	}

	public Float getTension() {
		return tension;
	}

	public void setTension(Float tension) {
		this.tension = tension;
	}

	public Float getPoids() {
		return poids;
	}

	public void setPoids(Float poids) {
		this.poids = poids;
	}

	public String getRemarque() {
		return remarque;
	}

	public void setRemarque(String remarque) {
		this.remarque = remarque;
	}

	public DossierGrossesse getDossierGrossesse() {
		return dossierGrossesse;
	}

	public void setDossierGrossesse(DossierGrossesse dossierGrossesse) {
		this.dossierGrossesse = dossierGrossesse;
	}
  
}