package com.gestion_hospitaliere.UeEntreprise.model.Payments;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;



@Entity
public class Caisse {
    private String numeroCaisse;
    private Double montantTotalEncaisse;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // @OneToMany(mappedBy = "caisse", cascade = CascadeType.ALL)
    // private List<RapportCaisse> rapportsCaisse;


    // @OneToMany(mappedBy = "caisse", cascade = CascadeType.ALL)
    // @JsonIgnore
    // private List<Paiement> paiements = new ArrayList<>();


    @ManyToOne
    @JoinColumn(name = "employe_id")
    private Employe employe;


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

    public Employe getEmploye() {
        return employe;
    }

    public void setEmploye(Employe employe) {
        this.employe = employe;
    }

    // public List<Paiement> getPaiements() {
    //     return paiements;
    // }

    // public void setPaiements(List<Paiement> paiements) {
    //     this.paiements = paiements;
    // }


}