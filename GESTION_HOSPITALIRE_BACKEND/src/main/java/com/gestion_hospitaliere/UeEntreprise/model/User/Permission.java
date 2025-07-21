package com.gestion_hospitaliere.UeEntreprise.model.User;

import static com.gestion_hospitaliere.UeEntreprise.Utilis.RegexConstants.*;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Entity
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
	@Pattern(regexp = LETTRES_SEULEMENT, message = "Le nom de la permission doit contenir entre 3 et 50 caractères alphanumériques.")
	@NotBlank(message = "Le nom de la permission ne peut pas être vide.")
	@NotNull(message = "Le nom de la permission ne peut pas être nul.")
    private String nom;

	@Pattern(regexp = LETTRES_SEULEMENT, message = "La description de la permission doit contenir entre 3 et 100 caractères alphanumériques.")
	@NotBlank(message = "La description de la permission ne peut pas être vide.")
	@NotNull(message = "La description de la permission ne peut pas être nulle.")
    private String description;

	public Permission() {
	}

	public Permission(String nom, String description) {
		this.nom = nom;
		this.description = description;
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getNom() {
		return nom;
	}
	public void setNom(String nom) {
		this.nom = nom;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
    
    // Getters and setters
    
    
    
}
