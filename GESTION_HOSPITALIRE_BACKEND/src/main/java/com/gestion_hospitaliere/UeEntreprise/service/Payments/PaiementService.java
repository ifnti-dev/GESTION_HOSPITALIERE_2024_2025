package com.gestion_hospitaliere.UeEntreprise.service.Payments;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Payments.Paiement;

import com.gestion_hospitaliere.UeEntreprise.repository.Payments.PaiementRepository;

@Service
public class PaiementService {

    @Autowired
    private PaiementRepository paiementRepository;

    //@Autowired
    //private FactureRepository factureRepository;

    public List<Paiement> getAllPaiements() {
        return paiementRepository.findAll();
    }

    public Paiement getPaiementById(Long id) {
        return paiementRepository.findById(id).orElse(null);
    }

    // public Paiement createPaiement(Paiement paiement) {
    //     // Vérifier la facture
    //     Long factureId = paiement.getFacture().getId();
    //     Facture facture = factureRepository.findById(factureId)
    //         .orElseThrow(() -> new RuntimeException("Facture non trouvée avec l'id : " + factureId));

    //     paiement.setFacture(facture);

    //     return paiementRepository.save(paiement);
    // }

    // public Paiement updatePaiement(Long id, Paiement updatedPaiement) {
    //     if (!paiementRepository.existsById(id)) {
    //         return null;
    //     }

    //     updatedPaiement.setId(id);

    //     // Vérifier la facture
    //     Long factureId = updatedPaiement.getFacture().getId();
    //     Facture facture = factureRepository.findById(factureId)
    //         .orElseThrow(() -> new RuntimeException("Facture non trouvée avec l'id : " + factureId));

    //     updatedPaiement.setFacture(facture);

    //     return paiementRepository.save(updatedPaiement);
    // }

    public void deletePaiement(Long id) {
        paiementRepository.deleteById(id);
    }

    public List<Paiement> findByMontant(Double montant) {
        return paiementRepository.findByMontant(montant);
    }

    public List<Paiement> findByDate(LocalDate date) {
        return paiementRepository.findByDate(date);
    }

    public List<Paiement> findByMoyen(String moyen) {
        return paiementRepository.findByMoyen(moyen);
    }

    public List<Paiement> findByFactureId(Long factureId) {
        return paiementRepository.findByFactureId(factureId);
    }

    public List<Paiement> findByMontantGreaterThan(Double montant) {
        return paiementRepository.findByMontantGreaterThan(montant);
    }

    public List<Paiement> findByMontantLessThan(Double montant) {
        return paiementRepository.findByMontantLessThan(montant);
    }
}
