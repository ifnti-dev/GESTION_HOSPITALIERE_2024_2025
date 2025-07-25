// package com.gestion_hospitaliere.UeEntreprise.model.User;



// import java.util.ArrayList;
// import java.util.List;

// import com.fasterxml.jackson.annotation.JsonIgnore;
// import com.gestion_hospitaliere.UeEntreprise.model.Appointments.RendezVous;

// import com.gestion_hospitaliere.UeEntreprise.model.Employe.Employe;
// import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
// import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierMedical;

// import jakarta.persistence.CascadeType;
// import jakarta.persistence.Entity;
// import jakarta.persistence.FetchType;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.OneToMany;
// import jakarta.persistence.OneToOne;

// @Entity
// public class Personne {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @OneToOne(mappedBy = "personne", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//     private Employe employe;

// 	@OneToMany(mappedBy = "personne", cascade = CascadeType.ALL)
// 	@JsonIgnore  // Ignore dans le JSON
// 	private List<DossierGrossesse> dossierGrossesse; 

// 	@OneToOne(mappedBy = "personne", cascade = CascadeType.ALL, orphanRemoval = true)	
// 	@JsonIgnore  // Ignore dans le JSON
//     private DossierMedical dossierMedical;
    

//     private String nom;
//     private String prenom;
//     private String email;
//     private String adresse;
//     private String telephone;
//     private String sexe;
//     private String dateNaissance;
//     private String situationMatrimoniale;
//     private String password;

// 	@OneToMany(mappedBy = "personne", cascade = CascadeType.ALL)
// 	@JsonIgnore  // Ignore dans le JSON
//     private List<RendezVous> rendezVous = new ArrayList<>();
    
    
//     // Getter et Setter
//     public Employe getEmploye() {
//         return employe;
//     }

//     public void setEmploye(Employe employe) {
//         this.employe = employe;
//     }
// 	public Long getId() {
// 		return id;
// 	}
// 	public void setId(Long id) {
// 		this.id = id;
// 	}
// 	public String getNom() {
// 		return nom;
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
// 	public String getEmail() {
// 		return email;
// 	}
// 	public void setEmail(String email) {
// 		this.email = email;
// 	}
// 	public String getAdresse() {
// 		return adresse;
// 	}
// 	public void setAdresse(String adresse) {
// 		this.adresse = adresse;
// 	}
// 	public String getTelephone() {
// 		return telephone;
// 	}
// 	public void setTelephone(String telephone) {
// 		this.telephone = telephone;
// 	}
// 	public String getSexe() {
// 		return sexe;
// 	}
// 	public void setSexe(String sexe) {
// 		this.sexe = sexe;
// 	}
// 	public String getDateNaissance() {
// 		return dateNaissance;
// 	}
// 	public void setDateNaissance(String dateNaissance) {
// 		this.dateNaissance = dateNaissance;
// 	}
// 	public String getSituationMatrimoniale() {
// 		return situationMatrimoniale;
// 	}
// 	public void setSituationMatrimoniale(String situationMatrimoniale) {
// 		this.situationMatrimoniale = situationMatrimoniale;
// 	}
// 	public String getPassword() {
// 		return password;
// 	}
// 	public void setPassword(String password) {
// 		this.password = password;
// 	}

// 	public List<RendezVous> getRendezVous() {
// 		return rendezVous;
// 	}

// 	public void setRendezVous(List<RendezVous> rendezVous) {
// 		this.rendezVous = rendezVous;
// 	}
    

// 	public List<DossierGrossesse> getDossierGrossesse() {
// 		return dossierGrossesse;
// 	}

// 	public void setDossierGrossesse(List<DossierGrossesse> dossierGrossesse) {
// 		this.dossierGrossesse = dossierGrossesse;
// 	}

// 	public DossierMedical getDossierMedical() {
// 		return dossierMedical;
// 	}

// 	 public void setDossierMedical(DossierMedical dossierMedical) {
// 		this.dossierMedical = dossierMedical;
// 	}
// }



package com.gestion_hospitaliere.UeEntreprise.model.User;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.model.Appointments.RendezVous;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.SuiviEtat;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierMedical;
import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.Accouchement;
import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.SuiviGrossesse;

import jakarta.persistence.*;

@Table(name = "personne")
@Entity
public class Personne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;
    private String adresse;
    private String telephone;
    private String sexe;
    private String dateNaissance;
    private String situationMatrimoniale;
    @Column(nullable = true) 
    private String password;
    
    @OneToOne(mappedBy = "personne", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Employe employe;

    @OneToOne(mappedBy = "personne", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private DossierMedical dossierMedical;

    @OneToMany(mappedBy = "personne", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<DossierGrossesse> dossierGrossesse;

    @OneToMany(mappedBy = "personne", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<RendezVous> rendezVous = new ArrayList<>();

    

    @OneToMany(mappedBy = "personne", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<SuiviEtat> suiviEtat = new ArrayList<>();

    @OneToMany(mappedBy = "personne", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<SuiviGrossesse> suiviGrossesse = new ArrayList<>();

    

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    public String getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(String dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getSituationMatrimoniale() {
        return situationMatrimoniale;
    }

    public void setSituationMatrimoniale(String situationMatrimoniale) {
        this.situationMatrimoniale = situationMatrimoniale;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Employe getEmploye() {
        return employe;
    }

    public void setEmploye(Employe employe) {
        this.employe = employe;
    }

    public DossierMedical getDossierMedical() {
        return dossierMedical;
    }

    public void setDossierMedical(DossierMedical dossierMedical) {
        this.dossierMedical = dossierMedical;
    }

    public List<DossierGrossesse> getDossierGrossesse() {
        return dossierGrossesse;
    }

    public void setDossierGrossesse(List<DossierGrossesse> dossierGrossesse) {
        this.dossierGrossesse = dossierGrossesse;
    }

    public List<RendezVous> getRendezVous() {
        return rendezVous;
    }

    public void setRendezVous(List<RendezVous> rendezVous) {
        this.rendezVous = rendezVous;
    }

    

    public List<SuiviEtat> getSuiviEtat() {
        return suiviEtat;
    }

    public void setSuiviEtat(List<SuiviEtat> suiviEtat) {
        this.suiviEtat = suiviEtat;
    }

    public List<SuiviGrossesse> getSuiviGrossesse() {
        return suiviGrossesse;
    }

    public void setSuiviGrossesse(List<SuiviGrossesse> suiviGrossesse) {
        this.suiviGrossesse = suiviGrossesse;
    }

   
}
