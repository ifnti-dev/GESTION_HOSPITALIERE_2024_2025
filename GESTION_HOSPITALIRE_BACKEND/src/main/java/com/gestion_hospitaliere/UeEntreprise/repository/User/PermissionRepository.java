package com.gestion_hospitaliere.UeEntreprise.repository.User;

import org.springframework.stereotype.Repository;
import com.gestion_hospitaliere.UeEntreprise.model.User.Permission;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    // Méthode pour trouver une permission par son nom
    Optional<Permission> findPermissionByNom(String nom);
    @Query("SELECT p FROM Permission p WHERE UPPER(p.nom) = UPPER(:nom)")
    Optional<Permission> findByNomInsensitive(@Param("nom") String nom);
    boolean existsByNom(String nom);
}
