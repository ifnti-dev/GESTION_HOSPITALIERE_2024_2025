package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.LigneApprovisionnementRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.MedicamentReferenceRepository;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.LigneApprovisionnement;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.MedicamentReference;

@Service
@Transactional
public class LigneApprovisionnementService {
    private static final AtomicInteger lotCounter = new AtomicInteger(1);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    
    private final LigneApprovisionnementRepository ligneApprovisionnementRepository;
    private final MedicamentReferenceRepository medicamentReferenceRepository;

    public LigneApprovisionnementService(
            LigneApprovisionnementRepository ligneApprovisionnementRepository,
            MedicamentReferenceRepository medicamentReferenceRepository) {
        this.ligneApprovisionnementRepository = ligneApprovisionnementRepository;
        this.medicamentReferenceRepository = medicamentReferenceRepository;
    }

    public List<LigneApprovisionnement> getAllLignesApprovisionnement() {
        return ligneApprovisionnementRepository.findAll();
    }

    public LigneApprovisionnement getLigneApprovisionnementById(Long id) {
        return ligneApprovisionnementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ligne d'approvisionnement non trouvée avec l'ID: " + id));
    }

    public LigneApprovisionnement saveLigneApprovisionnement(LigneApprovisionnement ligneApprovisionnement) {
        // Validation
        if (ligneApprovisionnement.getQuantiteInitiale() == null || ligneApprovisionnement.getQuantiteInitiale() <= 0) {
            throw new IllegalArgumentException("La quantité doit être positive");
        }
        
        if (ligneApprovisionnement.getNumeroLot() == null || ligneApprovisionnement.getNumeroLot().isEmpty()) {
            ligneApprovisionnement.setNumeroLot(generateLotNumber());
        }

        // Vérifier l'unicité du numéro de lot
        if (ligneApprovisionnement.getId() == null && 
            ligneApprovisionnementRepository.existsByNumeroLot(ligneApprovisionnement.getNumeroLot())) {
            throw new IllegalArgumentException("Le numéro de lot existe déjà: " + ligneApprovisionnement.getNumeroLot());
        }

        // Pour création ou mise à jour
        if (ligneApprovisionnement.getId() == null) {
            return createNewLigne(ligneApprovisionnement);
        } else {
            return updateExistingLigne(ligneApprovisionnement);
        }
    }
    
    private String generateLotNumber() {
        String datePart = LocalDate.now().format(DATE_FORMATTER);
        int counter = lotCounter.getAndIncrement();
        return "LOT-" + datePart + "-" + String.format("%04d", counter);
    }
    
    private LigneApprovisionnement createNewLigne(LigneApprovisionnement ligne) {
        // Initialiser la quantité disponible
        if (ligne.getQuantiteDisponible() == null) {
            ligne.setQuantiteDisponible(ligne.getQuantiteInitiale());
        }
        
        // Sauvegarde initiale
        LigneApprovisionnement savedLigne = ligneApprovisionnementRepository.save(ligne);
        
        // Mise à jour du stock du médicament référence
        if (ligne.getMedicamentReference() != null) {
            updateMedicamentReferenceQuantity(
                ligne.getMedicamentReference(), 
                ligne.getQuantiteInitiale(), 
                true);
        }
            
        return savedLigne;
    }
    
    private LigneApprovisionnement updateExistingLigne(LigneApprovisionnement ligne) {
        LigneApprovisionnement existingLigne = ligneApprovisionnementRepository.findById(ligne.getId())
                .orElseThrow(() -> new RuntimeException("Ligne non trouvée"));
        
        // Calcul de la différence
        int quantiteDifference = ligne.getQuantiteInitiale() - existingLigne.getQuantiteInitiale();
        
        // Sauvegarde de la ligne
        LigneApprovisionnement savedLigne = ligneApprovisionnementRepository.save(ligne);
        
        // Mise à jour du stock si quantité modifiée
        if (quantiteDifference != 0 && ligne.getMedicamentReference() != null) {
            updateMedicamentReferenceQuantity(
                ligne.getMedicamentReference(), 
                Math.abs(quantiteDifference), 
                quantiteDifference > 0);
        }
            
        return savedLigne;
    }

    public void deleteLigneApprovisionnement(Long id) {
        LigneApprovisionnement ligne = ligneApprovisionnementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ligne non trouvée"));
        
        // Diminuer le stock avant suppression
        if (ligne.getMedicamentReference() != null) {
            updateMedicamentReferenceQuantity(
                ligne.getMedicamentReference(), 
                ligne.getQuantiteInitiale(), 
                false);
        }
            
        ligneApprovisionnementRepository.deleteById(id);
    }
    
    private void updateMedicamentReferenceQuantity(
            MedicamentReference medicamentReference, 
            int quantite, 
            boolean isAddition) {
        
        MedicamentReference ref = medicamentReferenceRepository.findById(medicamentReference.getId())
                .orElseThrow(() -> new RuntimeException("Référence médicament non trouvée"));
        
        int newQuantite = isAddition 
                ? ref.getQuantite() + quantite 
                : ref.getQuantite() - quantite;
        
        if (newQuantite < 0) {
            throw new IllegalStateException("Stock insuffisant pour cette opération");
        }
        
        ref.setQuantite(newQuantite);
        medicamentReferenceRepository.save(ref);
    }

    public List<LigneApprovisionnement> getByApprovisionnementId(Long approvisionnementId) {
        return ligneApprovisionnementRepository.findByApprovisionnementId(approvisionnementId);
    }

    public List<LigneApprovisionnement> getByMedicamentReferenceId(Long medicamentReferenceId) {
        return ligneApprovisionnementRepository.findByMedicamentReferenceId(medicamentReferenceId);
    }

    public List<LigneApprovisionnement> getByDateExpirationBefore(LocalDate date) {
        return ligneApprovisionnementRepository.findByDateExpirationBefore(date);
    }
    
    // Méthodes pour le système FIFO
    public List<LigneApprovisionnement> getAllAvailableLots() {
        return ligneApprovisionnementRepository.findAllAvailableLots();
    }
    
    public List<LigneApprovisionnement> getAvailableLotsByMedicamentReference(Long medicamentReferenceId) {
        return ligneApprovisionnementRepository.findAvailableLotsByMedicamentReference(medicamentReferenceId);
    }
    
    public List<LigneApprovisionnement> getExpiringSoonLots(int daysAhead) {
        LocalDate dateLimit = LocalDate.now().plusDays(daysAhead);
        return ligneApprovisionnementRepository.findExpiringSoonLots(dateLimit);
    }
    
    public List<LigneApprovisionnement> getExpiredLots() {
        return ligneApprovisionnementRepository.findExpiredLots();
    }
    
    public List<LigneApprovisionnement> getLowStockLots(Integer seuilMinimum) {
        return ligneApprovisionnementRepository.findLowStockLots(seuilMinimum);
    }
    
    // Méthode pour réduire le stock lors d'une vente (FIFO)
    public void reduireStockFIFO(Long medicamentReferenceId, Integer quantiteVendue) {
        List<LigneApprovisionnement> lotsDisponibles = getAvailableLotsByMedicamentReference(medicamentReferenceId);
        
        int quantiteRestante = quantiteVendue;
        
        for (LigneApprovisionnement lot : lotsDisponibles) {
            if (quantiteRestante <= 0) break;
            
            int quantiteAPrelecer = Math.min(quantiteRestante, lot.getQuantiteDisponible());
            lot.reduireStock(quantiteAPrelecer);
            ligneApprovisionnementRepository.save(lot);
            
            quantiteRestante -= quantiteAPrelecer;
        }
        
        if (quantiteRestante > 0) {
            throw new RuntimeException("Stock insuffisant pour le médicament référence ID: " + medicamentReferenceId);
        }
    }
    
    // Méthode pour restaurer le stock lors d'une annulation
    public void restaurerStockFIFO(Long medicamentReferenceId, Integer quantiteARestaurer) {
        List<LigneApprovisionnement> lots = getByMedicamentReferenceId(medicamentReferenceId);
        
        // Restaurer dans l'ordre inverse (LIFO pour la restauration)
        for (int i = lots.size() - 1; i >= 0 && quantiteARestaurer > 0; i--) {
            LigneApprovisionnement lot = lots.get(i);
            
            int quantiteManquante = lot.getQuantiteInitiale() - lot.getQuantiteDisponible();
            int quantiteARestaurer_lot = Math.min(quantiteARestaurer, quantiteManquante);
            
            if (quantiteARestaurer_lot > 0) {
                lot.restaurerStock(quantiteARestaurer_lot);
                ligneApprovisionnementRepository.save(lot);
                quantiteARestaurer -= quantiteARestaurer_lot;
            }
        }
    }
}