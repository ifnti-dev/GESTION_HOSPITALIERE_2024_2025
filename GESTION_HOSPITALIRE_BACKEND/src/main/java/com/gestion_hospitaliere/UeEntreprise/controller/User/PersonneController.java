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
import org.springframework.web.bind.annotation.RestController;

import com.gestion_hospitaliere.UeEntreprise.model.Medical.DossierMedical;
import com.gestion_hospitaliere.UeEntreprise.model.User.Personne;
import com.gestion_hospitaliere.UeEntreprise.service.User.PersonneService;

@RestController
@RequestMapping("/api/personne")
public class PersonneController {

    @Autowired
    private PersonneService personneService;

    // Ajouter un utilisateur
    @PostMapping
    public ResponseEntity<Personne> ajouterPersonne(@RequestBody Personne personne) {
        Personne nouvelPersonne = personneService.ajouterPersonne(personne);
        return ResponseEntity.ok(nouvelPersonne);
    }

    // Récupérer tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<Personne>> obtenirTousLesPersonne() {
        List<Personne> personnes = personneService.obtenirTousLesPersonnes();
        return ResponseEntity.ok(personnes);
    }

    @GetMapping("/pas-dossier-medical")
    public ResponseEntity<List<Personne>> getPasDossiersMedical() {
            List<Personne> personnes = personneService.obtenirPersonnesSansDossierMedical();
            return ResponseEntity.ok(personnes);
    }

    @GetMapping("/pas-dossier-grossesse")
    public ResponseEntity<List<Personne>> getPasDossiersGrossesse() {
        List<Personne> personnes = personneService.obtenirToutesLesFemmes();
        return ResponseEntity.ok(personnes);
    }

    // Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<Personne> obtenirUtilisateurParId(@PathVariable Long id) {
        Optional<Personne> utilisateur = personneService.obtenirPersonneParId(id);
        return utilisateur.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Récupérer un utilisateur par email
    

    // Mettre à jour un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<Personne> mettreAJourUtilisateur(@PathVariable Long id, @RequestBody Personne personneDetails) {
        try {
            Personne personneMisAJour = personneService.mettreAJourPersonne(id, personneDetails);
            return ResponseEntity.ok(personneMisAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerPersonne(@PathVariable Long id) {
        personneService.supprimerPersonne(id);
        return ResponseEntity.noContent().build();
    }
}