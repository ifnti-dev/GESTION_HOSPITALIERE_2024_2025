package com.gestion_hospitaliere.UeEntreprise.repository.Payments;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.Payments.Facture;
import com.gestion_hospitaliere.UeEntreprise.model.Payments.StatutFacture;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    
    // Trouver les factures par type (Assurez-vous que Facture a un champ 'type' si vous décommentez ceci)
    // List<Facture> findByType(String type);
    
    // Trouver les factures par statut
    List<Facture> findByStatut(StatutFacture statut);
    
    // Trouver les factures par date d'émission
    List<Facture> findByDateEmission(LocalDate date);
    
    
    // Trouver les factures dont le montant total est supérieur à une valeur donnée
    List<Facture> findByMontantTotalGreaterThan(BigDecimal montant);
    
    // Trouver les factures dont le montant total est inférieur à une valeur donnée
    List<Facture> findByMontantTotalLessThan(BigDecimal montant);
}
