package com.gestion_hospitaliere.UeEntreprise.service.User;

import com.gestion_hospitaliere.UeEntreprise.model.User.Role;
import com.gestion_hospitaliere.UeEntreprise.model.dto.RoleRequest;
import com.gestion_hospitaliere.UeEntreprise.model.User.Permission;
import com.gestion_hospitaliere.UeEntreprise.repository.User.RoleRepository;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import com.gestion_hospitaliere.UeEntreprise.repository.User.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Validated
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PermissionRepository permissionRepository;


    /**
     * Crée un nouveau rôle à partir des données fournies.
     * @param roleRequest les données du rôle à créer
     * @return le rôle créé
     */
    // Créer un nouveau rôle
    @Transactional
    public Role creerRole(@Valid RoleRequest roleRequest) {
        validerRole(roleRequest);
        Role role = new Role();

        role.setNom(roleRequest.getNom());

        Set<Permission> permissions = roleRequest.getPermissions().stream()
            .map(id -> permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission non trouvée avec id : " + id)))
            .collect(Collectors.toSet());

        role.setPermissions(permissions);

        return roleRepository.save(role);
    }

    private void validerRole(RoleRequest roleRequest) {
        if (roleRequest.getNom() == null || roleRequest.getNom().isBlank()) {
            throw new IllegalArgumentException("Le nom du rôle est obligatoire");
        }
    }

    // Récupérer tous les rôles
    public List<Role> obtenirTousLesRoles() {
        return roleRepository.findAll();
    }

    // Récupérer toutes les permissions
    public List<Permission> obtenirToutesLesPermissions() {
        return permissionRepository.findAll();
    }

    // Récupérer un rôle par ID
    public Optional<Role> obtenirRoleParId(Long id) {
        return roleRepository.findById(id);
    }

    // Récupérer un rôle par nom
    // public Role obtenirRoleParNom(String nom) {
    //     return roleRepository.findByNom(nom);
    // }

    @Transactional
    public Role mettreAJourRole(Long id, @Valid RoleRequest roleRequest) {
        return roleRepository.findById(id).map(role -> {
            validerRoleUpdate(roleRequest);

            role.setNom(roleRequest.getNom());

            Set<Permission> permissions = roleRequest.getPermissions().stream()
                .map(permissionId -> permissionRepository.findById(permissionId)
                    .orElseThrow(() -> new RuntimeException("Permission non trouvée : " + permissionId)))
                .collect(Collectors.toSet());

            role.setPermissions(permissions);

            return roleRepository.save(role);
        }).orElseThrow(() -> new RuntimeException("Rôle non trouvé avec l'ID : " + id));
    }

    private void validerRoleUpdate(RoleRequest roleRequest) {
        validerRole(roleRequest); // réutiliser la méthode existante
    }

    // Supprimer un rôle
    public void supprimerRole(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new RuntimeException("Rôle non trouvé avec l'ID : " + id);
        }
        roleRepository.deleteById(id);
    }

    // Ajouter des permissions à un rôle
    @Transactional
    public Role addPermissionToRole(Long roleId, Long permissionId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role non trouvé"));
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("Permission non trouvée"));

        role.addPermission(permission); // Utilisation de la méthode addPermission

        return roleRepository.save(role);
    }

    // Retirer des permissions d'un rôle
    @Transactional
    public Role removePermissionFromRole(Long roleId, Long permissionId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role non trouvé"));
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("Permission non trouvée"));

        role.removePermission(permission); // Utilisation de la méthode removePermission

        return roleRepository.save(role);
    }


    // public Role addPermissionToRole(Long roleId, Long permissionId) {
    //     Role role = roleRepository.findById(roleId)
    //             .orElseThrow(() -> new RuntimeException("Role non trouvé"));
    //     Permission permission = permissionRepository.findById(permissionId)
    //             .orElseThrow(() -> new RuntimeException("Permission non trouvée"));
    //     if (role.getPermissions().contains(permission)) {
    //         throw new RuntimeException("La permission est déjà associée à ce rôle.");
    //     }

    //     role.getPermissions().add(permission);
    //     return roleRepository.save(role);
    // }

    // public Role removePermissionFromRole(Long roleId, Long permissionId) {
    //     Role role = roleRepository.findById(roleId)
    //             .orElseThrow(() -> new RuntimeException("Role non trouvé"));
    //     Permission permission = permissionRepository.findById(permissionId)
    //             .orElseThrow(() -> new RuntimeException("Permission non trouvée"));
    //     role.getPermissions().remove(permission);
    //     return roleRepository.save(role);
    // }

    // nombre d'employé associé à un rôle
    public int getNombreEmployesPourRole(Long roleId) {
        if (roleId == null) {
            throw new IllegalArgumentException("L'ID du rôle ne peut pas être null");
        }
        
        return roleRepository.findById(roleId)
                .map(Role::getNombreEmployes)
                .orElseThrow(() -> new RuntimeException("Rôle non trouvé avec l'ID : " + roleId));
    }
}