package com.gestion_hospitaliere.UeEntreprise.model.Pregnancy;

import java.time.LocalDate;
import java.time.LocalTime;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierGrossesse;
import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Accouchement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Section ACCOUCHEMENT
    private LocalDate date; // Obligatoire
    private LocalTime heure; // Obligatoire
    private String lieu; // Obligatoire
    private String presentation; // Nullable
    private String typeAccouchement; // Obligatoire
    private String etatPerinee; // Nullable
    private String etatVulve; // Nullable
    private String typeDelivrance; // Obligatoire
    private Boolean revisionUterine; // Nullable
    private Boolean hemorragieGrave; // Nullable
    private Boolean allaitement30min; // Nullable
    private Boolean allaitementApres30min; // Nullable
    private String suitesCouches; // Nullable

    // Section NOUVEAU-NE
    private Boolean aTerme; // Nullable
    private Boolean premature; // Nullable
    private Boolean vivant; // Nullable
    private Boolean criantAussitot; // Nullable
    private Boolean mortNe; // Nullable
    private Boolean reanime; // Nullable
    private Integer dureeReanimation; // Nullable
    private Boolean reanimationEnVain; // Nullable
    private Integer apgar1min; // Nullable
    private Integer apgar5min; // Nullable
    private Integer apgar10min; // Nullable
    private Float taille; // Nullable
    private Float perimetreCranien; // Nullable
    private String sexe; // Nullable ("M" ou "F")
    private Float poids; // Obligatoire

    // Vaccinations
    private LocalDate dateBCG; // Nullable
    private LocalDate datePolio; // Nullable

    // Relations
    

    @ManyToOne
    @JoinColumn(name = "employe_id", nullable = false)
    private Employe employe; // Obligatoire

    @ManyToOne
    @JoinColumn(name = "dossier_grossesse_id", nullable = false)
    private DossierGrossesse dossierGrossesse; // Obligatoire

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getHeure() { return heure; }
    public void setHeure(LocalTime heure) { this.heure = heure; }

    public String getLieu() { return lieu; }
    public void setLieu(String lieu) { this.lieu = lieu; }

    public String getPresentation() { return presentation; }
    public void setPresentation(String presentation) { this.presentation = presentation; }

    public String getTypeAccouchement() { return typeAccouchement; }
    public void setTypeAccouchement(String typeAccouchement) { this.typeAccouchement = typeAccouchement; }

    public String getEtatPerinee() { return etatPerinee; }
    public void setEtatPerinee(String etatPerinee) { this.etatPerinee = etatPerinee; }

    public String getEtatVulve() { return etatVulve; }
    public void setEtatVulve(String etatVulve) { this.etatVulve = etatVulve; }

    public String getTypeDelivrance() { return typeDelivrance; }
    public void setTypeDelivrance(String typeDelivrance) { this.typeDelivrance = typeDelivrance; }

    public Boolean getRevisionUterine() { return revisionUterine; }
    public void setRevisionUterine(Boolean revisionUterine) { this.revisionUterine = revisionUterine; }

    public Boolean getHemorragieGrave() { return hemorragieGrave; }
    public void setHemorragieGrave(Boolean hemorragieGrave) { this.hemorragieGrave = hemorragieGrave; }

    public Boolean getAllaitement30min() { return allaitement30min; }
    public void setAllaitement30min(Boolean allaitement30min) { this.allaitement30min = allaitement30min; }

    public Boolean getAllaitementApres30min() { return allaitementApres30min; }
    public void setAllaitementApres30min(Boolean allaitementApres30min) { this.allaitementApres30min = allaitementApres30min; }

    public String getSuitesCouches() { return suitesCouches; }
    public void setSuitesCouches(String suitesCouches) { this.suitesCouches = suitesCouches; }

    public Boolean getATerme() { return aTerme; }
    public void setATerme(Boolean aTerme) { this.aTerme = aTerme; }

    public Boolean getPremature() { return premature; }
    public void setPremature(Boolean premature) { this.premature = premature; }

    public Boolean getVivant() { return vivant; }
    public void setVivant(Boolean vivant) { this.vivant = vivant; }

    public Boolean getCriantAussitot() { return criantAussitot; }
    public void setCriantAussitot(Boolean criantAussitot) { this.criantAussitot = criantAussitot; }

    public Boolean getMortNe() { return mortNe; }
    public void setMortNe(Boolean mortNe) { this.mortNe = mortNe; }

    public Boolean getReanime() { return reanime; }
    public void setReanime(Boolean reanime) { this.reanime = reanime; }

    public Integer getDureeReanimation() { return dureeReanimation; }
    public void setDureeReanimation(Integer dureeReanimation) { this.dureeReanimation = dureeReanimation; }

    public Boolean getReanimationEnVain() { return reanimationEnVain; }
    public void setReanimationEnVain(Boolean reanimationEnVain) { this.reanimationEnVain = reanimationEnVain; }

    public Integer getApgar1min() { return apgar1min; }
    public void setApgar1min(Integer apgar1min) { this.apgar1min = apgar1min; }

    public Integer getApgar5min() { return apgar5min; }
    public void setApgar5min(Integer apgar5min) { this.apgar5min = apgar5min; }

    public Integer getApgar10min() { return apgar10min; }
    public void setApgar10min(Integer apgar10min) { this.apgar10min = apgar10min; }

    public Float getTaille() { return taille; }
    public void setTaille(Float taille) { this.taille = taille; }

    public Float getPerimetreCranien() { return perimetreCranien; }
    public void setPerimetreCranien(Float perimetreCranien) { this.perimetreCranien = perimetreCranien; }

    public String getSexe() { return sexe; }
    public void setSexe(String sexe) { this.sexe = sexe; }

    public Float getPoids() { return poids; }
    public void setPoids(Float poids) { this.poids = poids; }

    public LocalDate getDateBCG() { return dateBCG; }
    public void setDateBCG(LocalDate dateBCG) { this.dateBCG = dateBCG; }

    public LocalDate getDatePolio() { return datePolio; }
    public void setDatePolio(LocalDate datePolio) { this.datePolio = datePolio; }
    
    
    public Employe getEmploye() { return employe; }
    public void setEmploye(Employe employe) { this.employe = employe; }

    public DossierGrossesse getDossierGrossesse() { return dossierGrossesse; }
    public void setDossierGrossesse(DossierGrossesse dossierGrossesse) { this.dossierGrossesse = dossierGrossesse; }
}