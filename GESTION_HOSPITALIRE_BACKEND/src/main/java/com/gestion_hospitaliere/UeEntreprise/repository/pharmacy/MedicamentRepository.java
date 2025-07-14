package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Medicament;

@Repository
public interface MedicamentRepository extends JpaRepository<Medicament, Long> {
    List<Medicament> findByNomContaining(String nom);
    List<Medicament> findByCategorieId(Long categorieId);
    List<Medicament> findByDescriptionContaining(String keyword);
}
