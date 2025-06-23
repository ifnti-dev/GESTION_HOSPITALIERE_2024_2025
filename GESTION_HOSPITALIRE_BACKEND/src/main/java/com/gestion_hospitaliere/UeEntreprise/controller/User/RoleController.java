package com.gestion_hospitaliere.UeEntreprise.controller.User;

import com.gestion_hospitaliere.UeEntreprise.model.User.Role;
import com.gestion_hospitaliere.UeEntreprise.model.dto.RoleRequest;
import com.gestion_hospitaliere.UeEntreprise.service.User.RoleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    // Créer un nouveau rôle
    @PostMapping
    public ResponseEntity<Role> creerRole(@RequestBody RoleRequest roleRequest) {
        Role nouveauRole = roleService.creerRole(roleRequest);
        return ResponseEntity.ok(nouveauRole);
    }


    // Récupérer tous les rôles
    @GetMapping
    public ResponseEntity<List<Role>> obtenirTousLesRoles() {
        List<Role> roles = roleService.obtenirTousLesRoles();
        return ResponseEntity.ok(roles);
    }

    // Récupérer un rôle par ID
    @GetMapping("/{id}")
    public ResponseEntity<Role> obtenirRoleParId(@PathVariable Long id) {
        Optional<Role> role = roleService.obtenirRoleParId(id);
        return role.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //Récupérer un rôle par nom
    // @GetMapping("/nom")
    // public ResponseEntity<Role> obtenirRoleParNom(@RequestParam String nom) {
    //     Role role = roleService.obtenirRoleParNom(nom);
    //     if (role != null) {
    //         return ResponseEntity.ok(role);
    //     } else {
    //         return ResponseEntity.notFound().build();
    //     }
    // }

    // Mettre à jour un rôle
    @PutMapping("/{id}")
    public ResponseEntity<Role> mettreAJourRole(@PathVariable Long id, @RequestBody RoleRequest roleRequest) {
        try {
            Role roleMisAJour = roleService.mettreAJourRole(id, roleRequest);
            return ResponseEntity.ok(roleMisAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    // public ResponseEntity<Role> mettreAJourRole(@PathVariable Long id, @RequestBody Role roleDetails) {
    //     try {
    //         Role roleMisAJour = roleService.mettreAJourRole(id, roleDetails);
    //         return ResponseEntity.ok(roleMisAJour);
    //     } catch (RuntimeException e) {
    //         return ResponseEntity.notFound().build();
    //     }
    // }


    // Supprimer un rôle
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerRole(@PathVariable Long id) {
        roleService.supprimerRole(id);
        return ResponseEntity.noContent().build();
    }
}