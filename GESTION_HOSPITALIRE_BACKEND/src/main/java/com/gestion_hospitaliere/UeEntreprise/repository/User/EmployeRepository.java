package com.gestion_hospitaliere.UeEntreprise.repository.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.User.Employe;



@Repository
public interface EmployeRepository extends JpaRepository<Employe, Long> {
    // Ajoutez ici des méthodes de recherche personnalisées si nécessaire

    // Utilisée par ConsultationService et EmployeService pour trouver un employé par son numéro d'ordre
    Optional<Employe> findByNumOrdre(String numOrdre);
     Optional<Employe> findByPersonneEmail(String email);
}



