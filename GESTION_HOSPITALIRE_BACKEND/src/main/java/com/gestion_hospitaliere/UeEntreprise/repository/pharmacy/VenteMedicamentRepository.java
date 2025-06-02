package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.VenteMedicament;

public interface VenteMedicamentRepository extends JpaRepository<VenteMedicament, Long> {
	  List<VenteMedicament> findByPatientId(Long patientId);
	    
	    // Trouver les ventes par caissier
	    List<VenteMedicament> findByCaissierId(Long caissierId);
	    
	    // Trouver les ventes par pharmacien
	    List<VenteMedicament> findByPharmacienId(Long pharmacienId);
	    
	    // Trouver les ventes entre deux dates
	    List<VenteMedicament> findByDateVenteBetween(LocalDate startDate, LocalDate endDate);
	    
	    // Trouver les ventes avec un montant total supérieur à une valeur
	    List<VenteMedicament> findByMontantTotalGreaterThan(Double montant);
	    
	    // Trouver les ventes avec un montant total entre deux valeurs
	    List<VenteMedicament> findByMontantTotalBetween(Double minMontant, Double maxMontant);
	    
	    // Requête personnalisée pour calculer le chiffre d'affaires par période
	    @Query("SELECT SUM(v.montantTotal) FROM VenteMedicament v WHERE v.dateVente BETWEEN :startDate AND :endDate")
	    Double calculateChiffreAffaires(@Param("startDate") LocalDate startDate, 
	                                   @Param("endDate") LocalDate endDate);
	    
	    // Requête pour trouver les ventes avec leurs lignes (chargement eager)
	    @Query("SELECT v FROM VenteMedicament v LEFT JOIN FETCH v.lignes WHERE v.id = :id")
	    VenteMedicament findByIdWithLignes(@Param("id") Long id);
	    
	    // Statistiques de ventes par jour
	    @Query("SELECT v.dateVente, SUM(v.montantTotal), COUNT(v) " +
	           "FROM VenteMedicament v " +
	           "WHERE v.dateVente BETWEEN :startDate AND :endDate " +
	           "GROUP BY v.dateVente " +
	           "ORDER BY v.dateVente")
	    List<Object[]> getDailySalesStatistics(@Param("startDate") LocalDate startDate, 
	                                         @Param("endDate") LocalDate endDate);
}