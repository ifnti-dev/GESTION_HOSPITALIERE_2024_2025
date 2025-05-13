package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.VenteMedicament;

public interface VenteMedicamentRepository extends JpaRepository<VenteMedicament, Long> {
    // Méthodes personnalisées si nécessaire
}