package com.gestion_hospitaliere.UeEntreprise.model.Medical;


import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS) // Modification ici
public abstract class Dossier { // Rendue abstraite pour éviter une table dédiée
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    
    private String antecedents;
    private String allergies;
    private String traitementsEnCours;
    private String groupeSanguin;
    
    

    // Getters and setters


	public String getAntecedents() {
		return antecedents;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setAntecedents(String antecedents) {
		this.antecedents = antecedents;
	}

	public String getAllergies() {
		return allergies;
	}

	public void setAllergies(String allergies) {
		this.allergies = allergies;
	}

	public String getTraitementsEnCours() {
		return traitementsEnCours;
	}

	public void setTraitementsEnCours(String traitementsEnCours) {
		this.traitementsEnCours = traitementsEnCours;
	}

	

	public String getGroupeSanguin() {
		return groupeSanguin;
	}

	public void setGroupeSanguin(String groupeSanguin) {
		this.groupeSanguin = groupeSanguin;
	}

	
    
    
    
}
