package com.gestion_hospitaliere.UeEntreprise.model.Pharmacy;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class LigneVente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Integer quantite;
    
    @ManyToOne
    @JoinColumn(name = "vente_id")
    private VenteMedicament vente;
    
    @ManyToOne
    @JoinColumn(name = "medicament_id")
    private Medicament medicament;

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

	public VenteMedicament getVente() {
		return vente;
	}

	public void setVente(VenteMedicament vente) {
		this.vente = vente;
	}

	public Medicament getMedicament() {
		return medicament;
	}

	public void setMedicament(Medicament medicament) {
		this.medicament = medicament;
	}
    
    
    
}