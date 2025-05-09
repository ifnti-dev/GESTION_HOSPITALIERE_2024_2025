package com.gestion_hospitaliere.UeEntreprise.model.Pharmacy;

import java.time.LocalDate;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class StockProduit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String lot;
    private Integer quantite;
    private LocalDate datePeremption;
    
    @ManyToOne
    @JoinColumn(name = "medicament_id")
    private Medicament medicament;
    
    // Getters and setters
}