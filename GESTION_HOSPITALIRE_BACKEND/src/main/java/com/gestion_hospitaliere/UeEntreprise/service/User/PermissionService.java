package com.gestion_hospitaliere.UeEntreprise.service.User;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import com.gestion_hospitaliere.UeEntreprise.model.User.Permission;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PermissionRepository;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Validated
@Transactional
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    // Créer une permission
    @Transactional
    public Permission creerPermission(@Valid Permission permission) {
        log.info("Création d'une nouvelle permission: {}", permission.getNom());
        return permissionRepository.save(permission);
    }

    // Récupérer toutes les permissions
    public List<Permission> obtenirToutesLesPermissions() {
        log.info("Récupération de toutes les permissions");
        return permissionRepository.findAll();
    }

    // Récupérer une permission par ID
    public Optional<Permission> obtenirPermissionParId(Long id) {
        log.info("Récupération de la permission avec ID: {}", id);
        return permissionRepository.findById(id);
    }

    // Récupérer une permission par nom
    public Optional<Permission> obtenirPermissionParNom(String nom) {
        log.info("Récupération de la permission par nom: {}", nom);
        return permissionRepository.findPermissionByNom(nom);
    }

    // Mettre à jour une permission
    @Transactional
    public Permission mettreAJourPermission(Long id, @Valid Permission permissionDetails) {
        log.info("Mise à jour de la permission avec ID: {}", id);
        return permissionRepository.findById(id).map(permission -> {
            if (permissionDetails.getNom() == null || permissionDetails.getNom().isEmpty()) {
                throw new IllegalArgumentException("Le nom de la permission est obligatoire");
            }
            permission.setNom(permissionDetails.getNom());
            permission.setDescription(permissionDetails.getDescription());
            return permissionRepository.save(permission);
        }).orElseThrow(() -> new RuntimeException("Permission non trouvée avec l'ID : " + id));
    }

    // Supprimer une permission
    @Transactional
    public void supprimerPermission(Long id) {
        log.info("Suppression de la permission avec ID: {}", id);
        permissionRepository.deleteById(id);
    }
}