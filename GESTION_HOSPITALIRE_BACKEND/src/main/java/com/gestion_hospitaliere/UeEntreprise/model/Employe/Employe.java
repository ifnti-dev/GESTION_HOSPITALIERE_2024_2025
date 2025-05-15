package com.gestion_hospitaliere.UeEntreprise.model.Employe;


import com.gestion_hospitaliere.UeEntreprise.model.User.Utilisateur;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity

public class Employe extends Utilisateur{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // private String role;

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	// public String getRole() {
	// 	return role;
	// }
	// public void setRole(String role) {
	// 	this.role = role;
	// }
    
    // Getters and setters
    
}
