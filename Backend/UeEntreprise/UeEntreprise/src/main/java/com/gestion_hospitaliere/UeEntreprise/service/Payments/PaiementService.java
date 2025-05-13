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

    public List<Paiement> getAllPaiements() {
        return paiementRepository.findAll();
    }

    public Paiement getPaiementById(Long id) {
        return paiementRepository.findById(id).orElse(null);
    }

    public Paiement createPaiement(Paiement paiement) {
        return paiementRepository.save(paiement);
    }

    public Paiement updatePaiement(Long id, Paiement updatedPaiement) {
        if (paiementRepository.existsById(id)) {
            updatedPaiement.setId(id);
            return paiementRepository.save(updatedPaiement);
        }
        return null;
    }

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