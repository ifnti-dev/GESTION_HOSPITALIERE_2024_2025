package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.CategorieMedicament;

public interface CategorieMedicamentRepository extends JpaRepository<CategorieMedicament, Long> {
    // Trouver une catégorie par nom
    CategorieMedicament findByNom(String nom);
}