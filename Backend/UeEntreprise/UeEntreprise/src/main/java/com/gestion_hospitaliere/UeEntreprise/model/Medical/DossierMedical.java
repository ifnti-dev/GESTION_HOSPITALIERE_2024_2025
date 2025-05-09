package com.gestion_hospitaliere.UeEntreprise.model.Medical;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class DossierMedical {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String antecedents;
    private String allergies;
    private String traitementsEnCours;
    private Float tension;
    private String groupeSanguin;
    
    @OneToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
    // Getters and setters
}