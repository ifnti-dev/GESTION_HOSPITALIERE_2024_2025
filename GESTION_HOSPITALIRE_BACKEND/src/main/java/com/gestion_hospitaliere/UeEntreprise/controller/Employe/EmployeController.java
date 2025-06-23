package com.gestion_hospitaliere.UeEntreprise.controller.Employe;
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
import com.gestion_hospitaliere.UeEntreprise.model.Employe.Employe;
import com.gestion_hospitaliere.UeEntreprise.service.Employe.EmployeService;

@RestController
@RequestMapping("api/employe")
public class EmployeController {

    @Autowired
    private EmployeService employeService;

    // 🔹 Créer un nouvel employé
    @PostMapping
    public ResponseEntity<Employe> creerEmploye(@RequestBody Employe employe) {
        Employe nouveau = employeService.creerEmploye(employe);
        return ResponseEntity.ok(nouveau);
    }

    // 🔹 Récupérer tous les employés
    @GetMapping
    public ResponseEntity<List<Employe>> getAll() {
        return ResponseEntity.ok(employeService.recupererTousLesEmployes());
    }

    // 🔹 Récupérer un employé par ID
    @GetMapping("/{id}")
    public ResponseEntity<Employe> getById(@PathVariable Long id) {
        Optional<Employe> employe = employeService.obtenirEmployeParId(id);
        return employe.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 🔹 Mettre à jour un employé
    @PutMapping("/{id}")
    public ResponseEntity<Employe> update(@PathVariable Long id, @RequestBody Employe updated) {
        Employe employe = employeService.mettreAJourEmploye(id, updated);
        return ResponseEntity.ok(employe);
    }

    // 🔹 Supprimer un employé
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        employeService.supprimerEmploye(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Ajouter un rôle à un employé
    @PostMapping("/{employeId}/roles/{roleId}")
    public ResponseEntity<Employe> ajouterRole(@PathVariable Long employeId, @PathVariable Long roleId) {
        Employe employe = employeService.ajouterRoleAEmploye(employeId, roleId);
        return ResponseEntity.ok(employe);
    }

    // 🔹 Retirer un rôle à un employé
    @DeleteMapping("/{employeId}/roles/{roleId}")
    public ResponseEntity<Employe> retirerRole(@PathVariable Long employeId, @PathVariable Long roleId) {
        Employe employe = employeService.retirerRoleAEmploye(employeId, roleId);
        return ResponseEntity.ok(employe);
    }

    // 🔹 Affecter une personne existante à un employé existant
    @PutMapping("/{employeId}/personne/{personneId}")
    public ResponseEntity<Employe> affecterPersonne(
            @PathVariable Long employeId,
            @PathVariable Long personneId) {
        Employe employe = employeService.affecterPersonneAEmploye(employeId, personneId);
        return ResponseEntity.ok(employe);
    }
}