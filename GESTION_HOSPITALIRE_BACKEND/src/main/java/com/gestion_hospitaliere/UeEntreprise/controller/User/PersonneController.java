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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/personne")
@Tag(name = "API Personne", description = "Gestion des personnes (patients et employés)")
public class PersonneController {

    @Autowired
    private PersonneService personneService;

    // Ajouter un utilisateur
    @Operation(summary = "Ajouter une personne", description = "Création d'un nouveau patient ou employé")
    @ApiResponse(responseCode = "200", description = "Personne créée avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @PostMapping
    public ResponseEntity<Personne> ajouterPersonne(@RequestBody Personne personne) {
        Personne nouvelPersonne = personneService.ajouterPersonne(personne);
        return ResponseEntity.ok(nouvelPersonne);
    }

    // Récupérer tous les utilisateurs
    @Operation(summary = "Lister toutes les personnes")
    @GetMapping
    public ResponseEntity<List<Personne>> obtenirTousLesPersonne() {
        List<Personne> personnes = personneService.obtenirTousLesPersonnes();
        return ResponseEntity.ok(personnes);
    }

    @Operation(summary = "Lister les personnes sans dossier médical")
    @GetMapping("/pas-dossier-medical")
    public ResponseEntity<List<Personne>> getPasDossiersMedical() {
            List<Personne> personnes = personneService.obtenirPersonnesSansDossierMedical();
            return ResponseEntity.ok(personnes);
    }


    @Operation(summary = "Lister toutes les femmes")
    @GetMapping("/pas-dossier-grossesse")
    public ResponseEntity<List<Personne>> getPasDossiersGrossesse() {
        List<Personne> personnes = personneService.obtenirToutesLesFemmes();
        return ResponseEntity.ok(personnes);
    }

    // Récupérer un utilisateur par ID
    @Operation(summary = "Récupérer une personne par ID")
    @ApiResponse(responseCode = "200", description = "Personne trouvée")
    @ApiResponse(responseCode = "404", description = "Personne non trouvée")
    @GetMapping("/{id}")
    public ResponseEntity<Personne> obtenirUtilisateurParId(@PathVariable Long id) {
        Personne personne = personneService.obtenirParId(id);
        return ResponseEntity.ok(personne);
    }

    // Récupérer un utilisateur par email
    @Operation(summary = "Rechercher par email")
    @GetMapping("/email/{email}")
    public ResponseEntity<Personne> obtenirPersonneParEmail(@PathVariable String email) {
        Optional<Personne> personne = personneService.obtenirParEmail(email);
        return personne.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // Mettre à jour un utilisateur
    @Operation(summary = "Mettre à jour une personne")
    @PutMapping("/{id}")
    public ResponseEntity<Personne> mettreAJourPersonne(@PathVariable Long id, @RequestBody Personne personneDetails) {
        try {
            Personne personneMisAJour = personneService.mettreAJourPersonne(id, personneDetails);
            return ResponseEntity.ok(personneMisAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer un utilisateur
    @Operation(summary = "Supprimer une personne")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerPersonne(@PathVariable Long id) {
        personneService.supprimerPersonne(id);
        return ResponseEntity.noContent().build();
    }

    // Récupéré tout les patients
    @Operation(summary = "Lister tous les patients")
    @GetMapping("/patients")
    public ResponseEntity<List<Personne>> obtenirPatients() {
        List<Personne> patients = personneService.obtenirPatients();
        return ResponseEntity.ok(patients);
    }

    // Récupéré tout les employés
    @Operation(summary = "Lister tous les employés")
    @GetMapping("/employes")
    public ResponseEntity<List<Personne>> obtenirEmployes() {
        List<Personne> employes = personneService.obtenirEmployes();
        return ResponseEntity.ok(employes);
    }
}