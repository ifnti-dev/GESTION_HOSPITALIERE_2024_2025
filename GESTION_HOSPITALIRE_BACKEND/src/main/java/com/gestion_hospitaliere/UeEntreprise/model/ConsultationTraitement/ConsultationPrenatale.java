package com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;

@Entity
@Table(name = "consultations_prenatales")
public class ConsultationPrenatale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "consultationPrenatale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Prescription> prescriptions = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "dossier_id")
    private DossierGrossesse dossierGrossesse;

    @ManyToOne
    @JoinColumn(name = "employe_id", nullable = false)
    private Employe employe;

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

    // === Getters & Setters ===

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Prescription> getPrescriptions() {
        return prescriptions;
    }

    public void setPrescriptions(List<Prescription> prescriptions) {
        this.prescriptions = prescriptions;
    }

    public DossierGrossesse getDossierGrossesse() {
        return dossierGrossesse;
    }

    public void setDossierGrossesse(DossierGrossesse dossierGrossesse) {
        this.dossierGrossesse = dossierGrossesse;
    }

    public Employe getEmploye() {
        return employe;
    }

    public void setEmploye(Employe employe) {
        this.employe = employe;
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
