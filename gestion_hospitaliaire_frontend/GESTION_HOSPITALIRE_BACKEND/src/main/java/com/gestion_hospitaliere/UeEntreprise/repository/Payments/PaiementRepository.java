package com.gestion_hospitaliere.UeEntreprise.repository.Payments;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.Payments.Paiement;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    
    // Trouver les paiements par montant
    List<Paiement> findByMontant(Double montant);
    
    // Trouver les paiements par date
    List<Paiement> findByDate(LocalDate date);
    
    // Trouver les paiements par moyen de paiement
    List<Paiement> findByMoyen(String moyen);
    
    // Trouver les paiements associés à une facture spécifique
    List<Paiement> findByFactureId(Long factureId);
    
    // Trouver les paiements dont le montant est supérieur à une valeur donnée
    List<Paiement> findByMontantGreaterThan(Double montant);
    
    // Trouver les paiements dont le montant est inférieur à une valeur donnée
    List<Paiement> findByMontantLessThan(Double montant);
}
