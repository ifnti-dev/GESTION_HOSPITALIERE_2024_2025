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
    public Personne ajouterPersonne(Personne utilisateur) {
        return personneRepository.save(utilisateur);
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
            personnel.setPassword(personneDetails.getPassword());
            return personneRepository.save(personnel);
        } else {
            throw new RuntimeException("Personnel non trouvé avec l'ID : " + id);
        }
    }

    // Supprimer un utilisateur
    public void supprimerPersonne(Long id) {
        personneRepository.deleteById(id);
    }
}