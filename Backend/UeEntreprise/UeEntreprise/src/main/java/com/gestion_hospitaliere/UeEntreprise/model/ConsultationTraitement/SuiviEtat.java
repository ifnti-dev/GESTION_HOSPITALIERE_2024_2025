package com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement;

import java.time.LocalDate;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class SuiviEtat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate date;
    private Integer temperature;
    private Float tension;
    private String observations;
    
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
    // Getters and setters
}