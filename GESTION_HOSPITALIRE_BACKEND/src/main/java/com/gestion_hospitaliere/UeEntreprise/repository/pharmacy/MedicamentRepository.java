package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.Medicament;

public interface MedicamentRepository extends JpaRepository<Medicament, Long> {
    // Trouver les médicaments par nom (avec LIKE)
    List<Medicament> findByNomContaining(String nom);
    
    // Trouver les médicaments par catégorie
    List<Medicament> findByCategorieId(Long categorieId);
    
    // Trouver les médicaments actifs
    List<Medicament> findByEstActifTrue();
}