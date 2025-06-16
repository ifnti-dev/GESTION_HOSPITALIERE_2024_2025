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
public class FactureService {

    @Autowired
    private FactureRepository factureRepository;
    
    @Autowired
    private EmployeRepository employeRepository;
    
    @Autowired
    private CaisseRepository caisseRepository;
    
    @Autowired
    private PaiementRepository paiementRepository;

    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    public Facture getFactureById(Long id) {
        return factureRepository.findById(id).orElse(null);
    }

    public Facture createFacture(Facture facture) {
        // Gestion de l'employé par ID
        if(facture.getEmploye() == null || facture.getEmploye().getId() == null) {
            throw new RuntimeException("L'ID de l'employé est requis");
        }
        Employe employe = employeRepository.findById(facture.getEmploye().getId())
                .orElseThrow(() -> new RuntimeException("Employé non trouvé"));
        facture.setEmploye(employe);

        // Sauvegarde initiale pour obtenir l'ID de la facture
        Facture savedFacture = factureRepository.save(facture);

        // Gestion des paiements par IDs
        if(facture.getPaiements() != null) {
            for(Paiement paiement : facture.getPaiements()) {
                if(paiement.getId() == null) {
                    throw new RuntimeException("L'ID du paiement est requis");
                }
                
                Paiement existingPaiement = paiementRepository.findById(paiement.getId())
                        .orElseThrow(() -> new RuntimeException("Paiement non trouvé"));
                
                // Vérification de la caisse
                if(existingPaiement.getCaisse() == null || existingPaiement.getCaisse().getId() == null) {
                    throw new RuntimeException("La caisse du paiement n'est pas définie");
                }
                
                Caisse caisse = caisseRepository.findById(existingPaiement.getCaisse().getId())
                        .orElseThrow(() -> new RuntimeException("Caisse non trouvée"));
                
                // Vérification que la caisse appartient à l'employé
                if(!caisse.getEmploye().getId().equals(employe.getId())) {
                    throw new RuntimeException("La caisse n'appartient pas à cet employé");
                }
                
                existingPaiement.setFacture(savedFacture);
                paiementRepository.save(existingPaiement);
            }
        }

        return factureRepository.save(savedFacture);
    }

    public Facture updateFacture(Long id, Facture updatedFacture) {
        Facture existingFacture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));
        
        // Mise à jour des champs de base
        existingFacture.setType(updatedFacture.getType());
        existingFacture.setMontantTotal(updatedFacture.getMontantTotal());
        existingFacture.setStatut(updatedFacture.getStatut());
        existingFacture.setDateEmission(updatedFacture.getDateEmission());
        
        // Mise à jour de l'employé si nécessaire
        if(updatedFacture.getEmploye() != null && updatedFacture.getEmploye().getId() != null) {
            Employe employe = employeRepository.findById(updatedFacture.getEmploye().getId())
                    .orElseThrow(() -> new RuntimeException("Employé non trouvé"));
            existingFacture.setEmploye(employe);
        }
        
        return factureRepository.save(existingFacture);
    }

    public void deleteFacture(Long id) {
        factureRepository.deleteById(id);
    }

    public List<Facture> findByDate(LocalDate date) {
        return factureRepository.findByDateEmission(date); // Changed to use findByDateEmission
    }
}