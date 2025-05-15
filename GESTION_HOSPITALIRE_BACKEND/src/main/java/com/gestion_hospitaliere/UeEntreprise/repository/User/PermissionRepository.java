package com.gestion_hospitaliere.UeEntreprise.repository.User;

import org.springframework.stereotype.Repository;
import com.gestion_hospitaliere.UeEntreprise.model.User.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    // Méthode pour trouver une permission par son nom
    Permission findByNom(String nom);
}
