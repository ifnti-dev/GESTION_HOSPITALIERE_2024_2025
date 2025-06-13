package com.gestion_hospitaliere.UeEntreprise.model.dto;

import java.util.Set;

public class RoleRequest {

    private String nom;
    private Set<Long> permissions;

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Set<Long> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<Long> permissions) {
        this.permissions = permissions;
    }

}
