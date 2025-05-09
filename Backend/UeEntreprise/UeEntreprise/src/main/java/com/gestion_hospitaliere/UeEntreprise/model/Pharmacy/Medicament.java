package com.gestion_hospitaliere.UeEntreprise.model.Pharmacy;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Medicament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String description;
    private String unite;
    private Integer seuilAlerte;
    private Boolean estActif;
    
    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private CategorieMedicament categorie;
    
    @OneToMany(mappedBy = "medicament", cascade = CascadeType.ALL)
    private List<Reference> references = new ArrayList<>();
    
    @OneToMany(mappedBy = "medicament", cascade = CascadeType.ALL)
    private List<StockProduit> stocks = new ArrayList<>();
    
    // Getters and setters
}