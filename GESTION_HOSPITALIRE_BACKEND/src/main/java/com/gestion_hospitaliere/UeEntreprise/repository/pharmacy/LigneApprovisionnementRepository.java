package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.LigneApprovisionnement;

@Repository
public interface LigneApprovisionnementRepository extends JpaRepository<LigneApprovisionnement, Long> {
    List<LigneApprovisionnement> findByApprovisionnementId(Long approvisionnementId);
//    List<LigneApprovisionnement> findByMedicamentId(Long medicamentId);
    List<LigneApprovisionnement> findByDateExpirationBefore(LocalDate date);
}