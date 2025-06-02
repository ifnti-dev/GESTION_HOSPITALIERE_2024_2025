package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;


import org.springframework.data.jpa.repository.JpaRepository;
import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.AlerteRupture;

public interface AlerteRuptureRepository extends JpaRepository<AlerteRupture, Long> {
    // Méthodes personnalisées si nécessaire
}