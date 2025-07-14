package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.LigneApprovisionnement;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.LigneCommande;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.LigneApprovisionnementRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.LigneCommandeRepository;

@Service
@Transactional
public class LigneCommandeService {
    
    private final LigneCommandeRepository ligneCommandeRepository;
    private final LigneApprovisionnementRepository ligneApprovisionnementRepository;
    private final LigneApprovisionnementService ligneApprovisionnementService;

    public LigneCommandeService(
            LigneCommandeRepository ligneCommandeRepository,
            LigneApprovisionnementRepository ligneApprovisionnementRepository,
            LigneApprovisionnementService ligneApprovisionnementService) {
        this.ligneCommandeRepository = ligneCommandeRepository;
        this.ligneApprovisionnementRepository = ligneApprovisionnementRepository;
        this.ligneApprovisionnementService = ligneApprovisionnementService;
    }

    public List<LigneCommande> getAllLignesCommande() {
        return ligneCommandeRepository.findAll();
    }

    public LigneCommande getLigneCommandeById(Long id) {
        return ligneCommandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ligne de commande non trouvée avec l'ID: " + id));
    }

    public LigneCommande saveLigneCommande(LigneCommande ligneCommande) {
        // Validation
        if (ligneCommande.getQuantite() == null || ligneCommande.getQuantite() <= 0) {
            throw new IllegalArgumentException("La quantité doit être positive");
        }

        if (ligneCommande.getLigneApprovisionnement() == null) {
            throw new IllegalArgumentException("La ligne d'approvisionnement est obligatoire");
        }

        // Vérifier la disponibilité du stock
        LigneApprovisionnement lot = ligneApprovisionnementRepository.findById(
                ligneCommande.getLigneApprovisionnement().getId())
                .orElseThrow(() -> new RuntimeException("Lot non trouvé"));

        if (!lot.hasStock(ligneCommande.getQuantite())) {
            throw new RuntimeException("Stock insuffisant pour le lot " + lot.getNumeroLot() + 
                ". Stock disponible: " + lot.getQuantiteDisponible());
        }

        // Pour création
        if (ligneCommande.getId() == null) {
            return createNewLigneCommande(ligneCommande, lot);
        } else {
            return updateExistingLigneCommande(ligneCommande, lot);
        }
    }

    private LigneCommande createNewLigneCommande(LigneCommande ligneCommande, LigneApprovisionnement lot) {
        // Calculer le prix unitaire et le sous-total
        ligneCommande.setPrixUnitaire(lot.getPrixUnitaireVente());
        ligneCommande.setSousTotal(ligneCommande.getQuantite() * lot.getPrixUnitaireVente());

        // Réduire le stock du lot
        lot.reduireStock(ligneCommande.getQuantite());
        ligneApprovisionnementRepository.save(lot);

        // Sauvegarder la ligne de commande
        return ligneCommandeRepository.save(ligneCommande);
    }

    private LigneCommande updateExistingLigneCommande(LigneCommande ligneCommande, LigneApprovisionnement lot) {
        LigneCommande existingLigne = ligneCommandeRepository.findById(ligneCommande.getId())
                .orElseThrow(() -> new RuntimeException("Ligne de commande non trouvée"));

        // Restaurer l'ancien stock
        LigneApprovisionnement oldLot = existingLigne.getLigneApprovisionnement();
        oldLot.restaurerStock(existingLigne.getQuantite());
        ligneApprovisionnementRepository.save(oldLot);

        // Vérifier le nouveau stock
        if (!lot.hasStock(ligneCommande.getQuantite())) {
            // Restaurer l'ancien stock en cas d'erreur
            oldLot.reduireStock(existingLigne.getQuantite());
            ligneApprovisionnementRepository.save(oldLot);
            throw new RuntimeException("Stock insuffisant pour le nouveau lot");
        }

        // Réduire le nouveau stock
        lot.reduireStock(ligneCommande.getQuantite());
        ligneApprovisionnementRepository.save(lot);

        // Mettre à jour les prix
        ligneCommande.setPrixUnitaire(lot.getPrixUnitaireVente());
        ligneCommande.setSousTotal(ligneCommande.getQuantite() * lot.getPrixUnitaireVente());

        return ligneCommandeRepository.save(ligneCommande);
    }

    public void deleteLigneCommande(Long id) {
        LigneCommande ligneCommande = ligneCommandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ligne de commande non trouvée"));

        // Restaurer le stock
        LigneApprovisionnement lot = ligneCommande.getLigneApprovisionnement();
        lot.restaurerStock(ligneCommande.getQuantite());
        ligneApprovisionnementRepository.save(lot);

        // Supprimer la ligne de commande
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
        List<LigneApprovisionnement> lotsDisponibles = getAvailableLotsByMedicamentReference(medicamentReferenceId);
        
        if (lotsDisponibles.isEmpty()) {
            throw new RuntimeException("Aucun lot disponible pour ce médicament");
        }

        // Vérifier si on a assez de stock total
        int stockTotal = lotsDisponibles.stream()
                .mapToInt(LigneApprovisionnement::getQuantiteDisponible)
                .sum();

        if (stockTotal < quantite) {
            throw new RuntimeException("Stock total insuffisant. Disponible: " + stockTotal + ", Demandé: " + quantite);
        }

        // Prendre le premier lot disponible (FIFO)
        LigneApprovisionnement premierLot = lotsDisponibles.get(0);
        
        // Si le premier lot a assez de stock
        if (premierLot.getQuantiteDisponible() >= quantite) {
            LigneCommande ligneCommande = new LigneCommande();
            ligneCommande.setQuantite(quantite);
            ligneCommande.setLigneApprovisionnement(premierLot);
            // La commande sera définie par le contrôleur
            
            return saveLigneCommande(ligneCommande);
        } else {
            // Si on doit utiliser plusieurs lots, prendre la quantité maximale du premier lot
            LigneCommande ligneCommande = new LigneCommande();
            ligneCommande.setQuantite(premierLot.getQuantiteDisponible());
            ligneCommande.setLigneApprovisionnement(premierLot);
            
            return saveLigneCommande(ligneCommande);
        }
    }
}
