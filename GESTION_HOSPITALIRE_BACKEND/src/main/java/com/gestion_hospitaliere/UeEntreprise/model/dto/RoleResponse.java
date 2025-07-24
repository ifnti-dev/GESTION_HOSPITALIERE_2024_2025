package com.gestion_hospitaliere.UeEntreprise.model.dto;

import java.util.Set;

public class RoleResponse {

    private Long id;
    private String nom;
    private int nombrePermissions;
    private int nombreEmployes;
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
