package com.gestion_hospitaliere.UeEntreprise.service.Payments;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion_hospitaliere.UeEntreprise.model.Employe.Employe;
import com.gestion_hospitaliere.UeEntreprise.model.Payments.Facture;
import com.gestion_hospitaliere.UeEntreprise.repository.Employe.EmployeRepository;
import com.gestion_hospitaliere.UeEntreprise.repository.Payments.FactureRepository;

@Service
public class FactureService {

    @Autowired
    private FactureRepository factureRepository;

    @Autowired
    private EmployeRepository caissierRepository;

    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    public Facture getFactureById(Long id) {
        return factureRepository.findById(id).orElse(null);
    }

    public Facture createFacture(Facture facture) {
        // Récupérer et valider le caissier
        Long caissierId = facture.getCaissier().getId();
        Employe caissier = caissierRepository.findById(caissierId)
            .orElseThrow(() -> new RuntimeException("Caissier non trouvé avec l'id : " + caissierId));

        facture.setCaissier(caissier);

        // Si tu veux t'assurer que chaque paiement connaît sa facture (relation bidirectionnelle)
        facture.getPaiements().forEach(paiement -> paiement.setFacture(facture));

        return factureRepository.save(facture);
    }

    public Facture updateFacture(Long id, Facture updatedFacture) {
        if (!factureRepository.existsById(id)) {
            return null;
        }

        updatedFacture.setId(id);

        // Vérifier que le caissier existe
        Long caissierId = updatedFacture.getCaissier().getId();
        Employe caissier = caissierRepository.findById(caissierId)
            .orElseThrow(() -> new RuntimeException("Caissier non trouvé avec l'id : " + caissierId));

        updatedFacture.setCaissier(caissier);

        // Mettre à jour la relation bidirectionnelle avec les paiements
        updatedFacture.getPaiements().forEach(paiement -> paiement.setFacture(updatedFacture));

        return factureRepository.save(updatedFacture);
    }

    public void deleteFacture(Long id) {
        factureRepository.deleteById(id);
    }

    public List<Facture> findByDate(LocalDate date) {
        return factureRepository.findByDate(date);
    }
}
