package com.gestion_hospitaliere.UeEntreprise.service.Payments;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.Payments.Caisse;
import com.gestion_hospitaliere.UeEntreprise.model.Payments.Facture;
import com.gestion_hospitaliere.UeEntreprise.model.Payments.Paiement;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.EmployeRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Payments.CaisseRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Payments.FactureRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Payments.PaiementRepository;

@Service
public class PaiementService {

    @Autowired
    private PaiementRepository paiementRepository;

    @Autowired
    private FactureRepository factureRepository;
    
    @Autowired
    private CaisseRepository caisseRepository;
    
    @Autowired
    private EmployeRepository employeRepository;

    public List<Paiement> getAllPaiements() {
        return paiementRepository.findAll();
    }

    public Paiement getPaiementById(Long id) {
        return paiementRepository.findById(id).orElse(null);
    }

    public Paiement createPaiement(Paiement paiement) {
        if(paiement.getCaisse() == null || paiement.getCaisse().getId() == null) {
            throw new RuntimeException("L'ID de la caisse est requis");
        }
        Caisse caisse = caisseRepository.findById(paiement.getCaisse().getId())
                .orElseThrow(() -> new RuntimeException("Caisse non trouvée"));
        
        if(paiement.getFacture() == null || paiement.getFacture().getId() == null) {
            throw new RuntimeException("L'ID de la facture est requis");
        }
        Facture facture = factureRepository.findById(paiement.getFacture().getId())
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));
        
        Employe employeCaisse = caisse.getEmploye();
        Employe employeFacture = facture.getEmploye();
        
        if(employeCaisse == null || employeFacture == null) {
            throw new RuntimeException("Employé non défini pour la caisse ou la facture");
        }
        
        if(!employeCaisse.getId().equals(employeFacture.getId())) {
            throw new RuntimeException("L'employé de la caisse ne correspond pas à l'employé de la facture");
        }
        
        paiement.setCaisse(caisse);
        paiement.setFacture(facture);
        
        return paiementRepository.save(paiement);
    }

    public Paiement updatePaiement(Long id, Paiement updatedPaiement) {
        Paiement existingPaiement = paiementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé"));
        
        existingPaiement.setMontant(updatedPaiement.getMontant());
        existingPaiement.setDate(updatedPaiement.getDate());
        existingPaiement.setMoyen(updatedPaiement.getMoyen());
        
        if(updatedPaiement.getCaisse() != null && updatedPaiement.getCaisse().getId() != null) {
            Caisse caisse = caisseRepository.findById(updatedPaiement.getCaisse().getId())
                    .orElseThrow(() -> new RuntimeException("Caisse non trouvée"));
            existingPaiement.setCaisse(caisse);
        }
        
        if(updatedPaiement.getFacture() != null && updatedPaiement.getFacture().getId() != null) {
            Facture facture = factureRepository.findById(updatedPaiement.getFacture().getId())
                    .orElseThrow(() -> new RuntimeException("Facture non trouvée"));
            existingPaiement.setFacture(facture);
        }
        
        if(!existingPaiement.getCaisse().getEmploye().getId()
           .equals(existingPaiement.getFacture().getEmploye().getId())) {
            throw new RuntimeException("L'employé de la caisse ne correspond pas à l'employé de la facture");
        }
        
        return paiementRepository.save(existingPaiement);
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
