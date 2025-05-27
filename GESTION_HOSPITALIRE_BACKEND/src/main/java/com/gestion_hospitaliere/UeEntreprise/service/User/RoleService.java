package com.gestion_hospitaliere.UeEntreprise.service.User;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.User.Permission;
import com.gestion_hospitaliere.UeEntreprise.model.User.Role;
import com.gestion_hospitaliere.UeEntreprise.model.dto.RoleRequest;
import com.gestion_hospitaliere.UeEntreprise.repository.User.PermissionRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.User.RoleRepository;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PermissionRepository permissionRepository;

    // Créer un rôle
    // public Role creerRole(Role role) {
    //     return roleRepository.save(role);
    // }

    public Role creerRole(RoleRequest roleRequest) {
        Role role = new Role();
        role.setNom(roleRequest.getNom());

        Set<Permission> permissions = roleRequest.getPermissions().stream()
            .map(id -> permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission non trouvée avec id : " + id)))
            .collect(Collectors.toSet());

        role.setPermissions(permissions);

        return roleRepository.save(role);
    }

    // Récupérer tous les rôles
    public List<Role> obtenirTousLesRoles() {
        return roleRepository.findAll();
    }

    // Récupérer un rôle par ID
    public Optional<Role> obtenirRoleParId(Long id) {
        return roleRepository.findById(id);
    }

    // Récupérer un rôle par nom
    public Role obtenirRoleParNom(String nom) {
        return roleRepository.findByNom(nom);
    }

    // Mettre à jour un rôle
    // public Role mettreAJourRole(Long id, Role roleDetails) {
    //     return roleRepository.findById(id).map(role -> {
    //         role.setNom(roleDetails.getNom());
    //         role.setPermissions(roleDetails.getPermissions());
    //         return roleRepository.save(role);
    //     }).orElseThrow(() -> new RuntimeException("Rôle non trouvé avec l'ID : " + id));
    // }

    public Role mettreAJourRole(Long id, RoleRequest roleRequest) {
        return roleRepository.findById(id).map(role -> {
            role.setNom(roleRequest.getNom());

            Set<Permission> permissions = roleRequest.getPermissions().stream()
                .map(permissionId -> permissionRepository.findById(permissionId)
                    .orElseThrow(() -> new RuntimeException("Permission non trouvée : " + permissionId)))
                .collect(Collectors.toSet());

            role.setPermissions(permissions);

            return roleRepository.save(role);
        }).orElseThrow(() -> new RuntimeException("Rôle non trouvé avec l'ID : " + id));
    }

    // Supprimer un rôle
    public void supprimerRole(Long id) {
        roleRepository.deleteById(id);
    }
}