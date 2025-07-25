package com.gestion_hospitaliere.UeEntreprise.repository.User;

import java.util.List;
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
           "LEFT JOIN FETCH r.rolePermissions " +
           "WHERE p.email = :email")
    Optional<Employe> findByPersonneEmailWithRoles(@Param("email") String email);

    Optional<Employe> findByNumOrdre(String numOrdre);

    @Query("SELECT e FROM Employe e JOIN FETCH e.personne JOIN FETCH e.roles")
    List<Employe> findAllWithDetails();

    boolean existsByNumOrdre(String numOrdre);
    List<Employe> findByRolesNom(String roleNom);

    @Query(value = "SELECT r.nom as roleName, COUNT(e.id) as employeeCount " +
                   "FROM employe e " +
                   "JOIN employe_roles er ON e.id = er.employe_id " +
                   "JOIN role r ON er.role_id = r.id " +
                   "GROUP BY r.nom", nativeQuery = true)
    List<Object[]> countEmployesByRoleNative();
}
