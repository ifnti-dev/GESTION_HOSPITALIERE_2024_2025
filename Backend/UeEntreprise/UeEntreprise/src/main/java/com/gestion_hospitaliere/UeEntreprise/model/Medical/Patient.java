package com.gestion_hospitaliere.UeEntreprise.model.Medical;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.gestion_hospitaliere.UeEntreprise.model.Appointments.RendezVous;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.SuiviEtat;
import com.gestion_hospitaliere.UeEntreprise.model.HospitalisationService.Hospitalisation;
import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.VenteMedicament;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String sexe;
    private String adresse;
    
    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL)
    private DossierMedical dossierMedical;
    
    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL)
    private DossierGrossesse dossierGrossesse;
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<RendezVous> rendezVous = new ArrayList<>();
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Hospitalisation> hospitalisations = new ArrayList<>();
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Consultation> consultations = new ArrayList<>();
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<SuiviEtat> suivisEtat = new ArrayList<>();
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<VenteMedicament> ventesMedicaments = new ArrayList<>();
    
    // Getters and setters
}