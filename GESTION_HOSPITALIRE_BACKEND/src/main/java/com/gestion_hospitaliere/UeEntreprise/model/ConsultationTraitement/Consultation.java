package com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate date;
    private String symptomes;
    private String diagnostic;
    
    @OneToMany(mappedBy = "consultation", cascade = CascadeType.ALL)

	@JsonIgnore

    private List<Prescription> prescriptions = new ArrayList<>();
    
    
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

	public String getSymptomes() {
		return symptomes;
	}

	public void setSymptomes(String symptomes) {
		this.symptomes = symptomes;
	}

	public String getDiagnostic() {
		return diagnostic;
	}

	public void setDiagnostic(String diagnostic) {
		this.diagnostic = diagnostic;
	}

	public List<Prescription> getPrescriptions() {
		return prescriptions;
	}

	public void setPrescriptions(List<Prescription> prescriptions) {
		this.prescriptions = prescriptions;
	}

	public Personne getPersonne() {
		return personne;
	}

	public void setPersonne(Personne personne) {
		this.personne = personne;
	}

}