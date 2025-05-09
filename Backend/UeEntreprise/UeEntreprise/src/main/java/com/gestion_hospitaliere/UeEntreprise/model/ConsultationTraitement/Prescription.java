package com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.Medicament;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Integer quantite;
    private String posologie;
    private Integer duree;
    
    @ManyToOne
    @JoinColumn(name = "consultation_id")
    private Consultation consultation;
    
    @ManyToOne
    @JoinColumn(name = "medicament_id")
    private Medicament medicament;
    
    // Getters and setters
}