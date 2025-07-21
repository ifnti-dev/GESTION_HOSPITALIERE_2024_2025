package com.gestion_hospitaliere.UeEntreprise.model.User;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.Utilis.Auditable;

import static com.gestion_hospitaliere.UeEntreprise.Utilis.RegexConstants.*;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Entity
public class Role extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
	@NotBlank(message = "Le nom du rôle ne peut pas être vide.")
	@NotNull(message = "Le nom du rôle ne peut pas être nul.")
	@Pattern(regexp = LETTRES_SEULEMENT, message = "Le nom du rôle doit contenir entre 3 et 50 caractères alphanumériques.")
    private String nom;
    
    @ManyToMany
	@JsonIgnore
    @JoinTable(
        name = "role_permissions",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new HashSet<>();


	public Role() {
	}

	public Role(String nom, Set<Permission> permissions) {
		this.nom = nom;
		this.permissions = permissions;
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

	public Set<Permission> getPermissions() {
		return permissions;
	}

	public void setPermissions(Set<Permission> permissions) {
		this.permissions = permissions;
	}
    
    
    
    // Getters and setters
}
