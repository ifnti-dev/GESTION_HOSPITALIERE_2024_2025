package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;


import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.StockProduit;

public interface StockProduitRepository extends JpaRepository<StockProduit, Long> {
    // Trouver les stocks par médicament
    List<StockProduit> findByMedicamentId(Long medicamentId);
    
    // Trouver les stocks périmés
    List<StockProduit> findByDatePeremptionBefore(LocalDate date);
    
    // Trouver les stocks par lot
    List<StockProduit> findByLot(String lot);
}