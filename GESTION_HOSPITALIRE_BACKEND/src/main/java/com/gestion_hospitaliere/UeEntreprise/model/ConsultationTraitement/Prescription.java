package com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Medicament;
import jakarta.persistence.*;

@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantite;

    private String posologie;

    private Integer duree;

    @ManyToOne
    @JoinColumn(name = "consultation_prenatale")
    @JsonIgnore // ou @JsonBackReference si ConsultationPrenatale utilise @JsonManagedReference
    private ConsultationPrenatale consultationPrenatale;

    @ManyToOne
    @JoinColumn(name = "consultation_id")
    @JsonIgnore // ou @JsonBackReference si Consultation utilise @JsonManagedReference
    private Consultation consultation;

    @ManyToOne
    @JoinColumn(name = "medicament_id", nullable = false)
    private Medicament medicament;

    // === Getters & Setters ===

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantite() {
        return quantite;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public String getPosologie() {
        return posologie;
    }

    public void setPosologie(String posologie) {
        this.posologie = posologie;
    }

    public Integer getDuree() {
        return duree;
    }

    public void setDuree(Integer duree) {
        this.duree = duree;
    }

    public ConsultationPrenatale getConsultationPrenatale() {
        return consultationPrenatale;
    }

    public void setConsultationPrenatale(ConsultationPrenatale consultationPrenatale) {
        this.consultationPrenatale = consultationPrenatale;
    }

    public Consultation getConsultation() {
        return consultation;
    }

    public void setConsultation(Consultation consultation) {
        this.consultation = consultation;
    }

    public Medicament getMedicament() {
        return medicament;
    }

    public void setMedicament(Medicament medicament) {
        this.medicament = medicament;
    }
}
