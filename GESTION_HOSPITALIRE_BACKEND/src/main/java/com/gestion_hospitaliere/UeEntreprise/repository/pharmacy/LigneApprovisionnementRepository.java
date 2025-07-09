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
    
    // Correction: utiliser approvisionnement.id au lieu de approvisionnementId
    @Query("SELECT la FROM LigneApprovisionnement la WHERE la.approvisionnement.id = :approvisionnementId")
    List<LigneApprovisionnement> findByApprovisionnementId(@Param("approvisionnementId") Long approvisionnementId);
    
    // Correction: utiliser medicamentReference.id au lieu de medicamentReferenceId
    @Query("SELECT la FROM LigneApprovisionnement la WHERE la.medicamentReference.id = :medicamentReferenceId")
    List<LigneApprovisionnement> findByMedicamentReferenceId(@Param("medicamentReferenceId") Long medicamentReferenceId);
    
    List<LigneApprovisionnement> findByDateExpirationBefore(LocalDate date);
    
    boolean existsByNumeroLot(String numeroLot);
    
    @Modifying
    @Query("UPDATE MedicamentReference mr SET mr.quantite = mr.quantite + :quantite WHERE mr.id = :id")
    void updateQuantity(@Param("id") Long id, @Param("quantite") int quantite);
    
    // Requêtes pour le système FIFO
    @Query("SELECT la FROM LigneApprovisionnement la WHERE la.quantiteDisponible > 0 AND la.dateExpiration > CURRENT_DATE ORDER BY la.dateReception ASC")
    List<LigneApprovisionnement> findAllAvailableLots();
    
    @Query("SELECT la FROM LigneApprovisionnement la WHERE la.medicamentReference.id = :medicamentReferenceId AND la.quantiteDisponible > 0 AND la.dateExpiration > CURRENT_DATE ORDER BY la.dateReception ASC")
    List<LigneApprovisionnement> findAvailableLotsByMedicamentReference(@Param("medicamentReferenceId") Long medicamentReferenceId);
    
    @Query("SELECT la FROM LigneApprovisionnement la WHERE la.quantiteDisponible > 0 AND la.dateExpiration BETWEEN CURRENT_DATE AND :dateLimit ORDER BY la.dateExpiration ASC")
    List<LigneApprovisionnement> findExpiringSoonLots(@Param("dateLimit") LocalDate dateLimit);
    
    @Query("SELECT la FROM LigneApprovisionnement la WHERE la.dateExpiration <= CURRENT_DATE")
    List<LigneApprovisionnement> findExpiredLots();
    
    @Query("SELECT la FROM LigneApprovisionnement la WHERE la.quantiteDisponible > 0 AND la.quantiteDisponible <= :seuilMinimum")
    List<LigneApprovisionnement> findLowStockLots(@Param("seuilMinimum") Integer seuilMinimum);
    
    // Recherche par numéro de lot
    List<LigneApprovisionnement> findByNumeroLot(String numeroLot);
    
    // Statistiques - Total des quantités disponibles par médicament référence
    @Query("SELECT la.medicamentReference.id, SUM(la.quantiteDisponible) FROM LigneApprovisionnement la WHERE la.quantiteDisponible > 0 GROUP BY la.medicamentReference.id")
    List<Object[]> getTotalQuantiteDisponibleByMedicamentReference();
}
