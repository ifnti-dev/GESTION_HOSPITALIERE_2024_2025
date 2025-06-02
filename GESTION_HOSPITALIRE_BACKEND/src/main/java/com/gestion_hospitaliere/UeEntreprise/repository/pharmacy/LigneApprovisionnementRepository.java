package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.LigneApprovisionnement;

public interface LigneApprovisionnementRepository extends JpaRepository<LigneApprovisionnement, Long> {
    // Trouver les lignes par approvisionnement
    List<LigneApprovisionnement> findByApprovisionnementId(Long approvisionnementId);
    
    // Trouver les lignes par médicament
    List<LigneApprovisionnement> findByMedicamentId(Long medicamentId);
}