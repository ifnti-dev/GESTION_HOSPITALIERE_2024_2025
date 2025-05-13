package com.gestion_hospitaliere.UeEntreprise.service.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.User.Permission;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PermissionRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PermissionService {

    @Autowired
    private PermissionRepository permissionRepository;

    // Créer une permission
    public Permission creerPermission(Permission permission) {
        return permissionRepository.save(permission);
    }

    // Récupérer toutes les permissions
    public List<Permission> obtenirToutesLesPermissions() {
        return permissionRepository.findAll();
    }

    // Récupérer une permission par ID
    public Optional<Permission> obtenirPermissionParId(Long id) {
        return permissionRepository.findById(id);
    }

    // Récupérer une permission par nom
    public Permission obtenirPermissionParNom(String nom) {
        return permissionRepository.findByNom(nom);
    }

    // Mettre à jour une permission
    public Permission mettreAJourPermission(Long id, Permission permissionDetails) {
        return permissionRepository.findById(id).map(permission -> {
            permission.setNom(permissionDetails.getNom());
            permission.setDescription(permissionDetails.getDescription());
            return permissionRepository.save(permission);
        }).orElseThrow(() -> new RuntimeException("Permission non trouvée avec l'ID : " + id));
    }

    // Supprimer une permission
    public void supprimerPermission(Long id) {
        permissionRepository.deleteById(id);
    }
}
