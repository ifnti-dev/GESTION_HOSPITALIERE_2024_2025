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

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import static com.gestion_hospitaliere.UeEntreprise.Utilis.RegexConstants.*;

import com.gestion_hospitaliere.UeEntreprise.Utilis.Auditable;
import com.gestion_hospitaliere.UeEntreprise.model.Appointments.RendezVous;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.SuiviEtat;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierMedical;
import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.Accouchement;
import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.SuiviGrossesse;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;

@Table(
    name = "personne",
    indexes = {
        @Index(name = "idx_email", columnList = "email", unique = true),
        @Index(name = "idx_telephone", columnList = "telephone", unique = true)
    })
@Entity
public class Personne extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire et doit être en lettre uniquement.")
    @Pattern(regexp = LETTRES_SEULEMENT, message = "Ce champ ne doit contenir que des lettres, des espaces, des tirets ou des apostrophes.")
    @Column(nullable = false, length = 50)
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire et doit être en lettre uniquement.")
    @Pattern(regexp = LETTRES_SEULEMENT, message = "Ce champ ne doit contenir que des lettres, des espaces, des tirets ou des apostrophes.")
    private String prenom;

    @NotBlank(message = "L'email est obligatoire et doit être au format valide.")
    @Email(message = "L'email doit être au format valide.")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "L'adresse est obligatoire.")
    @Pattern(regexp = ADRESSE, message = "Ce champ ne doit contenir que des lettres, des espaces, des tirets ou des apostrophes.")
    private String adresse;

    @NotBlank(message = "Le téléphone est obligatoire et doit être au format valide.")
    @Pattern(
        regexp = TELEPHONE,
        message = "Le téléphone doit être au format international (ex: +228XXXXXXXX)."
    )
    @Column(unique = true)
    private String telephone;

    @NotBlank(message = "Le sexe est obligatoire.")
    @Pattern(regexp = SEXE, message = "Le sexe doit être 'Homme', 'Femme', 'H', 'F' ou 'Autre'.")
    private String sexe;

    @NotNull(message = "La date de naissance est obligatoire.")
    @Past(message = "La date de naissance doit être dans le passé.")
    private LocalDate dateNaissance;

    @NotBlank(message = "La situation matrimoniale est obligatoire.")
    @Pattern(regexp = LETTRES_SEULEMENT, message = "La situation matrimoniale ne doit contenir que des lettres, des espaces, des tirets ou des apostrophes.")
    private String situationMatrimoniale;

    @NotBlank(message = "Le mot de passe est obligatoire.")
    @Pattern(
        regexp = MOT_DE_PASSE_FORT,
        message = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
    )
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
    private List<DossierGrossesse> dossierGrossesse = new ArrayList<>();

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

    public LocalDate getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
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



    public boolean isPatient() {
        return this.employe == null;
    }

    public boolean isEmploye() {
        return this.employe != null;
    }
    

}
