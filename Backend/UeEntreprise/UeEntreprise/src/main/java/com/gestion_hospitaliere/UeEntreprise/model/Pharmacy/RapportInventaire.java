package com.gestion_hospitaliere.UeEntreprise.model.Pharmacy;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class RapportInventaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate dateGeneration;
    private String contenu;
    
    // Getters and setters
}
