package com.gestion_hospitaliere.UeEntreprise.model.Payments;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.CascadeType;
import java.util.List;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Caissier;

@Entity
public class Caisse {
    private String numeroCaisse;
    private Double montantTotalEncaisse;

    // @OneToMany(mappedBy = "caisse", cascade = CascadeType.ALL)
    // private List<RapportCaisse> rapportsCaisse;

    @ManyToOne
    private Caissier caissier;

    // Getters et setters
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