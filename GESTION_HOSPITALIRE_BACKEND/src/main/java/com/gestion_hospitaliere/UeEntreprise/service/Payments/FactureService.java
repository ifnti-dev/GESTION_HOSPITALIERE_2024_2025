package com.gestion_hospitaliere.UeEntreprise.service.Payments;

import java.math.BigDecimal;
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
            .orElseThrow(() -> new RuntimeException("Facture non trouvée avec l'id : " + id));
    
    // Validation des champs mis à jour
    if (updatedFacture.getType() != null) {
        existingFacture.setType(updatedFacture.getType());
    }

    if (updatedFacture.getMontantTotal() == null || updatedFacture.getMontantTotal().compareTo(BigDecimal.ZERO) < 0) {
        throw new IllegalArgumentException("Le montant total doit être renseigné et positif ou nul.");
    }
    existingFacture.setMontantTotal(updatedFacture.getMontantTotal());

    if (updatedFacture.getStatut() == null) {
        throw new IllegalArgumentException("Le statut de la facture est obligatoire.");
    }
    existingFacture.setStatut(updatedFacture.getStatut());

    if (updatedFacture.getDateEmission() == null) {
        throw new IllegalArgumentException("La date d'émission est obligatoire.");
    }
    if (updatedFacture.getDateEmission().isAfter(LocalDate.now())) {
        throw new IllegalArgumentException("La date d'émission ne peut pas être dans le futur.");
    }
    existingFacture.setDateEmission(updatedFacture.getDateEmission());

    // Mise à jour de l'employé si fourni
    if (updatedFacture.getEmploye() != null && updatedFacture.getEmploye().getId() != null) {
        Employe employe = employeRepository.findById(updatedFacture.getEmploye().getId())
                .orElseThrow(() -> new RuntimeException("Employé non trouvé avec l'id : " + updatedFacture.getEmploye().getId()));
        existingFacture.setEmploye(employe);
    } else if (updatedFacture.getEmploye() != null && updatedFacture.getEmploye().getId() == null) {
        throw new IllegalArgumentException("L'ID de l'employé est requis pour la mise à jour.");
    }

    // Optionnel : on pourrait aussi vérifier si le numéro de facture est modifié et vérifier son unicité

    return factureRepository.save(existingFacture);
}


    public void deleteFacture(Long id) {
        factureRepository.deleteById(id);
    }

    public List<Facture> findByDate(LocalDate date) {
        return factureRepository.findByDateEmission(date); // Changed to use findByDateEmission
    }
}