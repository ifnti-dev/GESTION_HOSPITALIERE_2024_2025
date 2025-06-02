package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.Reference;

public interface ReferenceRepository extends JpaRepository<Reference, Long> {
    // Trouver les références par médicament
    List<Reference> findByMedicamentId(Long medicamentId);
    
    // Trouver les références par nom
    List<Reference> findByNomContaining(String nom);
}