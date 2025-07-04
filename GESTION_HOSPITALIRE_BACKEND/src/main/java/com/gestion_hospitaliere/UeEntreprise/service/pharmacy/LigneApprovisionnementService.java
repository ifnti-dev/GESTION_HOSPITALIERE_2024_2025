package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.LigneApprovisionnementRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.MedicamentReferenceRepository;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.LigneApprovisionnement;
import com.gestion_hospitaliere.UeEntreprise.model.pharmacy.MedicamentReference;

@Service
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
        return ligneApprovisionnementRepository.findById(id).orElse(null);
    }

    public LigneApprovisionnement saveLigneApprovisionnement(LigneApprovisionnement ligneApprovisionnement) {
        // Validation
        if (ligneApprovisionnement.getQuantite() == null || ligneApprovisionnement.getQuantite() <= 0) {
            throw new IllegalArgumentException("La quantité doit être positive");
        }
        
        if (ligneApprovisionnement.getNumeroLot() == null || ligneApprovisionnement.getNumeroLot().isEmpty()) {
            ligneApprovisionnement.setNumeroLot(generateLotNumber());
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
        // Sauvegarde initiale
        LigneApprovisionnement savedLigne = ligneApprovisionnementRepository.save(ligne);
        
        // Mise à jour du stock
        updateMedicamentReferenceQuantity(
            ligne.getMedicamentReference(), 
            ligne.getQuantite(), 
            true);
            
        return savedLigne;
    }
    
    private LigneApprovisionnement updateExistingLigne(LigneApprovisionnement ligne) {
        LigneApprovisionnement existingLigne = ligneApprovisionnementRepository.findById(ligne.getId())
                .orElseThrow(() -> new RuntimeException("Ligne non trouvée"));
        
        // Calcul de la différence
        int quantiteDifference = ligne.getQuantite() - existingLigne.getQuantite();
        
        // Sauvegarde de la ligne
        LigneApprovisionnement savedLigne = ligneApprovisionnementRepository.save(ligne);
        
        // Mise à jour du stock si quantité modifiée
        if (quantiteDifference != 0) {
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
        updateMedicamentReferenceQuantity(
            ligne.getMedicamentReference(), 
            ligne.getQuantite(), 
            false);
            
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

//    public List<LigneApprovisionnement> getByMedicamentId(Long medicamentId) {
//        return ligneApprovisionnementRepository.findByMedicamentId(medicamentId);
//    }

    public List<LigneApprovisionnement> getByDateExpirationBefore(LocalDate date) {
        return ligneApprovisionnementRepository.findByDateExpirationBefore(date);
    }
}