package com.gestion_hospitaliere.UeEntreprise.service.User;

import com.gestion_hospitaliere.UeEntreprise.model.User.Utilisateur;
import com.gestion_hospitaliere.UeEntreprise.repository.User.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    // Ajouter un utilisateur
    public Utilisateur ajouterUtilisateur(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    // Récupérer tous les utilisateurs
    public List<Utilisateur> obtenirTousLesUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    // Récupérer un utilisateur par ID
    public Optional<Utilisateur> obtenirUtilisateurParId(Long id) {
        return utilisateurRepository.findById(id);
    }

    // Récupérer un utilisateur par email
    public Optional<Utilisateur> obtenirUtilisateurParEmail(String email) {
        return Optional.ofNullable(utilisateurRepository.findByEmail(email));
    }

    // Mettre à jour un utilisateur
    public Utilisateur mettreAJourUtilisateur(Long id, Utilisateur utilisateurDetails) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(id);
        if (utilisateurOptional.isPresent()) {
            Utilisateur utilisateur = utilisateurOptional.get();
            utilisateur.setNomUtilisateur(utilisateurDetails.getNomUtilisateur());
            utilisateur.setPassword(utilisateurDetails.getPassword());
            utilisateur.setNom(utilisateurDetails.getNom());
            utilisateur.setPrenom(utilisateurDetails.getPrenom());
            utilisateur.setEmail(utilisateurDetails.getEmail());
            utilisateur.setRoles(utilisateurDetails.getRoles());
            return utilisateurRepository.save(utilisateur);
        } else {
            throw new RuntimeException("Utilisateur non trouvé avec l'ID : " + id);
        }
    }

    // Supprimer un utilisateur
    public void supprimerUtilisateur(Long id) {
        utilisateurRepository.deleteById(id);
    }
}
