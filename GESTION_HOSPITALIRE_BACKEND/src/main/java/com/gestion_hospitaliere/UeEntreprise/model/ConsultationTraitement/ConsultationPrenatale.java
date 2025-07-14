package com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;

@Entity
@Table(name = "consultations_prenatales")
public class ConsultationPrenatale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   @ManyToOne
    @JoinColumn(name = "patiente_id")
    private Personne personne;

    @Column(nullable = false)
    private LocalDate dateConsultation;

    @Column(nullable = false)
    private Integer semaineAmenorrhee;

    @Column(nullable = false)
    private Double poids;

    @Column(nullable = false)
    private String tensionArterielle;

    private Integer hauteurUterine;

    private String bruitsCardiaquesFoetaux;
    @Column(columnDefinition = "TEXT")
    private String observations;

    private LocalDate prochainRdv;

    private String alerte;

    // Getters et Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Personne getPatiente() {
        return personne;
    }

    public void setPatiente(Personne personne) {
        this.personne = personne;
    }

    public LocalDate getDateConsultation() {
        return dateConsultation;
    }

    public void setDateConsultation(LocalDate dateConsultation) {
        this.dateConsultation = dateConsultation;
    }

    public Integer getSemaineAmenorrhee() {
        return semaineAmenorrhee;
    }

    public void setSemaineAmenorrhee(Integer semaineAmenorrhee) {
        this.semaineAmenorrhee = semaineAmenorrhee;
    }

    public Double getPoids() {
        return poids;
    }

    public void setPoids(Double poids) {
        this.poids = poids;
    }

    public String getTensionArterielle() {
        return tensionArterielle;
    }

    public void setTensionArterielle(String tensionArterielle) {
        this.tensionArterielle = tensionArterielle;
    }

    public Integer getHauteurUterine() {
        return hauteurUterine;
    }

    public void setHauteurUterine(Integer hauteurUterine) {
        this.hauteurUterine = hauteurUterine;
    }

    public String getBruitsCardiaquesFoetaux() {
        return bruitsCardiaquesFoetaux;
    }

    public void setBruitsCardiaquesFoetaux(String bruitsCardiaquesFoetaux) {
        this.bruitsCardiaquesFoetaux = bruitsCardiaquesFoetaux;
    }

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    public LocalDate getProchainRdv() {
        return prochainRdv;
    }

    public void setProchainRdv(LocalDate prochainRdv) {
        this.prochainRdv = prochainRdv;
    }

    public String getAlerte() {
        return alerte;
    }

    public void setAlerte(String alerte) {
        this.alerte = alerte;
    }
}
