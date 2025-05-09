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
public class CategorieMedicament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String description;
    
    @OneToMany(mappedBy = "categorie")
    private List<Medicament> medicaments = new ArrayList<>();
    
    // Getters and setters
}