package com.gestion_hospitaliere.UeEntreprise.repository.Payments;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.Payments.Facture;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    
    // Trouver les factures par type
    List<Facture> findByType(String type);
    
    // Trouver les factures par statut
    List<Facture> findByStatut(String statut);
    
    // Trouver les factures par date
    List<Facture> findByDate(LocalDate date);
    
    
    // Trouver les factures dont le montant total est supérieur à une valeur donnée
    List<Facture> findByMontantTotalGreaterThan(Double montant);
    
    // Trouver les factures dont le montant total est inférieur à une valeur donnée
    List<Facture> findByMontantTotalLessThan(Double montant);
}
