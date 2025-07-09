package com.gestion_hospitaliere.UeEntreprise.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthRequest {
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("password")
    private String password;

    // Constructeurs
    public AuthRequest() {}

    public AuthRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters et Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "AuthRequest{" +
                "email='" + email + '\'' +
                ", password='[PROTECTED]'" +
                '}';
    }
}
