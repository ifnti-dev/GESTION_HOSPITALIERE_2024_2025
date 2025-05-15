package com.gestion_hospitaliere.UeEntreprise.model.Employe;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement.Consultation;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Medecin extends Employe {

    private String specialite;

    @OneToMany(mappedBy = "medecin")
    @JsonManagedReference("medecin-consultation") // Partie "parent" de la relation
    private List<Consultation> consultations = new ArrayList<>();

    // Getters et setters
    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public List<Consultation> getConsultations() {
        return consultations;
    }

    public void setConsultations(List<Consultation> consultations) {
        this.consultations = consultations;
    }
}
