package com.gestion_hospitaliere.UeEntreprise.model.Payments;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Caissier;

@Entity
public class Caisse {
    private String numeroCaisse;
    private Double montantTotalEncaisse;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // @OneToMany(mappedBy = "caisse", cascade = CascadeType.ALL)
    // private List<RapportCaisse> rapportsCaisse;

    @ManyToOne
    private Caissier caissier;

    // Getters et setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroCaisse() {
        return numeroCaisse;
    }

    public void setNumeroCaisse(String numeroCaisse) {
        this.numeroCaisse = numeroCaisse;
    }

    public Double getMontantTotalEncaisse() {
        return montantTotalEncaisse;
    }

    public void setMontantTotalEncaisse(Double montantTotalEncaisse) {
        this.montantTotalEncaisse = montantTotalEncaisse;
    }

    // public List<RapportCaisse> getRapportsCaisse() {
    //     return rapportsCaisse;
    // }

    // public void setRapportsCaisse(List<RapportCaisse> rapportsCaisse) {
    //     this.rapportsCaisse = rapportsCaisse;
    // }

    public Caissier getCaissier() {
        return caissier;
    }

    public void setCaissier(Caissier caissier) {
        this.caissier = caissier;
    }
}