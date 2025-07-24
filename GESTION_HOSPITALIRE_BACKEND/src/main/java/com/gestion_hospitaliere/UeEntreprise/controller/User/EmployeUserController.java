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
import org.springframework.http.HttpStatus;

import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.dto.EmployeParRoleDTO;
import com.gestion_hospitaliere.UeEntreprise.service.User.EmployeService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("api/employe")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class EmployeUserController {

    @Autowired
    private EmployeService employeService;

    // 🔹 Créer un nouvel employé
    @Operation(summary = "Crée un nouvel employé")
    @PostMapping
    public ResponseEntity<?> creerEmploye(@Valid @RequestBody Employe employe) {
        try {
            System.out.println("=== CRÉATION EMPLOYÉ ===");
            System.out.println("Données reçues: " + employe);
            System.out.println("Personne associée: " + employe.getPersonne());
            
            if (employe.getPersonne() != null) {
                System.out.println("Détails personne:");
                System.out.println("- Nom: " + employe.getPersonne().getNom());
                System.out.println("- Prénom: " + employe.getPersonne().getPrenom());
                System.out.println("- Email: " + employe.getPersonne().getEmail());
                System.out.println("- ID: " + employe.getPersonne().getId());
            }
            
            Employe nouveau = employeService.creerEmploye(employe);
            System.out.println("Employé créé avec succès: " + nouveau.getId());
            return ResponseEntity.ok(nouveau);
        } catch (Exception e) {
            System.err.println("Erreur lors de la création de l'employé: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Erreur: " + e.getMessage());
        }
    }

    // 🔹 Récupérer tous les employés
    @Operation(summary = "Récupéré tous les employés")
    @GetMapping
    public ResponseEntity<List<Employe>> getAll() {
        try {
            List<Employe> employes = employeService.recupererTousLesEmployes();
            return ResponseEntity.ok(employes);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des employés: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🔹 Récupérer un employé par ID
    @Operation(summary = "Récupéré un employé par id")
    @GetMapping("/{id}")
    public ResponseEntity<Employe> getById(@PathVariable Long id) {
        try {
            Optional<Employe> employe = employeService.obtenirEmployeParId(id);
            return employe.map(ResponseEntity::ok)
                          .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération de l'employé: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🔹 Mettre à jour un employé
    @Operation(summary = "Mettre à jour un employé")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Employe updated) {
        try {
            System.out.println("=== MISE À JOUR EMPLOYÉ ===");
            System.out.println("ID: " + id);
            System.out.println("Données: " + updated);
            
            Employe employe = employeService.mettreAJourEmploye(id, updated);
            return ResponseEntity.ok(employe);
        } catch (Exception e) {
            System.err.println("Erreur lors de la mise à jour: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Erreur: " + e.getMessage());
        }
    }

    // 🔹 Supprimer un employé
    @Operation(summary = "Supprimer un employé")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            employeService.supprimerEmploye(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Erreur lors de la suppression: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Erreur: " + e.getMessage());
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Erreur: " + e.getMessage());
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Erreur: " + e.getMessage());
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Erreur: " + e.getMessage());
        }
    }

    @Operation(summary = "Trouver le nombre d'employé pour chaque rôle !")
    @GetMapping("/stats/roles")
    public List<EmployeParRoleDTO> getStatsRoles() {
        return employeService.getNombreEmployesParRole();
    }
}
