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
import org.springframework.web.bind.annotation.CrossOrigin;

import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.service.User.EmployeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import jakarta.validation.Valid;

@RestController
@RequestMapping("api/employe")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class EmployeUserController {

    @Autowired
    private EmployeService employeService;

    // 🔹 Créer un nouvel employé
    @Operation(summary = "Crée un nouvel employé",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(
                examples = {
                    @ExampleObject(
                        name = "Création avec nouvelle personne",
                        value = "{...}" // Coller votre JSON exemple ici
                    )
                }
            )
        )
    )
    @PostMapping
    public ResponseEntity<?> creerEmploye(@Valid @RequestBody Employe employe) {
        try {
            System.out.println("=== CRÉATION EMPLOYÉ ===");
            System.out.println("Données reçues: " + employe);
            
            Employe nouveau = employeService.creerEmploye(employe);
            return ResponseEntity.ok(nouveau);
        } catch (Exception e) {
            System.err.println("Erreur lors de la création de l'employé: " + e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    // 🔹 Récupérer tous les employés
    @Operation(summary = "Récupérer tous les employés")
    @GetMapping
    public ResponseEntity<List<Employe>> getAll() {
        try {
            List<Employe> employes = employeService.recupererTousLesEmployes();
            return ResponseEntity.ok(employes);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des employés: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // 🔹 Récupérer un employé par ID
    @Operation(summary = "Récupérer un employé par id")
    @GetMapping("/{id}")
    public ResponseEntity<Employe> getById(@PathVariable Long id) {
        try {
            return employeService.obtenirEmployeParId(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération de l'employé: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // 🔹 Mettre à jour un employé
    @Operation(summary = "Mettre à jour un employé")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Employe updated) {
        try {
            Employe employe = employeService.mettreAJourEmploye(id, updated);
            return ResponseEntity.ok(employe);
        } catch (Exception e) {
            System.err.println("Erreur lors de la mise à jour: " + e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    // 🔹 Supprimer un employé
    @Operation(summary = "Supprimer un employé")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            employeService.supprimerEmploye(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Erreur lors de la suppression: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // 🔹 Ajouter un rôle à un employé
    @Operation(summary = "Ajouter un rôle à un employé")
    @PostMapping("/{employeId}/roles/{roleId}")
    public ResponseEntity<?> ajouterRole(@PathVariable Long employeId, @PathVariable Long roleId) {
        try {
            Employe employe = employeService.ajouterRoleAEmploye(employeId, roleId);
            return ResponseEntity.ok(employe);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'ajout du rôle: " + e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    // 🔹 Retirer un rôle à un employé
    @Operation(summary = "Retirer un rôle à un employé")
    @DeleteMapping("/{employeId}/roles/{roleId}")
    public ResponseEntity<?> retirerRole(@PathVariable Long employeId, @PathVariable Long roleId) {
        try {
            Employe employe = employeService.retirerRoleAEmploye(employeId, roleId);
            return ResponseEntity.ok(employe);
        } catch (Exception e) {
            System.err.println("Erreur lors du retrait du rôle: " + e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    // 🔹 Affecter une personne existante à un employé existant
    @Operation(summary = "Affecter une personne existante à un employé existant")
    @PutMapping("/{employeId}/personne/{personneId}")
    public ResponseEntity<?> affecterPersonne(
            @PathVariable Long employeId,
            @PathVariable Long personneId) {
        try {
            Employe employe = employeService.affecterPersonneAEmploye(employeId, personneId);
            return ResponseEntity.ok(employe);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'affectation: " + e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    // 🔹 Statistiques employés par rôle (version sans DTO)
    @Operation(summary = "Nombre d'employés par rôle")
    @GetMapping("/stats/roles")
    public ResponseEntity<List<Object[]>> getStatsRoles() {
        try {
            List<Object[]> stats = employeService.getNombreEmployesParRole();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des stats: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
