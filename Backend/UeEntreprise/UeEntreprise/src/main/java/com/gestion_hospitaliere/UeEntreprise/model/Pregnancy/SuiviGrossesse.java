package com.gestion_hospitaliere.UeEntreprise.model.Pregnancy;

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
public class SuiviGrossesse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String trimestre;
    private Float tension;
    private Float poids;
    private String remarque;
    
    @ManyToOne
    @JoinColumn(name = "dossier_grossesse_id")
    private DossierGrossesse dossierGrossesse;
    
    // Getters and setters
}