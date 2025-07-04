package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.LigneApprovisionnement;

@Repository
public interface LigneApprovisionnementRepository extends JpaRepository<LigneApprovisionnement, Long> {
	 
	
    List<LigneApprovisionnement> findByApprovisionnementId(Long approvisionnementId);
    List<LigneApprovisionnement> findByDateExpirationBefore(LocalDate date);
    
    boolean existsByNumeroLot(String numeroLot);
    
    @Modifying
    @Query("UPDATE MedicamentReference mr SET mr.quantite = mr.quantite + :quantite WHERE mr.id = :id")
    void updateQuantity(@Param("id") Long id, @Param("quantite") int quantite);
}