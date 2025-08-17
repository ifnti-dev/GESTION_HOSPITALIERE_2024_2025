package com.gestion_hospitaliere.UeEntreprise.model.ConsultationTraitement;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;

@Entity
@Table(name = "consultations_prenatales")
public class ConsultationPrenatale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Suivi clinique (dynamique)
    private LocalDate dateConsultation;
    private Double poidsMere;
    private Integer hauteurUterine;
    private String bruitsCoeurFoetal;
    private Boolean oedemes;
    private String mouvementsFoetus;
    
    // Pathologies gestationnelles (dynamiques)
    private Boolean presenceDiabeteGestationnel;
    private Boolean presenceHypertensionGestationnelle;
    
    // Examens (dynamiques)
    private String resultatsAnalyses;
    private String examensComplementaires;
    
    // Prise en charge (dynamique)
    private String traitementsEnCours;      // Déplacé de Dossier
    private String observationsGenerales;   // Déplacé de DossierGrossesse
    private String decisionMedicale;
    private LocalDate dateProchaineConsultation;
    
    // Vaccination (dynamique)
    private Integer derniereDoseVAT;
    private LocalDate dateDerniereDoseVAT;

    // Relation
    @ManyToOne
    @JoinColumn(name = "dossier_grossesse_id")
    private DossierGrossesse dossierGrossesse;

    @OneToMany(mappedBy = "consultationPrenatale", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<PrescriptionPrenatal> prescriptionsPrenatale = new ArrayList<>();

    public List<PrescriptionPrenatal> getPrescriptionsPrenatale() {
        return prescriptionsPrenatale;
    }

    public void setPrescriptionsPrenatale(List<PrescriptionPrenatal> prescriptionsPrenatale) {
        this.prescriptionsPrenatale = prescriptionsPrenatale;
    }

    @ManyToOne
    @JoinColumn(name = "employe_id", nullable = false)
    private Employe employe;


    

    public Employe getEmploye() {
        return employe;
    }

    public void setEmploye(Employe employe) {
        this.employe = employe;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateConsultation() {
        return dateConsultation;
    }

    public void setDateConsultation(LocalDate dateConsultation) {
        this.dateConsultation = dateConsultation;
    }

    public Double getPoidsMere() {
        return poidsMere;
    }

    public void setPoidsMere(Double poidsMere) {
        this.poidsMere = poidsMere;
    }

    public Integer getHauteurUterine() {
        return hauteurUterine;
    }

    public void setHauteurUterine(Integer hauteurUterine) {
        this.hauteurUterine = hauteurUterine;
    }

    public String getBruitsCoeurFoetal() {
        return bruitsCoeurFoetal;
    }

    public void setBruitsCoeurFoetal(String bruitsCoeurFoetal) {
        this.bruitsCoeurFoetal = bruitsCoeurFoetal;
    }

    public Boolean getOedemes() {
        return oedemes;
    }

    public void setOedemes(Boolean oedemes) {
        this.oedemes = oedemes;
    }

    public String getMouvementsFoetus() {
        return mouvementsFoetus;
    }

    public void setMouvementsFoetus(String mouvementsFoetus) {
        this.mouvementsFoetus = mouvementsFoetus;
    }

    public Boolean getPresenceDiabeteGestationnel() {
        return presenceDiabeteGestationnel;
    }

    public void setPresenceDiabeteGestationnel(Boolean presenceDiabeteGestationnel) {
        this.presenceDiabeteGestationnel = presenceDiabeteGestationnel;
    }

    public Boolean getPresenceHypertensionGestationnelle() {
        return presenceHypertensionGestationnelle;
    }

    public void setPresenceHypertensionGestationnelle(Boolean presenceHypertensionGestationnelle) {
        this.presenceHypertensionGestationnelle = presenceHypertensionGestationnelle;
    }

    public String getResultatsAnalyses() {
        return resultatsAnalyses;
    }

    public void setResultatsAnalyses(String resultatsAnalyses) {
        this.resultatsAnalyses = resultatsAnalyses;
    }

    public String getExamensComplementaires() {
        return examensComplementaires;
    }

    public void setExamensComplementaires(String examensComplementaires) {
        this.examensComplementaires = examensComplementaires;
    }

    public String getTraitementsEnCours() {
        return traitementsEnCours;
    }

    public void setTraitementsEnCours(String traitementsEnCours) {
        this.traitementsEnCours = traitementsEnCours;
    }

    public String getObservationsGenerales() {
        return observationsGenerales;
    }

    public void setObservationsGenerales(String observationsGenerales) {
        this.observationsGenerales = observationsGenerales;
    }

    public String getDecisionMedicale() {
        return decisionMedicale;
    }

    public void setDecisionMedicale(String decisionMedicale) {
        this.decisionMedicale = decisionMedicale;
    }

    public LocalDate getDateProchaineConsultation() {
        return dateProchaineConsultation;
    }

    public void setDateProchaineConsultation(LocalDate dateProchaineConsultation) {
        this.dateProchaineConsultation = dateProchaineConsultation;
    }

    public Integer getDerniereDoseVAT() {
        return derniereDoseVAT;
    }

    public void setDerniereDoseVAT(Integer derniereDoseVAT) {
        this.derniereDoseVAT = derniereDoseVAT;
    }

    public LocalDate getDateDerniereDoseVAT() {
        return dateDerniereDoseVAT;
    }

    public void setDateDerniereDoseVAT(LocalDate dateDerniereDoseVAT) {
        this.dateDerniereDoseVAT = dateDerniereDoseVAT;
    }

    public DossierGrossesse getDossierGrossesse() {
        return dossierGrossesse;
    }

    public void setDossierGrossesse(DossierGrossesse dossierGrossesse) {
        this.dossierGrossesse = dossierGrossesse;
    }

    // ... (getters/setters)
}