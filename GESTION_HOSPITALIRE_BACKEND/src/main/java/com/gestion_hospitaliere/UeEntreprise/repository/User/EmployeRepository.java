package com.gestion_hospitaliere.UeEntreprise.repository.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.dto.EmployeParRoleDTO;

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
    Optional<Employe> findByNumOrdre(String numOrdre);

    @Query("SELECT NEW com.gestion_hospitaliere.UeEntreprise.dto.EmployeParRoleDTO(r.nom, COUNT(e)) " +
           "FROM Employe e JOIN e.roles r GROUP BY r.nom")
    List<EmployeParRoleDTO> countEmployesByRole();

    @EntityGraph(attributePaths = {"personne", "roles"})
    List<Employe> findAllWithDetails();

    boolean existsByNumOrdre(String numOrdre);
    List<Employe> findByRolesNom(String roleNom);
}
