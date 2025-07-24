package com.gestion_hospitaliere.UeEntreprise.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class PersonneNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public PersonneNotFoundException(Long id) {
        super("Personne not found with ID: " + id);
    }

    public PersonneNotFoundException(String email) {
        super("Personne not found with email: " + email);
    }

}
