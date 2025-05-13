package com.gestion_hospitaliere.UeEntreprise.service.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.User.Role;
import com.gestion_hospitaliere.UeEntreprise.repository.User.RoleRepository;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    // Créer un rôle
    public Role creerRole(Role role) {
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
    public Role mettreAJourRole(Long id, Role roleDetails) {
        return roleRepository.findById(id).map(role -> {
            role.setNom(roleDetails.getNom());
            role.setPermissions(roleDetails.getPermissions());
            return roleRepository.save(role);
        }).orElseThrow(() -> new RuntimeException("Rôle non trouvé avec l'ID : " + id));
    }

    // Supprimer un rôle
    public void supprimerRole(Long id) {
        roleRepository.deleteById(id);
    }
}
