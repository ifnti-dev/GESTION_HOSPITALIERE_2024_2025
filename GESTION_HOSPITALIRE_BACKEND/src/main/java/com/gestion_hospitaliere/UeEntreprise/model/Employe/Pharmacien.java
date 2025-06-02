package com.gestion_hospitaliere.UeEntreprise.model.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.User.Utilisateur;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class Pharmacien {

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String horairesTravail;
	    private Boolean actif;

	    @OneToOne
	    @JoinColumn(name = "utilisateur_id")
	    private Utilisateur utilisateur;

	  

    
}

