package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.RapportInventaire;

public interface RapportInventaireRepository extends JpaRepository<RapportInventaire, Long> {
    // Trouver les rapports par date
    List<RapportInventaire> findByDateGeneration(LocalDate date);
    
    // Trouver les rapports entre deux dates
    List<RapportInventaire> findByDateGenerationBetween(LocalDate startDate, LocalDate endDate);
}