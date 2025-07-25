package com.gestion_hospitaliere.UeEntreprise.model.dto;

public class EmployeParRoleDTO {

    private String roleNom;
    private Long nombreEmployes;

    public EmployeParRoleDTO(String roleNom, Long nombreEmployes) {
        this.roleNom = roleNom;
        this.nombreEmployes = nombreEmployes;
    }

    // Getters obligatoires
    public String getRoleNom() {
        return roleNom;
    }

    public Long getNombreEmployes() {
        return nombreEmployes;
    }
}
