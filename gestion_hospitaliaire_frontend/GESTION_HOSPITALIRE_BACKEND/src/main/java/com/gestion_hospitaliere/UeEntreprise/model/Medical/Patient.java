// package com.gestion_hospitaliere.UeEntreprise.model.Medical;

// import java.time.LocalDate;
// import java.util.ArrayList;
// import java.util.List;

// import com.fasterxml.jackson.annotation.JsonIgnore;
// import com.gestion_hospitaliere.UeEntreprise.model.Appointments.RendezVous;
// import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
// import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.SuiviEtat;
// import com.gestion_hospitaliere.UeEntreprise.model.HospitalisationService.Hospitalisation;
// import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.VenteMedicament;

// import jakarta.persistence.CascadeType;
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.OneToMany;
// import jakarta.persistence.OneToOne;

// @Entity
// public class Patient {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
    
//     private String nom;
//     private String prenom;
//     private LocalDate dateNaissance;
//     private String sexe;
//     private String adresse;
    
// 	// @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)	
// 	// @JsonIgnore  // Ignore dans le JSON
//     // private DossierMedical dossierMedical;
    
    
	
		
   
//     @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
// 	@JsonIgnore  // Ignore dans le JSON
//     private List<Hospitalisation> hospitalisations = new ArrayList<>();
    
//     @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
// 	@JsonIgnore  // Ignore dans le JSON
//     private List<Consultation> consultations = new ArrayList<>();
    
//     @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
// 	@JsonIgnore  // Ignore dans le JSON
//     private List<SuiviEtat> suivisEtat = new ArrayList<>();
    
//     @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
// 	@JsonIgnore  // Ignore dans le JSON
//     private List<VenteMedicament> ventesMedicaments = new ArrayList<>();


//     // Getters and setters


// 	public String getNom() {
// 		return nom;
// 	}

// 	public Long getId() {
// 		return id;
// 	}

// 	public void setId(Long id) {
// 		this.id = id;
// 	}

// 	public void setNom(String nom) {
// 		this.nom = nom;
// 	}

// 	public String getPrenom() {
// 		return prenom;
// 	}

// 	public void setPrenom(String prenom) {
// 		this.prenom = prenom;
// 	}

// 	public LocalDate getDateNaissance() {
// 		return dateNaissance;
// 	}

// 	public void setDateNaissance(LocalDate dateNaissance) {
// 		this.dateNaissance = dateNaissance;
// 	}

// 	public String getSexe() {
// 		return sexe;
// 	}

// 	public void setSexe(String sexe) {
// 		this.sexe = sexe;
// 	}

// 	public String getAdresse() {
// 		return adresse;
// 	}

// 	public void setAdresse(String adresse) {
// 		this.adresse = adresse;
// 	}

// 	// public DossierMedical getDossierMedical() {
// 	// 	return dossierMedical;
// 	// }

// 	// public void setDossierMedical(DossierMedical dossierMedical) {
// 	// 	this.dossierMedical = dossierMedical;
// 	// 	if (dossierMedical != null) {
// 	// 		dossierMedical.setPatient(this);
// 	// 	}
// 	// }
	

	

// 	public List<Hospitalisation> getHospitalisations() {
// 		return hospitalisations;
// 	}

// 	public void setHospitalisations(List<Hospitalisation> hospitalisations) {
// 		this.hospitalisations = hospitalisations;
// 	}

// 	public List<Consultation> getConsultations() {
// 		return consultations;
// 	}

// 	public void setConsultations(List<Consultation> consultations) {
// 		this.consultations = consultations;
// 	}

// 	public List<SuiviEtat> getSuivisEtat() {
// 		return suivisEtat;
// 	}

// 	public void setSuivisEtat(List<SuiviEtat> suivisEtat) {
// 		this.suivisEtat = suivisEtat;
// 	}

// 	public List<VenteMedicament> getVentesMedicaments() {
// 		return ventesMedicaments;
// 	}

// 	public void setVentesMedicaments(List<VenteMedicament> ventesMedicaments) {
// 		this.ventesMedicaments = ventesMedicaments;
// 	}
    
    
    
    
    
    
    
    
    
// }