package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Reference;

@Repository
public interface ReferenceRepository extends JpaRepository<Reference, Long> {
    List<Reference> findByNomContaining(String nom);
//    List<Reference> findByMedicamentId(Long medicamentId);
//    List<Reference> findByQuantiteCalculeeGreaterThan(Integer quantite);
}
