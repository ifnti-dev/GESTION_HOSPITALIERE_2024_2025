package com.gestion_hospitaliere.UeEntreprise.service.User;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import com.gestion_hospitaliere.UeEntreprise.exceptions.BusinessException;
import com.gestion_hospitaliere.UeEntreprise.exceptions.PersonneNotFoundException;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PersonneRepository;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Validated
public class PersonneService {

    @Autowired
    private PersonneRepository personneRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Ajouter un utilisateur
    public Personne ajouterPersonne(@Valid Personne personne) {
        if (personneRepository.existsByEmail(personne.getEmail())) {
            throw new BusinessException("Email déjà utilisé");
        }
        if (personneRepository.existsByTelephone(personne.getTelephone())) {
            throw new BusinessException("Téléphone déjà utilisé");
        }
        
        personne.setPassword(passwordEncoder.encode(personne.getPassword()));
        return personneRepository.save(personne);
    }

    // Récupérer tous les utilisateurs
    public List<Personne> obtenirTousLesPersonnes() {
        return personneRepository.findAll();
    }

    // public List<Personne> obtenirPersonnesSansDossierMedical() {
    //     return personneRepository.findAll()
    //             .stream()
    //             .filter(personne -> personne.getDossierMedical() == null)
    //             .collect(Collectors.toList());
    // }
    public List<Personne> obtenirPersonnesSansDossierMedical() {
        return personneRepository.findPersonnesSansDossierMedical();
    }

    // 2️⃣ Récupérer toutes les femmes SANS dossier de grossesse
    // public List<Personne> obtenirToutesLesFemmes() {
    //     return personneRepository.findAll().stream()
    //         .filter(personne -> personne.getSexe() != null && personne.getSexe().equalsIgnoreCase("f"))
    //         .collect(Collectors.toList());
    // }
    public List<Personne> obtenirToutesLesFemmes() {
        return personneRepository.findBySexeIgnoreCase("f");
    }


    // Récupérer un utilisateur par ID
    public Personne obtenirParId(Long id) {
        return personneRepository.findById(id)
               .orElseThrow(() -> new PersonneNotFoundException(id));
    }

    

    // Mise à jour sécurisée
    public Personne mettreAJourPersonne(Long id, @Valid Personne details) {
        return personneRepository.findById(id)
            .map(existant -> {
                if (!existant.getEmail().equals(details.getEmail()) && 
                    personneRepository.existsByEmail(details.getEmail())) {
                    throw new BusinessException("Email déjà utilisé");
                }

                existant.setNom(details.getNom());
                existant.setPrenom(details.getPrenom());
                
                if (details.getPassword() != null) {
                    existant.setPassword(passwordEncoder.encode(details.getPassword()));
                }
                
                return personneRepository.save(existant);
            })
            .orElseThrow(() -> new PersonneNotFoundException(id));
    }

    // Suppression avec vérification
    public void supprimerPersonne(Long id) {
        if (!personneRepository.existsById(id)) {
            throw new PersonneNotFoundException(id);
        }
        personneRepository.deleteById(id);
        log.info("Personne {} supprimée", id);
    }

    // Trouver les personnes qui sont des patients
    public List<Personne> obtenirPatients() {
        return personneRepository.findByEmployeIsNull();
    }

    // Trouver les personnes qui sont des employés
    public List<Personne> obtenirEmployes() {
        return personneRepository.findByEmployeIsNotNull();
    }


    // Trouver une personne par email
    public Optional<Personne> obtenirParEmail(@Valid String email) {
        return personneRepository.findByEmail(email);
    }
}