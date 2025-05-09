package com.gestion_hospitaliere.UeEntreprise.model.Payments;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Paiement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Double montant;
    private LocalDate date;
    private String moyen;
    
    @ManyToOne
    @JoinColumn(name = "facture_id")
    private Facture facture;
    
    // Getters and setters
}
