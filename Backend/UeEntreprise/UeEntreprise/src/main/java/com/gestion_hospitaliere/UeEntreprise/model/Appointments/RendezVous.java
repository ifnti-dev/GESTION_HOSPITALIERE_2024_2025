package com.gestion_hospitaliere.UeEntreprise.model.Appointments;

import java.time.LocalDateTime;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Medecin;
import com.gestion_hospitaliere.UeEntreprise.model.Employe.SageFemme;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.Patient;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class RendezVous {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDateTime dateHeure;
    private String type;
    private String statut;
    private String notes;
    
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;
    
    @ManyToOne
    @JoinColumn(name = "sagefemme_id")
    private SageFemme sageFemme;
    
    // Getters and setters
}
