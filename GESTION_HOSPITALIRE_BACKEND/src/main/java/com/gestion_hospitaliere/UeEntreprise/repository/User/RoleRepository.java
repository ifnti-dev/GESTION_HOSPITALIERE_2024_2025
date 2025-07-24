package com.gestion_hospitaliere.UeEntreprise.repository.User;


import java.util.Optional;
import org.springframework.stereotype.Repository;
import com.gestion_hospitaliere.UeEntreprise.model.User.Role;
import org.springframework.data.jpa.repository.JpaRepository;


/**
 * Repository pour la gestion des rôles.
 */

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Trouve un rôle par son nom.
     * @param nom le nom du rôle
     * @return un Optional contenant le rôle trouvé, ou vide si non trouvé.
     */
    Optional<Role> findByNom(String nom);
}
