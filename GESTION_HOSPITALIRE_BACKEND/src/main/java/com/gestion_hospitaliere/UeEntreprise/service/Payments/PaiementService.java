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
    // --- Validation de la caisse ---
    if (paiement.getCaisse() == null || paiement.getCaisse().getId() == null) {
        throw new IllegalArgumentException("L'ID de la caisse est requis.");
    }
    Caisse caisse = caisseRepository.findById(paiement.getCaisse().getId())
            .orElseThrow(() -> new RuntimeException("Caisse non trouvée avec l'ID : " + paiement.getCaisse().getId()));

    // --- Validation de la facture ---
    if (paiement.getFacture() == null || paiement.getFacture().getId() == null) {
        throw new IllegalArgumentException("L'ID de la facture est requis.");
    }
    Facture facture = factureRepository.findById(paiement.getFacture().getId())
            .orElseThrow(() -> new RuntimeException("Facture non trouvée avec l'ID : " + paiement.getFacture().getId()));

    // --- Validation de la cohérence des employés ---
    Employe employeCaisse = caisse.getEmploye();
    Employe employeFacture = facture.getEmploye();

    if (employeCaisse == null || employeFacture == null) {
        throw new RuntimeException("Employé non défini pour la caisse ou la facture.");
    }

    if (!employeCaisse.getId().equals(employeFacture.getId())) {
        throw new IllegalArgumentException("L'employé de la caisse ne correspond pas à l'employé de la facture.");
    }

    // --- Validation du montant ---
    if (paiement.getMontant() == null || paiement.getMontant() <= 0) {
        throw new IllegalArgumentException("Le montant du paiement doit être renseigné et supérieur à zéro.");
    }

    // --- Validation de la date ---
    if (paiement.getDate() == null) {
        throw new IllegalArgumentException("La date du paiement est obligatoire.");
    }
    if (paiement.getDate().isAfter(LocalDate.now())) {
        throw new IllegalArgumentException("La date du paiement ne peut pas être dans le futur.");
    }

    // --- Validation du moyen de paiement ---
    if (paiement.getMoyen() == null || paiement.getMoyen().trim().isEmpty()) {
        throw new IllegalArgumentException("Le moyen de paiement doit être renseigné.");
    }
    // (Optionnel) : Valider contre une liste prédéfinie, ex :
    List<String> moyensValidés = List.of("Espèces", "Carte", "Mobile Money", "Chèque");
    if (!moyensValidés.contains(paiement.getMoyen())) {
        throw new IllegalArgumentException("Moyen de paiement invalide. Moyens valides : " + moyensValidés);
    }

    // --- Enregistrement ---
    paiement.setCaisse(caisse);
    paiement.setFacture(facture);

    return paiementRepository.save(paiement);
}

    public Paiement updatePaiement(Long id, Paiement updatedPaiement) {
    // --- Vérification de l'existence du paiement ---
    Paiement existingPaiement = paiementRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Paiement non trouvé avec l'ID : " + id));

    // --- Validation du montant ---
    if (updatedPaiement.getMontant() == null || updatedPaiement.getMontant() <= 0) {
        throw new IllegalArgumentException("Le montant du paiement doit être renseigné et supérieur à zéro.");
    }

    // --- Validation de la date ---
    if (updatedPaiement.getDate() == null) {
        throw new IllegalArgumentException("La date du paiement est obligatoire.");
    }
    if (updatedPaiement.getDate().isAfter(LocalDate.now())) {
        throw new IllegalArgumentException("La date du paiement ne peut pas être dans le futur.");
    }

    // --- Validation du moyen de paiement ---
    if (updatedPaiement.getMoyen() == null || updatedPaiement.getMoyen().trim().isEmpty()) {
        throw new IllegalArgumentException("Le moyen de paiement doit être renseigné.");
    }
    List<String> moyensValidés = List.of("Espèces", "Carte", "Mobile Money", "Chèque");
    if (!moyensValidés.contains(updatedPaiement.getMoyen())) {
        throw new IllegalArgumentException("Moyen de paiement invalide. Moyens valides : " + moyensValidés);
    }

    // --- Mise à jour des champs de base ---
    existingPaiement.setMontant(updatedPaiement.getMontant());
    existingPaiement.setDate(updatedPaiement.getDate());
    existingPaiement.setMoyen(updatedPaiement.getMoyen());

    // --- Mise à jour de la caisse si modifiée ---
    if (updatedPaiement.getCaisse() != null && updatedPaiement.getCaisse().getId() != null) {
        Caisse caisse = caisseRepository.findById(updatedPaiement.getCaisse().getId())
                .orElseThrow(() -> new RuntimeException("Caisse non trouvée avec l'ID : " + updatedPaiement.getCaisse().getId()));
        existingPaiement.setCaisse(caisse);
    }

    // --- Mise à jour de la facture si modifiée ---
    if (updatedPaiement.getFacture() != null && updatedPaiement.getFacture().getId() != null) {
        Facture facture = factureRepository.findById(updatedPaiement.getFacture().getId())
                .orElseThrow(() -> new RuntimeException("Facture non trouvée avec l'ID : " + updatedPaiement.getFacture().getId()));
        existingPaiement.setFacture(facture);
    }

    // --- Vérification de la cohérence employé caisse <-> facture ---
    Employe employeCaisse = existingPaiement.getCaisse().getEmploye();
    Employe employeFacture = existingPaiement.getFacture().getEmploye();

    if (employeCaisse == null || employeFacture == null) {
        throw new RuntimeException("L'employé de la caisse ou de la facture est manquant.");
    }

    if (!employeCaisse.getId().equals(employeFacture.getId())) {
        throw new RuntimeException("L'employé de la caisse ne correspond pas à celui de la facture.");
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
