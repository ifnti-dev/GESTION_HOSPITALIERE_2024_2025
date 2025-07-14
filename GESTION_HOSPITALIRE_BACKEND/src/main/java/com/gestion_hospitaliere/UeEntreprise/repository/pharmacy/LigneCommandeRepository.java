package com.gestion_hospitaliere.UeEntreprise.repository.pharmacy;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.LigneCommande;

@Repository
public interface LigneCommandeRepository extends JpaRepository<LigneCommande, Long> {
    
    // Recherche par commande
    @Query("SELECT lc FROM LigneCommande lc WHERE lc.commande.id = :commandeId")
    List<LigneCommande> findByCommandeId(@Param("commandeId") Long commandeId);
    
    // Recherche par ligne d'approvisionnement (lot)
    @Query("SELECT lc FROM LigneCommande lc WHERE lc.ligneApprovisionnement.id = :ligneApprovisionnementId")
    List<LigneCommande> findByLigneApprovisionnementId(@Param("ligneApprovisionnementId") Long ligneApprovisionnementId);
    
    // Recherche par numéro de lot
    @Query("SELECT lc FROM LigneCommande lc WHERE lc.ligneApprovisionnement.numeroLot = :numeroLot")
    List<LigneCommande> findByLigneApprovisionnementNumeroLot(@Param("numeroLot") String numeroLot);
    
    // Recherche par médicament référence via le lot d'approvisionnement
    @Query("SELECT lc FROM LigneCommande lc WHERE lc.ligneApprovisionnement.medicamentReference.id = :medicamentReferenceId")
    List<LigneCommande> findByLigneApprovisionnementMedicamentReferenceId(@Param("medicamentReferenceId") Long medicamentReferenceId);
    
    // Recherche par prix unitaire
    List<LigneCommande> findByPrixUnitaire(Integer prixUnitaire);
    
    // Recherche par prix unitaire supérieur à
    List<LigneCommande> findByPrixUnitaireGreaterThan(Integer prix);
    
    // Recherche par quantité
    List<LigneCommande> findByQuantite(Integer quantite);
    
    // Recherche par sous-total
    List<LigneCommande> findBySousTotal(Integer sousTotal);
    
    // Recherche par sous-total supérieur à
    List<LigneCommande> findBySousTotalGreaterThan(Integer sousTotal);
    
    // Statistiques - Total des ventes par médicament référence
    @Query("SELECT lc.ligneApprovisionnement.medicamentReference.id, SUM(lc.quantite), SUM(lc.sousTotal) " +
           "FROM LigneCommande lc GROUP BY lc.ligneApprovisionnement.medicamentReference.id")
    List<Object[]> getVentesStatsByMedicamentReference();
    
    // Statistiques - Total des ventes par lot
    @Query("SELECT lc.ligneApprovisionnement.id, lc.ligneApprovisionnement.numeroLot, SUM(lc.quantite), SUM(lc.sousTotal) " +
           "FROM LigneCommande lc GROUP BY lc.ligneApprovisionnement.id, lc.ligneApprovisionnement.numeroLot")
    List<Object[]> getVentesStatsByLot();
    
    // Top des médicaments les plus vendus
    @Query("SELECT lc.ligneApprovisionnement.medicamentReference, SUM(lc.quantite) as totalVendu " +
           "FROM LigneCommande lc GROUP BY lc.ligneApprovisionnement.medicamentReference " +
           "ORDER BY totalVendu DESC")
    List<Object[]> getTopMedicamentsVendus();
}
