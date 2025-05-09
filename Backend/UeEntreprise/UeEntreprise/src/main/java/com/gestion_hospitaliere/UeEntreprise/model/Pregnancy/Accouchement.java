package com.gestion_hospitaliere.UeEntreprise.model.Pregnancy;

import java.time.LocalDate;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.SageFemme;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Accouchement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate date;
    private String type;
    private String complications;
    private Float bebePoids;
    
    @ManyToOne
    @JoinColumn(name = "sagefemme_id")
    private SageFemme sageFemme;
    
    @ManyToOne
    @JoinColumn(name = "dossier_grossesse_id")
    private DossierGrossesse dossierGrossesse;
    
    // Getters and setters
}