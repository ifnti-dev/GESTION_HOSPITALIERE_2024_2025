package com.gestion_hospitaliere.UeEntreprise.model.HospitalisationService;

import java.time.LocalDate;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;


@Entity
public class Hospitalisation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String lit;
    private LocalDate dateEntree;
    private LocalDate dateSortie;
    
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;
    
    // Getters and setters
}