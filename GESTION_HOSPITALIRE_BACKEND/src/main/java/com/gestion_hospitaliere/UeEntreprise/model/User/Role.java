package com.gestion_hospitaliere.UeEntreprise.model.User;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gestion_hospitaliere.UeEntreprise.Utilis.Auditable;

import static com.gestion_hospitaliere.UeEntreprise.Utilis.RegexConstants.*;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/**
 * Représente un rôle dans le système, incluant les permissions associées.
 */

@Entity
public class Role extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
	@NotBlank(message = "Le nom du rôle ne peut pas être vide.")
	@NotNull(message = "Le nom du rôle ne peut pas être nul.")
	@Pattern(regexp = LETTRES_SEULEMENT, message = "Le nom du rôle doit contenir entre 3 et 50 caractères alphanumériques.")
    private String nom;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "role_permissions",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> rolePermissions = new HashSet<>();

	@JsonIgnore
	@ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
	private Set<Employe> employes = new HashSet<>();



	public Role() {
	}

	public Role(String nom, Set<Permission> rolePermissions) {
		this.nom = nom;
		this.rolePermissions = rolePermissions;
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
		return rolePermissions;
	}

	public void setPermissions(Set<Permission> rolePermissions) {
		this.rolePermissions = rolePermissions;
	}

	public void addPermission(Permission rolePermissions) {
		if (rolePermissions != null) {
			this.rolePermissions.add(rolePermissions);
		} else {
			throw new IllegalArgumentException("La permission ne peut pas être nulle.");
		}
	}

	public void removePermission(Permission rolePermissions) {
		if (rolePermissions != null) {
			this.rolePermissions.remove(rolePermissions);
		} else {
			throw new IllegalArgumentException("La permission ne peut pas être nulle.");
		}
	}
    
	public Set<Employe> getEmployes() {
		return employes;
	}

	public void setEmployes(Set<Employe> employes) {
		this.employes = employes;
	}

	public int getNombreEmployes() {
		return employes.size();
	}

	@Override
	public String toString() {
		return "Role{id=" + id + ", nom='" + nom + "'}";
	}
        
}
