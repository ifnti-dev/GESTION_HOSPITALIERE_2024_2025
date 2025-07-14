package com.gestion_hospitaliere.UeEntreprise.repository.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;

@Repository
public interface EmployeRepository extends JpaRepository<Employe, Long> {
    
    @Query("SELECT e FROM Employe e JOIN FETCH e.personne p WHERE p.email = :email")
    Optional<Employe> findByPersonneEmail(@Param("email") String email);
    
    @Query("SELECT e FROM Employe e " +
           "JOIN FETCH e.personne p " +
           "LEFT JOIN FETCH e.roles r " +
           "LEFT JOIN FETCH r.permissions " +
           "WHERE p.email = :email")
    Optional<Employe> findByPersonneEmailWithRoles(@Param("email") String email);
}
