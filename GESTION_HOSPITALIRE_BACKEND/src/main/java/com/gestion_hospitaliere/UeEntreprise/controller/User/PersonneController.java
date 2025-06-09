package com.gestion_hospitaliere.UeEntreprise.controller.User;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestion_hospitaliere.UeEntreprise.model.User.Utilisateur;
import com.gestion_hospitaliere.UeEntreprise.service.User.UtilisateurService;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    // Ajouter un utilisateur
    @PostMapping
    public ResponseEntity<Utilisateur> ajouterUtilisateur(@RequestBody Utilisateur utilisateur) {
        Utilisateur nouvelUtilisateur = utilisateurService.ajouterUtilisateur(utilisateur);
        return ResponseEntity.ok(nouvelUtilisateur);
    }

    // Récupérer tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<Utilisateur>> obtenirTousLesUtilisateurs() {
        List<Utilisateur> utilisateurs = utilisateurService.obtenirTousLesUtilisateurs();
        return ResponseEntity.ok(utilisateurs);
    }

    // Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> obtenirUtilisateurParId(@PathVariable Long id) {
        Optional<Utilisateur> utilisateur = utilisateurService.obtenirUtilisateurParId(id);
        return utilisateur.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Récupérer un utilisateur par email
    

    // Mettre à jour un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> mettreAJourUtilisateur(@PathVariable Long id, @RequestBody Utilisateur utilisateurDetails) {
        try {
            Utilisateur utilisateurMisAJour = utilisateurService.mettreAJourUtilisateur(id, utilisateurDetails);
            return ResponseEntity.ok(utilisateurMisAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerUtilisateur(@PathVariable Long id) {
        utilisateurService.supprimerUtilisateur(id);
        return ResponseEntity.noContent().build();
    }
}