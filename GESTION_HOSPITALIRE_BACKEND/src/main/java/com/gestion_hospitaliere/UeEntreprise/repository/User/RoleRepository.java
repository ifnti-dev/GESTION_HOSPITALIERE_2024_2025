package com.gestion_hospitaliere.UeEntreprise.repository.User;


import java.util.Optional;
import org.springframework.stereotype.Repository;
import com.gestion_hospitaliere.UeEntreprise.model.User.Role;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByNom(String nom);
}
