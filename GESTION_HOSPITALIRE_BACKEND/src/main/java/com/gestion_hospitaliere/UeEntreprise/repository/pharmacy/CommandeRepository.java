package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Commande;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {
    List<Commande> findByDateCommande(LocalDate date);
    List<Commande> findByPersonneId(Long personneId);
    List<Commande> findByMontantTotalGreaterThan(String montant);
}
