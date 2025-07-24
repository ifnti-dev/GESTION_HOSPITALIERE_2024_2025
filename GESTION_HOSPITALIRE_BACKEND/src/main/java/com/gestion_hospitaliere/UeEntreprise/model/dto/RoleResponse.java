package com.gestion_hospitaliere.UeEntreprise.model.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class RoleResponse {

    private Long id;
    private String nom;
    private int nombrePermissions;
    private int nombreEmployes;
    private LocalDateTime updatedAt;
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    private LocalDateTime createdAt;
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    private Set<String> permissionsLabels;

    // Getters et setters

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

    public int getNombrePermissions() {
        return nombrePermissions;
    }

    public void setNombrePermissions(int nombrePermissions) {
        this.nombrePermissions = nombrePermissions;
    }

    public int getNombreEmployes() {
        return nombreEmployes;
    }

    public void setNombreEmployes(int nombreEmployes) {
        this.nombreEmployes = nombreEmployes;
    }

    public Set<String> getPermissionsLabels() {
        return permissionsLabels;
    }

    public void setPermissionsLabels(Set<String> permissionsLabels) {
        this.permissionsLabels = permissionsLabels;
    }
}
