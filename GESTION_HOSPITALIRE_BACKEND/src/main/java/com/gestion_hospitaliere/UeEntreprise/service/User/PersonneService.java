package com.gestion_hospitaliere.UeEntreprise.service.User;

import java.util.List;
import java.util.Optional;

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
        if (personne.getNom() == null || personne.getEmail() == null) {
            throw new IllegalArgumentException("Nom et email sont requis.");
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