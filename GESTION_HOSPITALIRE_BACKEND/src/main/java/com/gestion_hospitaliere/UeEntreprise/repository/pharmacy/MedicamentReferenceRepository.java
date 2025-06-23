package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.MedicamentReference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicamentReferenceRepository extends JpaRepository<MedicamentReference, Long> {
    
    List<MedicamentReference> findByMedicamentId(Long medicamentId);
    
    List<MedicamentReference> findByReferenceId(Long referenceId);
    
    List<MedicamentReference> findByQuantiteGreaterThan(Integer quantite);
    
    List<MedicamentReference> findByMedicamentIdAndReferenceId(Long medicamentId, Long referenceId);
}