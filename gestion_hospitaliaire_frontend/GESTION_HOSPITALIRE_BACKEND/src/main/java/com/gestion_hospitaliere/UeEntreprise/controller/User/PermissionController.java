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

import com.gestion_hospitaliere.UeEntreprise.model.User.Permission;
import com.gestion_hospitaliere.UeEntreprise.service.User.PermissionService;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    // Ajouter une permission
    @PostMapping
    public ResponseEntity<Permission> creerPermission(@RequestBody Permission permission) {
        Permission nouvellePermission = permissionService.creerPermission(permission);
        return ResponseEntity.ok(nouvellePermission);
    }

    // Récupérer toutes les permissions
    @GetMapping
    public ResponseEntity<List<Permission>> obtenirToutesLesPermissions() {
        List<Permission> permissions = permissionService.obtenirToutesLesPermissions();
        return ResponseEntity.ok(permissions);
    }

    // Récupérer une permission par ID
    @GetMapping("/{id}")
    public ResponseEntity<Permission> obtenirPermissionParId(@PathVariable Long id) {
        Optional<Permission> permission = permissionService.obtenirPermissionParId(id);
        return permission.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Récupérer une permission par nom
    @GetMapping("/nom")
    public ResponseEntity<Permission> obtenirPermissionParNom(@RequestParam String nom) {
        Permission permission = permissionService.obtenirPermissionParNom(nom);
        if (permission != null) {
            return ResponseEntity.ok(permission);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Mettre à jour une permission
    @PutMapping("/{id}")
    public ResponseEntity<Permission> mettreAJourPermission(@PathVariable Long id, @RequestBody Permission permissionDetails) {
        try {
            Permission permissionMiseAJour = permissionService.mettreAJourPermission(id, permissionDetails);
            return ResponseEntity.ok(permissionMiseAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer une permission
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerPermission(@PathVariable Long id) {
        permissionService.supprimerPermission(id);
        return ResponseEntity.noContent().build();
    }
}
