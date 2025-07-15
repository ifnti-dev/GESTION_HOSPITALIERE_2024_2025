package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.LigneApprovisionnement;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.LigneCommande;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.Commande;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.LigneApprovisionnementRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.LigneCommandeRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.CommandeRepository;

@Service
@Transactional
public class LigneCommandeService {

  private final LigneCommandeRepository ligneCommandeRepository;
  private final LigneApprovisionnementRepository ligneApprovisionnementRepository;
  private final LigneApprovisionnementService ligneApprovisionnementService;
  private final CommandeRepository commandeRepository;

  public LigneCommandeService(
          LigneCommandeRepository ligneCommandeRepository,
          LigneApprovisionnementRepository ligneApprovisionnementRepository,
          LigneApprovisionnementService ligneApprovisionnementService,
          CommandeRepository commandeRepository) {
      this.ligneCommandeRepository = ligneCommandeRepository;
      this.ligneApprovisionnementRepository = ligneApprovisionnementRepository;
      this.ligneApprovisionnementService = ligneApprovisionnementService;
      this.commandeRepository = commandeRepository;
  }

  public List<LigneCommande> getAllLignesCommande() {
      return ligneCommandeRepository.findAll();
  }

  public LigneCommande getLigneCommandeById(Long id) {
      return ligneCommandeRepository.findById(id)
              .orElseThrow(() -> new RuntimeException("Ligne de commande non trouvée avec l'ID: " + id));
  }

  public LigneCommande saveLigneCommande(LigneCommande ligneCommande) {
      // 1. Basic Validation
      if (ligneCommande.getQuantite() == null || ligneCommande.getQuantite() <= 0) {
          throw new IllegalArgumentException("La quantité doit être positive.");
      }
      if (ligneCommande.getLigneApprovisionnement() == null || ligneCommande.getLigneApprovisionnement().getId() == null) {
          throw new IllegalArgumentException("La ligne d'approvisionnement est obligatoire.");
      }
      if (ligneCommande.getCommande() == null || ligneCommande.getCommande().getId() == null) {
          throw new IllegalArgumentException("La commande est obligatoire pour une ligne de commande.");
      }

      // 2. Fetch and set managed Commande entity
      Commande managedCommande = commandeRepository.findById(ligneCommande.getCommande().getId())
              .orElseThrow(() -> new RuntimeException("Commande associée non trouvée avec l'ID: " + ligneCommande.getCommande().getId()));
      ligneCommande.setCommande(managedCommande);

      // 3. Fetch the target LigneApprovisionnement (lot)
      LigneApprovisionnement targetLot = ligneApprovisionnementRepository.findById(ligneCommande.getLigneApprovisionnement().getId())
              .orElseThrow(() -> new RuntimeException("Lot non trouvé avec l'ID: " + ligneCommande.getLigneApprovisionnement().getId()));
      ligneCommande.setLigneApprovisionnement(targetLot); // Ensure the managed entity is set

      int oldQuantity = 0;
      LigneApprovisionnement oldLot = null;

      // 4. Handle existing line (update scenario)
      if (ligneCommande.getId() != null) {
          LigneCommande existingLigne = ligneCommandeRepository.findById(ligneCommande.getId())
                  .orElseThrow(() -> new RuntimeException("Ligne de commande existante non trouvée avec l'ID: " + ligneCommande.getId()));
          oldQuantity = existingLigne.getQuantite();
          oldLot = existingLigne.getLigneApprovisionnement();

          // Restore stock from the old lot if the lot is changing or quantity is decreasing
          if (!oldLot.getId().equals(targetLot.getId())) {
              oldLot.restaurerStock(oldQuantity);
              ligneApprovisionnementRepository.save(oldLot); // Save changes to old lot
          } else if (ligneCommande.getQuantite() < oldQuantity) {
              targetLot.restaurerStock(oldQuantity - ligneCommande.getQuantite());
          }
      }

      // 5. Check stock availability for the new quantity on the target lot
      int quantityToReduce = ligneCommande.getQuantite();
      if (ligneCommande.getId() != null && oldLot != null && oldLot.getId().equals(targetLot.getId())) {
          // If same lot, only reduce the *difference* if quantity increased
          quantityToReduce = ligneCommande.getQuantite() - oldQuantity;
      }

      if (quantityToReduce > 0 && !targetLot.hasStock(quantityToReduce)) {
          // If stock check fails, revert any restored stock from oldLot (if applicable)
          if (oldLot != null && !oldLot.getId().equals(targetLot.getId())) {
              oldLot.reduireStock(oldQuantity); // Revert restoration
              ligneApprovisionnementRepository.save(oldLot);
          } else if (ligneCommande.getQuantite() < oldQuantity) { // Revert partial restoration if quantity decreased
              targetLot.reduireStock(oldQuantity - ligneCommande.getQuantite());
          }
          throw new RuntimeException("Stock insuffisant pour le lot " + targetLot.getNumeroLot() + 
              ". Stock disponible: " + targetLot.getQuantiteDisponible() + ", Tentative de réduction: " + quantityToReduce);
      }

      // 6. Reduce stock from the target lot
      if (quantityToReduce > 0) {
          targetLot.reduireStock(quantityToReduce);
      }
      ligneApprovisionnementRepository.save(targetLot); // Save changes to target lot

      // 7. Set price and calculate subtotal
      ligneCommande.setPrixUnitaire(targetLot.getPrixUnitaireVente());
      ligneCommande.calculerSousTotal(); // Use the utility method on the entity

      // 8. Save the LigneCommande
      return ligneCommandeRepository.save(ligneCommande);
  }

  public void deleteLigneCommande(Long id) {
      LigneCommande ligneCommande = ligneCommandeRepository.findById(id)
              .orElseThrow(() -> new RuntimeException("Ligne de commande non trouvée"));

      // Restore stock to the associated lot
      LigneApprovisionnement lot = ligneCommande.getLigneApprovisionnement();
      if (lot != null) {
          lot.restaurerStock(ligneCommande.getQuantite());
          ligneApprovisionnementRepository.save(lot);
      }

      // Delete the line item
      ligneCommandeRepository.deleteById(id);
  }

  public List<LigneCommande> getByCommandeId(Long commandeId) {
      return ligneCommandeRepository.findByCommandeId(commandeId);
  }

  public List<LigneCommande> getByLigneApprovisionnementId(Long ligneApprovisionnementId) {
      return ligneCommandeRepository.findByLigneApprovisionnementId(ligneApprovisionnementId);
  }

  // Méthodes pour récupérer les lots disponibles (FIFO)
  public List<LigneApprovisionnement> getAllAvailableLots() {
      return ligneApprovisionnementService.getAllAvailableLots();
  }

  public List<LigneApprovisionnement> getAvailableLotsByMedicamentReference(Long medicamentReferenceId) {
      return ligneApprovisionnementService.getAvailableLotsByMedicamentReference(medicamentReferenceId);
  }

  public List<LigneApprovisionnement> getExpiringSoonLots(int daysAhead) {
      return ligneApprovisionnementService.getExpiringSoonLots(daysAhead);
  }

  public List<LigneApprovisionnement> getExpiredLots() {
      return ligneApprovisionnementService.getExpiredLots();
  }

  public List<LigneApprovisionnement> getLowStockLots(Integer seuilMinimum) {
      return ligneApprovisionnementService.getLowStockLots(seuilMinimum);
  }

  // Méthode pour créer une commande automatique FIFO
  public LigneCommande createLigneCommandeFIFO(Long commandeId, Long medicamentReferenceId, Integer quantite) {
      Commande commande = commandeRepository.findById(commandeId)
              .orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'ID: " + commandeId));

      List<LigneApprovisionnement> lotsDisponibles = getAvailableLotsByMedicamentReference(medicamentReferenceId);
      
      if (lotsDisponibles.isEmpty()) {
          throw new RuntimeException("Aucun lot disponible pour ce médicament.");
      }

      int stockTotal = lotsDisponibles.stream()
              .mapToInt(LigneApprovisionnement::getQuantiteDisponible)
              .sum();

      if (stockTotal < quantite) {
          throw new RuntimeException("Stock total insuffisant. Disponible: " + stockTotal + ", Demandé: " + quantite);
      }

      int remainingQuantityToSell = quantite;
      LigneCommande lastCreatedLigne = null; // To return the last created line

      for (LigneApprovisionnement lot : lotsDisponibles) {
          if (remainingQuantityToSell <= 0) {
              break;
          }

          int quantityFromThisLot = Math.min(remainingQuantityToSell, lot.getQuantiteDisponible());

          if (quantityFromThisLot > 0) {
              LigneCommande ligneCommande = new LigneCommande();
              ligneCommande.setCommande(commande); // Set the Commande object
              ligneCommande.setQuantite(quantityFromThisLot);
              ligneCommande.setLigneApprovisionnement(lot); // Set the LigneApprovisionnement object
              
              // saveLigneCommande will handle stock reduction and price/subtotal calculation
              lastCreatedLigne = saveLigneCommande(ligneCommande);
              remainingQuantityToSell -= quantityFromThisLot;
          }
      }
      
      if (lastCreatedLigne == null) {
          throw new RuntimeException("Erreur inattendue: Aucune ligne de commande n'a pu être créée.");
      }
      return lastCreatedLigne;
  }
}
