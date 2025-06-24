package com.gestion_hospitaliere.UeEntreprise.service.User;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PersonneRepository;

@Service
public class PersonneService {

    @Autowired
    private PersonneRepository personneRepository;

    // Ajouter un utilisateur
    public Personne ajouterPersonne(Personne personne) {
        // Validation des données
        if (personne.getNom() == null || personne.getNom().isEmpty()) {
            throw new IllegalArgumentException("Le nom est requis.");
        }

        if (personne.getEmail() == null || personne.getEmail().isEmpty()) {
            throw new IllegalArgumentException("L'email est requis.");
        }

        Pattern emailPattern = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
        if (!emailPattern.matcher(personne.getEmail()).matches()) {
            throw new IllegalArgumentException("Email invalide.");
        }
        
        if (personneRepository.existsByEmail(personne.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé.");
        }

        if (personne.getAdresse() == null || personne.getAdresse().isEmpty()) {
            throw new IllegalArgumentException("L'adresse est requise.");
        }
        
        // Vérification que l'adresse ne contient que des lettres et espaces
        Pattern addressPattern = Pattern.compile("^[A-Za-zÀ-ÿ\\s]+$");
        if (!addressPattern.matcher(personne.getAdresse()).matches()) {
            throw new IllegalArgumentException("L'adresse doit contenir uniquement des lettres.");
        }

        if (personne.getTelephone() == null || personne.getTelephone().isEmpty()) {
            throw new IllegalArgumentException("Le numéro de téléphone est requis.");
        }
        
        // Vérification que le téléphone ne contient que des chiffres
        Pattern phonePattern = Pattern.compile("^[0-9]+$");
        if (!phonePattern.matcher(personne.getTelephone()).matches()) {
            throw new IllegalArgumentException("Le numéro de téléphone doit contenir uniquement des chiffres.");
        }

        return personneRepository.save(personne);
    }

    // Récupérer tous les utilisateurs
    public List<Personne> obtenirTousLesPersonnes() {
        return personneRepository.findAll();
    }

    // Récupérer un utilisateur par ID
    public Optional<Personne> obtenirPersonneParId(Long id) {
        return personneRepository.findById(id);
    }

    

    // Mettre à jour un utilisateur
    public Personne mettreAJourPersonne(Long id, Personne personneDetails) {
        Optional<Personne> personnelOptional = personneRepository.findById(id);
        if (personnelOptional.isPresent()) {
            Personne personnel = personnelOptional.get();
            personnel.setNom(personneDetails.getNom());
            personnel.setPrenom(personneDetails.getPrenom());
            personnel.setEmail(personneDetails.getEmail());
            personnel.setPassword(personneDetails.getPassword());
            // Ajoutez d'autres champs à mettre à jour ici
            return personneRepository.save(personnel);
        } else {
            throw new RuntimeException("Personne non trouvée avec l'ID : " + id);
        }
    }

    // Supprimer un utilisateur
    public void supprimerPersonne(Long id) {
        personneRepository.deleteById(id);
    }
}