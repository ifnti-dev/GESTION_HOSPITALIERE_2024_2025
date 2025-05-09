package com.gestion_hospitaliere.UeEntreprise.model.Medical;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.Accouchement;
import com.gestion_hospitaliere.UeEntreprise.model.Pregnancy.SuiviGrossesse;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;


@Entity
public class DossierGrossesse extends DossierMedical {
    private LocalDate dateOuverture;
    private Integer nombreGrossesses;
    private Integer nombreAccouchements;
    private LocalDate dateDerniereRegle;
    private LocalDate datePrevueAccouchement;
    private String rhesus;
    private String statutImmunisationRubeole;
    private String statutImmunisationToxo;
    private String statutImmunisationHepatiteB;
    private String statutSerologieHiv;
    private String statutSerologieSyphilis;
    private Boolean presenceDiabeteGestationnel;
    private Boolean presenceHypertensionGestationnelle;
    private String observationsGenerales;
    
    @OneToMany(mappedBy = "dossierGrossesse", cascade = CascadeType.ALL)
    private List<SuiviGrossesse> suivisGrossesse = new ArrayList<>();
    
    @OneToMany(mappedBy = "dossierGrossesse", cascade = CascadeType.ALL)
    private List<Accouchement> accouchements = new ArrayList<>();
    
    // Getters and setters
}