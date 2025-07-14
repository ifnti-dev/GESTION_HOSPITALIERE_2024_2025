package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Commande;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {
    
    // Recherche par date de commande
    List<Commande> findByDateCommande(LocalDate dateCommande);
    
    // Recherche par personne ID avec requête personnalisée
    @Query("SELECT c FROM Commande c WHERE c.personne.id = :personneId")
    List<Commande> findByPersonneId(@Param("personneId") Long personneId);
    
    // Recherche par montant total supérieur (String)
    @Query("SELECT c FROM Commande c WHERE CAST(c.montantTotal AS double) > :montant")
    List<Commande> findByMontantTotalGreaterThan(@Param("montant") Double montant);
    
    // Recherche par montant total supérieur (String comparison)
    @Query("SELECT c FROM Commande c WHERE c.montantTotal > :montant")
    List<Commande> findByMontantTotalGreaterThanString(@Param("montant") String montant);
    
    // Recherche par plage de dates
    List<Commande> findByDateCommandeBetween(LocalDate dateDebut, LocalDate dateFin);
    
    // Recherche par plage de montants
    @Query("SELECT c FROM Commande c WHERE CAST(c.montantTotal AS double) BETWEEN :montantMin AND :montantMax")
    List<Commande> findByMontantTotalBetween(@Param("montantMin") Double montantMin, @Param("montantMax") Double montantMax);
    
    // Toutes les commandes triées par date décroissante
    @Query("SELECT c FROM Commande c ORDER BY c.dateCommande DESC")
    List<Commande> findAllOrderByDateCommandeDesc();
    
    // Commandes d'une personne triées par date décroissante
    @Query("SELECT c FROM Commande c WHERE c.personne.id = :personneId ORDER BY c.dateCommande DESC")
    List<Commande> findByPersonneIdOrderByDateCommandeDesc(@Param("personneId") Long personneId);
    
    // Recherche par nom de personne
    @Query("SELECT c FROM Commande c WHERE c.personne.nom LIKE %:nom%")
    List<Commande> findByPersonneNomContaining(@Param("nom") String nom);
    
    // Commandes d'aujourd'hui
    @Query("SELECT c FROM Commande c WHERE c.dateCommande = CURRENT_DATE")
    List<Commande> findCommandesAujourdhui();
    
    // Nombre de commandes d'aujourd'hui
    @Query("SELECT COUNT(c) FROM Commande c WHERE c.dateCommande = CURRENT_DATE")
    Long countCommandesAujourdhui();
    
    // Montant total des commandes d'aujourd'hui
    @Query("SELECT SUM(CAST(c.montantTotal AS double)) FROM Commande c WHERE c.dateCommande = CURRENT_DATE")
    Double sumMontantCommandesAujourdhui();
    
    // Commandes par mois
    @Query("SELECT c FROM Commande c WHERE YEAR(c.dateCommande) = :annee AND MONTH(c.dateCommande) = :mois")
    List<Commande> findByMois(@Param("annee") int annee, @Param("mois") int mois);
    
    // Statistiques par personne
    @Query("SELECT COUNT(c) FROM Commande c WHERE c.personne.id = :personneId")
    Long countByPersonneId(@Param("personneId") Long personneId);
    
    @Query("SELECT SUM(CAST(c.montantTotal AS double)) FROM Commande c WHERE c.personne.id = :personneId")
    Double sumMontantByPersonneId(@Param("personneId") Long personneId);
}
